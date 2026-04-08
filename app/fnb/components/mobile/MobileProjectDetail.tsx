"use client";

import { useEffect } from "react";
import type { MouseEvent } from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { projects } from "../../shared/projectData";
import ProjectGallery from "../shared/ProjectGallery";
import { mobilePrimaryCtaClassName } from "./mobileNavConfig";

interface MobileProjectDetailProps {
    projectId: string;
    onClose: () => void;
}

const projectNameOverride: Record<string, string> = {
    gongdabang: "공 다 방",
    ba: "B A (Break Away)",
    dowon: "도원스타일",
    iter: "이테르  iter",
};

export default function MobileProjectDetail({ projectId, onClose }: MobileProjectDetailProps) {
    const proj = projects.find((project) => project.id === projectId);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    if (!proj) {
        return null;
    }

    const handleContactClick = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        onClose();

        const target = document.querySelector("#m-contact");
        if (target) {
            window.setTimeout(() => {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 120);
        }
    };

    return (
        <motion.div
            className="fixed inset-0 z-[80] overflow-y-auto bg-[#17191d]"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            <div className="sticky top-0 z-10 bg-transparent px-5 pt-5 backdrop-blur-[10px]">
                <div className="relative flex h-[36px] items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/fnb/images/logo/logo_final.png" alt="gongsangplanet" className="mx-auto h-[13px] w-auto object-contain" />
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute right-5 inline-flex h-[28px] w-[28px] items-center justify-center text-white"
                        aria-label="프로젝트 상세 닫기"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div className="px-5 pb-6 pt-5 text-white">
                <h2 className="text-[clamp(21px,5.2vw,32px)] font-extrabold tracking-[-0.023em] text-[#a77817]">
                    {projectNameOverride[proj.id] ?? proj.name}
                </h2>

                <div className="mt-3 space-y-[2px] text-[9px] font-semibold leading-[1.72] text-white/95">
                    <p>위치: {proj.location}</p>
                    <p>면적: {proj.area.replace("㎡", "M2")}</p>
                    <p>용도: {proj.usage}</p>
                </div>
            </div>

            <ProjectGallery projectId={proj.id} images={proj.galleryImgs} isMobile />

            <div className="bg-[#17191d] px-5 pb-2 pt-6 text-white">
                <div className="flex items-end gap-2 whitespace-nowrap">
                    <p className="font-eng text-[13px] font-black leading-[1.3] tracking-[0.026em]">CONCEPT</p>
                    <p className="text-[8px] font-black tracking-[-0.023em]">{proj.conceptKo}</p>
                    <p className="text-[8px] font-bold tracking-[-0.015em]">{proj.conceptEn}</p>
                </div>
                <p className="mt-[6px] whitespace-pre-line text-[9px] font-semibold leading-[1.95] tracking-[-0.012em] text-white/92">
                    {proj.description}
                </p>
            </div>

            {proj.processImg ? (
                <div className="bg-[#17191d] px-5 pb-9 pt-8 text-white">
                    <p className="font-eng text-[14px] font-black leading-[1.3] tracking-[0.026em]">MASS PROCESS</p>
                    <div className="mt-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={proj.processImg} alt={`${proj.name} mass process`} className="w-full object-contain" />
                    </div>
                    <div
                        className={`mt-4 grid gap-2 text-center text-[9px] font-semibold leading-[1.76] text-white/84 ${
                            proj.processDescriptions.length === 3 ? "grid-cols-3" : "grid-cols-4"
                        }`}
                    >
                        {proj.processDescriptions.map((description, index) => (
                            <p key={`${proj.id}-mobile-process-${index}`}>{description}</p>
                        ))}
                    </div>

                    <div className="mt-7 text-center">
                        <a href="#m-contact" onClick={handleContactClick} className={mobilePrimaryCtaClassName}>
                            무료 상담 신청
                        </a>
                        <p className="mt-4 text-[9px] font-semibold tracking-[-0.008em] text-white/90">
                            이런 공간을 만들고 싶다면 프로젝트 상담신청 해주시기 바랍니다.
                        </p>
                    </div>
                </div>
            ) : null}
        </motion.div>
    );
}
