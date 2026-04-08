"use client";

import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { mobileNavLinks, mobilePrimaryCtaClassName } from "./mobileNavConfig";

export default function MobileNavbar() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        document.body.style.touchAction = isOpen ? "none" : "";

        return () => {
            document.body.style.overflow = "";
            document.body.style.touchAction = "";
        };
    }, [isOpen]);

    const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
        event.preventDefault();
        setIsOpen(false);

        const target = document.querySelector(href);
        if (target) {
            window.setTimeout(() => {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
        }
    };

    return (
        <>
            <header className="fixed inset-x-0 top-0 z-50 bg-transparent backdrop-blur-[10px]">
                <div className="mx-auto flex h-[48px] max-w-[768px] items-center px-5">
                    <div className="w-[32px]" />

                    <a href="#m-home" className="mx-auto flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/fnb/images/logo/logo_final.png" alt="gongsangplanet" className="h-[14px] w-auto object-contain" />
                    </a>

                    <button
                        type="button"
                        className="inline-flex h-[28px] w-[32px] items-center justify-center text-white"
                        onClick={() => setIsOpen(true)}
                        aria-label="메뉴 열기"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                </div>
            </header>

            <AnimatePresence>
                {isOpen ? (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ duration: 0.28, ease: "easeOut" }}
                        className="fixed inset-0 z-[70] bg-[#17191d] px-8 pb-10 pt-14"
                    >
                        <button
                            type="button"
                            className="absolute right-5 top-5 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/80"
                            onClick={() => setIsOpen(false)}
                            aria-label="메뉴 닫기"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="mt-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/fnb/images/logo/logo_final.png" alt="gongsangplanet" className="h-[14px] w-auto object-contain" />
                        </div>

                        <nav className="mt-10 flex flex-col gap-6">
                            {mobileNavLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={(event) => handleNavClick(event, link.href)}
                                    className="font-eng text-[28px] font-extrabold uppercase tracking-[0.104em] text-white"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </nav>

                        <div className="mt-10">
                            <a
                                href="#m-contact"
                                onClick={(event) => handleNavClick(event, "#m-contact")}
                                className={mobilePrimaryCtaClassName}
                            >
                                무료 상담 신청
                            </a>
                        </div>

                        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                            <p className="text-[11px] font-bold tracking-[0.01em] text-white/52">오픈 전 임시 링크</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                                <a
                                    href="/fnb"
                                    onClick={() => setIsOpen(false)}
                                    className="inline-flex h-8 items-center justify-center rounded-lg bg-white/10 px-3 text-[12px] font-semibold text-white/88"
                                >
                                    기존버전
                                </a>
                                <a
                                    href="/fnb_new"
                                    onClick={() => setIsOpen(false)}
                                    className="inline-flex h-8 items-center justify-center rounded-lg bg-white/10 px-3 text-[12px] font-semibold text-white/88"
                                >
                                    ai버전
                                </a>
                                <a
                                    href="/ad"
                                    onClick={() => setIsOpen(false)}
                                    className="inline-flex h-8 items-center justify-center rounded-lg bg-white/10 px-3 text-[12px] font-semibold text-white/88"
                                >
                                    광고버전
                                </a>
                            </div>
                        </div>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </>
    );
}
