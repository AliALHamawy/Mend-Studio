"use client";

import Link from "next/link";
import type { Route } from "next";
import { motion } from "framer-motion";
import { ArrowRightIcon, AudioLinesIcon, CheckIcon, FileImageIcon, ImageIcon, VideoIcon } from "lucide-react";

type StudioKind = "image" | "video" | "audio";

const content: Record<StudioKind, { eyebrow: string; title: string; description: string; formats: string; href: Route; icon: typeof ImageIcon; tint: string }> = {
  image: {
    eyebrow: "Image studio",
    title: "Make images lighter, sharper, and ready to share.",
    description: "Change formats and tune smart compression directly in your browser. Keep the original close and the output clear.",
    formats: "JPG · PNG · WebP · AVIF",
    href: "/convert/image",
    icon: ImageIcon,
    tint: "bg-orange-50 text-orange-600",
  },
  video: {
    eyebrow: "Video studio",
    title: "Put every frame in the right container.",
    description: "Convert footage for the next screen, edit, or archive with a focused workflow and dependable output.",
    formats: "MP4 · WebM · MOV · MKV",
    href: "/convert/video",
    icon: VideoIcon,
    tint: "bg-sky-50 text-sky-600",
  },
  audio: {
    eyebrow: "Audio studio",
    title: "Give every track a format that fits.",
    description: "Prepare high-fidelity audio for players, editors, and the projects ahead without unnecessary setup.",
    formats: "MP3 · WAV · FLAC · AAC",
    href: "/convert/audio",
    icon: AudioLinesIcon,
    tint: "bg-amber-50 text-amber-600",
  },
};

function ImagePreview() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-orange-50 text-orange-600"><FileImageIcon className="size-5" /></span><div><p className="text-sm font-semibold text-zinc-900">landscape.jpg</p><p className="text-xs text-zinc-500">Original image</p></div></div>
        <span className="text-xs font-medium text-zinc-500">4.2 MB</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-zinc-200" /><ArrowRightIcon className="size-4 text-orange-500" /><div className="h-px flex-1 bg-zinc-200" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-orange-100 text-orange-700"><CheckIcon className="size-5" /></span><div><p className="text-sm font-semibold text-zinc-900">landscape.webp</p><p className="text-xs text-zinc-500">Optimized output</p></div></div>
        <span className="text-sm font-bold text-emerald-600">680 KB <span className="text-xs font-medium">−84%</span></span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-orange-100"><motion.div initial={{ width: 0 }} whileInView={{ width: "16%" }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.2 }} className="h-full rounded-full bg-orange-500" /></div>
    </div>
  );
}

function VideoPreview() {
  const formats = ["MP4", "WebM", "MOV", "MKV"];
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between"><p className="text-sm font-semibold text-zinc-900">Playback targets</p><span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">Ready</span></div>
      <div className="grid grid-cols-2 gap-3">{formats.map((format, index) => <div key={format} className={`rounded-xl border p-4 ${index === 0 ? "border-sky-300 bg-sky-50/70" : "border-zinc-200 bg-zinc-50"}`}><p className="text-sm font-bold text-zinc-900">{format}</p><p className="mt-2 text-xs text-zinc-500">{index === 0 ? "H.264 · 60fps" : index === 1 ? "VP9 · 30fps" : index === 2 ? "H.264 · 60fps" : "H.265 · 30fps"}</p></div>)}</div>
      <div className="flex items-center gap-2 text-xs text-zinc-500"><VideoIcon className="size-4 text-sky-600" /> Choose a container for the next screen.</div>
    </div>
  );
}

function AudioPreview() {
  const bars = [24, 38, 18, 48, 30, 56, 34, 44, 22, 52, 32, 42, 26, 48, 20, 36, 28, 54, 30, 44, 22, 38, 18, 46];
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between"><div><p className="text-sm font-semibold text-zinc-900">studio-recording.wav</p><p className="mt-1 text-xs text-zinc-500">High-fidelity output</p></div><AudioLinesIcon className="size-5 text-amber-600" /></div>
      <div className="flex h-20 items-center gap-1 rounded-xl bg-amber-50 px-4">{bars.map((height, index) => <motion.span key={index} initial={{ height: 4 }} whileInView={{ height }} viewport={{ once: true }} transition={{ duration: 0.35, delay: index * 0.02 }} className="flex-1 rounded-full bg-amber-400" />)}</div>
      <div className="flex flex-wrap gap-2"><span className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700">320 kbps</span><span className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700">WAV</span><span className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700">FLAC lossless</span></div>
    </div>
  );
}

function StudioPreview({ kind }: { kind: StudioKind }) {
  if (kind === "image") return <ImagePreview />;
  if (kind === "video") return <VideoPreview />;
  return <AudioPreview />;
}

export function StudioSection({ kind }: { kind: StudioKind }) {
  const studio = content[kind];
  const Icon = studio.icon;
  const isReversed = kind === "video";

  return (
    <motion.section
      id={kind}
      className="relative flex min-h-screen flex-col items-center justify-center border-t border-zinc-200 px-6 py-12"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className={`mx-auto flex w-full max-w-6xl flex-col items-center gap-12 md:gap-16 ${isReversed ? "md:flex-row-reverse" : "md:flex-row"}`}>
        <motion.div
          className="w-full flex-1"
          initial={{ opacity: 0, x: isReversed ? 24 : -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
        >
          <span className={`grid size-14 place-items-center rounded-2xl ${studio.tint}`}><Icon className="size-7" aria-hidden="true" /></span>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">{studio.eyebrow}</p>
          <h2 className="mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-5xl">{studio.title}</h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-zinc-600">{studio.description}</p>
          <Link href={studio.href} className="mt-7 inline-flex h-11 items-center gap-2 rounded-lg bg-zinc-900 px-5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-zinc-800">
            Open {studio.eyebrow.toLowerCase()} <ArrowRightIcon className="size-4" aria-hidden="true" />
          </Link>
        </motion.div>
        <motion.div
          className="relative w-full flex-1 overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 shadow-[0_24px_80px_-40px_rgba(24,24,27,0.35)] sm:p-8"
          initial={{ opacity: 0, x: isReversed ? -24 : 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, delay: 0.2, ease: "easeOut" }}
        >
          <div className="absolute -right-10 -top-10 size-48 rounded-full bg-orange-100/70 blur-3xl" />
          <div className="relative"><div className="mb-7 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400"><span>{studio.eyebrow}</span><span>Preview</span></div><StudioPreview kind={kind} /></div>
        </motion.div>
      </div>
    </motion.section>
  );
}
