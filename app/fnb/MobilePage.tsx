"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import MobileNavbar from './components/mobile/MobileNavbar';
import MobileHero from './components/mobile/MobileHero';
import MobileChallenges from './components/mobile/MobileChallenges';
import MobileProjectGrid from './components/mobile/MobileProjectGrid';
import MobileProjectDetail from './components/mobile/MobileProjectDetail';
import MobileAbout from './components/mobile/MobileAbout';
import MobileAwards from './components/mobile/MobileAwards';
import MobileFaq from './components/mobile/MobileFaq';
import MobileContact from './components/mobile/MobileContact';

export default function MobilePage() {
    const [selectedProject, setSelectedProject] = useState<string | null>(null);

    return (
        <main className="relative w-full overflow-x-hidden bg-[#1A1A1A] text-white">
            <MobileNavbar />
            <MobileHero />
            <MobileChallenges />
            <MobileProjectGrid onSelect={(id) => setSelectedProject(id)} />
            <MobileAbout />
            <MobileAwards />
            <MobileFaq />
            <MobileContact />

            <AnimatePresence>
                {selectedProject && (
                    <MobileProjectDetail
                        projectId={selectedProject}
                        onClose={() => setSelectedProject(null)}
                    />
                )}
            </AnimatePresence>
        </main>
    );
}
