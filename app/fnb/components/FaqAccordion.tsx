"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function FaqAccordion() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            q: "인테리어 비용은 평당 얼마인가요?",
            a: "F&B 공간은 업종의 성격, 면적, 기존 설비상태, 주방 구성 방식에 따라 비용 편차가 큽니다. 공상플래닛은 단순 평당 단가가 아닌, 공간의 목적과 운영 방식에 맞춘 예산 구조를 제안드립니다. 상담을 통해 현실적인 범위를 안내드립니다.",
        },
        {
            q: "전체 진행 기간은 얼마나 걸리나요?",
            a: "일반적으로 기획 2-4주, 설계 3-5주, 시공 6주-10주 정도가 소요됩니다. 공간 규모와 현장 조건에 따라 달라질 수 있으며, 오픈 일정이 확정된 경우 역산 방식으로 계획을 수립합니다.",
        },
        {
            q: "공상플래닛은 어떤 기준으로 프로젝트를 진행하나요?",
            a: "모든 프로젝트를 수주하기보다 브랜드의 방향성과 공간에 대한 관점이 맞는 팀과 협업합니다. 공간의 완성도뿐 아니라 실제 운영의 현실까지 함께 고민하며, 디자인과 수익 구조가 균형 있게 작동하는 프로젝트를 지향합니다.",
        },
        {
            q: "공사 중 추가 비용이 발생할 가능성도 있나요?",
            a: "공상플래닛은 디자인 변경이 없는 한, 추가 비용이 발생하지 않도록 사전 점검을 철저히 진행합니다. 현장 실측과 구조 확인, 설비 상태 점검을 기반으로 예상 가능한 변수를 최대한 설계 단계에서 반영합니다.",
        },
        {
            q: "아직 구체적인 계획이 정리되지 않았는데 상담이 가능할까요?",
            a: "가능합니다. 공간 정보와 대략적인 운영 방향만 있어도 현실적인 예산 범위와 진행 가능성을 안내해드립니다. 상담 이후에 진행을 결정하셔도 됩니다. 부담 없이 방향부터 점검해 보셔도 좋습니다.",
        },
    ];

    return (
        <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#141414]" id="faq">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 md:gap-24">
                {/* FAQ Title Area */}
                <div className="md:w-1/3 shrink-0">
                    <motion.h2
                        className="font-serif text-5xl md:text-6xl font-medium text-white tracking-widest"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        FAQ
                    </motion.h2>
                </div>

                {/* Accordion Questions Area */}
                <div className="md:w-2/3 space-y-2">
                    {faqs.map((faq, idx) => (
                        <motion.div
                            key={idx}
                            className="border-b border-white/10"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                        >
                            <button
                                className="w-full py-6 flex justify-between items-center text-left focus:outline-none"
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                            >
                                <div className="text-xl md:text-2xl font-serif text-[#CDB991]">
                                    <span className="mr-3">Q.</span>
                                    {faq.q}
                                </div>
                                <motion.div
                                    animate={{ rotate: openIndex === idx ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-white/50 shrink-0 ml-4"
                                >
                                    <ChevronDown className="w-6 h-6" />
                                </motion.div>
                            </button>

                            <AnimatePresence>
                                {openIndex === idx && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <p className="pb-8 text-[#A3A3A3] leading-relaxed font-light text-sm md:text-base">
                                            {faq.a}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
