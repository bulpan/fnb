"use client";

import { pcPrimaryCtaClassName } from "./pcNavConfig";

const problems = [
    "브랜드 컨셉이 공간에서 잘 전달되지 않습니다.",
    "경쟁 매장과 차별화된 공간이 필요합니다.",
    "오래 지속되는 공간을 만들고 싶습니다.",
    "매출을 만드는 공간을 만들고 싶습니다.",
];

export default function PcChallenges() {
    return (
        <section id="challenges" className="relative h-screen min-h-[1080px] w-full overflow-hidden">
            <div className="absolute inset-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/fnb/images/compressed/about_photo/1.webp"
                    alt="이런 고민이 있으신가요"
                    className="h-full w-full object-cover"
                    style={{ objectPosition: "center calc(50% - 120px)" }}
                />
                <div className="absolute inset-0 bg-black/33" />
            </div>

            <div className="relative z-10 mx-auto h-full w-full max-w-[1920px] text-white">
                <div className="absolute left-1/2 top-[136px] w-[1020px] -translate-x-1/2 text-center">
                    <h2 className="text-[76px] font-bold leading-[1.13] tracking-[-0.014em]">
                        이런 고민이 있으신가요?
                    </h2>

                    <div className="mx-auto mt-[74px] inline-flex items-start text-left">
                        <div className="space-y-[12px]">
                            {problems.map((problem, idx) => (
                                <p
                                    key={idx}
                                    className="text-[36px] font-bold leading-[1.53] tracking-[-0.01em]"
                                >
                                    - {problem}
                                </p>
                            ))}
                        </div>
                    </div>

                    <div className="mt-[51px] text-center">
                        <p className="text-[50px] font-bold leading-[1.30] tracking-[-0.015em]">
                            이 모든 문제
                            <br />
                            공상플래닛이 해결합니다.
                        </p>
                        <a
                            href="#contact"
                            className={`mt-[53px] ${pcPrimaryCtaClassName}`}
                        >
                            무료 상담 신청
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
