export const fnbContactFieldOrder = [
    "name",
    "phone",
    "storeType",
    "location",
    "area",
    "openDate",
    "budget",
] as const;

export type FnbContactFieldName = (typeof fnbContactFieldOrder)[number];

export type FnbContactFormData = Record<FnbContactFieldName, string>;

export interface FnbContactFieldConfig {
    name: FnbContactFieldName;
    label: string;
    type: "text" | "tel";
    mobilePlaceholder: string;
    pcPlaceholder: string;
}

export const fnbContactFields: FnbContactFieldConfig[] = [
    {
        name: "name",
        label: "이름",
        type: "text",
        mobilePlaceholder: "홍길동",
        pcPlaceholder: "홍길동",
    },
    {
        name: "phone",
        label: "연락처",
        type: "tel",
        mobilePlaceholder: "010-0000-0000",
        pcPlaceholder: "010-0000-0000",
    },
    {
        name: "storeType",
        label: "매장 유형",
        type: "text",
        mobilePlaceholder: "ex_카페,레스토랑,기타",
        pcPlaceholder: "ex_카페,레스토랑,기타",
    },
    {
        name: "location",
        label: "매장 위치",
        type: "text",
        mobilePlaceholder: "서울시 강남구 ...",
        pcPlaceholder: "서울 / 경기 / 지방",
    },
    {
        name: "area",
        label: "매장 면적(평)",
        type: "text",
        mobilePlaceholder: "예: 24평",
        pcPlaceholder: "예: 30평",
    },
    {
        name: "openDate",
        label: "오픈 예정일",
        type: "text",
        mobilePlaceholder: "예: 2026-10",
        pcPlaceholder: "예: 2026-06",
    },
    {
        name: "budget",
        label: "예산 범위",
        type: "text",
        mobilePlaceholder: "예: 1.5억 ~ 2억",
        pcPlaceholder: "예: 1.5억 ~ 2억",
    },
];

export const initialFnbContactFormData: FnbContactFormData = {
    name: "",
    phone: "",
    storeType: "",
    location: "",
    area: "",
    openDate: "",
    budget: "",
};

export const fnbContactFieldLabelMap: Record<FnbContactFieldName, string> = fnbContactFields.reduce(
    (acc, field) => {
        acc[field.name] = field.label;
        return acc;
    },
    {} as Record<FnbContactFieldName, string>,
);
