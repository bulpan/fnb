"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import { projects } from "@/app/fnb/shared/projectData";
import SectionHeading from "./SectionHeading";
import { cn } from "@/lib/utils";

function pickPreviewImages(mainImg: string, galleryImgs: string[]) {
  const unique = Array.from(new Set([mainImg, ...galleryImgs]));
  return unique.slice(0, 4);
}

const projectHighlights: Record<
  string,
  {
    strategy: string;
    keyDesign: string[];
  }
> = {
  gongdabang: {
    strategy: "관광 상권 기반 회전, 체류 복합형 좌석배치\n공다방만의 정체성 표현",
    keyDesign: ["공산성을 내부로 연결하는 구조", "효율적인 운영을 반영한 레이아웃"],
  },
  ba: {
    strategy: "도심 속 휴식형 카페 설계\n편안함을 강조한 재료구성",
    keyDesign: ["자연빛을 끌어드리는 공간 설계", "좌석 밀도 조절로 체류 유도"],
  },
  dowon: {
    strategy: "브랜드 정체성이 보이는 공간 설계\n여성 타겟을 위한 무드 구성",
    keyDesign: ["입구부터 내부까지 스토리 흐름 설계", "재료와 디테일 중심 공간 완성"],
  },
  iter: {
    strategy: "경험 중심 다이닝 공간 설계",
    keyDesign: ["입체적 동선 구조", "조도 변화로 분위기 전환"],
  },
};

const projectOutcomes: Partial<Record<string, string[]>> = {
  gongdabang: ["공주 지역 인기 카페", "SNS 바이럴", "7년차 매장"],
};

const primaryCtaClassName =
  "inline-flex h-[44px] min-w-[164px] items-center justify-center rounded-xl bg-white px-6 text-[14px] font-extrabold text-[#121212] transition-colors hover:bg-white/92";

