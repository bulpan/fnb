"use client";

import { projects } from "../../shared/projectData";

interface MobileProjectGridProps {
    onSelect: (id: string) => void;
}

const teaserOverride: Record<string, { title: string; subtitle: string; tags: string[] }> = {
    gongdabang: {
        title: "공 다 방",
        subtitle: "공산성 풍경을 차경으로 끌어들인 카페",
        tags: ["공주 인기매장", "7년차 매장", "SNS 바이럴"],
    },
    ba: {
        title: "B A",
        subtitle: "자연광의 변화를 공간에 담아낸 카페",
        tags: ["덕은동 인기매장", "오픈 3개월 내 안정화", "SNS 바이럴"],
    },
    dowon: {
        title: "도원스타일",
        subtitle: "복숭아 꽃 낙원을 모티브로 한 레스토랑",
        tags: ["더현대 인기 매장", "6년차 매장", "현재 컨셉 타 매장 리뉴얼 확산중"],
    },
    iter: {
        title: "iter",
        subtitle: "공간의 동선과 빛의 변화로 풀어낸 레스토랑",
        tags: ["소공동 인기 매장", "오픈 3개월 내 안정화", "SNS 바이럴"],
    },
};

export default function MobileProjectGrid({ onSelect }: MobileProjectGridProps) {
    const imageConfigMap: Record<string, { src: string; objectPosition?: string }> = {
        gongdabang: {
            src: "/fnb/images/compressed/project/gongdabang/4.webp",
            objectPosition: "left center",
        },
        ba: {
            src: "/fnb/images/compressed/project/ba/4.webp",
            objectPosition: "left center",
        },
        dowon: {
            src: "/fnb/images/compressed/project/dowon/2.webp",
            objectPosition: "center bottom",
        },
        iter: {
            src: "/fnb/images/compressed/project/iter/2.webp",
            objectPosition: "center bottom",
        },
    };

    return (
        <section id="m-project" className="bg-[#17191d] pb-12">
            <div className="flex flex-col items-center justify-center pb-[28px] pt-[90px]">
                <h2 className="text-[14px] font-bold tracking-[-0.01em] text-[#a77817]">
                    주요 프로젝트를 소개 합니다.
                </h2>
                <p className="mt-1 text-[14px] font-bold tracking-[-0.01em] text-[#a77817]">
                    이미지를 클릭하여 공간의 이야기를 경험해 보세요
                </p>
            </div>

            <div className="grid grid-cols-2">
                {projects.map((proj, idx) => {
                    const teaser = teaserOverride[proj.id] ?? {
                        title: proj.name,
                        subtitle: proj.shortDesc,
                        tags: proj.tags,
                    };

                    const imageConfig = imageConfigMap[proj.id] ?? { src: proj.mainImg };

                    return (
                        <button
                            key={proj.id}
                            type="button"
                            className="relative aspect-[16/23] overflow-hidden border-white/10 text-center"
                            style={{
                                borderRightWidth: idx % 2 === 0 ? "1px" : "0",
                                borderTopWidth: idx >= 2 ? "1px" : "0",
                            }}
                            onClick={() => onSelect(proj.id)}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={imageConfig.src}
                                alt={proj.name}
                                className="h-full w-full object-cover"
                                style={{ objectPosition: imageConfig.objectPosition ?? "center center" }}
                            />
                            <div className="absolute inset-0 bg-black/33" />

                            <div className="absolute inset-x-0 top-[26%] flex flex-col items-center px-3 text-white">
                                <h3 className="text-[clamp(20px,4.8vw,34px)] font-extrabold tracking-[-0.023em]">{teaser.title}</h3>
                                <p className="mt-[6px] text-[clamp(12px,3vw,20px)] font-semibold leading-[1.56] tracking-[-0.012em]">
                                    {teaser.subtitle}
                                </p>

                                <div className="mt-5 space-y-[2px] text-[clamp(14px,3.5vw,24px)] font-bold leading-[1.50] tracking-[-0.015em]">
                                    {teaser.tags.map((tag) => (
                                        <p key={tag}>{tag}</p>
                                    ))}
                                </div>
                            </div>

                            <div className="absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white/80">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 5V19M5 12H19" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
