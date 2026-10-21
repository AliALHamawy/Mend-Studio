"use client";

import { useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowUpIcon } from "lucide-react";
import { MotionPage } from "@/components/shared/motion-page";
import { HeroSection } from "@/components/home/hero-section";
import { MobileStudioSections, StudioShowcase } from "@/components/home/studio-section";

const sections = [
  { id: "hero", label: "Intro" },
  { id: "image", label: "Images" },
  { id: "video", label: "Video" },
  { id: "audio", label: "Audio" },
];

export function ImmersiveHome() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 32, mass: 0.15 });
  const [active, setActive] = useState("hero");

  return (
    <div className="relative overflow-visible">
      <aside className="fixed right-6 top-1/2 z-50 hidden -translate-y-1/2 lg:block" aria-label="Page sections">
        <div className="relative flex flex-col items-center gap-8">
          <div className="absolute top-2 bottom-2 w-px bg-zinc-200" aria-hidden="true">
            <motion.div className="w-full origin-top bg-orange-500" style={{ height: "100%", scaleY: progress }} />
          </div>
          {sections.map((section) => (
            <a key={section.id} href={`#${section.id}`} onClick={() => setActive(section.id)} className="group relative flex items-center gap-3">
              <span className={`relative z-10 size-2.5 rounded-full border-2 border-[#fafafa] transition-colors ${active === section.id ? "bg-orange-500 ring-4 ring-orange-100" : "bg-zinc-300 group-hover:bg-zinc-500"}`} />
              <span className={`absolute right-6 whitespace-nowrap text-xs font-medium transition-opacity ${active === section.id ? "text-zinc-900 opacity-100" : "text-zinc-500 opacity-0 group-hover:opacity-100"}`}>{section.label}</span>
            </a>
          ))}
        </div>
      </aside>

      {/* The entrance animation wraps only the page content: its transform would otherwise become
          the containing block for the fixed dots and back-to-top button and unpin them. */}
      <MotionPage>
        <motion.section id="hero" onViewportEnter={() => setActive("hero")} viewport={{ amount: 0.35, margin: "0px 0px -20% 0px" }} className="min-h-[calc(100vh-4.5rem)]">
          <HeroSection />
        </motion.section>
        <div id="studios" className="scroll-mt-20">
          <div className="hidden md:block">
            <StudioShowcase onActiveChange={(kind) => setActive(kind)} />
          </div>
          <MobileStudioSections />
        </div>
      </MotionPage>

      <a href="#hero" className="fixed bottom-6 right-5 z-30 grid size-10 place-items-center rounded-full border border-white/90 bg-white/50 text-zinc-700 shadow-[0_20px_50px_rgba(0,0,0,0.08),_0_10px_20px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,1),_inset_0_-2px_4px_rgba(0,0,0,0.03)] ring-1 ring-inset ring-white/80 backdrop-blur-3xl transition-all duration-300 hover:bg-white/60" aria-label="Back to top">
        <ArrowUpIcon className="size-4" aria-hidden="true" />
      </a>
    </div>
  );
}
