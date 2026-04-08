"use client";

import { mobilePrimaryCtaClassName } from "./mobileNavConfig";

const clientTypes = ["프랜차이즈 기업", "개인 카페 창업자", "전문 셰프 레스토랑", "리브랜딩 매장"];
const bgImageIndices = [1, 2, 3, 7, 9, 10, 13, 6, 12, 14, 15, 16, 19, 20, 22, 26, 21, 11, 18, 27, 30, 29, 4, 24];
const bgImages = bgImageIndices.map((n) => `/fnb/images/compressed/about_photo/${n}.webp`);

export default function MobileAbout() {
    return (
        <section id="m-about" className="relative w-full min-h-[100svh] bg-[#17191d] overflow-hidden">
            <div className="relative z-0 grid w-full grid-cols-3">
                {bgImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-[267/185] overflow-hidden bg-[#17191d]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt="" className="h-full w-full object-cover" />
                    </div>
                ))}
            </div>
            <div className="absolute inset-0 z-[5] bg-black/53" />

            <div className="absolute inset-0 z-10 mx-auto flex w-full max-w-[768px] flex-col items-center px-6 pb-14 pt-[142px] text-center text-white">
                <h2 className="text-[clamp(38px,9.2vw,57px)] font-extrabold leading-[1.10] tracking-[-0.035em]">
                    F&B 전문
                    <br />
                    공간 디자인 스튜디오
                </h2>

                <p className="mt-1 text-[clamp(20.4px,5.4vw,27.5px)] font-bold tracking-[-0.023em]">16년간 F&B 공간 사업적 성과 연구</p>

                <a href="#m-contact" className={`mt-[46px] ${mobilePrimaryCtaClassName}`}>
                    무료 상담 신청
                </a>

                <span className="mt-[30px] text-[36px] font-extrabold tracking-[0.1em] text-white">고객유형</span>
                <div className="mt-3 space-y-[6.12px] text-center">
                    {clientTypes.map((type) => (
                        <p key={type} className="text-[clamp(18px,4.8vw,24px)] font-extrabold tracking-[-0.012em] text-white/92">
                            {type}
                        </p>
                    ))}
                </div>
            </div>
        </section>
    );
}
