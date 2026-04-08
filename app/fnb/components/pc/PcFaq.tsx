"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { pcFaqs } from "../../shared/projectData";

export default function PcFaq() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="h-screen bg-[#17191d] px-[120px] pt-[169px] text-white">
            <div className="mx-auto flex h-full w-full max-w-[1760px] gap-[64px]">
                <div className="w-[320px] shrink-0">
                    <h2 className="font-eng text-[93px] font-semibold leading-none tracking-[-0.02em] text-[#a77817]">FAQ</h2>
                </div>

                <div className="flex-1 space-y-[16px] pb-12">
                    {pcFaqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div key={faq.q} className="border-b border-white/10 pb-[16px]">
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="flex w-full items-start gap-[16px] py-4 text-left transition-colors duration-200 hover:text-white/80"
                                >
                                    <span className="w-[52px] shrink-0 text-[34px] font-bold tracking-[-0.02em] text-[#a77817]">Q.</span>
                                    <div className="flex flex-1 items-center justify-between gap-4">
                                        <p className="text-[34px] font-bold tracking-[-0.02em] text-[#a77817]">{faq.q}</p>
                                        <div className="shrink-0 pt-2">
                                            {isOpen ? (
                                                <Minus className="h-8 w-8 text-[#a77817]" strokeWidth={2.5} />
                                            ) : (
                                                <Plus className="h-8 w-8 text-[#a77817]" strokeWidth={2.5} />
                                            )}
                                        </div>
                                    </div>
                                </button>
                                
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pl-[68px] pt-2">
                                                <p className="whitespace-pre-line text-[25px] font-semibold leading-[1.5] tracking-[-0.01em] text-white/95">
                                                    {faq.a}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
