"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, X } from "lucide-react";

const pcHookItems = [
  "브랜드 컨셉이 공간에서 약해 보이는 문제",
  "경쟁 매장과 차별이 안 되는 인테리어 고민",
  "예쁘지만 매출 동선이 약한 매장 구조",
];

const mobileHookItems = [
  "내 매장만의 분위기가 약하다고 느껴질 때",
  "예쁜데 운영이 불편한 구조를 바꾸고 싶을 때",
];

const introStats = [
  { value: "16년", label: "F&B 공간 설계 경험" },
  { value: "250+", label: "프로젝트 수행" },
  { value: "14+", label: "브랜드 협업" },
] as const;

const previewImages = [
  "/fnb/images/compressed/project/gongdabang/2.webp",
  "/fnb/images/compressed/project/ba/4.webp",
  "/fnb/images/compressed/project/dowon/1.webp",
];

export default function FnbNewEntryOverlay() {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
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
    }, 130);
  }, []);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.section
          className="fixed inset-0 z-[120] overflow-y-auto bg-black/72 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24, ease: "easeOut" }}
          aria-label="F&B 공간디자인 인트로 레이어"
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(70%_58%_at_20%_30%,rgba(205,185,145,0.18),rgba(0,0,0,0))]" />
            <div className="absolute inset-0 bg-[radial-gradient(74%_60%_at_80%_75%,rgba(167,120,23,0.16),rgba(0,0,0,0))]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(8,9,11,0.55),rgba(8,9,11,0.94))]" />
          </div>

          <div className="relative mx-auto flex min-h-screen w-full max-w-[1450px] items-center px-3 py-3 md:px-6 md:py-7">
            <div className="relative w-full overflow-hidden rounded-[26px] border border-white/16 bg-[#101318]/95 shadow-[0_38px_120px_rgba(0,0,0,0.62)] break-keep md:rounded-[34px]">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(72%_56%_at_12%_18%,rgba(205,185,145,0.12),rgba(0,0,0,0))]" />
                <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01)_35%,rgba(0,0,0,0.12)_80%)]" />
              </div>

              <button
                type="button"
                onClick={closeOnly}
                className="absolute right-3 top-3 z-[130] inline-flex h-9 w-9 items-center justify-center rounded-xl bg-black/36 text-white/82 transition-colors hover:bg-black/54 md:right-5 md:top-5 md:h-10 md:w-10 md:rounded-2xl"
                aria-label="인트로 닫기"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="relative grid w-full grid-cols-1 gap-7 px-4 pb-5 pt-12 md:grid-cols-12 md:gap-8 md:px-8 md:pb-8 md:pt-9">
              <motion.div
                className="md:col-span-7"
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.48, ease: "easeOut" }}
              >
                <p className="font-eng text-[11px] font-bold uppercase tracking-[0.22em] text-[#d4bc8f] md:text-[12px]">
                  F&B SPACE DESIGN CONSULTING
                </p>
                <h2 className="mt-4 hidden font-serif text-[clamp(30px,4.1vw,62px)] font-semibold leading-[1.24] tracking-[-0.045em] text-[#f4efe6] md:block">
                  고객이 들어오고 싶어지는 공간,
                  <br />
                  운영이 편해지는 구조로 설계합니다
                </h2>
                <h2 className="mt-4 font-serif text-[clamp(28px,8.4vw,38px)] font-semibold leading-[1.28] tracking-[-0.04em] text-[#f4efe6] md:hidden">
                  카페·레스토랑
                  <br />
                  공간 디자인 상담
                </h2>

                <p className="mt-4 hidden max-w-[58ch] text-[15px] font-medium leading-[1.85] tracking-[-0.01em] text-[#d0cbc2] md:block">
                  공상플래닛은 카페·레스토랑 창업자의 현실 고민을 브랜드와 매출 관점에서 함께 해결합니다.
                </p>
                <div className="mt-5 hidden grid-cols-1 gap-2.5 md:mt-6 md:grid">
                  {pcHookItems.map((item) => (
                    <div key={item} className="flex items-start gap-2.5 rounded-xl bg-white/[0.05] px-3.5 py-2.5">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#cdb991]/18 text-[#d6be90]">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <p className="text-[13px] font-semibold leading-[1.55] text-[#ece7dd] md:text-[14px]">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 grid grid-cols-1 gap-2.5 md:hidden">
                  {mobileHookItems.map((item) => (
                    <div key={item} className="flex items-start gap-2.5 rounded-xl bg-white/[0.05] px-3.5 py-2.5">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#cdb991]/18 text-[#d6be90]">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <p className="text-[13px] font-semibold leading-[1.55] text-[#ece7dd]">{item}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-3 gap-2.5 md:gap-3">
                  {introStats.map((stat, idx) => (
                    <div key={stat.label} className="rounded-xl bg-white/[0.06] px-3 py-3.5">
                      <p className="font-eng text-[22px] font-extrabold tracking-[-0.02em] text-[#f2ede3] md:text-[24px]">
                        {stat.value}
                      </p>
                      <p className="mt-1.5 text-[11px] font-semibold leading-[1.45] text-[#bcb7ae] md:text-[12px]">
                        {idx === 2 ? "브랜드 협업" : stat.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-7 grid grid-cols-3 gap-2 md:flex md:flex-wrap md:gap-3">
                  <button
                    type="button"
                    onClick={() => closeAndMove("new-project")}
                    className="inline-flex h-[42px] min-w-0 items-center justify-center rounded-xl bg-white px-2 text-[11px] font-extrabold text-[#121212] transition-colors hover:bg-white/92 md:h-[44px] md:px-5 md:text-[14px]"
                  >
                    <span className="md:hidden">프로젝트</span>
                    <span className="hidden md:inline">대표 프로젝트 보기</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => closeAndMove("new-contact")}
                    className="inline-flex h-[42px] min-w-0 items-center justify-center rounded-xl bg-[#d4b27a] px-2 text-[11px] font-extrabold text-[#17130d] transition-colors hover:bg-[#ddbd89] md:h-[44px] md:px-5 md:text-[14px]"
                  >
                    <span className="md:hidden">상담 신청</span>
                    <span className="hidden md:inline">30초 상담 신청</span>
                  </button>
                  <button
                    type="button"
                    onClick={closeOnly}
                    className="inline-flex h-[42px] min-w-0 items-center justify-center gap-1 rounded-xl bg-white/[0.07] px-2 text-[11px] font-bold text-white/86 transition-colors hover:bg-white/[0.13] md:h-[44px] md:px-5 md:text-[13px]"
                  >
                    <span className="md:hidden">바로 둘러보기</span>
                    <span className="hidden md:inline">사이트 바로 둘러보기</span>
                    <ArrowRight className="hidden h-4 w-4 md:block" />
                  </button>
                </div>
              </motion.div>

              <motion.div
                className="md:col-span-5"
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.52, ease: "easeOut", delay: 0.05 }}
              >
                <div className="relative overflow-hidden rounded-2xl bg-black/25 md:hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewImages[0]} alt="모바일 대표 공간 이미지" className="h-[170px] w-full object-cover" />
                </div>

                <div className="hidden h-full grid-cols-2 gap-2.5 md:grid md:gap-3">
                  <div className="relative overflow-hidden rounded-2xl bg-black/25">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewImages[0]} alt="대표 공간 이미지 1" className="h-full w-full object-cover" />
                  </div>
                  <div className="relative overflow-hidden rounded-2xl bg-black/25">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewImages[1]} alt="대표 공간 이미지 2" className="h-full w-full object-cover" />
                  </div>
                  <div className="relative col-span-2 overflow-hidden rounded-2xl bg-black/25">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewImages[2]}
                      alt="대표 공간 이미지 3"
                      className="h-[220px] w-full object-cover md:h-[270px]"
                    />
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
