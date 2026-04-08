"use client";

import { fnbContactFields } from "../../shared/contactForm";
import { useFnbContactForm } from "../../shared/useFnbContactForm";

export default function PcContact() {
    const placeholderMap = Object.fromEntries(
        fnbContactFields.map((field) => [field.name, field.pcPlaceholder]),
    ) as Record<(typeof fnbContactFields)[number]["name"], string>;

    const { formData, isSubmitting, submitState, submitMessage, setFieldValue, handleSubmit } = useFnbContactForm("pc");

    return (
        <section id="contact" className="h-screen bg-[#17191d] px-[120px] pt-[129px] text-white">
            <div className="relative mx-auto h-full w-full max-w-[1760px]">
                <h2 className="font-eng text-[93px] font-semibold leading-none tracking-[-0.02em] text-[#a77817]">CONTACT</h2>

                <div className="relative pl-[20px]">
                    <div className="mt-[22px] space-y-2">
                        <p className="text-[44px] font-bold tracking-[-0.03em]">공상플래닛에서는 매월 한정된 프로젝트만 진행합니다.</p>
                        <p className="text-[30px] font-bold tracking-[-0.03em] text-[#a77817]">빠른 상담 순으로 일정이 마감 됩니다.</p>
                        <p className="text-[30px] font-bold tracking-[-0.03em] text-[#a77817]">디자인의 완성도를 위해 선택된 프로젝트에 집중합니다.</p>
                    </div>

                    <div className="mt-[34px] flex items-end gap-9">
                        <h3 className="text-[47px] font-black tracking-[-0.03em] text-[#a77817]">F&B 공간 무료상담</h3>
                        <p className="pb-1 text-[31px] font-bold tracking-[-0.03em]">프로젝트 상담을 위해 간단한 정보를 남겨주세요</p>
                    </div>

                    <form className="mt-[20px] max-w-[1020px] space-y-[20px]" onSubmit={handleSubmit}>
                        <label className="block border-b border-white/30 pb-1 text-[20px] font-semibold tracking-[-0.01em]">
                            이름 :
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                className="ml-3 w-[76%] bg-transparent text-[20px] font-medium outline-none placeholder:text-white/25"
                                placeholder={placeholderMap.name}
                                onChange={(event) => setFieldValue("name", event.target.value)}
                                required
                            />
                        </label>

                        <label className="block border-b border-white/30 pb-1 text-[20px] font-semibold tracking-[-0.01em]">
                            연락처 :
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                className="ml-3 w-[72%] bg-transparent text-[20px] font-medium outline-none placeholder:text-white/25"
                                placeholder={placeholderMap.phone}
                                onChange={(event) => setFieldValue("phone", event.target.value)}
                                required
                            />
                        </label>

                        <label className="block border-b border-white/30 pb-1 text-[20px] font-semibold tracking-[-0.01em]">
                            매장 유형 :
                            <input
                                type="text"
                                name="storeType"
                                value={formData.storeType}
                                className="ml-3 w-[70%] bg-transparent text-[20px] font-medium outline-none placeholder:text-white/25"
                                placeholder={placeholderMap.storeType}
                                onChange={(event) => setFieldValue("storeType", event.target.value)}
                                required
                            />
                        </label>

                        <label className="block border-b border-white/30 pb-1 text-[20px] font-semibold tracking-[-0.01em]">
                            매장 위치 :
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                className="ml-3 w-[70%] bg-transparent text-[20px] font-medium outline-none placeholder:text-white/25"
                                placeholder={placeholderMap.location}
                                onChange={(event) => setFieldValue("location", event.target.value)}
                                required
                            />
                        </label>

                        <div className="grid grid-cols-2 gap-[34px]">
                            <label className="block border-b border-white/30 pb-1 text-[20px] font-semibold tracking-[-0.01em]">
                                매장 면적(평) :
                                <input
                                    type="text"
                                    name="area"
                                    value={formData.area}
                                    className="ml-3 w-[56%] bg-transparent text-[20px] font-medium outline-none placeholder:text-white/25"
                                    placeholder={placeholderMap.area}
                                    onChange={(event) => setFieldValue("area", event.target.value)}
                                    required
                                />
                            </label>

                            <label className="block border-b border-white/30 pb-1 text-[20px] font-semibold tracking-[-0.01em]">
                                오픈 예정일 :
                                <input
                                    type="text"
                                    name="openDate"
                                    value={formData.openDate}
                                    className="ml-3 w-[52%] bg-transparent text-[20px] font-medium outline-none placeholder:text-white/25"
                                    placeholder={placeholderMap.openDate}
                                    onChange={(event) => setFieldValue("openDate", event.target.value)}
                                    required
                                />
                            </label>
                        </div>

                        <label className="block border-b border-white/30 pb-1 text-[20px] font-semibold tracking-[-0.01em]">
                            예산 범위 :
                            <input
                                type="text"
                                name="budget"
                                value={formData.budget}
                                className="ml-3 w-[70%] bg-transparent text-[20px] font-medium outline-none placeholder:text-white/25"
                                placeholder={placeholderMap.budget}
                                onChange={(event) => setFieldValue("budget", event.target.value)}
                                required
                            />
                        </label>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="mt-3 inline-flex h-[40px] min-w-[150px] items-center justify-center rounded-[10px] bg-white px-8 text-[16px] font-bold text-[#111]"
                        >
                            {isSubmitting ? "전송 중..." : "상담 신청하기"}
                        </button>

                        {submitMessage && (
                            <p className={`text-[15px] font-semibold ${submitState === "success" ? "text-[#99d979]" : "text-[#ff9090]"}`}>
                                {submitMessage}
                            </p>
                        )}
                    </form>

                    <div className="absolute bottom-0 right-0 text-center text-[20px] font-semibold leading-[1.7] tracking-[-0.01em] text-white/60">
                        <p>gongsangplanet@gmail.com</p>
                        <p>서울시 마포구 서교동 458-20 푸른감성빌딩 203호</p>
                        <p>T.02 6925 3206</p>
                        <p>F.02 6925 3207</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
