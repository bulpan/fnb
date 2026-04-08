"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { projects } from "../fnb/shared/projectData";
import FnbNewNavbar from "./sections/FnbNewNavbar";
import FnbNewHero from "./sections/FnbNewHero";
import FnbNewChallenges from "./sections/FnbNewChallenges";
import FnbNewProjects from "./sections/FnbNewProjects";
import FnbNewTrust from "./sections/FnbNewTrust";
import FnbNewFaq from "./sections/FnbNewFaq";
import FnbNewContact from "./sections/FnbNewContact";
import ProjectModal from "./sections/ProjectModal";

export default function FnbNewPage() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const selectedProject = useMemo(() => {
    if (!selectedProjectId) return null;
    return projects.find((p) => p.id === selectedProjectId) ?? null;
  }, [selectedProjectId]);

  return (
    <main className="relative">
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
