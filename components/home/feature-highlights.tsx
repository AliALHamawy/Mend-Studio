"use client";

import { motion } from "framer-motion";
import { ImageIcon, LockKeyholeIcon, Music2Icon, VideoIcon } from "lucide-react";

const highlights = [
  { title: "Browser-first image processing", description: "Compress and convert images without sending them anywhere.", icon: ImageIcon, className: "md:col-span-2" },
  { title: "High-fidelity audio conversion", description: "Move tracks between the formats your next tool expects.", icon: Music2Icon, className: "" },
  { title: "Server-accelerated video rendering", description: "Reliable conversion for larger footage and demanding codecs.", icon: VideoIcon, className: "" },
  { title: "100% private and ad-free", description: "A focused workspace with no account wall or distracting ads.", icon: LockKeyholeIcon, className: "md:col-span-2" },
];

export function FeatureHighlights() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 sm:py-28" aria-labelledby="feature-highlights-title">
      <div className="mb-10 max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Why it works</p>
        <h2 id="feature-highlights-title" className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">The useful parts, without the noise.</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {highlights.map(({ title, description, icon: Icon, className }, index) => (
          <motion.article key={title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, delay: index * 0.06 }} className={`rounded-3xl border border-white/90 bg-white/50 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.08),_0_10px_20px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,1),_inset_0_-2px_4px_rgba(0,0,0,0.03)] ring-1 ring-inset ring-white/80 backdrop-blur-3xl transition-all duration-300 hover:bg-white/60 ${className}`}>
            <Icon className="size-5 text-orange-600" aria-hidden="true" />
            <h3 className="mt-8 text-lg font-semibold tracking-tight text-zinc-900">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{description}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
