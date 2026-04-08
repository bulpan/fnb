import { NextResponse } from "next/server";
import { fnbContactFieldLabelMap, fnbContactFieldOrder, FnbContactFormData } from "@/app/fnb/shared/contactForm";

export const runtime = "nodejs";

const NOTION_API_BASE_URL = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";
const CONTACT_MAX_LENGTH: Record<keyof FnbContactFormData, number> = {
    name: 40,
    phone: 40,
    storeType: 120,
    location: 180,
    area: 40,
    openDate: 40,
    budget: 120,
};

type ContactRequestBody = FnbContactFormData & {
    channel?: string;
    pagePath?: string;
};

type NotionPropertyInfo = {
    type?: string;
};

type NotionDatabaseSchema = {
    titlePropertyName: string;
    properties: Record<string, NotionPropertyInfo>;
};

const notionDatabaseSchemaCache = new Map<string, NotionDatabaseSchema>();
let cachedAutoSelectedDatabaseId = "";

const REQUIRED_NOTION_COLUMNS = [
    { key: "name", aliases: ["이름"] },
    { key: "phone", aliases: ["연락처"] },
    { key: "storeType", aliases: ["매장 유형"] },
    { key: "location", aliases: ["매장 위치"] },
    { key: "area", aliases: ["매장 면적(평)"] },
    { key: "openDate", aliases: ["오픈 예정일"] },
    { key: "budget", aliases: ["예산 범위"] },
    { key: "inquiryAt", aliases: ["문의일시", "문의 일시"] },
] as const;

type RequiredColumnKey = (typeof REQUIRED_NOTION_COLUMNS)[number]["key"];

function normalizeText(value: unknown): string {
    if (typeof value !== "string") {
        return "";
    }

    return value.replace(/\s+/g, " ").trim();
}

function normalizeColumnName(name: string): string {
    return name.replace(/\s+/g, "").trim().toLowerCase();
}

