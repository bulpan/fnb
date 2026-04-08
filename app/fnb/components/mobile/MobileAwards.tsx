"use client";

import { awards, clients } from "../../shared/projectData";
import { mobilePrimaryCtaClassName } from "./mobileNavConfig";

export default function MobileAwards() {
    return (
        <section id="m-awards" className="bg-[#17191d] px-5 pb-12 pt-[82px] text-white">
            <div className="mx-auto w-full max-w-[768px]">
                <h2 className="text-center text-[clamp(40px,9.5vw,57px)] font-extrabold tracking-[-0.031em] text-[#a77817]">디자인 어워드 수상</h2>

                <p className="mt-0 text-center text-[clamp(15.4px,3.96vw,19.8px)] font-bold leading-[1.45] tracking-[-0.015em]">
                    개성을 살린 깊이 있는 디자인
                    <br />
                    수상과 협업으로 증명해왔습니다.
                </p>

                <div className="mt-[10px] flex justify-center">
                    <a href="#m-contact" className={mobilePrimaryCtaClassName}>
                        무료 상담 신청
                    </a>
                </div>

                <p className="font-eng mt-4 text-[clamp(14px,3.78vw,21px)] font-bold uppercase tracking-[0.0169em] text-[#a77817]">AWARD</p>
                <div className="mt-3 grid grid-cols-2 gap-3">
                    {awards.map((award) => (
                        <div key={`${award.year}-${award.name}`} className="text-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={award.img} alt={award.name} className="h-[110px] w-full object-cover" />
                            <p className="mt-2 whitespace-nowrap text-[clamp(10px,2.45vw,12px)] font-semibold leading-[1.3] tracking-[-0.015em] text-white/92">
                                {award.year} {award.name}
                            </p>
                            <p className="whitespace-nowrap text-[clamp(10px,2.45vw,12px)] font-semibold leading-[1.3] tracking-[-0.015em] text-white/92">
                                {award.nameKo}
                            </p>
                        </div>
                    ))}
                </div>

                <p className="font-eng mt-7 text-[clamp(14px,3.78vw,21px)] font-bold uppercase tracking-[0.013em] text-[#a77817]">CLIENT</p>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
                    {clients.map((client) => (
                        <p key={client} className="whitespace-nowrap text-center text-[clamp(11px,3vw,15px)] font-bold tracking-[-0.008em] text-white/95">
                            {client}
                        </p>
                    ))}
                </div>
            </div>
        </section>
    );
}
