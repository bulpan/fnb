"use client";

import { motion } from "framer-motion";
import { awards, clients } from "@/app/fnb/shared/projectData";
import SectionHeading from "./SectionHeading";

const clientTypes = ["프랜차이즈 기업", "개인 카페 창업자", "리브랜딩 매장", "전문 셰프 레스토랑 창업"];

const archiveImages = Array.from({ length: 30 }, (_, index) => `/fnb/images/compressed/about_photo/${index + 1}.webp`);

export default function FnbNewTrust() {
  return (
    <section id="new-about" className="relative bg-[#0c0d10] scroll-mt-6 break-keep">
      <div className="mx-auto max-w-[1360px] px-5 py-14 md:py-24">
        <SectionHeading
          eyebrow="ABOUT"
          title="성과로 증명되는 공간 디자인"
          description={
            <>
              <span className="md:hidden">
                16년 동안 축적한 F&B 공간 아카이브와 수상 경력,
                <br />
                함께한 브랜드를 소개합니다.
              </span>
              <span className="hidden md:inline">16년 동안 축적한 F&B 공간 아카이브와 수상 경력, 함께한 브랜드를 소개합니다.</span>
            </>
          }
        />

        <motion.div
          className="mt-10 rounded-3xl bg-[#151922] p-4 shadow-[0_18px_45px_rgba(0,0,0,0.28)] md:mt-14 md:p-6"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2 md:mb-5">
            <div>
              <p className="font-eng text-[11px] font-bold uppercase tracking-[0.22em] text-[#cfb27f]">ARCHIVE</p>
              <h3 className="mt-2 text-[20px] font-bold tracking-[-0.03em] text-[#f2ede4] md:text-[24px]">
                프로젝트 아카이브
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1.5 md:grid-cols-6 md:gap-2">
            {archiveImages.map((src, idx) => (
              <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-lg bg-black/24">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`공상플래닛 아카이브 이미지 ${idx + 1}`}
                  loading={idx < 6 ? "eager" : "lazy"}
                  decoding="async"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/12" />
              </div>
            ))}
          </div>
        </motion.div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:mt-8 md:grid-cols-12 md:gap-6">
          <motion.div
            className="rounded-3xl bg-[#171b24] p-6 shadow-[0_14px_36px_rgba(0,0,0,0.24)] md:col-span-5 md:p-9"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <p className="font-eng text-[11px] font-bold uppercase tracking-[0.22em] text-[#cfb27f]">CLIENT TYPE</p>
            <h3 className="mt-3 text-[22px] font-bold tracking-[-0.03em] text-[#f2ede4]">주요 고객 유형</h3>

            <div className="mt-6 space-y-2.5">
              {clientTypes.map((type) => (
                <p
                  key={type}
                  className="rounded-xl bg-black/26 px-3.5 py-2.5 text-[14px] font-medium text-[#cbc7be] md:text-[15px]"
                >
                  {type}
                </p>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="rounded-3xl bg-[#171b24] p-6 shadow-[0_14px_36px_rgba(0,0,0,0.24)] md:col-span-7 md:p-9"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
          >
            <p className="font-eng text-[11px] font-bold uppercase tracking-[0.22em] text-[#cfb27f]">AWARDS</p>
            <h3 className="mt-3 text-[22px] font-bold tracking-[-0.03em] text-[#f2ede4]">디자인 어워드</h3>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {awards.map((award, idx) => (
                <div
                  key={`${award.year}-${award.name}-${idx}`}
                  className="rounded-xl bg-black/30 p-4 transition-colors hover:bg-black/42"
                >
                  <div className="flex gap-3.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={award.img}
                      alt={award.name}
                      loading="lazy"
                      decoding="async"
                      className="h-[86px] w-[124px] shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0">
                      <p className="font-eng text-[12px] font-bold text-[#cdb991]">
                        {award.year} <span className="text-[#cdc8be]">{award.name}</span>
                      </p>
                      <p className="mt-1.5 text-[12px] font-medium leading-[1.5] text-[#b6b1a8]">{award.nameKo}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-6 rounded-3xl bg-[#171b24] p-6 shadow-[0_14px_36px_rgba(0,0,0,0.24)] md:mt-8 md:p-9"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
        >
          <div className="flex flex-wrap items-end justify-between gap-2.5">
            <div>
              <p className="font-eng text-[11px] font-bold uppercase tracking-[0.22em] text-[#cfb27f]">CLIENT</p>
              <h3 className="mt-2 text-[22px] font-bold tracking-[-0.03em] text-[#f2ede4]">함께한 브랜드</h3>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7">
            {clients.map((client, idx) => (
              <p
                key={`${client}-${idx}`}
                className="rounded-lg bg-black/28 px-3 py-2.5 text-center text-[13px] font-medium tracking-[-0.02em] text-[#cbc7be] md:text-[14px]"
              >
                {client}
              </p>
            ))}
          </div>
        </motion.div>

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
