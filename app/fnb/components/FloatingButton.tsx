"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingButton() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show button after scrolling down 300px
            if (window.scrollY > 300) {
                setVisible(true);
            } else {
                setVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToContact = () => {
        const el = document.getElementById("contact");
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="fixed bottom-6 w-full px-6 flex justify-center z-40 md:hidden"
                >
                    <button
                        onClick={scrollToContact}
                        className="w-full max-w-sm bg-white text-black py-4 rounded-full font-medium text-lg leading-none shadow-[0_10px_30px_rgba(0,0,0,0.5)] active:scale-95 transition-transform"
                    >
                        프로젝트 상담 신청
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
