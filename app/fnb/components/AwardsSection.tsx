"use client";

import { motion } from "framer-motion";

export default function AwardsSection() {
    const awards = [
        { img: "/fnb/images/award/1.jpeg", alt: "K-Design Award" },
        { img: "/fnb/images/award/2.jpeg", alt: "IF Design Award" },
        { img: "/fnb/images/award/3.jpeg", alt: "Red Dot Award" },
        { img: "/fnb/images/award/4.jpeg", alt: "Good Design Award" },
    ];

    const clients = [
        "한화 푸드테크", "신세계푸드", "진주햄", "삼양에프앤비", "롯데쇼핑", "롯데물산", "한화호텔&리조트",
        "모나미", "서부티앤디", "문학동네", "카브루", "SK 플래닛", "포쉬텔", "만다리나덕"
    ];

    return (
        <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#141414]" id="awards">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="mb-16 text-center"
                >
                    <h2 className="font-serif text-3xl md:text-5xl font-light text-white mb-6 tracking-[0.15em]">
                        디자인 어워드 수상
                    </h2>
                    <p className="text-[#C4C4C4] text-sm md:text-base font-light tracking-wide leading-relaxed max-w-2xl mx-auto break-keep">
                        공상플래닛의 디자인에 대한 노력은 수상으로 증명했습니다.<br className="hidden md:block" />
                        찍어내듯 디자인을 하는 게 아닌 프로젝트 각각의 개성을 살리는 깊이 있는 디자인을 고집했던 저희의 노력은 여러 수상 경력과 다양한 클라이언트와의 협업으로 이어져 왔습니다.
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
                    {awards.map((award, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="bg-[#1A1A1A] p-6 text-center"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={award.img} alt={award.alt} className="w-full max-w-[120px] md:max-w-[160px] mx-auto h-auto object-contain" />
                        </motion.div>
                    ))}
                </div>

                {/* Clients Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    <h3 className="font-serif text-[#CDB991] text-lg tracking-[0.2em] mb-8 text-center">CLIENT</h3>
                    <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-6 max-w-4xl mx-auto">
                        {clients.map((client, idx) => (
                            <span key={idx} className="text-[#A3A3A3] font-light text-sm md:text-base tracking-widest hover:text-white transition-colors cursor-default">
                                {client}
                            </span>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
