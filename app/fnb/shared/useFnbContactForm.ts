"use client";

import { FormEvent, useState } from "react";
import {
    FnbContactFieldName,
    FnbContactFormData,
    fnbContactFieldOrder,
    fnbContactFieldLabelMap,
    initialFnbContactFormData,
} from "./contactForm";

type SubmitState = "idle" | "success" | "error";
const CONTACT_API_ENDPOINT = process.env.NEXT_PUBLIC_FNB_CONTACT_ENDPOINT?.trim() || "/api/fnb/contact";

function normalizeInput(value: string): string {
    return value.replace(/\s+/g, " ").trim();
}

function normalizeFormData(formData: FnbContactFormData): FnbContactFormData {
    return {
        name: normalizeInput(formData.name),
        phone: normalizeInput(formData.phone),
        storeType: normalizeInput(formData.storeType),
        location: normalizeInput(formData.location),
        area: normalizeInput(formData.area),
        openDate: normalizeInput(formData.openDate),
        budget: normalizeInput(formData.budget),
    };
}

export function useFnbContactForm(channel: "pc" | "mobile") {
    const [formData, setFormData] = useState<FnbContactFormData>(initialFnbContactFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitState, setSubmitState] = useState<SubmitState>("idle");
    const [submitMessage, setSubmitMessage] = useState("");

    const setFieldValue = (name: FnbContactFieldName, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        const normalized = normalizeFormData(formData);
        const missingField = fnbContactFieldOrder.find((fieldName) => !normalized[fieldName]);
        if (missingField) {
            setSubmitState("error");
            setSubmitMessage(`${fnbContactFieldLabelMap[missingField]} 항목을 입력해 주세요.`);
            return;
        }

        setIsSubmitting(true);
        setSubmitState("idle");
        setSubmitMessage("");

        try {
            const response = await fetch(CONTACT_API_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...normalized,
                    channel,
                    pagePath: window.location.pathname,
                }),
            });

            const responseData = (await response.json().catch(() => null)) as { message?: string } | null;
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(
                        "상담 API 경로를 찾지 못했습니다. 정적 배포 환경이라면 NEXT_PUBLIC_FNB_CONTACT_ENDPOINT 설정을 확인해 주세요.",
                    );
                }
                throw new Error(responseData?.message || "상담 신청 전송 중 오류가 발생했습니다.");
            }

            setSubmitState("success");
            setSubmitMessage(responseData?.message || "상담 신청이 접수되었습니다. 빠르게 연락드릴게요.");
            setFormData(initialFnbContactFormData);
        } catch (error) {
            const fallbackMessage = "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
            setSubmitState("error");
            if (error instanceof TypeError) {
                setSubmitMessage("상담 서버에 연결하지 못했습니다. 네트워크 상태 또는 API 배포 상태를 확인해 주세요.");
            } else {
                setSubmitMessage(error instanceof Error ? error.message || fallbackMessage : fallbackMessage);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        isSubmitting,
        submitState,
        submitMessage,
        setFieldValue,
        handleSubmit,
    };
}
