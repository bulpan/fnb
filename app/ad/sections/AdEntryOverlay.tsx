"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronRight, X } from "lucide-react";

type AdIntent = "default" | "cost" | "remodel";

const adCopy: Record<
  AdIntent,
  {
    eyebrow: string;
    titleTop: string;
    titleBottom: string;
    desc: string;
    desktopBullets: string[];
    mobileBullets: string[];
  }
> = {
  default: {
    eyebrow: "NAVER AD LANDING",
    titleTop: "고객이 들어오고 싶어하고, 사장님은 운영하기 쉬운 공간으로.",
    titleBottom: "16년차 F&B 전문가가 브랜드와 매출을 동시에 잡아드립니다.",
    desc: "브랜드 전달력, 고객 동선, 운영 효율까지 한 번에 점검해 드립니다.",
    desktopBullets: [
      "브랜드 컨셉이 공간에서 약해 보이는 문제",
      "경쟁 매장과 차별이 안 되는 인테리어 고민",
      "예쁘지만 매출 동선이 약한 매장 구조",
    ],
    mobileBullets: [
      "브랜드가 잘 보이는 매장 설계",
      "고객 체류를 고려한 동선 점검",
    ],
  },
  cost: {
    eyebrow: "NAVER AD · COST",
    titleTop: "예산 안에서 완성도를 지키는",
    titleBottom: "카페 · 레스토랑 인테리어 전략",
    desc: "견적을 쓰기 전에 필수 항목부터 정리해 불필요한 비용 리스크를 줄이도록 돕습니다.",
    desktopBullets: [
      "초기 견적에서 빠지기 쉬운 공정 항목 점검",
      "면적 대비 우선순위 설계로 예산 배분 정리",
      "오픈 일정과 공사 범위의 현실적인 조율",
    ],
    mobileBullets: [
      "불필요한 공사비 리스크 점검",
      "예산 범위에 맞는 우선순위 설계",
    ],
  },
  remodel: {
    eyebrow: "NAVER AD · REMODEL",
    titleTop: "리모델링 이후 매장이 달라지는",
    titleBottom: "공간 구조 재정비 플랜",
    desc: "현재 매장의 문제를 진단하고, 손님 경험과 운영 효율이 함께 올라가는 구조를 제안합니다.",
    desktopBullets: [
      "기존 동선의 병목 구간과 체류 저해 요소 점검",
      "재방문을 유도하는 좌석 구성과 시선 흐름",
      "리뉴얼 시 브랜드 인지감을 높이는 포인트 정리",
    ],
    mobileBullets: [
      "리뉴얼 전후 동선 개선 포인트 점검",
      "브랜드 인지감을 높이는 핵심 설계",
    ],
  },
};

const stats = [
  { value: "16년", label: "F&B 공간 설계 경험" },
  { value: "250+", label: "프로젝트 수행" },
  { value: "14+", label: "브랜드 협업" },
] as const;

const previewImages = [
  "/fnb/images/compressed/project/gongdabang/2.webp",
  "/fnb/images/compressed/project/ba/4.webp",
  "/fnb/images/compressed/project/dowon/1.webp",
];

