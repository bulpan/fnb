"use client";

import { mobilePrimaryCtaClassName } from "./mobileNavConfig";

const problems = [
    "브랜드 컨셉이 공간에서 잘 전달되지 않습니다.",
    "경쟁 매장과 차별화된 공간이 필요합니다.",
    "오래 지속되는 공간을 만들고 싶습니다.",
    "매출을 만드는 공간을 만들고 싶습니다.",
];

export default function MobileChallenges() {
    return (
        <section id="m-challenges" className="relative min-h-[100svh] w-full overflow-hidden">
            <div className="absolute inset-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/fnb/images/compressed/project/dowon/1.webp"
                    alt="이런 고민이 있으신가요"
                    className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/33" />
            </div>

            <div className="relative z-10 mx-auto min-h-[100svh] w-full max-w-[768px] px-6 pb-10 pt-[158px] text-white">
                <h2 className="text-center text-[clamp(34px,8.5vw,48px)] font-black leading-[1.46] tracking-[-0.031em]">
                    이런 고민이 있으신가요?
                </h2>

                <div className="mx-auto mt-[67px] w-fit space-y-[10px] text-left">
                    {problems.map((problem) => (
                        <p
                            key={problem}
                            className="text-[clamp(16px,4.2vw,24px)] font-bold leading-[1.85] tracking-[-0.012em]"
                        >
                            - {problem}
                        </p>
                    ))}
                </div>

                <div className="mt-14 text-center">
                    <p className="text-[clamp(30px,7.6vw,46px)] font-extrabold leading-[1.46] tracking-[-0.031em]">
                        이 모든 문제
                        <br />
                        공상플래닛이 해결합니다.
                    </p>

                    <a href="#m-contact" className={`mt-8 ${mobilePrimaryCtaClassName}`}>
                        무료 상담 신청
                    </a>
                </div>
            </div>
        </section>
    );
}
