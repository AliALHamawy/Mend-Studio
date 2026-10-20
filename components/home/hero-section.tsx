"use client";

import Link from "next/link";
import type { Route } from "next";
import { motion } from "framer-motion";
import { ArrowRightIcon, ImageIcon, Music2Icon, UploadCloudIcon, VideoIcon } from "lucide-react";

const tools = [
  { label: "Images", icon: ImageIcon },
  { label: "Audio", icon: Music2Icon },
  { label: "Video", icon: VideoIcon },
];

export function HeroSection() {
  return (
    <section className="border-b border-zinc-200 bg-[#fafafa] px-6 py-24 sm:py-32">
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Universal media converter
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }} className="mt-6 max-w-4xl text-5xl font-bold leading-[1.02] tracking-tight text-zinc-900 sm:text-6xl">
          A clean way to move media forward.
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.16 }} className="mx-auto mt-6 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
          Convert images, audio, and video into the formats your next tool needs. Fast controls, clear output, no account required.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.24 }} className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={"/convert/image" as Route} className="inline-flex h-11 items-center gap-2 rounded-lg bg-zinc-900 px-5 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:bg-zinc-800">
            Start converting <ArrowRightIcon className="size-4" aria-hidden="true" />
          </Link>
          <Link href="#workspaces" className="inline-flex h-11 items-center text-sm font-semibold text-zinc-700 underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-zinc-950">
            Explore workspaces
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.32 }} className="mt-16 w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white p-3 text-left shadow-[0_18px_60px_-30px_rgba(24,24,27,0.35)]">
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-zinc-100 p-1">
            {tools.map(({ label, icon: Icon }, index) => (
              <Link key={label} href={["/convert/image", "/convert/audio", "/convert/video"][index] as Route} className="flex items-center justify-center gap-2 rounded-lg px-3 py-3 text-sm font-medium text-zinc-600 transition-colors hover:bg-white hover:text-zinc-950">
                <Icon className="size-4" aria-hidden="true" /> {label}
              </Link>
            ))}
          </div>
          <div className="mt-3 flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-[#fafafa] px-6 py-10 text-center">
            <UploadCloudIcon className="size-9 text-zinc-500" strokeWidth={1.5} aria-hidden="true" />
            <p className="mt-4 text-sm font-semibold text-zinc-900">Drop a file to begin</p>
            <p className="mt-2 text-sm text-zinc-500">Choose a workspace above, then continue in the focused converter.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
