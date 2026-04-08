// Cloudflare Pages Function for F&B Contact Form Integration with Notion
// Path: functions/api/fnb/contact.ts
// Last Update: 2026-04-08 (Trigger for environment variables)

interface Env {
  NOTION_TOKEN: string;
  NOTION_DATABASE_ID: string;
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
    return Response.json(
      { message: "서버 설정(NOTION_TOKEN/ID)이 누락되었습니다. 대시보드에서 환경 변수를 설정해 주세요." },
      { status: 500 }
    );
  }

  try {
    const payload: any = await request.json();
    
    // Validate
    for (const field of fnbContactFieldOrder) {
      const val = normalizeText(payload[field]);
      if (!val) {
        return Response.json({ message: `${fnbContactFieldLabelMap[field]} 항목을 입력해 주세요.` }, { status: 400 });
      }
      if (val.length > CONTACT_MAX_LENGTH[field]) {
        return Response.json({ message: `${fnbContactFieldLabelMap[field]} 항목이 너무 깁니다.` }, { status: 400 });
      }
    }

    const now = new Date();
    const kstDateText = formatKstDate(now);
    const clientIp = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "-";

    const properties: any = {
      "이름": { title: [{ text: { content: payload.name } }] },
      "연락처": { rich_text: [{ text: { content: payload.phone } }] },
      "매장 유형": { rich_text: [{ text: { content: payload.storeType } }] },
      "매장 위치": { rich_text: [{ text: { content: payload.location } }] },
      "매장 면적(평)": { rich_text: [{ text: { content: payload.area } }] },
      "오픈 예정일": { rich_text: [{ text: { content: payload.openDate } }] },
      "예산 범위": { rich_text: [{ text: { content: payload.budget } }] },
      "신청일시": { rich_text: [{ text: { content: kstDateText } }] },
    };

    const createResponse = await notionRequest("/pages", notionToken, {
      method: "POST",
      body: JSON.stringify({
        parent: { database_id: notionDatabaseId },
        properties,
        children: [
          {
            object: "block",
            type: "paragraph",
            paragraph: { rich_text: [{ text: { content: `접수 경로: ${payload.pagePath || "/"} (IP: ${clientIp})` } }] }
          }
        ],
      }),
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.json();
      console.error("Notion API Error:", errorData);
      return Response.json({ message: "노션 저장 중 오류가 발생했습니다." }, { status: 502 });
    }

    const pageData: any = await createResponse.json();

    // Add comment for notification push
    try {
      await notionRequest("/comments", notionToken, {
        method: "POST",
        body: JSON.stringify({
          parent: { page_id: pageData.id },
          rich_text: [{ text: { content: `🔔 새 상담 신청: ${payload.name}님 (${payload.phone})\n내용을 확인해 주세요.` } }]
        }),
      });
    } catch (e) {
      console.error("Comment error:", e);
    }

    return Response.json({ success: true, message: "상담 신청이 완료되었습니다!" });

  } catch (err: any) {
    return Response.json({ message: err.message || "서버 내부 오류" }, { status: 500 });
  }
}
