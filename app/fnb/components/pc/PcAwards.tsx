"use client";

import { awards, clients } from "../../shared/projectData";

export default function PcAwards() {
    return (
        <section id="awards" className="flex h-screen items-center bg-[#17191d] px-[160px] pt-[84px] text-white">
            <div className="mx-auto w-full max-w-[1740px]">
                <h2 className="text-center text-[90px] font-extrabold tracking-[-0.04em] text-[#a77817]">
                    디자인 어워드 수상
                </h2>

                <p className="mt-[18px] text-center text-[28px] font-bold leading-[1.5] tracking-[-0.01em]">
                    프로젝트 각각의 개성을 살리는 깊이 있는 디자인을 고집했던
                    <br />
                    저희의 노력은 여러 수상 경력과 다양한 클라이언트와의 협업으로 이어져 왔습니다.
                </p>

                <div className="mt-[28px]">
                    <p className="font-eng text-[27px] font-bold uppercase tracking-[-0.01em] text-[#a77817]">AWARD</p>
                    <div className="mt-[14px] grid grid-cols-4 gap-x-[92px] gap-y-[48px]">
                        {awards.map((award) => (
                            <div key={`${award.year}-${award.name}`} className="text-center">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={award.img} alt={award.name} className="h-[210px] w-full object-cover" />
                                <p className="mt-3 text-[16px] font-semibold tracking-[-0.01em] text-white/94">
                                    {award.year} {award.name}
                                </p>
                                <p className="text-[16px] font-semibold tracking-[-0.01em] text-white/94">{award.nameKo}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-[36px]">
                    <p className="font-eng text-[27px] font-bold uppercase tracking-[-0.01em] text-[#a77817]">CLIENT</p>
                    <div className="mt-3 grid grid-cols-7 gap-y-[20px]">
                        {clients.map((client) => (
                            <p
                                key={client}
                                className="text-center text-[29px] font-semibold leading-[1.15] tracking-[-0.05em] text-white/96"
                            >
                                {client}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
