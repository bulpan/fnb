"use client";

import { useState } from "react";
import { projects } from "../../shared/projectData";

interface PcProjectGridProps {
    onSelect: (id: string) => void;
}

const teaserOverride: Record<string, { title: string; subtitle: string; tags: string[]; showDots?: boolean }> = {
    gongdabang: {
        title: "공 다 방",
        subtitle: "공산성 풍경을 차경으로 끌어들인 카페",
        tags: ["공주 인기 매장", "7년차 매장", "SNS 바이럴"],
    },
    ba: {
        title: "B A",
        subtitle: "자연광의 변화를 공간에 담아낸 카페",
        tags: ["덕은동 인기 매장", "오픈 3개월 내 안정화", "SNS 바이럴"],
        showDots: true,
    },
    dowon: {
        title: "도원스타일",
        subtitle: "복숭아꽃 낙원을 모티브로 한 레스토랑",
        tags: ["더 현대 인기 매장", "6년차 매장", "현재 컨셉 타 매장 리뉴얼 확산중"],
    },
    iter: {
        title: "iter",
        subtitle: "공간의 동선과 빛의 변화로 풀어낸 레스토랑",
        tags: ["소공동 인기 매장", "오픈 3개월 내 안정화", "SNS 바이럴"],
    },
};

export default function PcProjectGrid({ onSelect }: PcProjectGridProps) {
    const [hovered, setHovered] = useState<string | null>(null);

    return (
        <section id="project" className="h-screen overflow-hidden bg-[#161616]">
            <div className="grid h-full grid-cols-2 grid-rows-2">
                {projects.map((proj, idx) => {
                    const teaser = teaserOverride[proj.id] ?? {
                        title: proj.name,
                        subtitle: proj.shortDesc,
                        tags: proj.tags,
                    };

                    return (
                        <button
                            key={proj.id}
                            type="button"
                            className="group relative h-full cursor-pointer overflow-hidden border-white/10 text-left"
                            style={{
                                borderRightWidth: idx % 2 === 0 ? "1px" : "0",
                                borderBottomWidth: idx < 2 ? "1px" : "0",
                            }}
                            onMouseEnter={() => setHovered(proj.id)}
                            onMouseLeave={() => setHovered(null)}
                            onClick={() => onSelect(proj.id)}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={proj.mainImg}
                                alt={proj.name}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                style={{
                                    objectPosition: 
                                        ["ba", "gongdabang"].includes(proj.id) ? "bottom" : 
                                        proj.id === "iter" ? "top" : 
                                        proj.id === "dowon" ? "50% 70%" : "center"
                                }}
                            />
                            <div className="absolute inset-0 bg-black/33 transition-colors duration-500 group-hover:bg-black/27" />

                            <div className="absolute inset-0 flex flex-col items-center justify-center px-12 text-center text-white">
                                <h3 className="text-[34px] font-extrabold tracking-[-0.03em]">{teaser.title}</h3>

                                <div className="mt-[5px] flex min-h-[32px] items-start justify-center gap-3">
                                    {teaser.showDots ? (
                                        <div className="pt-[2px] text-[14px] leading-[1.1] text-black/80">
                                            <p>•</p>
                                            <p>•</p>
                                            <p>•</p>
                                            <p>•</p>
                                        </div>
                                    ) : null}
                                    <p className="text-[21px] font-semibold tracking-[-0.015em]">{teaser.subtitle}</p>
                                </div>

                                <div className="mt-[22px] flex flex-col gap-[6px] text-[22px] font-bold tracking-[-0.015em]">
                                    {teaser.tags.map((tag) => (
                                        <p key={tag}>{tag}</p>
                                    ))}
                                </div>
                            </div>

                            {hovered === proj.id ? (
                                <span className="font-eng absolute bottom-[34px] left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-[8px] border border-white/60 bg-black/25 px-5 py-2 text-[14px] font-semibold uppercase tracking-[0.16em] text-white transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-black">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform duration-500 group-hover:rotate-90">
                                        <path d="M12 5V19M5 12H19" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    VIEW PROJECT
                                </span>
                            ) : null}
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
