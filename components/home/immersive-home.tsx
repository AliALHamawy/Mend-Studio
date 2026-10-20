"use client";

import { useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowUpIcon } from "lucide-react";
import { HeroSection } from "@/components/home/hero-section";
import { StudioSection } from "@/components/home/studio-section";

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
    <div className="relative">
      <aside className="fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 lg:block" aria-label="Page sections">
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

      <motion.section id="hero" onViewportEnter={() => setActive("hero")} viewport={{ amount: 0.35, margin: "0px 0px -20% 0px" }} className="min-h-[calc(100vh-4.5rem)]">
        <HeroSection />
      </motion.section>
      <motion.div onViewportEnter={() => setActive("image")} viewport={{ amount: 0.3, margin: "0px 0px -20% 0px" }}><StudioSection kind="image" /></motion.div>
      <motion.div onViewportEnter={() => setActive("video")} viewport={{ amount: 0.3, margin: "0px 0px -20% 0px" }}><StudioSection kind="video" /></motion.div>
      <motion.div onViewportEnter={() => setActive("audio")} viewport={{ amount: 0.3, margin: "0px 0px -20% 0px" }}><StudioSection kind="audio" /></motion.div>
      <a href="#hero" className="fixed bottom-6 right-5 z-30 grid size-10 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-lg transition-colors hover:bg-zinc-50" aria-label="Back to top">
        <ArrowUpIcon className="size-4" aria-hidden="true" />
      </a>
    </div>
  );
}
