"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { Project } from "@/app/fnb/shared/projectData";
import { cn } from "@/lib/utils";
import FnbNewProjectGallery from "./FnbNewProjectGallery";

const primaryCtaClassName =
  "inline-flex h-[44px] min-w-[164px] items-center justify-center rounded-xl bg-white px-6 text-[14px] font-extrabold text-[#121212] transition-colors hover:bg-white/92";

export default function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[80]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <button type="button" aria-label="프로젝트 상세 닫기" onClick={onClose} className="absolute inset-0 bg-black/72" />

      <motion.div
        className={cn(
          "absolute inset-x-0 bottom-0 top-0 mx-auto h-full w-full overflow-hidden",
          "max-w-[1240px] rounded-none bg-[#0f1012] shadow-[0_26px_70px_rgba(0,0,0,0.45)] md:top-[72px] md:h-[calc(100vh-96px)] md:rounded-3xl",
        )}
        initial={{ y: 18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 18, opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-50 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-black/55 text-white/85 backdrop-blur hover:bg-black/66 md:right-5 md:top-5"
          aria-label="닫기"
        >
          <X className="h-5 w-5" />
        </button>

        <div ref={scrollRef} data-project-scroll-container="true" className="relative h-full overflow-y-auto">
          <FnbNewProjectGallery
            key={project.id}
            images={project.galleryImgs}
            projectName={project.name}
            onThumbnailSelect={() => {
              const scrollEl = scrollRef.current;
              if (!scrollEl) return;
              scrollEl.scrollTo({ top: 0, behavior: "smooth" });
              window.setTimeout(() => {
                if (scrollEl.scrollTop > 2) {
                  scrollEl.scrollTo({ top: 0, behavior: "auto" });
                }
              }, 280);
            }}
          >
            <section className="bg-[#0f1012]">
              <div className="mx-auto max-w-[980px] px-6 pb-12 pt-8 md:px-10 md:pb-14 md:pt-10">
                <div className="flex flex-wrap items-start justify-between gap-4 pr-12 md:pr-14">
                  <div>
                    <p className="font-eng text-[11px] font-bold uppercase tracking-[0.22em] text-white/55">{project.nameEn}</p>
                    <h2 className="mt-2 text-[32px] font-black tracking-[-0.04em] text-[#cdb991] md:text-[42px]">
                      {project.name}
                    </h2>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-2.5 text-[13px] font-semibold leading-[1.65] text-[#cbc7be] md:grid-cols-3 md:gap-4 md:text-[14px]">
                  <p className="rounded-lg bg-white/[0.06] px-3.5 py-2.5">위치: {project.location}</p>
                  <p className="rounded-lg bg-white/[0.06] px-3.5 py-2.5">
                    면적: {project.area.replace("㎡", "m²")}
                  </p>
                  <p className="rounded-lg bg-white/[0.06] px-3.5 py-2.5">용도: {project.usage}</p>
                </div>

                <div className="mt-10">
                  <p className="font-eng text-[12px] font-bold uppercase tracking-[0.22em] text-[#cfb27f]">CONCEPT</p>
                  <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <p className="text-[24px] font-extrabold tracking-[-0.03em] text-[#f2ede4] md:text-[30px]">{project.conceptKo}</p>
                    <p className="text-[16px] font-bold tracking-[-0.01em] text-[#b7b2a9]">{project.conceptEn}</p>
                  </div>
                  <p className="mt-4 whitespace-pre-line text-[14px] font-medium leading-[1.95] tracking-[-0.01em] text-[#c6c2b9] md:text-[15px]">
                    {project.description}
                  </p>
                </div>

                {project.processImg ? (
                  <div className="mt-10">
                    <p className="font-eng text-[12px] font-bold uppercase tracking-[0.22em] text-[#cfb27f]">MASS PROCESS</p>
                    <div className="mt-4 overflow-hidden rounded-2xl bg-black/25">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={project.processImg} alt={`${project.name} mass process`} className="w-full object-contain" />
                    </div>
                    {project.processDescriptions?.length ? (
                      <div
                        className={cn(
                          "mt-4 grid gap-3 text-center text-[10px] font-semibold leading-[1.4] text-[#b8b3aa] md:text-[12px]",
                          project.processDescriptions.length === 3 ? "grid-cols-3" : "grid-cols-4",
                        )}
                      >
                        {project.processDescriptions.map((t, idx) => (
                          <p key={`${project.id}-p-${idx}`}>{t}</p>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}

                <div className="mt-10 flex flex-col gap-3 rounded-2xl bg-white/[0.06] p-4 md:flex-row md:items-center md:justify-between md:gap-5 md:p-5">
                  <div>
                    <p className="text-[12px] font-semibold leading-[1.6] text-white/60 md:text-[13px]">
                      현장 조건에 맞춘 현실적인 범위 부터 안내드립니다.
                    </p>
                  </div>
                  <a href="#new-contact" onClick={onClose} className={primaryCtaClassName}>
                    무료 상담 신청
                  </a>
                </div>
              </div>
            </section>
          </FnbNewProjectGallery>
        </div>
      </motion.div>
    </motion.div>
  );
}
