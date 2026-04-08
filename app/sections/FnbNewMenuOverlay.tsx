"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavName } from "./FnbNewNavbar";
import { navLinks } from "./FnbNewNavbar";

interface FnbNewMenuOverlayProps {
  active: NavName;
  onClose: () => void;
  onSelect: (name: NavName, href: string) => void;
}

export default function FnbNewMenuOverlay({ active, onClose, onSelect }: FnbNewMenuOverlayProps) {
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex justify-end"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative flex h-full w-full max-w-[400px] flex-col overflow-y-auto overscroll-contain bg-[#0f1012] p-8 pb-10 shadow-2xl md:p-12 md:pb-12"
      >
        <div className="flex items-center justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/fnb/images/logo/logo_final.png" alt="logo" className="h-[18px] w-auto opacity-60" />
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/8 text-white/80 transition-all hover:bg-white/14"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-12 flex flex-col gap-4">
          <p className="font-eng text-[11px] font-bold uppercase tracking-[0.3em] text-[#cfb27f]">Navigation</p>
          <div className="flex flex-col">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => onSelect(link.name, link.href)}
                className="group relative flex items-center justify-between border-b border-white/5 py-4 text-left break-keep"
              >
                <span
                  className={cn(
                    "font-extrabold text-[22px] tracking-[-0.02em] transition-all duration-300 md:text-[24px]",
                    active === link.name ? "text-[#d4b27a]" : "text-[#c3bfb6] group-hover:pl-2 group-hover:text-[#f3efe6]"
                  )}
                >
                  {link.name}
                </span>
                <ArrowRight
                  className={cn(
                    "h-4 w-4 transition-all duration-300",
                    active === link.name ? "translate-x-0 opacity-100 text-[#d4b27a]" : "-translate-x-4 opacity-0 text-[#f3efe6] group-hover:translate-x-0 group-hover:opacity-100"
                  )}
                />
              </button>
            ))}
          </div>
        </nav>

        <div className="mt-auto pt-8">
          <div className="rounded-2xl bg-white/6 p-5 backdrop-blur-xl">
            <p className="text-[16px] font-bold tracking-[-0.02em] text-[#f2ede4]">공간의 시작, 공상플래닛</p>
            <p className="mt-1.5 text-[12px] font-medium leading-[1.6] text-[#bcb7ad]">
              브랜드의 가치가 담긴 인테리어 설계를 지금 바로 상담하세요.
            </p>
            <a
              href="#new-contact"
              onClick={(e) => {
                e.preventDefault();
                onSelect("CONTACT", "#new-contact");
              }}
              className="mt-5 inline-flex h-[40px] w-full items-center justify-center rounded-xl bg-[#cdb991] text-[13px] font-extrabold text-[#121212] transition-all hover:bg-[#d9c8a9]"
            >
              무료 상담 신청
            </a>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[11px] font-bold tracking-[0.02em] text-white/52">오픈 전 임시 링크</p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              <a
                href="/fnb"
                onClick={onClose}
                className="inline-flex h-8 items-center justify-center rounded-lg bg-white/10 px-3 text-[12px] font-semibold text-white/86 transition-colors hover:bg-white/16"
              >
                기존버전
              </a>
              <a
                href="/fnb_new"
                onClick={onClose}
                className="inline-flex h-8 items-center justify-center rounded-lg bg-white/10 px-3 text-[12px] font-semibold text-white/86 transition-colors hover:bg-white/16"
              >
                ai버전
              </a>
              <a
                href="/ad"
                onClick={onClose}
                className="inline-flex h-8 items-center justify-center rounded-lg bg-white/10 px-3 text-[12px] font-semibold text-white/86 transition-colors hover:bg-white/16"
              >
                광고버전
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
