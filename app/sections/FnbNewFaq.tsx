"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/app/fnb/shared/projectData";
import SectionHeading from "./SectionHeading";
import { cn } from "@/lib/utils";

export default function FnbNewFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="new-faq" className="bg-[#0f1012] scroll-mt-6 break-keep">
      <div className="mx-auto max-w-[1240px] px-5 py-14 md:py-20">
        <SectionHeading
          eyebrow="FAQ"
          title="자주 묻는 질문"
          description="진행 기간, 비용 범위, 협업 방식 등 상담 전에 자주 문의하시는 내용을 안내합니다."
        />

        <div className="mt-8 grid grid-cols-1 gap-3 md:mt-16">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={item.q} className="rounded-[24px] bg-white/[0.03] transition-colors hover:bg-white/[0.05]">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex w-full items-start justify-between gap-6 px-5 py-5 text-left md:px-8 md:py-6"
                >
                  <div className="flex-1">
                    <p className="flex items-start text-[16px] font-semibold leading-[1.6] tracking-[-0.02em] text-[#ece7dd]">
                      <span className="font-eng shrink-0 text-[13px] font-bold uppercase tracking-[0.22em] text-[#cdb991]">Q.</span>
                      <span className="ml-1">{item.q}</span>
                    </p>
                  </div>
                  <span
                    className={cn(
                      "mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-black/25 text-white/50",
                      "transition-all duration-200",
                      isOpen ? "rotate-180 bg-[#cdb991]/10 text-[#cdb991]" : "rotate-0",
                    )}
                  >
                    <ChevronDown className="h-5 w-5" />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-6 pt-0 md:px-8 md:pb-7">
                        <p className="whitespace-pre-line text-[14px] font-medium leading-[1.9] tracking-[-0.01em] text-[#c6c2b9]">
                          {item.a}
                        </p>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
