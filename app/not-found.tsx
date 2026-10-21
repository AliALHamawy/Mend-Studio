import Link from "next/link";
import type { Route } from "next";
import { CompassIcon, SparklesIcon } from "lucide-react";

const benches: Array<{ href: Route; label: string; note: string }> = [
  { href: "/convert/image", label: "Images", note: "Browser-side formats & compression" },
  { href: "/convert/audio", label: "Audio", note: "MP3, WAV, FLAC, and more" },
  { href: "/convert/video", label: "Video", note: "MP4, WebM, MKV, and more" },
];

export default function NotFound() {
  return (
    <div className="relative isolate flex flex-1 flex-col items-center justify-center overflow-x-clip bg-[#fafafa] px-6 py-24 text-zinc-900">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute bottom-1/4 right-1/4 size-[26rem] rounded-full bg-gradient-to-br from-teal-400/15 via-cyan-200/20 to-transparent blur-3xl" />
        <div className="absolute left-1/3 top-1/4 size-[24rem] rounded-full bg-gradient-to-tr from-amber-400/20 via-orange-200/15 to-transparent blur-3xl" />
      </div>
      <div className="relative z-10 w-full max-w-xl rounded-[2rem] border border-white/90 bg-white/60 p-8 shadow-[0_28px_80px_rgba(0,0,0,0.12),inset_0_1px_2px_rgba(255,255,255,1)] ring-1 ring-inset ring-white/80 backdrop-blur-3xl sm:p-10">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
          <CompassIcon className="size-4" aria-hidden="true" />
          Page not found
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">This route does not exist.</h1>
        <p className="mt-4 text-sm leading-7 text-zinc-600">
          The link may be outdated or mistyped. Pick a conversion bench below or return to the Mend Studio home page.
        </p>
        <Link
          href={"/" as Route}
          className="mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/20 bg-zinc-900/85 px-6 text-sm font-medium text-white shadow-[0_12px_24px_rgba(0,0,0,0.12)] transition-colors hover:bg-zinc-900"
        >
          <SparklesIcon className="size-4" aria-hidden="true" />
          Back to home
        </Link>
        <ul className="mt-8 flex flex-col gap-2 border-t border-zinc-200/80 pt-6">
          {benches.map((bench) => (
            <li key={bench.href}>
              <Link
                href={bench.href}
                className="group flex items-center justify-between rounded-2xl border border-white/80 bg-white/55 px-4 py-4 transition-colors hover:bg-white/90"
              >
                <span>
                  <span className="block text-base font-semibold text-zinc-900">{bench.label}</span>
                  <span className="mt-0.5 block text-sm text-zinc-500">{bench.note}</span>
                </span>
                <span className="text-zinc-300 transition-transform group-hover:translate-x-1" aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
