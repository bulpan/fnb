"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { mobileFaqs } from "../../shared/projectData";
import { mobilePrimaryCtaClassName } from "./mobileNavConfig";

export default function MobileFaq() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="m-faq" className="min-h-[100svh] bg-[#17191d] px-5 pb-12 pt-[79px] text-white">
            <div className="mx-auto w-full max-w-[768px]">
                <h2 className="font-eng text-center text-[clamp(35px,8.4vw,50px)] font-extrabold leading-[1.3] tracking-[-0.023em] text-[#a77817]">
                    FAQ
                </h2>

                <div className="mt-[11px]">
                    {mobileFaqs.map((faq, idx) => (
                        <div key={faq.q} className="border-b border-white/15 py-4">
                            <button
                                type="button"
                                className="flex w-full items-start justify-between gap-4 text-left"
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                            >
                                <div className="flex text-[clamp(15.4px,3.9vw,19.8px)] font-extrabold leading-[1.56] tracking-[-0.015em] text-[#a77817]">
                                    <span className="w-[26px] shrink-0 text-left">Q.</span>
                                    <span className="text-left">{faq.q}</span>
                                </div>
                                <motion.span
                                    animate={{ rotate: openIndex === idx ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="mt-1 text-white/70"
                                >
                                    <ChevronDown className="h-5 w-5" />
                                </motion.span>
                            </button>

                            <AnimatePresence initial={false}>
                                {openIndex === idx ? (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.22 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mt-3 flex text-[clamp(11px,3vw,14.3px)] font-medium leading-[2.02] tracking-[-0.008em] text-white/92">
                                            <span className="w-[26px] shrink-0" />
                                            <p className="flex-1 whitespace-pre-line text-left">
                                                {faq.a}
                                            </p>
                                        </div>
                                    </motion.div>
                                ) : null}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                <div className="mt-10 flex justify-center">
                    <a href="#m-contact" className={mobilePrimaryCtaClassName}>
                        무료 상담 신청
                    </a>
                </div>
            </div>
        </section>
    );
}
