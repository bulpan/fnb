"use client";

import { pcPrimaryCtaClassName } from "./pcNavConfig";

const clientTypes = ["프랜차이즈 기업", "개인 카페 창업자", "리브랜딩 매장", "전문 셰프 레스토랑 창업"];

const bgImages = Array.from({ length: 30 }, (_, i) => `/fnb/images/compressed/about_photo/${i + 1}.webp`);

export default function PcAbout() {
    return (
        <section id="about" className="relative h-screen w-full overflow-hidden bg-[#17181c]">
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-5">
                {bgImages.map((img, idx) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={idx} src={img} alt="" className="h-full w-full object-cover" />
                ))}
            </div>

            <div className="absolute inset-0 bg-black/56" />

            <div className="relative z-10 mx-auto flex h-full w-full max-w-[1920px] flex-col items-center justify-center px-8 text-center text-white">
                <div className="translate-y-[48px]">
                    <h2 className="text-[91px] font-bold tracking-[0.02em]">F&B 전문 공간 디자인 스튜디오</h2>
                    <p className="mt-1 text-[49px] font-semibold tracking-[-0.03em]">16년간 F&B 공간 사업적 성과 연구</p>

                    <a
                        href="#contact"
                        className={`mt-[36px] ${pcPrimaryCtaClassName}`}
                    >
                        무료 상담 신청
                    </a>

                    <h3 className="mt-[36px] text-[61px] font-extrabold tracking-[-0.03em] text-white">고객 유형</h3>
                    <div className="mt-[10px] space-y-[8px] text-[46px] font-semibold leading-[1.12] tracking-[-0.03em]">
                        {clientTypes.map((type) => (
                            <p key={type}>{type}</p>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
