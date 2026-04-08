"use client";

import { pcPrimaryCtaClassName } from "./pcNavConfig";

export default function PcHero() {
    return (
        <section id="home" className="relative h-screen w-full overflow-hidden">
            <div className="absolute inset-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/fnb/images/compressed/project/gongdabang/2.webp"
                    alt="F&B 공간 디자인"
                    className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/33" />
            </div>

            <div className="relative z-10 mx-auto flex h-full w-full max-w-[1920px] flex-col items-center px-8 pt-[232px] text-center">
                <p className="text-[50px] font-bold tracking-[-0.02em] text-white">
                    카페 · 레스토랑 창업자를 위한
                </p>
                <h1 className="mt-2 text-[74px] font-bold leading-[1.14] tracking-[-0.04em] text-white">
                    브랜드와 매출을 만드는 F&B 공간 디자인 전문 스튜디오
                </h1>

                <a
                    href="#contact"
                    className={`mt-[70px] ${pcPrimaryCtaClassName}`}
                >
                    무료 상담 신청
                </a>

                <div className="mt-[61px] text-center text-white">
                    <p className="text-[51px] font-medium leading-[1.2] tracking-[-0.04em]">
                        공상플래닛은 <span className="font-eng text-[69px] font-semibold">16</span>년간
                    </p>
                    <p className="mt-0 text-[51px] font-medium leading-[1.2] tracking-[-0.04em]">
                        <span className="font-eng text-[69px] font-semibold">250</span>개 이상의 매장 설계 경험과 폐업률{" "}
                        <span className="font-eng text-[69px] font-semibold">10%</span>미만 유지
                    </p>
                </div>
            </div>
        </section>
    );
}
