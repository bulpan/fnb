"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import PcNavbar from './components/pc/PcNavbar';
import PcHero from './components/pc/PcHero';
import PcChallenges from './components/pc/PcChallenges';
import PcProjectGrid from './components/pc/PcProjectGrid';
import PcProjectDetail from './components/pc/PcProjectDetail';
import PcAbout from './components/pc/PcAbout';
import PcAwards from './components/pc/PcAwards';
import PcFaq from './components/pc/PcFaq';
import PcContact from './components/pc/PcContact';

export default function PcPage() {
    const [selectedProject, setSelectedProject] = useState<string | null>(null);

    return (
        <main className="relative w-full bg-[#1A1A1A] text-white">
            <PcNavbar />
            <PcHero />
            <PcChallenges />
            <PcProjectGrid onSelect={(id) => setSelectedProject(id)} />
            <PcAbout />
            <PcAwards />
            <PcFaq />
            <PcContact />

            <AnimatePresence>
                {selectedProject && (
                    <PcProjectDetail
                        projectId={selectedProject}
                        onClose={() => setSelectedProject(null)}
                    />
                )}
            </AnimatePresence>
        </main>
    );
}
