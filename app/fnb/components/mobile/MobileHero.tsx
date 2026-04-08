"use client";

import { mobilePrimaryCtaClassName } from "./mobileNavConfig";

export default function MobileHero() {
    return (
        <section id="m-home" className="relative min-h-[100svh] w-full overflow-hidden">
            <div className="absolute inset-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/fnb/mobile_hero_bg.jpg"
                    alt="F&B 공간 디자인"
                    className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/33" />
            </div>

            <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[768px] flex-col items-center px-6 pb-12 pt-[152px] text-center text-white">
                <p className="text-[clamp(16px,4.3vw,28px)] font-extrabold leading-[1.61] tracking-[-0.023em]">
                    카페 · 레스토랑 창업자를 위한
                </p>

                <h1 className="mt-3 text-[clamp(26px,6.7vw,41px)] font-black leading-[1.51] tracking-[-0.031em]">
                    브랜드와 매출을 만드는 F&B 공간
                    <br />
                    디자인 전문 스튜디오
                </h1>

                <a href="#m-contact" className={`mt-9 ${mobilePrimaryCtaClassName}`}>
                    무료 상담 신청
                </a>

                <div className="mt-[52px] text-white">
                    <p className="text-[clamp(16px,4.2vw,24px)] font-bold tracking-[-0.023em]">
                        공상플래닛은 <span className="font-eng text-[clamp(30px,7.8vw,46px)] font-extrabold">16</span>년간
                    </p>
                    <p className="mt-1 text-[clamp(16px,4.2vw,24px)] font-bold tracking-[-0.023em]">
                        <span className="font-eng text-[clamp(30px,7.8vw,46px)] font-extrabold">250</span>개 이상의 매장 설계 경험과
                    </p>
                    <p className="mt-1 text-[clamp(16px,4.2vw,24px)] font-bold tracking-[-0.023em]">
                        폐업률 <span className="font-eng text-[clamp(30px,7.8vw,46px)] font-extrabold">10%</span>미만 유지
                    </p>
                </div>
            </div>
        </section>
    );
}