export default function AdEntryOverlay() {
  const [isOpen, setIsOpen] = useState(true);
  const copy = adCopy.default;

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const closeOnly = useCallback(() => {
    setIsOpen(false);
  }, []);

  const closeAndMove = useCallback((targetId: string) => {
    setIsOpen(false);
    window.setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  }, []);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.section
          className="fixed inset-0 z-[130] overflow-y-auto bg-black/76 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          aria-label="광고 랜딩 인트로"
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(66%_54%_at_16%_18%,rgba(205,185,145,0.2),rgba(0,0,0,0))]" />
            <div className="absolute inset-0 bg-[radial-gradient(70%_56%_at_84%_72%,rgba(167,120,23,0.16),rgba(0,0,0,0))]" />
          </div>

          <div className="relative mx-auto flex min-h-screen w-full max-w-[1460px] items-center px-3 py-3 md:px-6 md:py-7">
            <div className="relative w-full overflow-hidden rounded-[24px] border border-white/18 bg-[#0f1218]/95 shadow-[0_42px_120px_rgba(0,0,0,0.65)] break-keep md:rounded-[34px]">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01)_36%,rgba(0,0,0,0.14)_82%)]" />
              </div>

              <button
                type="button"
                onClick={closeOnly}
                className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-black/38 text-white/85 transition-colors hover:bg-black/55 md:right-5 md:top-5 md:h-10 md:w-10 md:rounded-2xl"
                aria-label="인트로 닫기"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="relative grid grid-cols-1 gap-6 px-4 pb-5 pt-11 md:grid-cols-12 md:gap-8 md:px-8 md:pb-8 md:pt-9">
                <motion.div
                  className="md:col-span-7"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.46, ease: "easeOut" }}
                >
                  <p className="font-eng text-[11px] font-bold uppercase tracking-[0.22em] text-[#d4bc8f] md:text-[12px]">
                    {copy.eyebrow}
                  </p>

                  <h2 className="mt-4 hidden font-serif text-[clamp(23px,3.15vw,47px)] font-semibold leading-[1.22] tracking-[-0.045em] text-[#f4efe6] md:block">
                    {copy.titleTop}
                    <br />
                    {copy.titleBottom}
                  </h2>
                  <h2 className="mt-4 font-serif text-[clamp(20px,6vw,28px)] font-semibold leading-[1.28] tracking-[-0.04em] text-[#f4efe6] md:hidden">
                    {copy.titleTop}
                    <br />
                    {copy.titleBottom}
                  </h2>

                  <p className="mt-4 hidden max-w-[60ch] text-[14px] font-medium leading-[1.8] tracking-[-0.01em] text-[#d0cbc1] md:block md:text-[15px]">
                    {copy.desc}
                  </p>

                  <div className="mt-5 hidden grid-cols-1 gap-2.5 md:grid">
                    {copy.desktopBullets.map((item) => (
                      <div key={item} className="flex items-start gap-2.5 rounded-xl bg-white/[0.05] px-3.5 py-2.5">
                        <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#cdb991]/18 text-[#d6be90]">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                        <p className="text-[14px] font-semibold leading-[1.58] text-[#ece7dd]">{item}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-2.5 md:hidden">
                    {copy.mobileBullets.map((item) => (
                      <div key={item} className="flex items-start gap-2.5 rounded-xl bg-white/[0.05] px-3.5 py-2.5">
                        <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#cdb991]/18 text-[#d6be90]">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                        <p className="text-[13px] font-semibold leading-[1.56] text-[#ece7dd]">{item}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-2.5 md:gap-3">
                    {stats.map((stat) => (
                      <div key={stat.label} className="rounded-xl bg-white/[0.06] px-3 py-3.5">
                        <p className="font-eng text-[22px] font-extrabold tracking-[-0.02em] text-[#f2ede3] md:text-[24px]">
                          {stat.value}
                        </p>
                        <p className="mt-1.5 text-[11px] font-semibold leading-[1.45] text-[#bcb7ae] md:text-[12px]">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-7 grid grid-cols-2 gap-2.5 md:flex md:flex-wrap md:gap-3">
                    <button
                      type="button"
                      onClick={() => closeAndMove("new-contact")}
                      className="inline-flex h-[44px] items-center justify-center rounded-xl bg-[#d4b27a] px-4 text-[13px] font-extrabold text-[#17130d] transition-colors hover:bg-[#ddbd89] md:min-w-[184px] md:text-[14px]"
                    >
                      30분 무료 진단 받기
                    </button>
                    <button
                      type="button"
                      onClick={() => closeAndMove("new-project")}
                      className="inline-flex h-[44px] items-center justify-center rounded-xl bg-white px-4 text-[13px] font-extrabold text-[#121212] transition-colors hover:bg-white/92 md:min-w-[172px] md:text-[14px]"
                    >
                      포트폴리오 보기
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={closeOnly}
                    className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-white/76 transition-colors hover:text-white/92 md:mt-4 md:text-[13px]"
                  >
                    바로 사이트 둘러보기
                    <ChevronRight className="h-4 w-4" />
                  </button>

                  <p className="mt-3 text-[11px] font-medium leading-[1.6] text-white/52 md:text-[12px]">
                    상담 후 진행 여부는 자유롭게 결정하실 수 있습니다.
                  </p>
                </motion.div>

                <motion.div
                  className="md:col-span-5"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.06 }}
                >
                  <div className="relative overflow-hidden rounded-2xl bg-black/25 md:hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewImages[0]} alt="대표 프로젝트 이미지" className="h-[172px] w-full object-cover" />
                  </div>

                  <div className="hidden h-full grid-cols-2 gap-2.5 md:grid md:gap-3">
                    <div className="relative overflow-hidden rounded-2xl bg-black/25">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={previewImages[0]} alt="대표 프로젝트 이미지 1" className="h-full w-full object-cover" />
                    </div>
                    <div className="relative overflow-hidden rounded-2xl bg-black/25">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={previewImages[1]} alt="대표 프로젝트 이미지 2" className="h-full w-full object-cover" />
                    </div>
                    <div className="relative col-span-2 overflow-hidden rounded-2xl bg-black/25">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={previewImages[2]} alt="대표 프로젝트 이미지 3" className="h-[250px] w-full object-cover" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}
