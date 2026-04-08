"use client";

import { motion } from "framer-motion";

export default function ContactSection() {
    return (
        <section className="py-32 px-6 md:px-12 lg:px-24 bg-[#1A1A1A]" id="contact">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24">
                {/* Contact Info Header */}
                <motion.div
                    className="md:w-1/2"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="font-serif text-5xl md:text-7xl font-bold text-white mb-8">
                        CONTACT
                    </h2>
                    <p className="text-2xl md:text-3xl text-[#E5E5E5] font-light leading-snug mb-4">
                        공상플래닛에서는 매월 <span className="font-medium text-white text-3xl md:text-4xl underline decoration-[#CDB991] underline-offset-8">한정된 프로젝트만</span> 진행합니다.
                    </p>
                    <p className="text-[#CDB991] font-light text-lg">
                        디자인의 완성도를 위해 선택된 프로젝트에 집중합니다.
                    </p>
                </motion.div>

                {/* Contact Form */}
                <motion.div
                    className="md:w-1/2"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="bg-[#141414] p-8 md:p-12 border border-white/5 rounded-2xl shadow-2xl">
                        <h3 className="text-2xl font-serif text-[#CDB991] mb-2 font-medium">F&B 공간 디자인 상담</h3>
                        <p className="text-[#A3A3A3] font-light text-sm mb-8">프로젝트 상담을 위해 간단한 정보를 남겨주세요.</p>

                        <form className="space-y-6" onSubmit={(e) => e.preventDefault()} suppressHydrationWarning>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm text-[#A3A3A3] mb-2 font-medium">이름 *</label>
                                    <input suppressHydrationWarning type="text" className="w-full bg-transparent border-b border-white/20 pb-2 text-white placeholder-white/20 focus:outline-none focus:border-[#CDB991] transition-colors" placeholder="홍길동" />
                                </div>
                                <div>
                                    <label className="block text-sm text-[#A3A3A3] mb-2 font-medium">연락처 *</label>
                                    <input suppressHydrationWarning type="tel" className="w-full bg-transparent border-b border-white/20 pb-2 text-white placeholder-white/20 focus:outline-none focus:border-[#CDB991] transition-colors" placeholder="010-0000-0000" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-[#A3A3A3] mb-2 font-medium">매장 유형 *</label>
                                <input suppressHydrationWarning type="text" className="w-full bg-transparent border-b border-white/20 pb-2 text-white placeholder-white/20 focus:outline-none focus:border-[#CDB991] transition-colors" placeholder="ex) 카페, 레스토랑, 베이커리 등" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm text-[#A3A3A3] mb-2 font-medium">매장 위치</label>
                                    <input suppressHydrationWarning type="text" className="w-full bg-transparent border-b border-white/20 pb-2 text-white placeholder-white/20 focus:outline-none focus:border-[#CDB991] transition-colors" placeholder="시/구 정도의 대략적 위치" />
                                </div>
                                <div>
                                    <label className="block text-sm text-[#A3A3A3] mb-2 font-medium">매장 면적 (평)</label>
                                    <input suppressHydrationWarning type="text" className="w-full bg-transparent border-b border-white/20 pb-2 text-white placeholder-white/20 focus:outline-none focus:border-[#CDB991] transition-colors" placeholder="예상 평수" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm text-[#A3A3A3] mb-2 font-medium">오픈 예정일</label>
                                    <input suppressHydrationWarning type="text" className="w-full bg-transparent border-b border-white/20 pb-2 text-white placeholder-white/20 focus:outline-none focus:border-[#CDB991] transition-colors" placeholder="ex) 2025년 3월 중" />
                                </div>
                                <div>
                                    <label className="block text-sm text-[#A3A3A3] mb-2 font-medium">예산 범위</label>
                                    <input suppressHydrationWarning type="text" className="w-full bg-transparent border-b border-white/20 pb-2 text-white placeholder-white/20 focus:outline-none focus:border-[#CDB991] transition-colors" placeholder="인테리어 예상 예산" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-[#A3A3A3] mb-2 font-medium">프로젝트 간단 설명</label>
                                <textarea
                                    suppressHydrationWarning
                                    rows={3}
                                    className="w-full bg-transparent border border-white/20 rounded p-4 text-white placeholder-white/20 focus:outline-none focus:border-[#CDB991] transition-colors resize-none mt-2"
                                    placeholder="공간의 컨셉이나 특별히 원하시는 방향이 있다면 자유롭게 적어주세요."
                                />
                            </div>

                            <div className="pt-4 mt-6">
                                <button
                                    type="submit"
                                    className="w-full bg-white text-black py-4 rounded font-medium text-lg hover:bg-white/90 transition-colors tracking-wide"
                                >
                                    상담 신청하기
                                </button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
