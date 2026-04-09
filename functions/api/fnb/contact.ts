// Cloudflare Pages Function for F&B Contact Form Integration with Notion
// Path: functions/api/fnb/contact.ts
// Last Update: 2026-04-08 (Trigger for environment variables)

interface Env {
  NOTION_TOKEN: string;
  NOTION_DATABASE_ID: string;
  RESEND_API_KEY?: string;
  FNB_CONTACT_NOTIFY_EMAIL?: string;
  FNB_CONTACT_FROM_EMAIL?: string;
}

const fnbContactFieldOrder = ["name", "phone", "storeType", "location", "area", "openDate", "budget"];
const CONTACT_MAX_LENGTH: Record<string, number> = {
  name: 100,
  phone: 100,
  storeType: 200,
  location: 500,
  area: 100,
  openDate: 200,
  budget: 200,
};

const fnbContactFieldLabelMap: Record<string, string> = {
  name: "이름",
  phone: "연락처",
  storeType: "매장 유형",
  location: "매장 위치",
  area: "매장 면적(평)",
  openDate: "오픈 예정일",
  budget: "예산 범위",
};

function normalizeText(val: any): string {
  if (typeof val !== "string") return "";
  return val.trim();
}

function formatKstDate(date: Date) {
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstDate = new Date(date.getTime() + kstOffset);
  const y = kstDate.getUTCFullYear();
  const m = String(kstDate.getUTCMonth() + 1).padStart(2, "0");
  const d = String(kstDate.getUTCDate()).padStart(2, "0");
  const h = String(kstDate.getUTCHours()).padStart(2, "0");
  const min = String(kstDate.getUTCMinutes()).padStart(2, "0");
  const s = String(kstDate.getUTCSeconds()).padStart(2, "0");
  return `${y}-${m}-${d} ${h}:${min}:${s}`;
}

