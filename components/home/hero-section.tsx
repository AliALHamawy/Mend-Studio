"use client";

import Link from "next/link";
import type { Route } from "next";
import { ArrowRightIcon, ImageIcon, Music2Icon, UploadCloudIcon, VideoIcon } from "lucide-react";

const tools = [
  { label: "Images", icon: ImageIcon },
  { label: "Audio", icon: Music2Icon },
  { label: "Video", icon: VideoIcon },
];

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center border-b border-zinc-200 bg-[#fafafa] px-6 py-24 sm:py-32">
      <div className="pointer-events-none absolute -left-10 -top-10 size-72 rounded-full bg-purple-400/20 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-10 -right-10 size-72 rounded-full bg-teal-400/20 blur-3xl" aria-hidden="true" />
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 motion-safe:animate-fade-in">
          Universal media converter
        </p>
        <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-[1.02] tracking-tight text-zinc-900 motion-safe:animate-swap-in motion-safe:[animation-delay:80ms] md:text-6xl">
          A clean way to move media forward.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-zinc-600 motion-safe:animate-swap-in motion-safe:[animation-delay:160ms] sm:text-lg">
          Convert images, audio, and video into the formats your next tool needs. Fast controls, clear output, no account required.
        </p>
        <div className="mt-8 flex w-full flex-col justify-center gap-3 overflow-visible motion-safe:animate-swap-in motion-safe:[animation-delay:240ms] sm:w-auto sm:flex-row">
          <Link href={"/convert/image" as Route} className="relative inline-flex h-11 w-full transform-gpu select-none items-center justify-center gap-2 overflow-hidden rounded-full border border-white/20 bg-zinc-900/85 px-4 py-2.5 text-sm font-medium text-white shadow-[0_20px_50px_rgba(0,0,0,0.08),_0_10px_20px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.4)] backdrop-blur-xl transition-all duration-300 [backface-visibility:hidden] hover:scale-[1.02] hover:bg-zinc-900 active:scale-95 sm:w-auto sm:px-6">
            <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            Start converting <ArrowRightIcon className="size-4" aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={() => document.getElementById("studios")?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className="inline-flex h-11 w-full transform-gpu select-none items-center justify-center rounded-full border border-white/90 bg-white/50 px-4 text-sm font-semibold text-zinc-900 shadow-[0_20px_50px_rgba(0,0,0,0.08),_0_10px_20px_rgba(0,0,0,0.04)] ring-1 ring-inset ring-white/80 backdrop-blur-3xl transition-all duration-300 [backface-visibility:hidden] hover:bg-white/60 sm:w-auto sm:px-5"
          >
            Explore workspaces
          </button>
        </div>

        <div className="relative mt-12 w-full max-w-3xl rounded-3xl border border-white/90 bg-white/50 p-2 text-left shadow-[0_20px_50px_rgba(0,0,0,0.08),_0_10px_20px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,1),_inset_0_-2px_4px_rgba(0,0,0,0.03)] ring-1 ring-inset ring-white/80 backdrop-blur-3xl transition-all duration-300 motion-safe:animate-swap-in motion-safe:[animation-delay:320ms] hover:bg-white/60 sm:mt-16 sm:p-3">
          <div className="grid grid-cols-3 gap-1 rounded-2xl bg-white/35 p-1 ring-1 ring-inset ring-white/50 backdrop-blur-md">
            {tools.map(({ label, icon: Icon }, index) => (
              <Link key={label} href={["/convert/image", "/convert/audio", "/convert/video"][index] as Route} className="flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-medium text-zinc-600 transition-all duration-300 hover:bg-white/60 hover:text-zinc-950">
                <Icon className="size-4" aria-hidden="true" /> {label}
              </Link>
            ))}
          </div>
          <div className="mt-3 flex min-h-56 flex-col items-center justify-center rounded-3xl border border-white/90 bg-white/50 px-6 py-10 text-center shadow-[0_20px_50px_rgba(0,0,0,0.08),_0_10px_20px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,1),_inset_0_-2px_4px_rgba(0,0,0,0.03)] ring-1 ring-inset ring-white/80 backdrop-blur-3xl transition-all duration-300 hover:bg-white/60">
            <UploadCloudIcon className="size-9 text-zinc-500" strokeWidth={1.5} aria-hidden="true" />
            <p className="mt-4 text-sm font-semibold text-zinc-900">Drop a file to begin</p>
            <p className="mt-2 text-sm text-zinc-500">Choose a workspace above, then continue in the focused converter.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
