"use client";

import Link from "next/link";
import type { Route } from "next";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
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

export function StudioSection({ kind, sectionId = kind }: { kind: StudioKind; sectionId?: string }) {
  const studio = content[kind];
  const Icon = studio.icon;
  const isReversed = kind === "video";

  return (
    <motion.section
      id={sectionId}
      className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-center border-t border-zinc-200 bg-[#fafafa] px-6 py-12"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="pointer-events-none absolute -left-10 -top-10 size-72 rounded-full bg-purple-400/20 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-10 -right-10 size-72 rounded-full bg-teal-400/20 blur-3xl" aria-hidden="true" />
      <div className={`relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-12 md:gap-16 ${isReversed ? "md:flex-row-reverse" : "md:flex-row"}`}>
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
          <Link href={studio.href as Route} className="relative mt-7 inline-flex h-11 items-center gap-2 overflow-hidden rounded-full border border-white/20 bg-zinc-900/85 px-6 py-2.5 text-sm font-medium text-white shadow-[0_20px_50px_rgba(0,0,0,0.08),_0_10px_20px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.4)] backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:bg-zinc-900 active:scale-95">
            <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            Open {studio.eyebrow.toLowerCase()} <ArrowRightIcon className="size-4" aria-hidden="true" />
          </Link>
        </motion.div>
        <motion.div
          className="relative w-full flex-1 overflow-hidden rounded-3xl border border-white/90 bg-white/50 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.08),_0_10px_20px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,1),_inset_0_-2px_4px_rgba(0,0,0,0.03)] ring-1 ring-inset ring-white/80 backdrop-blur-3xl transition-all duration-300 hover:bg-white/60 sm:p-8"
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

const showcaseKinds: StudioKind[] = ["image", "video", "audio"];

export function MobileStudioSections() {
  return (
    <div className="md:hidden">
      {showcaseKinds.map((kind) => (
        <StudioSection key={kind} kind={kind} sectionId={`${kind}-mobile`} />
      ))}
    </div>
  );
}

export function StudioShowcase({ onActiveChange }: { onActiveChange?: (kind: StudioKind) => void }) {
  const showcaseRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: showcaseRef, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 24,
    restDelta: 0.001,
  });
  const previewProgress = useTransform(smoothProgress, [0, 1], [0, 1]);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const hasNotifiedActiveRef = useRef(false);
  const frameRef = useRef<number | null>(null);

  useMotionValueEvent(smoothProgress, "change", (value) => {
    const nextIndex = Math.min(showcaseKinds.length - 1, Math.floor(value * showcaseKinds.length));

    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
    }

    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      if (activeIndexRef.current === nextIndex && hasNotifiedActiveRef.current) return;

      activeIndexRef.current = nextIndex;
      hasNotifiedActiveRef.current = true;
      setActiveIndex(nextIndex);
      onActiveChange?.(showcaseKinds[nextIndex]);
    });
  });

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const activeKind = showcaseKinds[activeIndex];
  const studio = content[activeKind];
  const Icon = studio.icon;

  return (
    <section ref={showcaseRef} id="showcase" className="relative min-h-[420vh] w-full border-t border-zinc-200 bg-[#fafafa]">
      <div id="image" className="pointer-events-none absolute left-0 top-0 h-px w-px scroll-mt-20" aria-hidden="true" />
      <div id="video" className="pointer-events-none absolute left-0 top-1/3 h-px w-px scroll-mt-20" aria-hidden="true" />
      <div id="audio" className="pointer-events-none absolute left-0 top-2/3 h-px w-px scroll-mt-20" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-10 top-1/4 size-72 rounded-full bg-purple-400/20 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-10 right-0 size-72 rounded-full bg-teal-400/20 blur-3xl" aria-hidden="true" />
      <div className="sticky top-20 z-10 mx-auto flex h-[75vh] w-full max-w-6xl flex-col justify-center px-6">
        <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="w-full lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeKind}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <span className={`grid size-14 place-items-center rounded-2xl ${studio.tint}`}><Icon className="size-7" aria-hidden="true" /></span>
                <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">{studio.eyebrow}</p>
                <h2 className="mt-4 max-w-xl text-4xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-5xl">{studio.title}</h2>
                <p className="mt-5 max-w-xl text-base leading-7 text-zinc-600">{studio.description}</p>
                <Link href={studio.href as Route} className="relative mt-7 inline-flex h-11 items-center gap-2 overflow-hidden rounded-full border border-white/20 bg-zinc-900/85 px-6 py-2.5 text-sm font-medium text-white shadow-[0_20px_50px_rgba(0,0,0,0.08),_0_10px_20px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.4)] backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:bg-zinc-900 active:scale-95">
                  <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                  Open {studio.eyebrow.toLowerCase()} <ArrowRightIcon className="size-4" aria-hidden="true" />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative w-full lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeKind}
                initial={{ opacity: 0, x: 28, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.98 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-white/90 bg-white/50 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.08),_0_10px_20px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,1),_inset_0_-2px_4px_rgba(0,0,0,0.03)] ring-1 ring-inset ring-white/80 backdrop-blur-3xl sm:p-12"
              >
                <div className="absolute -right-10 -top-10 size-48 rounded-full bg-orange-100/70 blur-3xl" />
                <div className="relative">
                  <div className="mb-7 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400"><span>{studio.eyebrow}</span><span>Preview</span></div>
                  <StudioPreview kind={activeKind} />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <motion.div className="pointer-events-none mt-8 h-1 w-40 origin-left self-center rounded-full bg-orange-400/40" style={{ scaleX: previewProgress }} aria-hidden="true" />
      </div>
    </section>
  );
}
