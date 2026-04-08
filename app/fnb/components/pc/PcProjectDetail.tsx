"use client";

import { useEffect } from "react";
import type { MouseEvent } from "react";
import { X } from "lucide-react";
import { projects } from "../../shared/projectData";
import { pcNavLinks, pcPrimaryCtaClassName } from "./pcNavConfig";
import ProjectGallery from "../shared/ProjectGallery";

interface PcProjectDetailProps {
    projectId: string;
    onClose: () => void;
}

const projectNameOverride: Record<string, string> = {
    gongdabang: "공 다 방",
    ba: "B A (Break Away)",
    dowon: "도원 스타일",
    iter: "이테르  iter",
};

export default function PcProjectDetail({ projectId, onClose }: PcProjectDetailProps) {
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

    const handleGlobalNavClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
        event.preventDefault();
        onClose();

        const targetId = href.replace("#", "");
        const target = document.getElementById(targetId);
        if (target) {
            window.setTimeout(() => {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 120);
        }
    };

    return (
        <div className="fixed inset-0 z-[70] bg-[#17191d]">
            <div className="pointer-events-none absolute inset-x-0 top-0 z-20">
                <div className="mx-auto w-full max-w-[1920px]">
                    <div className="pointer-events-auto flex h-[88px] items-center bg-transparent px-[92px] backdrop-blur-[10px]">
                        <a href="#home" onClick={(event) => handleGlobalNavClick(event, "#home")} className="mr-[68px] shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/fnb/images/logo/logo_final.png"
                                alt="gongsangplanet"
                                className="h-[28px] w-auto object-contain"
                            />
                        </a>

                        <nav className="font-eng flex flex-1 items-center justify-center gap-[34px] text-[17px] font-bold uppercase tracking-[0.02em] text-white/72">
                            {pcNavLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={(event) => handleGlobalNavClick(event, link.href)}
                                    className={`transition-colors duration-200 ${
                                        link.name === "KEY PROJECT" ? "text-white" : "hover:text-white"
                                    }`}
                                >
                                    {link.name}
                                </a>
                            ))}
                        </nav>

                        <a
                            href="#contact"
                            onClick={(event) => handleGlobalNavClick(event, "#contact")}
                            className={`ml-[62px] ${pcPrimaryCtaClassName}`}
                        >
                            무료 상담 신청
                        </a>
                    </div>
                </div>
            </div>

            <button
                type="button"
                onClick={onClose}
                className="absolute right-7 top-28 z-30 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white/70 transition-colors hover:text-white"
            >
                <X className="h-6 w-6" />
            </button>

            <div className="flex h-full w-full">
                <aside className="flex h-full w-[45%] flex-col overflow-y-auto border-r border-white/8 bg-[#17191d] px-[63px] pb-8 pt-[131px] text-white">
                    <h2 className="text-[49px] font-black tracking-[-0.03em] text-[#a77817]">
                        {projectNameOverride[proj.id] ?? proj.name}
                    </h2>

                    <div className="mt-[18px] space-y-[4px] text-[15px] font-semibold leading-[1.3]">
                        <p>위치: {proj.location}</p>
                        <p>면적: {proj.area.replace("㎡", "M2")}</p>
                        <p>용도: {proj.usage}</p>
                    </div>

                    <div className="mt-[52px]">
                        <div className="flex flex-wrap items-end gap-x-6 gap-y-1">
                            <p className="font-eng self-end translate-y-[1px] text-[32px] font-bold leading-none tracking-[0.01em]">CONCEPT</p>
                            <p className="self-end text-[30px] font-semibold leading-none tracking-[-0.03em]">{proj.conceptKo}</p>
                            <p className="self-end text-[30px] font-semibold leading-none tracking-[-0.02em]">{proj.conceptEn}</p>
                        </div>

                        <p className="mt-[10px] whitespace-pre-line text-[17px] font-semibold leading-[1.6] tracking-[-0.015em] text-white/94">
                            {proj.description}
                        </p>
                    </div>

                    {proj.processImg ? (
                        <div className="mt-[50px]">
                            <p className="font-eng text-[38px] font-bold leading-none tracking-[0.01em]">MASS PROCESS</p>
                            <div className="mt-4">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={proj.processImg} alt={`${proj.name} mass process`} className="w-full object-contain" />
                            </div>

                            <div
                                className={`mt-4 grid gap-4 text-center text-[11px] font-semibold leading-[1.35] text-white/86 ${
                                    proj.processDescriptions.length === 3 ? "grid-cols-3" : "grid-cols-4"
                                }`}
                            >
                                {proj.processDescriptions.map((description, index) => (
                                    <p key={`${proj.id}-process-${index}`}>{description}</p>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    <div className="mt-auto pt-6 text-center">
                        <a
                            href="#contact"
                            onClick={(event) => handleGlobalNavClick(event, "#contact")}
                            className={pcPrimaryCtaClassName}
                        >
                            무료 상담 신청
                        </a>
                        <p className="mt-4 text-[15px] font-semibold tracking-[-0.01em] text-white/92">
                            이런 공간을 만들고 싶다면 프로젝트 상담신청 해주시기 바랍니다.
                        </p>
                    </div>
                </aside>

                <div className="h-full w-[55%] overflow-hidden">
                    <ProjectGallery projectId={proj.id} images={proj.galleryImgs} isMobile={false} />
                </div>
            </div>
        </div>
    );
}
