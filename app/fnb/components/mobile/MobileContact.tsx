"use client";

import { fnbContactFields } from "../../shared/contactForm";
import { useFnbContactForm } from "../../shared/useFnbContactForm";

export default function MobileContact() {
    const { formData, isSubmitting, submitState, submitMessage, setFieldValue, handleSubmit } = useFnbContactForm("mobile");

    return (
        <section id="m-contact" className="bg-[#17191d] px-5 pb-10 pt-[40px] text-white">
            <div className="mx-auto w-full max-w-[768px]">
                <h2 className="font-eng text-center text-[clamp(44px,10.5vw,62px)] font-semibold leading-[1.3] tracking-[-0.023em] text-[#a77817]">
                    CONTACT
                </h2>

                <div className="mt-6 text-center">
                    <p className="text-[clamp(13px,3.4vw,18px)] font-black leading-[1.69] tracking-[-0.015em]">
                        공상플래닛에서는 매월 한정된 프로젝트만 진행합니다.
                    </p>
                    <p className="mt-3 text-[clamp(10px,2.7vw,13px)] font-bold tracking-[-0.008em] text-[#a77817]">
                        빠른 상담 순으로 일정이 마감 됩니다.
                    </p>
                    <p className="mt-1 text-[clamp(10px,2.7vw,13px)] font-bold tracking-[-0.008em] text-[#a77817]">
                        디자인의 완성도를 위해 선택된 프로젝트에 집중합니다.
                    </p>
                </div>

                <div className="mt-6 text-center">
                    <h3 className="text-[clamp(18px,4.5vw,24px)] font-black tracking-[-0.023em] text-[#a77817]">F&B 공간 무료 상담</h3>
                    <p className="mt-2 text-[clamp(10px,2.7vw,13px)] font-bold tracking-[-0.008em]">
                        프로젝트 상담을 위해 간단한 정보를 남겨주세요
                    </p>
                </div>

                <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
                    {fnbContactFields.map((field) => (
                        <label
                            key={field.name}
                            className="grid grid-cols-[96px_1fr] items-center gap-3 border-b border-white/30 pb-2"
                        >
                            <span className="text-[14px] font-bold tracking-[-0.008em]">{field.label}:</span>
                            <input
                                type={field.type}
                                name={field.name}
                                value={formData[field.name]}
                                placeholder={field.mobilePlaceholder}
                                className="min-w-0 w-full bg-transparent text-[16px] font-medium outline-none placeholder:text-white/45"
                                onChange={(event) => setFieldValue(field.name, event.target.value)}
                                required
                            />
                        </label>
                    ))}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-4 inline-flex h-[38px] w-full items-center justify-center rounded-[10px] bg-white text-[14px] font-bold text-[#17191d] transition-colors hover:bg-white/90"
                    >
                        {isSubmitting ? "전송 중..." : "상담 신청하기"}
                    </button>

                    {submitMessage && (
                        <p className={`mt-2 text-center text-[13px] font-semibold ${submitState === "success" ? "text-[#99d979]" : "text-[#ff9090]"}`}>
                            {submitMessage}
                        </p>
                    )}
                </form>

                <div className="mt-[36px] text-center text-[13px] font-medium leading-[1.8] tracking-[-0.01em] text-white/60">
                    <p>gongsangplanet@gmail.com</p>
                    <p>서울시 마포구 서교동 458-20 푸른감성빌딩 203호</p>
                    <p>
                        <a href="tel:02-6925-3206" className="inline-block pt-1">T.02 6925 3206</a>
                    </p>
                    <p>F.02 6925 3207</p>
                </div>
            </div>
        </section>
    );
}
