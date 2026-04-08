"use client";

import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { pcNavLinks, pcPrimaryCtaClassName, type PcNavName } from "./pcNavConfig";

export default function PcNavbar() {
    const [activeLink, setActiveLink] = useState<PcNavName>("HOME");

    useEffect(() => {
        const handleScroll = () => {
            const sectionIds = ["home", "challenges", "project", "about", "faq", "contact"];
            let currentSection: PcNavName = "HOME";

            for (const id of sectionIds) {
                const element = document.getElementById(id);
                if (!element) {
                    continue;
                }

                const rect = element.getBoundingClientRect();
                if (rect.top <= 180) {
                    currentSection =
                        id === "home"
                            ? "HOME"
                            : id === "challenges"
                              ? "YOUR CHALLENGES"
                              : id === "project"
                                ? "KEY PROJECT"
                                : (id.toUpperCase() as PcNavName);
                }
            }

            setActiveLink(currentSection);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, name: PcNavName, href: string) => {
        event.preventDefault();
        setActiveLink(name);

        const targetId = href.replace("#", "");
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
            <div className="mx-auto w-full max-w-[1920px]">
                <div className="pointer-events-auto flex h-[88px] items-center bg-transparent px-[92px] backdrop-blur-[10px]">
                    <a href="#home" className="mr-[68px] shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/fnb/images/logo/logo_final.png"
                            alt="gongsangplanet"
                            className="h-[28px] w-auto object-contain"
                        />
                    </a>

                    <nav className="font-eng flex flex-1 items-center justify-center gap-[34px] text-[17px] font-bold uppercase tracking-[0.02em]">
                        {pcNavLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={(event) => handleNavClick(event, link.name, link.href)}
                                className={`transition-colors duration-200 ${
                                    activeLink === link.name
                                        ? "text-white"
                                        : "text-white/72 hover:text-white"
                                }`}
                            >
                                {link.name}
                            </a>
                        ))}
                    </nav>

                    {activeLink !== "CONTACT" && (
                        <a
                            href="#contact"
                            onClick={(event) => handleNavClick(event, "CONTACT", "#contact")}
                            className={`ml-[62px] ${pcPrimaryCtaClassName}`}
                        >
                            무료 상담 신청
                        </a>
                    )}
                </div>
            </div>
        </header>
    );
}
