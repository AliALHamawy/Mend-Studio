"use client";

import Link from "next/link";
import type { Route } from "next";
import { AlertCircleIcon, SparklesIcon } from "lucide-react";

const benches: Array<{ href: Route; label: string }> = [
  { href: "/convert/image", label: "Image bench" },
  { href: "/convert/audio", label: "Audio bench" },
  { href: "/convert/video", label: "Video bench" },
];

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="relative isolate flex flex-1 flex-col items-center justify-center overflow-x-clip bg-[#fafafa] px-6 py-24 text-zinc-900">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/2 top-1/4 size-[28rem] -translate-x-1/2 rounded-full bg-gradient-to-tr from-orange-400/25 via-amber-200/20 to-transparent blur-3xl" />
      </div>
      <div className="relative z-10 w-full max-w-lg rounded-[2rem] border border-white/90 bg-white/60 p-8 text-center shadow-[0_28px_80px_rgba(0,0,0,0.12),inset_0_1px_2px_rgba(255,255,255,1)] ring-1 ring-inset ring-white/80 backdrop-blur-3xl sm:p-10">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-zinc-900/85 text-white shadow-sm">
          <AlertCircleIcon className="size-7" aria-hidden="true" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">Something went wrong</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          Mend Studio could not finish loading this view. Your media files are not stored on our servers—try again or jump back to a converter bench.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-11 items-center justify-center rounded-full border border-white/20 bg-zinc-900/85 px-6 text-sm font-medium text-white shadow-[0_12px_24px_rgba(0,0,0,0.12)] transition-colors hover:bg-zinc-900"
          >
            Try again
          </button>
          <Link
            href={"/" as Route}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/90 bg-white/50 px-6 text-sm font-semibold text-zinc-900 ring-1 ring-inset ring-white/80 backdrop-blur-xl transition-colors hover:bg-white/70"
          >
            <SparklesIcon className="size-4" aria-hidden="true" />
            Home
          </Link>
        </div>
        <nav className="mt-8 flex flex-wrap justify-center gap-2 border-t border-zinc-200/80 pt-6 text-sm" aria-label="Conversion benches">
          {benches.map((bench) => (
            <Link
              key={bench.href}
              href={bench.href}
              className="rounded-full bg-white/55 px-4 py-2 font-medium text-zinc-700 ring-1 ring-inset ring-white/80 transition-colors hover:bg-white/90 hover:text-zinc-900"
            >
              {bench.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
