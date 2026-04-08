"use client";

import { useEffect, useMemo, useState } from "react";
import type { MouseEvent } from "react";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import FnbNewMenuOverlay from "./FnbNewMenuOverlay";

export const navLinks = [
  { name: "HOME", href: "#new-home" },
  { name: "CHALLENGES", href: "#new-challenges" },
  { name: "PROJECT", href: "#new-project" },
  { name: "ABOUT", href: "#new-about" },
  { name: "FAQ", href: "#new-faq" },
  { name: "CONTACT", href: "#new-contact" },
] as const;

export type NavName = (typeof navLinks)[number]["name"];

export default function FnbNewNavbar() {
  const [active, setActive] = useState<NavName>("HOME");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const sectionIds = useMemo(
    () => [
      { id: "new-home", name: "HOME" as const },
      { id: "new-challenges", name: "CHALLENGES" as const },
      { id: "new-project", name: "PROJECT" as const },
      { id: "new-about", name: "ABOUT" as const },
      { id: "new-faq", name: "FAQ" as const },
      { id: "new-contact", name: "CONTACT" as const },
    ],
    [],
  );

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const elements = sectionIds
      .map((s) => ({ ...s, el: document.getElementById(s.id) }))
      .filter((s): s is { id: string; name: NavName; el: HTMLElement } => Boolean(s.el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

        if (!visible) return;
        const match = elements.find((e) => e.el === visible.target);
        if (match) setActive(match.name);
      },
      {
        root: null,
        rootMargin: "-18% 0px -66% 0px",
        threshold: [0.1, 0.2, 0.35, 0.5],
      },
    );

    elements.forEach((e) => observer.observe(e.el));
    return () => observer.disconnect();
  }, [sectionIds]);

  const onNavClick = (event: MouseEvent<HTMLAnchorElement>, name: NavName, href: string) => {
    event.preventDefault();
    setActive(name);
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 md:px-5">
      <div
        className={cn(
          "mx-auto mt-3 flex h-[60px] max-w-[1360px] items-center justify-between px-4 md:px-6",
          "transition-all duration-300",
          isScrolled ? "rounded-2xl bg-black/42 shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl" : "rounded-2xl bg-transparent",
        )}
      >
        <a href="#new-home" onClick={(e) => onNavClick(e, "HOME", "#new-home")} className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/fnb/images/logo/logo_final.png" alt="gongsangplanet" className="h-[18px] w-auto opacity-95 md:h-[20px]" />
        </a>

        <nav className="font-eng hidden items-center gap-6 text-[11px] font-bold uppercase tracking-[0.18em] lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => onNavClick(e, link.name, link.href)}
              className={cn(
                "relative py-1 transition-colors",
                active === link.name ? "text-[#e2cfab]" : "text-white/64 hover:text-white/90",
              )}
            >
              {link.name}
              <span
                className={cn(
                  "absolute -bottom-1 left-0 h-px w-full origin-left bg-[#cdb991] transition-transform duration-200",
                  active === link.name ? "scale-x-100" : "scale-x-0",
                )}
              />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <a
            href="#new-contact"
            onClick={(e) => onNavClick(e, "CONTACT", "#new-contact")}
            className="hidden h-10 items-center justify-center rounded-xl bg-white px-4 text-[13px] font-extrabold text-[#121212] transition-colors hover:bg-white/90 lg:inline-flex"
          >
            무료 상담 신청
          </a>

          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className={cn(
              "group inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/8 transition-all hover:bg-white/14 lg:hidden",
              isScrolled ? "bg-black/25" : "bg-transparent",
            )}
            aria-label="메뉴 열기"
          >
            <div className="flex h-5 w-5 flex-col items-center justify-center gap-1.5 overflow-hidden">
              <span className="h-0.5 w-5 bg-white/80 transition-all group-hover:w-4" />
              <span className="h-0.5 w-5 bg-[#cdb991] transition-all group-hover:w-3" />
            </div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen ? (
          <FnbNewMenuOverlay
            active={active}
            onClose={() => setIsMenuOpen(false)}
            onSelect={(name: NavName, href: string) => {
              setActive(name);
              setIsMenuOpen(false);
              const id = href.startsWith("#") ? href.slice(1) : href;
              window.setTimeout(() => {
                document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }, 120);
            }}
          />
        ) : null}
      </AnimatePresence>
    </header>
  );
}
