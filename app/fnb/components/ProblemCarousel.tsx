"use client";

import { motion } from "framer-motion";

export default function ProblemCarousel() {
    const problems = [
        {
            title: "브랜드 정체성",
            desc: "브랜드의 컨셉이 공간에서 제대로 전달되지 않습니다.",
        },
        {
            title: "차별화 된 공간",
            desc: "경쟁 매장과 차별화된 공간이 필요합니다.",
        },
        {
            title: "고객 체류 시간",
            desc: "고객이 오래 머무는 공간을 만들고 싶습니다.",
        },
        {
            title: "매출 증대",
            desc: "매출을 만드는 공간을 만들고 싶습니다.",
        },
    ];

    return (
        <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#141414] overflow-hidden" id="about">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-12 lg:items-end mb-16">
                    <motion.div
                        className="lg:w-1/2 flex flex-col justify-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light mb-8 text-white leading-snug tracking-wide">
                            이런 고민이 <br className="hidden md:block" />
                            있으신가요?
                        </h2>
                        <div className="text-[#C4C4C4] space-y-2 text-sm md:text-base font-light tracking-wide leading-relaxed">
                            <p className="text-white font-medium text-lg md:text-xl mb-4">공상플래닛은</p>
                            <p>16년동안 250개 이상의 F&B 공간 프로젝트 경험을 바탕으로</p>
                            <p>브랜드 경험과 매출을 함께 설계합니다.</p>
                        </div>
                    </motion.div>
                    <motion.div
                        className="lg:w-1/2"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/fnb/images/about.jpeg"
                            alt="About Gongsangplanet"
                            className="w-full h-auto max-h-[300px] object-cover rounded-xl grayscale-[0.3]"
                        />
                    </motion.div>
                </div>

                {/* Horizontal Carousel (CSS scroll snap on mobile, flex on desktop) */}
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 hide-scrollbar">
                    {problems.map((item, idx) => (
                        <motion.div
                            key={idx}
                            className="min-w-[280px] md:min-w-[320px] max-w-sm flex-shrink-0 bg-[#1A1A1A] border border-white/10 p-8 rounded-2xl snap-center"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                        >
                            <h3 className="text-xl md:text-2xl font-serif text-[#CDB991] mb-6 font-light tracking-wider">0{idx + 1}.</h3>
                            <p className="text-[#E5E5E5] leading-relaxed font-light text-lg break-keep">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
            <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
        </section>
    );
}