async function notionRequest(path: string, token: string, options: any) {
  return fetch(`https://api.notion.com/v1${path}`, {
    ...options,
    headers: {
      "Authorization": `Bearer ${token}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context;
  const notionToken = env.NOTION_TOKEN;
  const notionDatabaseId = env.NOTION_DATABASE_ID;

  if (!notionToken || !notionDatabaseId) {
    return new Response(JSON.stringify({ message: "서버 설정 누락" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }

  try {
    const payload: any = await request.json();
    
    // 1. Fetch Database Metadata to find column names
    const dbResponse = await notionRequest(`/databases/${notionDatabaseId}`, notionToken, { method: "GET" });
    if (!dbResponse.ok) {
      const dbErr = await dbResponse.json();
      return new Response(JSON.stringify({ 
        message: `노션 데이터베이스 접근 실패: ${dbErr.message || "권한을 확인해 주세요."}`,
        hint: "노션 DB 우측 상단 '...' -> '연결 추가'에서 통합을 초대했는지 확인해 주세요."
      }), { status: 502, headers: { "Content-Type": "application/json" } });
    }
    
    const dbData: any = await dbResponse.json();
    const props = dbData.properties;

    // Helper to find column by aliases
    const findProp = (aliases: string[]) => {
      const keys = Object.keys(props);
      for (const alias of aliases) {
        const found = keys.find(k => k.trim().toLowerCase() === alias.toLowerCase());
        if (found) return found;
      }
      return null;
    };

    const colMap = {
      name: findProp(["이름", "Name", "성함"]),
      phone: findProp(["연락처", "전화번호", "Phone"]),
      storeType: findProp(["매장 유형", "매장유형", "업종"]),
      location: findProp(["매장 위치", "매장위치", "지역"]),
      area: findProp(["매장 면적(평)", "매장 면적", "평수", "면적"]), // 별칭 보강
      openDate: findProp(["오픈 예정일", "오픈예정일"]),
      budget: findProp(["예산 범위", "예산"]),
      inquiryAt: findProp(["문의일시", "신청일시", "날짜"])
    };

    // 2. Build Properties
    const now = new Date();
    const kstDateText = formatKstDate(now);
    const nowIso = now.toISOString(); // 노션 날짜형 전용 ISO 규격
    const notionProps: any = {};

    const addProp = (key: string | null, value: string, isTitle = false) => {
      if (!key) return;
      const type = props[key].type;
      if (isTitle || type === "title") {
        notionProps[key] = { title: [{ text: { content: value } }] };
      } else if (type === "date") {
        // 날짜 타입 처리 (문의일시용)
        notionProps[key] = { date: { start: nowIso } };
      } else if (type === "rich_text") {
        notionProps[key] = { rich_text: [{ text: { content: value } }] };
      } else if (type === "phone_number") {
        notionProps[key] = { phone_number: value };
      }
    };

    addProp(colMap.name, payload.name, true);
    addProp(colMap.phone, payload.phone);
    addProp(colMap.storeType, payload.storeType);
    addProp(colMap.location, payload.location);
    addProp(colMap.area, payload.area);
    addProp(colMap.openDate, payload.openDate);
    addProp(colMap.budget, payload.budget);
    addProp(colMap.inquiryAt, kstDateText);

    // 3. Create Page
    const createResponse = await notionRequest("/pages", notionToken, {
      method: "POST",
      body: JSON.stringify({
        parent: { database_id: notionDatabaseId },
        properties: notionProps,
        children: [
          {
            object: "block",
            type: "paragraph",
            paragraph: { rich_text: [{ text: { content: `IP: ${request.headers.get("cf-connecting-ip") || "-"}` } }] }
          }
        ],
      }),
    });

    if (!createResponse.ok) {
      const errData = await createResponse.json();
      return new Response(JSON.stringify({ message: `노션 저장 실패: ${errData.message}` }), { status: 502, headers: { "Content-Type": "application/json" } });
    }

    try {
      await sendNotificationEmail(payload, env, kstDateText);
    } catch (emailErr) {
      console.error("Notifier email failed", emailErr);
    }

    return new Response(JSON.stringify({
      success: true,
      message: "접수 완료!",
      debug: { matched_columns: colMap },
    }), { status: 200, headers: { "Content-Type": "application/json" } });

  } catch (err: any) {
    return new Response(JSON.stringify({ message: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

async function sendNotificationEmail(payload: any, env: Env, timestamp: string) {
  const apiKey = env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return;
  }

  const toEmail = (env.FNB_CONTACT_NOTIFY_EMAIL?.trim() || "bulpan@gmail.com").toLowerCase();
  if (!toEmail) {
    return;
  }

  const fromEmail = (env.FNB_CONTACT_FROM_EMAIL?.trim() || "no-reply@fnb-contact.com").toLowerCase();

  const bodyLines = [
    "새로운 F&B 상담 신청이 들어왔습니다.",
    `접수일시: ${timestamp}`,
    `이름: ${payload.name || "-"}`,
    `연락처: ${payload.phone || "-"}`,
    `매장 유형: ${payload.storeType || "-"}`,
    `위치: ${payload.location || "-"}`,
    `면적: ${payload.area || "-"}`,
    `오픈 예정일: ${payload.openDate || "-"}`,
    `예산: ${payload.budget || "-"}`,
    `채널: ${payload.channel || "-"}`,
    `페이지: ${payload.pagePath || "-"}`,
    "",
    "공상플래닛 F&B 공간디자인 스튜디오",
    "관련 노션 링크:",
    "https://www.notion.so/33d4822f052780bdb680cb7fcd34a8bb?v=33d4822f05278036a13c000c665dd811",
  ];

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${fromEmail}`,
      to: [toEmail],
      subject: `[공상플래닛] 상담 신청 (${payload.name || "이름 없음"})`,
      text: bodyLines.join("\n"),
    }),
  });
}
