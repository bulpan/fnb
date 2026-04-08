"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { projects } from "../fnb/shared/projectData";
import FnbNewNavbar from "../fnb_new/sections/FnbNewNavbar";
import FnbNewHero from "../fnb_new/sections/FnbNewHero";
import FnbNewChallenges from "../fnb_new/sections/FnbNewChallenges";
import FnbNewProjects from "../fnb_new/sections/FnbNewProjects";
import FnbNewTrust from "../fnb_new/sections/FnbNewTrust";
import FnbNewFaq from "../fnb_new/sections/FnbNewFaq";
import FnbNewContact from "../fnb_new/sections/FnbNewContact";
import ProjectModal from "../fnb_new/sections/ProjectModal";
import AdEntryOverlay from "./sections/AdEntryOverlay";

export default function AdPage() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const selectedProject = useMemo(() => {
    if (!selectedProjectId) return null;
    return projects.find((p) => p.id === selectedProjectId) ?? null;
  }, [selectedProjectId]);

  return (
    <main className="relative">
      <AdEntryOverlay />
      <FnbNewNavbar />
      <FnbNewHero />
      <FnbNewChallenges />
      <FnbNewProjects onSelectProject={setSelectedProjectId} />
      <FnbNewTrust />
      <FnbNewFaq />
      <FnbNewContact />

      <AnimatePresence>
        {selectedProject ? (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProjectId(null)} />
        ) : null}
      </AnimatePresence>
    </main>
  );
}
