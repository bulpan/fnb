"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

const challengeReasons = [
  "1. 브랜드가 공간에서 보이지 않습니다.",
  "2. 예쁘지만, 다른 매장과 구분되지 않습니다.",
  "3. 트렌드에 의존한 공간은 오래 지속되지 않습니다.",
  "4. 동선이 비효율적입니다. 그래서 운영이 무너집니다.",
];

const strategyCards = [
  {
    id: "brand",
    title: "브랜드",
    headline: "브랜드를 먼저 설계합니다.",
    detail: "컨셉, 타겟, 경험구조를 먼저 정의합니다.",
  },
  {
    id: "diff",
    title: "차별화",
    headline: "우리 공간만의 이유를 만듭니다.",
    detail: "우리 공간에서만 볼 수 있는 형태와 재료를 만듭니다.",
  },
  {
    id: "sustain",
    title: "지속성",
    headline: "시간이 지나도 남는 공간을 만듭니다.",
    detail: "시각적 장식이 아닌 공간 경험으로 설계합니다.",
  },
  {
    id: "revenue",
    title: "수익구조",
    headline: "매출이 나는 구조를 설계합니다.",
    detail: "좌석배치, 회전율, 체류시간까지 수익기준으로 설계합니다.",
  },
];

export default function FnbNewChallenges() {
  return (
    <section id="new-challenges" className="relative bg-[#0f1012] scroll-mt-6 break-keep">
      <div className="mx-auto max-w-[1360px] px-5 py-16 md:py-24">
        <SectionHeading
          eyebrow="CHALLENGES"
          title={
            <>
              <span className="md:hidden">
                잘 안 되는 공간에는
                <br />
                이유가 있습니다.
              </span>
              <span className="hidden md:inline">잘 안 되는 공간에는 이유가 있습니다.</span>
            </>
          }
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mt-8 rounded-[24px] bg-[#171b24] p-6 md:p-8"
        >
          <div className="space-y-2.5 md:space-y-3">
            {challengeReasons.map((reason) => {
              const match = reason.match(/^(\d+\.)\s*(.*)$/);
              const marker = match?.[1] ?? "";
              const text = match?.[2] ?? reason;
              return (
                <p key={reason} className="flex items-start text-[15px] font-bold leading-[1.6] tracking-[-0.01em] text-[#f07173] md:text-[17px]">
                  <span className="shrink-0">{marker}</span>
                  <span className="ml-1">{text}</span>
                </p>
              );
            })}
          </div>
          <p className="mt-6 text-[15px] font-extrabold leading-[1.6] tracking-[-0.01em] text-[#7f8cff] md:text-[17px]">
            이 문제는 디자인이 아니라 설계 방식의 문제 입니다.
          </p>
        </motion.div>

        <h3 className="mt-10 font-serif text-[clamp(28px,3.6vw,52px)] font-semibold leading-[1.22] tracking-[-0.04em] text-[#f3efe7] md:mt-14">
          공상플래닛의 공간 전략 설계
        </h3>

        <div className="mt-6 grid grid-cols-1 gap-4 md:mt-8 md:grid-cols-2 md:gap-5">
          {strategyCards.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: idx * 0.05 }}
              className="group relative transform-gpu rounded-[24px] bg-[#171b24] p-6 shadow-[0_12px_30px_rgba(0,0,0,0.22)] md:transition-colors md:duration-300 md:hover:bg-[#1b202a]"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/40 md:group-hover:bg-white/10 md:group-hover:text-[#cdb991]">
                  <span className="font-eng text-[12px] font-bold">{String(idx + 1).padStart(2, "0")}</span>
                </div>
                <h4 className="text-[18px] font-bold tracking-[-0.02em] text-[#d4b27a]">{card.title}</h4>
              </div>
              <p className="mt-3 text-[19px] font-medium leading-[1.45] tracking-[-0.02em] text-[#f2ede4] md:text-[20px]">
                {card.headline}
              </p>
              <p className="mt-2 text-[15px] font-medium leading-[1.62] text-[#b9b4aa] md:text-[16px]">{card.detail}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-9 md:mt-12">
          <p className="text-[13px] font-semibold tracking-[-0.01em] text-[#c8c3b8] md:text-[14px]">
            현장 조건에 맞춘 현실적인 범위 부터 안내드립니다.
          </p>
          <a
            href="#new-contact"
            className="mt-3 inline-flex h-[44px] min-w-[164px] items-center justify-center rounded-xl bg-white px-6 text-[14px] font-extrabold text-[#121212] transition-colors hover:bg-white/92"
          >
            무료 상담 신청
          </a>
        </div>
      </div>
    </section>
  );
}
