"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ParallaxGallery() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const projects = [
        {
            name: "도원스타일",
            location: "서울 영등포 여의대로 108 더현대서울 6층",
            type: "중식 레스토랑",
            area: "250M2",
            img: "/fnb/images/dowon/main.jpeg",
            gallery: [
                "/fnb/images/dowon/1.jpeg",
                "/fnb/images/dowon/2.jpeg",
                "/fnb/images/dowon/3.jpeg",
                "/fnb/images/dowon/4.jpeg",
                "/fnb/images/dowon/5.jpeg",
                "/fnb/images/dowon/8.jpeg"
            ],
            conceptTitle: "‘낙원’",
            description: "도원 스타일은 '일상 속에서 잠시 벗어나 휴식을 경험할 수 있는 공간'을 목표로 기획 되었다. 도심 속에서 잠시 숨을 고르는 작은 휴식처가 되기를 바라는 마음에서, 숲의 감각을 공간에 담았다.\n\n'낙원'이라는 컨셉을 통해 숲에서 느껴지는 기하학적 단면의 이미지를 공간 요소로 풀어내며, 확장되는 듯한 경험을 만들어냈다. 공간이 가진 자연의 빛을 최대한 끌어들여 시간에 따라 변화하는 빛의 흐름이 감각적인 경험을 확장한다.",
            features: [
                "매장 내부 입구 대형 석재를 이용한 시각적인 확장과 컨셉 연출",
                "전이공간을 이용한 별빛 형상의 공간",
                "나무의 직선적인 요소와 물의 반사적인 요소를 결합한 디자인"
            ]
        },
        {
            name: "이테르 (iter)",
            location: "서울시 중구 남대문로5길 39 지하1층",
            type: "이탈리안 레스토랑",
            area: "200M2",
            img: "/fnb/images/ba/day/main.jpeg",
            gallery: [
                "/fnb/images/ba/day/1.jpeg",
                "/fnb/images/ba/night/1.jpeg",
                "/fnb/images/ba/day/2.jpeg",
                "/fnb/images/ba/night/2.jpeg",
                "/fnb/images/ba/day/3.jpeg",
                "/fnb/images/ba/night/3.jpeg",
            ],
            conceptTitle: "‘길’",
            description: "이테르(iter)는 라틴어로 길과 여행을 뜻한다. 한식과 이탈리안을 잇는 요리 철학이 담긴 캐주얼 다이닝 브랜드를 위해 우리는 '길'이라는 키워드에 주목했다.\n\n지하 공간의 조건을 긍정적으로 활용하여 긴 축을 따르는 시퀀스를 경험하도록 설계했다. 메인 홀에서 시간에 따라 변화하는 빛은 공간의 전체 무드를 전환시키며, 이는 두 세계를 잇는 '빛의 길'을 은유적으로 표현한다.",
            features: [
                "출입구 쪽에 주방/룸을 배치하여 메인 홀의 독립성을 강조",
                "전이공간 속 반사 요소를 통한 입구의 깊이감과 몰입감 증대",
                "천장과 바닥 레벨의 드라마틱한 변화를 통한 다채로운 공간감 제공",
                "광천정을 계획하여 지하 공간의 한계를 넘는 수직적 열림 극대화"
            ]
        },
        {
            name: "공다방",
            location: "충남 공주시 백미고을길 5-31",
            type: "카페",
            area: "200M2",
            img: "/fnb/images/gongdabang/main.jpeg",
            gallery: [
                "/fnb/images/gongdabang/1.jpeg",
                "/fnb/images/gongdabang/2.jpeg",
                "/fnb/images/gongdabang/3.jpeg",
                "/fnb/images/gongdabang/5.jpeg",
                "/fnb/images/gongdabang/6.jpeg",
                "/fnb/images/gongdabang/7.jpeg",
            ],
            conceptTitle: "‘Open & Close’",
            description: "도심 속 작은 휴식처가 되기를 바라는 마음에서 일상에서 경험하는 '숲'의 감각을 담아낸 프로젝트.\n\n'Open & Close'라는 컨셉으로 기존의 닫힌 형태를 벗어나 공간을 시각적으로 개방하고, 구조적 경계벽을 철거하여 동선을 넓혔다. 3면 개방을 통해 주변의 자연 풍경을 고스란히 실내로 포용하는, 감각이 깊이 확장되는 카페를 도출했다.",
            features: [
                "기존 공간의 시각적 폐쇄 극복 및 한계 철거",
                "경계벽을 과감히 허물어 만들어 낸 공간적 확장",
                "건물 3면의 개방을 통한 빛 흐름과 공간 활용성 극대화",
                "주변 풍경을 포용하는 자연 친화적 뷰 확보"
            ]
        },
        {
            name: "BA (Break Away)",
            location: "경기도 고양시 덕양구 청조로 10",
            type: "브런치 카페",
            area: "330M2",
            img: "/fnb/images/ba/day/1.jpeg", // Using fallback image for BA hero
            gallery: [ // Re-using BA images correctly for BA project this time
                "/fnb/images/ba/day/2.jpeg",
                "/fnb/images/ba/night/2.jpeg",
                "/fnb/images/ba/day/4.jpeg",
                "/fnb/images/ba/day/3.jpeg",
            ],
            conceptTitle: "‘Secret Forest’",
            description: "BA는 일상 속에서 잠시 벗어나 휴식을 경험하는 '나만의 작은 숲'을 목표로 기획되었다.\n\n'Secret Forest'를 주제로 기하학적인 단면들을 공간 전체에 풀어내어 물리적 크기를 넘어 공간이 끝없이 확장되는 듯한 착각을 이끌어 냈다. 자연의 빛을 최대한 내부 깊숙히 끌어들여 시간에 따라 섬세하게 변화하는 고요한 분위기를 연출한다.",
            features: [
                "유리블럭 등 반투명 물성을 이용한 시간에 따른 빛 유입 및 실루엣 표현",
                "긴박한 일상을 환기시키는 전이공간을 통한 여유로운 시퀀스 유도",
                "홀 내부 단 차이를 이용해 사용자마다 각기 다른 머무름의 경험 선사",
                "자연 빛의 의도를 표현한 섬세하고 감각적인 천장 디자인"
            ]
        }
    ];

    const yPos = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

    return (
        <section ref={ref} className="py-24 bg-[#1A1A1A]" id="project">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 mb-16">
                <motion.h2
                    className="font-serif text-3xl md:text-5xl font-medium text-white mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    KEY PROJECT
                </motion.h2>
                <motion.div
                    className="w-12 h-[1px] bg-[#A3A3A3]"
                    initial={{ width: 0 }}
                    whileInView={{ width: 48 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                />
            </div>

            <div className="flex flex-col gap-24">
                {projects.map((proj, idx) => {
                    return (
                        <div key={idx} className="relative w-full flex flex-col mb-16 md:mb-32">
                            {/* Main Parallax Hero for the Project */}
                            <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden group">
                                <motion.div
                                    className="absolute inset-0 w-full h-[120%]"
                                    style={{ y: yPos }}
                                >
                                    <div className="absolute inset-0 bg-black/40 z-10 transition-colors duration-700 group-hover:bg-black/20" />
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={proj.img}
                                        alt={proj.name}
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>

                                <div className="relative z-20 h-full flex items-end p-8 md:p-16 max-w-7xl mx-auto w-full">
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        transition={{ duration: 0.8 }}
                                    >
                                        <h3 className="text-4xl md:text-6xl font-serif text-white mb-4 tracking-wider font-light">{proj.name}</h3>
                                        <div className="text-[#E5E5E5] space-y-1 font-light text-sm md:text-base tracking-wide flex flex-col md:flex-row md:items-center md:gap-4 md:space-y-0">
                                            <p className="flex items-center gap-2"><span className="text-[#A3A3A3] text-xs">위치</span> {proj.location}</p>
                                            <span className="hidden md:inline-block text-white/30">|</span>
                                            <p className="flex items-center gap-2"><span className="text-[#A3A3A3] text-xs">용도</span> {proj.type}</p>
                                            <span className="hidden md:inline-block text-white/30">|</span>
                                            <p className="flex items-center gap-2"><span className="text-[#A3A3A3] text-xs">면적</span> {proj.area}</p>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Text Doc Injection */}
                            <div className="w-full bg-[#1A1A1A] py-16 px-6 md:px-12 lg:px-24">
                                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24">
                                    {/* Concept Overview */}
                                    <motion.div
                                        className="lg:w-1/2"
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        transition={{ duration: 0.8 }}
                                    >
                                        <h4 className="font-serif text-[#CDB991] text-lg tracking-[0.2em] mb-4">CONCEPT</h4>
                                        <h3 className="font-serif text-3xl md:text-5xl font-light text-white mb-8 tracking-wide">
                                            {proj.conceptTitle}
                                        </h3>
                                        <div className="space-y-4 text-[#C4C4C4] font-light leading-relaxed tracking-wide text-sm md:text-base whitespace-pre-line">
                                            {proj.description}
                                        </div>
                                    </motion.div>

                                    {/* Features List */}
                                    <motion.div
                                        className="lg:w-1/2 flex flex-col justify-end"
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        transition={{ duration: 0.8, delay: 0.2 }}
                                    >
                                        <div className="border border-white/10 rounded-2xl p-8 bg-[#141414]">
                                            <ul className="space-y-4">
                                                {proj.features.map((feature, fIdx) => (
                                                    <li key={fIdx} className="flex items-start gap-4 text-[#E5E5E5] font-light text-sm md:text-base leading-relaxed tracking-wide">
                                                        <span className="text-[#A3A3A3] font-serif mt-1 shrink-0 text-xs">-</span>
                                                        <span>{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Sub-grid Gallery */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 mx-2 md:mx-auto max-w-7xl w-full">
                                {proj.gallery.map((gImg, gIdx) => (
                                    <motion.div
                                        key={gIdx}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: (gIdx % 3) * 0.1 }}
                                        className="aspect-[4/3] overflow-hidden relative cursor-pointer group/item rounded-lg"
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={gImg}
                                            alt={`${proj.name} detail ${gIdx + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-105"
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
