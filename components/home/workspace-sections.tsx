"use client";

import Link from "next/link";
import type { Route } from "next";
import { motion } from "framer-motion";
import { ArrowRightIcon, AudioLinesIcon, ImageIcon, VideoIcon } from "lucide-react";

const workspaces = [
  { href: "/convert/image" as Route, eyebrow: "Image studio", title: "Make images lighter, sharper, and ready to share.", description: "Change image formats and tune smart compression directly in your browser.", formats: "JPG · PNG · WebP · AVIF", icon: ImageIcon, accent: "bg-orange-50 text-orange-600" },
  { href: "/convert/video" as Route, eyebrow: "Video studio", title: "Put every frame in the right container.", description: "Convert footage between MP4, WebM, MOV, and MKV for the next screen or edit.", formats: "MP4 · WebM · MOV · MKV", icon: VideoIcon, accent: "bg-sky-50 text-sky-600" },
  { href: "/convert/audio" as Route, eyebrow: "Audio studio", title: "Give every track a format that fits.", description: "Prepare high-fidelity audio for players, editors, and the projects ahead.", formats: "MP3 · WAV · FLAC · AAC", icon: AudioLinesIcon, accent: "bg-amber-50 text-amber-600" },
];

export function WorkspaceSections() {
  return (
    <section id="workspaces" className="mx-auto max-w-6xl px-6 py-20 sm:py-28" aria-labelledby="workspace-title">
      <div className="mb-12 max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Three focused workspaces</p>
        <h2 id="workspace-title" className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">Choose the tool that matches the file.</h2>
      </div>
      <div className="flex flex-col gap-6">
        {workspaces.map(({ href, eyebrow, title, description, formats, icon: Icon, accent }, index) => (
          <Link key={href} href={href as Route} className="group">
            <motion.article initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.45, delay: index * 0.06 }} whileHover={{ y: -3 }} className="grid gap-8 rounded-3xl border border-white/90 bg-white/50 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.08),_0_10px_20px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,1),_inset_0_-2px_4px_rgba(0,0,0,0.03)] ring-1 ring-inset ring-white/80 backdrop-blur-3xl transition-all duration-300 group-hover:bg-white/60 sm:p-10 lg:grid-cols-[1fr_0.7fr] lg:items-center">
              <div>
                <span className={`grid size-12 place-items-center rounded-xl ${accent}`}><Icon className="size-6" aria-hidden="true" /></span>
                <p className="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{eyebrow}</p>
                <h3 className="mt-3 max-w-2xl text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">{title}</h3>
                <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-600 sm:text-base">{description}</p>
              </div>
              <div className="flex flex-col gap-5 border-t border-zinc-200 pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">Supported formats</p>
                <p className="text-sm text-zinc-700">{formats}</p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-900 transition-colors group-hover:text-orange-600">Open workspace <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
              </div>
            </motion.article>
          </Link>
        ))}
      </div>
    </section>
  );
}