function formatKstDate(date: Date): string {
    return new Intl.DateTimeFormat("ko-KR", {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

function buildParagraphBlock(content: string) {
    return {
        object: "block",
        type: "paragraph",
        paragraph: {
            rich_text: [
                {
                    type: "text",
                    text: {
                        content,
                    },
                },
            ],
        },
    };
}

function toNotionText(content: string) {
    return [
        {
            type: "text",
            text: {
                content,
            },
        },
    ];
}

function extractNumber(value: string): number | null {
    const matched = value.replace(/,/g, "").match(/-?\d+(\.\d+)?/);
    if (!matched) {
        return null;
    }

    const parsed = Number.parseFloat(matched[0]);
    return Number.isFinite(parsed) ? parsed : null;
}

function normalizeDateForNotion(value: string): string | null {
    const raw = value.trim();
    if (!raw) {
        return null;
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
        return raw;
    }

    if (/^\d{4}-\d{2}$/.test(raw)) {
        return `${raw}-01`;
    }

    if (/^\d{4}\/\d{2}$/.test(raw)) {
        return `${raw.replace("/", "-")}-01`;
    }

    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return date.toISOString().slice(0, 10);
}

async function notionRequest(path: string, token: string, init: RequestInit): Promise<Response> {
    return fetch(`${NOTION_API_BASE_URL}${path}`, {
        ...init,
        headers: {
            Authorization: `Bearer ${token}`,
            "Notion-Version": NOTION_VERSION,
            "Content-Type": "application/json",
            ...init.headers,
        },
        cache: "no-store",
    });
}

async function readNotionError(response: Response): Promise<string> {
    try {
        const data = (await response.json()) as { message?: string };
        return data.message || "Notion API 요청에 실패했습니다.";
    } catch {
        return `Notion API 요청에 실패했습니다. status=${response.status}`;
    }
}

async function getDatabaseSchema(token: string, databaseId: string): Promise<NotionDatabaseSchema> {
    const cached = notionDatabaseSchemaCache.get(databaseId);
    if (cached) {
        return cached;
    }

    const response = await notionRequest(`/databases/${databaseId}`, token, {
        method: "GET",
    });

    if (!response.ok) {
        throw new Error(await readNotionError(response));
    }

    const data = (await response.json()) as {
        properties?: Record<string, NotionPropertyInfo>;
    };

    const properties = data.properties || {};
    const titlePropertyName = Object.entries(properties).find(([, prop]) => prop.type === "title")?.[0];
    if (!titlePropertyName) {
        throw new Error("Notion 데이터베이스에서 제목(Title) 속성을 찾을 수 없습니다.");
    }

    const schema = { titlePropertyName, properties };
    notionDatabaseSchemaCache.set(databaseId, schema);
    return schema;
}

async function listNotionDatabaseIds(token: string): Promise<string[]> {
    const response = await notionRequest("/search", token, {
        method: "POST",
        body: JSON.stringify({
            filter: {
                property: "object",
                value: "database",
            },
            sort: {
                direction: "descending",
                timestamp: "last_edited_time",
            },
            page_size: 100,
        }),
    });

    if (!response.ok) {
        throw new Error(await readNotionError(response));
    }

    const data = (await response.json()) as {
        results?: Array<{ id?: string; in_trash?: boolean }>;
    };

    return (data.results || [])
        .filter((result) => result.id && !result.in_trash)
        .map((result) => result.id as string);
}

function findPropertyNameByAliases(
    properties: Record<string, NotionPropertyInfo>,
    aliases: readonly string[],
): string | null {
    for (const alias of aliases) {
        if (alias in properties) {
            return alias;
        }
    }

    const normalizedPropertyMap = new Map<string, string>();
    for (const propertyName of Object.keys(properties)) {
        const normalized = normalizeColumnName(propertyName);
        if (!normalizedPropertyMap.has(normalized)) {
            normalizedPropertyMap.set(normalized, propertyName);
        }
    }

    for (const alias of aliases) {
        const matchedPropertyName = normalizedPropertyMap.get(normalizeColumnName(alias));
        if (matchedPropertyName) {
            return matchedPropertyName;
        }
    }

    return null;
}

function resolveRequiredColumnMap(properties: Record<string, NotionPropertyInfo>): {
    mapping: Partial<Record<RequiredColumnKey, string>>;
    missingLabels: string[];
} {
    const mapping: Partial<Record<RequiredColumnKey, string>> = {};
    const missingLabels: string[] = [];

    for (const column of REQUIRED_NOTION_COLUMNS) {
        const matchedName = findPropertyNameByAliases(properties, column.aliases);
        if (!matchedName) {
            missingLabels.push(column.aliases[0]);
            continue;
        }

        mapping[column.key] = matchedName;
    }

    return { mapping, missingLabels };
}

function getRequiredColumnScore(properties: Record<string, NotionPropertyInfo>): number {
    const { missingLabels } = resolveRequiredColumnMap(properties);
    return REQUIRED_NOTION_COLUMNS.length - missingLabels.length;
}

async function findBestDatabaseIdWithoutConfig(token: string): Promise<string> {
    if (cachedAutoSelectedDatabaseId) {
        return cachedAutoSelectedDatabaseId;
    }

    const databaseIds = await listNotionDatabaseIds(token);
    if (databaseIds.length === 0) {
        throw new Error("Notion에서 접근 가능한 데이터베이스를 찾지 못했습니다. 데이터베이스 공유를 확인해 주세요.");
    }

    let bestDatabaseId = databaseIds[0];
    let bestScore = -1;

    for (const databaseId of databaseIds) {
        try {
            const schema = await getDatabaseSchema(token, databaseId);
            const score = getRequiredColumnScore(schema.properties);
            if (score > bestScore) {
                bestScore = score;
                bestDatabaseId = databaseId;
            }

            if (score === REQUIRED_NOTION_COLUMNS.length) {
                cachedAutoSelectedDatabaseId = databaseId;
                return databaseId;
            }
        } catch {
            // 접근 권한이 없는 DB는 다음 후보로 넘어갑니다.
            continue;
        }
    }

    cachedAutoSelectedDatabaseId = bestDatabaseId;
    return bestDatabaseId;
}

function buildNotionPropertyValue(params: {
    propertyName: string;
    propertyType: string;
    value: string;
    nowIso: string;
    isInquiryAtColumn: boolean;
}) {
    const safeValue = params.value.slice(0, 1900);

    switch (params.propertyType) {
        case "title":
            return { title: toNotionText(safeValue) };
        case "rich_text":
            return { rich_text: toNotionText(safeValue) };
        case "phone_number":
            return { phone_number: safeValue };
        case "number": {
            const numberValue = extractNumber(safeValue);
            if (numberValue === null) {
                throw new Error(`${params.propertyName} 컬럼이 Number 타입입니다. 숫자를 포함한 값으로 입력해 주세요.`);
            }
            return { number: numberValue };
        }
        case "date": {
            const dateStart = params.isInquiryAtColumn
                ? params.nowIso
                : normalizeDateForNotion(safeValue);

            if (!dateStart) {
                throw new Error(`${params.propertyName} 컬럼이 Date 타입입니다. YYYY-MM 또는 YYYY-MM-DD 형식으로 입력해 주세요.`);
            }

            return { date: { start: dateStart } };
        }
        case "select":
            return { select: { name: safeValue } };
        case "multi_select": {
            const options = safeValue
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
                .slice(0, 20)
                .map((name) => ({ name }));

            return { multi_select: options };
        }
        default:
            throw new Error(`${params.propertyName} 컬럼 타입(${params.propertyType})은 지원되지 않습니다. 텍스트/숫자/날짜 타입으로 바꿔 주세요.`);
    }
}

function validatePayload(payload: ContactRequestBody): { ok: true; data: ContactRequestBody } | { ok: false; message: string } {
    const normalized = {} as FnbContactFormData;

    for (const fieldName of fnbContactFieldOrder) {
        const value = normalizeText(payload[fieldName]);
        if (!value) {
            return { ok: false, message: `${fnbContactFieldLabelMap[fieldName]} 항목을 입력해 주세요.` };
        }

        if (value.length > CONTACT_MAX_LENGTH[fieldName]) {
            return { ok: false, message: `${fnbContactFieldLabelMap[fieldName]} 항목은 ${CONTACT_MAX_LENGTH[fieldName]}자 이내로 입력해 주세요.` };
        }

        normalized[fieldName] = value;
    }

    return {
        ok: true,
        data: {
            ...normalized,
            channel: normalizeText(payload.channel) || "unknown",
            pagePath: normalizeText(payload.pagePath) || "/fnb",
        },
    };
}

export async function POST(request: Request) {
    const notionToken = process.env.NOTION_TOKEN;
    const configuredDatabaseId = process.env.NOTION_DATABASE_ID;

    if (!notionToken) {
        return NextResponse.json(
            { message: "서버의 Notion 연동 설정(NOTION_TOKEN)이 비어 있습니다. 관리자에게 문의해 주세요." },
            { status: 500 },
        );
    }

    let body: ContactRequestBody;

    try {
        body = (await request.json()) as ContactRequestBody;
    } catch {
        return NextResponse.json({ message: "요청 데이터 형식이 올바르지 않습니다." }, { status: 400 });
    }

    const validated = validatePayload(body);
    if (!validated.ok) {
        return NextResponse.json({ message: validated.message }, { status: 400 });
    }

    const now = new Date();
    const kstDateText = formatKstDate(now);

    try {
        const notionDatabaseId = normalizeText(configuredDatabaseId) || (await findBestDatabaseIdWithoutConfig(notionToken));
        const databaseSchema = await getDatabaseSchema(notionToken, notionDatabaseId);
        const { titlePropertyName, properties: databaseProperties } = databaseSchema;
        const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";
        const userAgent = request.headers.get("user-agent") || "";
        const nowIso = now.toISOString();

        const { mapping: requiredColumnMap, missingLabels } = resolveRequiredColumnMap(databaseProperties);
        if (missingLabels.length > 0) {
            return NextResponse.json(
                {
                    message: `Notion 데이터베이스에 다음 컬럼을 추가해 주세요: ${missingLabels.join(", ")}`,
                },
                { status: 500 },
            );
        }

        const columnValues: Record<RequiredColumnKey, string> = {
            name: validated.data.name,
            phone: validated.data.phone,
            storeType: validated.data.storeType,
            location: validated.data.location,
            area: validated.data.area,
            openDate: validated.data.openDate,
            budget: validated.data.budget,
            inquiryAt: kstDateText,
        };

        const notionPropertiesPayload: Record<string, unknown> = {};
        for (const requiredColumn of REQUIRED_NOTION_COLUMNS) {
            const propertyName = requiredColumnMap[requiredColumn.key];
            if (!propertyName) {
                continue;
            }

            const propertyType = databaseProperties[propertyName]?.type || "";
            notionPropertiesPayload[propertyName] = buildNotionPropertyValue({
                propertyName,
                propertyType,
                value: columnValues[requiredColumn.key],
                nowIso,
                isInquiryAtColumn: requiredColumn.key === "inquiryAt",
            });
        }

        if (!(titlePropertyName in notionPropertiesPayload)) {
            notionPropertiesPayload[titlePropertyName] = {
                title: toNotionText(`상담문의 | ${validated.data.name} | ${kstDateText}`),
            };
        }

        const createResponse = await notionRequest("/pages", notionToken, {
            method: "POST",
            body: JSON.stringify({
                parent: {
                    database_id: notionDatabaseId,
                },
                properties: notionPropertiesPayload,
                children: [
                    buildParagraphBlock(`접수 채널: ${validated.data.channel}`),
                    buildParagraphBlock(`페이지 경로: ${validated.data.pagePath}`),
                    buildParagraphBlock(`IP: ${clientIp || "-"}`),
                    buildParagraphBlock(`User-Agent: ${userAgent || "-"}`),
                ],
            }),
        });

        if (!createResponse.ok) {
            const notionError = await readNotionError(createResponse);
            console.error("[FNB_CONTACT_NOTION_CREATE_ERROR]", notionError);
            return NextResponse.json(
                { message: "상담 신청 저장에 실패했습니다. 잠시 후 다시 시도해 주세요." },
                { status: 502 },
            );
        }

        // 새 페이지에 댓글 추가 (노션 앱 푸시 알림 트리거용)
        try {
            const createData = (await createResponse.json()) as { id: string };
            const pageId = createData.id;

            if (pageId) {
                await notionRequest("/comments", notionToken, {
                    method: "POST",
                    body: JSON.stringify({
                        parent: { page_id: pageId },
                        rich_text: [
                            {
                                type: "text",
                                text: {
                                    content: `🔔 새 상담 접수: ${validated.data.name}님 (${validated.data.phone})\n실시간 매장 설계 상담 신청이 도착했습니다. 내용을 확인해 주세요.`,
                                },
                            },
                        ],
                    }),
                });
            }
        } catch (commentError) {
            // 댓글 생성 실패가 전체 상담 신청 성공 여부에 지장을 주지 않도록 로깅만 수행
            console.error("[FNB_CONTACT_NOTION_COMMENT_ERROR]", commentError);
        }

        return NextResponse.json(
            {
                success: true,
                message: "상담 신청이 접수되었습니다. 확인 후 빠르게 연락드릴게요.",
            },
            { status: 200 },
        );
    } catch (error) {
        const message = error instanceof Error ? error.message : "알 수 없는 오류";
        console.error("[FNB_CONTACT_API_ERROR]", message);

        return NextResponse.json(
            { message: "상담 신청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." },
            { status: 500 },
        );
    }
}
