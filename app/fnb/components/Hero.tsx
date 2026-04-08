"use client";

import { motion } from "framer-motion";

export default function Hero() {
    return (
        <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-12 px-6 overflow-hidden">
            {/* Background with Dark Overlay */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[#1A1A1A]/70 z-10" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/fnb/images/gongdabang/main.jpeg"
                    alt="Premium F&B Interior"
                    className="w-full h-full object-cover object-center grayscale-[0.2]"
                />
            </div>

            <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center">
                <motion.h1
                    className="font-serif text-3xl md:text-4xl lg:text-5xl font-light leading-snug text-white tracking-[0.1em] drop-shadow-sm"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    공간의 품격을 <br className="md:hidden" />
                    <span className="text-white/90">높입니다</span>
                </motion.h1>

                <motion.p
                    className="mt-8 text-base md:text-lg text-[#C4C4C4] font-light max-w-2xl mx-auto tracking-wide leading-relaxed"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                >
                    프리미엄 F&B 브랜드의 가치를 시각화하는 인테리어 디자인. <br className="hidden md:block" />
                    공상플래닛만의 세밀한 디테일과 한정된 프로젝트에 집중하는 철학을 경험하세요.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                    className="mt-12"
                >
                    <div className="w-[1px] h-24 bg-gradient-to-b from-white to-transparent mx-auto opacity-50" />
                </motion.div>
            </div>
        </section>
    );
}
