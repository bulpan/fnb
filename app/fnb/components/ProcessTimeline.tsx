"use client";

import { motion } from "framer-motion";

export default function ProcessTimeline() {
    const steps = [
        {
            num: "01",
            title: "현장 실측 및 상담",
            desc: "현장 상태를 점검하고 브랜드의 방향성과 예산 범위를 논의합니다.",
        },
        {
            num: "02",
            title: "기획 및 디자인 설계",
            desc: "공간의 레이아웃, 컨셉 보드, 3D 렌더링을 통해 구체적인 시안을 확정합니다.",
        },
        {
            num: "03",
            title: "시공 및 감리",
            desc: "설계 도면에 맞춰 디테일한 시공을 진행하며, 품질을 철저히 관리합니다.",
        },
        {
            num: "04",
            title: "완공 및 사후 관리",
            desc: "최종 마감 점검 후 현장을 인계하며, 일정 기간 A/S를 보장합니다.",
        },
    ];

    return (
        <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#141414]">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="mb-16 text-center"
                >
                    <h2 className="font-serif text-3xl md:text-5xl font-medium text-white mb-4">
                        PROJECT PROCESS
                    </h2>
                    <p className="text-[#A3A3A3] text-lg font-light">
                        완성도 높은 공간을 향한 체계적인 여정
                    </p>
                </motion.div>

                <div className="relative border-l border-white/20 pl-8 md:pl-12 ml-4 md:mx-auto space-y-16">
                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            className="relative"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            {/* Timeline Dot */}
                            <div className="absolute -left-[41px] md:-left-[57px] top-1 w-5 h-5 bg-[#1A1A1A] border-2 border-white rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full opacity-0 highlight-dot" />
                            </div>

                            <h3 className="text-xl md:text-2xl font-serif text-[#E5E5E5] mb-2">
                                <span className="text-[#666] text-sm md:text-base mr-3">STEP {step.num}</span>
                                {step.title}
                            </h3>
                            <p className="text-[#A3A3A3] font-light leading-relaxed">
                                {step.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
            <style jsx>{`
        /* Highlight dot animation on hover or view */
        .relative:hover .highlight-dot {
          opacity: 1;
        }
      `}</style>
        </section>
    );
}
