"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "HOME", href: "#" },
        { name: "ABOUT", href: "#about" },
        { name: "KEY PROJECT", href: "#project" },
        { name: "FAQ", href: "#faq" },
        { name: "CONTACT", href: "#contact" },
    ];

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${scrolled ? "bg-[#1A1A1A]/90 backdrop-blur-md border-b border-white/10" : "bg-transparent"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex flex-shrink-0 items-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/fnb/images/logo/logo_transparent.png" alt="gongsangplanet" className="h-8 md:h-10 w-auto object-contain" />
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center space-x-8 text-sm font-sans tracking-wide">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-[#A3A3A3] hover:text-white transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}
                        <button className="bg-white text-black px-6 py-2 rounded font-medium hover:bg-white/90 transition-colors">
                            프로젝트 상담 신청
                        </button>
                    </nav>

                    {/* Mobile Hamburger */}
                    <button
                        className="md:hidden p-2 text-white"
                        onClick={() => setIsOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                        className="fixed inset-0 z-[60] bg-[#1A1A1A] p-6 flex flex-col pt-20"
                    >
                        <button
                            className="absolute top-6 right-6 p-2 text-white"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <nav className="flex flex-col space-y-8 mt-12 mb-auto px-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-3xl font-serif text-[#E5E5E5] hover:text-white transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </a>
                            ))}
                        </nav>

                        <button className="w-full bg-white text-black py-4 rounded font-medium text-lg mb-8">
                            프로젝트 상담 신청
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