export default function FnbNewProjects({ onSelectProject }: { onSelectProject: (id: string) => void }) {
  return (
    <section id="new-project" className="relative bg-[#0f1012] scroll-mt-6 break-keep">
      <div className="mx-auto max-w-[1360px] px-5 py-14 md:py-24">
        <SectionHeading
          eyebrow="KEY PROJECT"
          title="공상플래닛을 증명하는 대표 프로젝트"
          description="공다방, BA, 도원스타일, iter 프로젝트를 통해 공상플래닛의 공간디자인 접근 방법을 확인하실 수 있습니다."
        />

        <div className="mt-12 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-2 md:gap-6">
          {projects.map((p, idx) => {
            const previewImages = pickPreviewImages(p.mainImg, p.galleryImgs);
            const mainPreview = previewImages[0] ?? p.mainImg;
            const sideImages = previewImages.slice(1);
            const highlight = projectHighlights[p.id];
            const outcomes = projectOutcomes[p.id] ?? p.tags.slice(0, 3);

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ duration: 0.55, ease: "easeOut", delay: idx * 0.05 }}
                className={cn(
                  "group relative overflow-hidden rounded-3xl bg-[#161a21] text-left shadow-[0_18px_45px_rgba(0,0,0,0.28)]",
                  "transform-gpu md:transition-all md:duration-300 md:hover:-translate-y-[2px] md:hover:bg-[#1a1f27]",
                )}
              >
                <button type="button" onClick={() => onSelectProject(p.id)} className="block w-full text-left">
                  <div className="px-6 pt-6 md:hidden">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-[24px] font-black tracking-[-0.03em] text-[#f2ede3]">{p.name}</h3>
                        <p className="mt-2 text-[14px] font-medium leading-[1.75] text-[#c3bfb6]">{p.shortDesc}</p>
                      </div>

                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-black/35 text-white/80 transition-colors group-hover:bg-white/12">
                        <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-[1px] group-hover:translate-x-[1px]" />
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 md:p-3">
                    <div className="relative overflow-hidden rounded-2xl md:hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={mainPreview}
                        alt={`${p.name} 메인 이미지`}
                        loading={idx < 2 ? "eager" : "lazy"}
                        decoding="async"
                        className="h-[228px] w-full object-cover md:transition-transform md:duration-700 md:group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.02),rgba(0,0,0,0.62))]" />
                    </div>

                    <div className="mt-2 flex gap-2 md:hidden">
                      {sideImages.map((src, imageIdx) => (
                        <div key={`${src}-mobile-${imageIdx}`} className="relative h-[82px] flex-1 overflow-hidden rounded-xl bg-black/25">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={src}
                            alt={`${p.name} 추가 이미지 ${imageIdx + 1}`}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="hidden md:block">
                      <div className="relative grid h-[350px] grid-cols-12 grid-rows-3 gap-2.5 overflow-hidden rounded-2xl bg-black/22 p-2.5">
                        <div className="relative col-span-8 row-span-3 overflow-hidden rounded-2xl">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={mainPreview}
                            alt={`${p.name} 대표 이미지`}
                            loading={idx < 2 ? "eager" : "lazy"}
                            decoding="async"
                            className="h-full w-full object-cover md:transition-transform md:duration-700 md:group-hover:scale-[1.03]"
                          />
                          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.55))]" />
                        </div>

                        {sideImages.map((src, imageIdx) => (
                          <div key={`${src}-desktop-${imageIdx}`} className="relative col-span-4 overflow-hidden rounded-xl">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={src}
                              alt={`${p.name} 상세 미리보기 ${imageIdx + 1}`}
                              loading="lazy"
                              decoding="async"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ))}

                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-4 md:p-7 md:pt-5">
                    <div className="mb-5 hidden items-start justify-between gap-4 md:flex">
                      <div>
                        <h3 className="text-[28px] font-black tracking-[-0.03em] text-[#f2ede3]">{p.name}</h3>
                        <p className="mt-2 text-[14px] font-medium leading-[1.75] text-[#c3bfb6]">{p.shortDesc}</p>
                      </div>

                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-black/35 text-white/80 transition-colors group-hover:bg-white/12">
                        <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-[1px] group-hover:translate-x-[1px]" />
                      </span>
                    </div>

                    {highlight || outcomes.length ? (
                      <div className="grid grid-cols-1 gap-3 rounded-2xl bg-black/26 p-4 md:p-[17px]">
                        {highlight ? (
                          <div>
                            <p className="text-[15px] font-extrabold tracking-[-0.02em] text-[#d4b27a] md:text-[16px]">
                              공간 전략
                            </p>
                            <p className="mt-1.5 whitespace-pre-line text-[13px] font-semibold leading-[1.65] text-white/80 md:text-[14px]">
                              {highlight.strategy}
                            </p>
                          </div>
                        ) : null}

                        {highlight ? (
                          <div>
                            <p className="text-[15px] font-extrabold tracking-[-0.02em] text-[#d4b27a] md:text-[16px]">
                              핵심 설계
                            </p>
                            <div className="mt-1.5 space-y-1.5">
                              {highlight.keyDesign.map((item) => (
                                <p key={`${p.id}-${item}`} className="flex items-start text-[13px] font-semibold leading-[1.6] text-white/76 md:text-[14px]">
                                  <span className="shrink-0">-</span>
                                  <span className="ml-1">{item}</span>
                                </p>
                              ))}
                            </div>
                          </div>
                        ) : null}

                        {outcomes.length ? (
                          <div className={cn(highlight ? "border-t border-white/10 pt-3" : "")}>
                            <p className="text-[15px] font-extrabold tracking-[-0.02em] text-[#d4b27a] md:text-[16px]">
                              성과
                            </p>
                            <div className="mt-2.5 flex flex-wrap gap-2">
                              {outcomes.map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center rounded-full bg-white/[0.08] px-3 py-1.5 text-[12px] font-bold tracking-[-0.01em] text-white/88"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    <div className="mt-6 flex items-center justify-between">
                      <div className="text-[12px] font-semibold text-[#adaba4]">
                        {p.usage} · {p.area.replace("㎡", "m²")}
                      </div>
                      <div className="inline-flex items-center gap-2 text-[12px] font-bold tracking-[0.12em] text-[#c7c4bc]">
                        <Plus className="h-4 w-4" />
                        VIEW DETAIL
                      </div>
                    </div>
                  </div>
                </button>

              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 md:mt-12">
          <p className="text-[12px] font-semibold tracking-[-0.01em] text-[#c8c3b8]">
            현장 조건에 맞춘 현실적인 범위 부터 안내드립니다.
          </p>
          <div className="mt-3">
            <a href="#new-contact" className={primaryCtaClassName}>
              무료 상담 신청
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
