"use client";

import { motion } from "framer-motion";

const primaryCtaClassName =
  "inline-flex h-[44px] min-w-[164px] items-center justify-center rounded-xl bg-white px-6 text-[14px] font-extrabold text-[#121212] transition-colors hover:bg-white/92";

const heroPhotos = [
  {
    src: "/fnb/images/compressed/hero/main-entry-dowon.webp",
    alt: "도원 스타일 입구 전경",
    caption: "도원 스타일 · 더현대서울",
  },
  {
    src: "/fnb/images/compressed/project/ba/4.webp",
    alt: "BA 내부 디자인",
    caption: "BA · 고양",
  },
  {
    src: "/fnb/images/compressed/project/dowon/1.webp",
    alt: "도원 스타일 내부",
    caption: "도원 스타일 · 더현대서울",
  },
  {
    src: "/fnb/images/compressed/project/iter/6.webp",
    alt: "이테르 레스토랑",
    caption: "iter · 남대문",
  },
  {
    src: "/fnb/images/compressed/project/gongdabang/5.webp",
    alt: "공다방 좌석 디테일",
    caption: "공다방 디테일",
  },
  {
    src: "/fnb/images/compressed/project/ba/7.webp",
    alt: "BA 조명 디테일",
    caption: "BA 디테일",
  },
];

const heroStats = [
  { k: "16", unit: "년", label: "결과로 증명해온 F&B 공간 설계" },
  { k: "250+", unit: "개", label: "프로젝트로 검증된 공간 설계" },
  { k: "14+", unit: "개", label: "브랜드와 성장한 파트너" },
] as const;

export default function FnbNewHero() {
  return (
    <section id="new-home" className="relative overflow-hidden pt-[72px] break-keep md:pt-[92px]">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(80%_70%_at_50%_18%,rgba(205,185,145,0.22),rgba(0,0,0,0))]" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_48%_at_15%_58%,rgba(167,120,23,0.18),rgba(0,0,0,0))]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(15,16,18,0.46),rgba(15,16,18,0.86),rgba(15,16,18,1))]" />
      </div>

      <div className="relative mx-auto grid max-w-[1360px] grid-cols-1 gap-6 px-5 pb-16 pt-3 md:grid-cols-12 md:gap-7 md:pb-24 md:pt-12">
        <motion.div
          className="md:col-span-5 md:flex md:h-[580px] md:flex-col"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="text-[13px] font-bold tracking-[0.02em] text-[#cfb27f]">카페 · 레스토랑 창업자를 위한</p>
          <h1 className="mt-4 font-serif text-[clamp(30px,7.8vw,44px)] font-semibold leading-[1.22] tracking-[-0.043em] text-[#f4efe6] md:hidden">
            성공한
            <br />
            F&B브랜드가 선택한 공간디자인 스튜디오
          </h1>
          <h1 className="mt-4 hidden font-serif text-[clamp(30px,3.7vw,54px)] font-semibold leading-[1.2] tracking-[-0.043em] text-[#f4efe6] md:block md:max-w-[17ch]">
            성공한
            <br />
            F&B브랜드가 선택한
            <br />
            공간디자인 스튜디오
          </h1>

          <p className="mt-5 max-w-[58ch] text-[15px] font-medium leading-[1.9] tracking-[-0.01em] text-[#cdc9bf]">
            공상플래닛은 브랜드의{" "}
            <span className="font-extrabold text-white underline decoration-[#cfb27f]/75 decoration-2 underline-offset-[3px]">
              감성과 수익성
            </span>
            을 함께 담아내는
            F&B공간디자인 전문 스튜디오입니다.
          </p>

          <div className="mt-6 md:hidden">
            <div className="relative h-[270px] overflow-hidden rounded-[1.75rem] bg-white/6 shadow-[0_16px_36px_rgba(0,0,0,0.34)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroPhotos[0].src}
                alt={heroPhotos[0].alt}
                loading="eager"
                decoding="async"
                className="h-full w-full object-cover"
                style={{ objectPosition: "center 44%" }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.08),rgba(0,0,0,0.58))]" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="font-eng text-[10px] font-bold uppercase tracking-[0.22em] text-[#d2b98a]">Featured Project</p>
                <p className="mt-2 text-[15px] font-semibold leading-[1.5] text-[#f2ede3]">{heroPhotos[0].caption}</p>
              </div>
            </div>
          </div>

          <div className="md:mt-auto">
            <div className="mt-6 grid grid-cols-3 gap-2.5 md:mt-0 md:gap-3">
              {heroStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-white/8 p-3.5 shadow-[0_10px_24px_rgba(0,0,0,0.2)] md:p-4">
                  <p className="font-eng text-[22px] font-extrabold tracking-[-0.01em] text-[#f2ede3] md:text-[26px]">
                    {stat.k}
                    <span className="ml-1 text-[12px] font-bold text-[#cfb27f]">{stat.unit}</span>
                  </p>
                  <p className="mt-1.5 text-[11px] font-semibold leading-[1.4] text-[#bbb7ae] md:text-[12px]">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 md:mt-8">
              <p className="text-[12px] font-semibold tracking-[-0.01em] text-[#c8c3b8] md:text-[13px]">
                현장 조건에 맞춘 현실적인 범위 부터 안내드립니다.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <a href="#new-contact" className={primaryCtaClassName}>
                  무료 상담 신청
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="hidden md:col-span-7 md:block"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: "easeOut", delay: 0.05 }}
        >
          <div className="relative h-[340px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 md:h-[580px]">
            <article className="h-full w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroPhotos[0].src}
                alt={heroPhotos[0].alt}
                loading="eager"
                decoding="async"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.05),rgba(0,0,0,0.6))] " />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <p className="font-eng text-[11px] font-bold uppercase tracking-[0.25em] text-[#d2b98a]">Featured Project</p>
                <p className="mt-2 text-[16px] font-semibold leading-[1.6] text-[#f2ede3] md:text-[18px]">
                  {heroPhotos[0].caption}
                </p>
              </div>
            </article>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
