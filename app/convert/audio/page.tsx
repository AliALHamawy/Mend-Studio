import { AudioConverter } from "@/components/audio/audio-converter";
import { PageHeader } from "@/components/shared/page-header";
import type { Metadata } from "next";
import { AudioLinesIcon, CheckCircle2Icon, ShieldCheckIcon } from "lucide-react";
import { buildPageMetadata } from "@/lib/page-metadata";

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: "Audio Converter",
    description:
      "Convert MP3, WAV, FLAC, AAC, OGG, and M4A audio securely. Private FFmpeg-powered audio conversion with no account required.",
    path: "/convert/audio",
    keywords: [
      "audio converter",
      "convert MP3 WAV FLAC",
      "private audio conversion",
      "FFmpeg audio converter",
      "secure media converter",
    ],
  });
}

export default function AudioConvertPage() {
  return (
    <div className="relative isolate flex-1 overflow-x-clip bg-[#fafafa] text-zinc-900">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/2 top-1/4 size-[32rem] -translate-x-1/2 rounded-full bg-gradient-to-tr from-red-500/15 via-rose-500/10 to-pink-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 size-[28rem] rounded-full bg-gradient-to-br from-rose-400/15 via-pink-200/20 to-transparent blur-3xl" />
      </div>
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-8 pt-28 sm:gap-12 sm:px-6 lg:px-10 lg:py-32">
        <PageHeader eyebrow="Audio bench" title="Put the track in the right container." description="Convert audio through the FFmpeg backend and download a clean result without creating an account." />
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_240px]">
          <AudioConverter />
          <aside className="flex flex-col gap-5 rounded-3xl border border-white/90 bg-white/60 p-8 text-sm text-muted-foreground shadow-[0_20px_50px_rgba(0,0,0,0.06),_0_10px_20px_rgba(0,0,0,0.03)] ring-1 ring-inset ring-white/80 backdrop-blur-3xl max-md:p-5 lg:border-l lg:pl-6">
            <div className="flex items-center gap-2 text-rose-700"><AudioLinesIcon className="size-4" /><p className="font-semibold">Best for</p></div>
            <p className="rounded-2xl bg-rose-400/10 p-4 text-zinc-700">Podcasts, music players, production workflows, and high-fidelity delivery.</p>
            <div className="flex items-center gap-2 text-rose-700"><CheckCircle2Icon className="size-4" /><p className="font-semibold">Supported output</p></div>
            <div className="flex flex-wrap gap-2">{["MP3", "WAV", "FLAC", "AAC", "OGG", "M4A"].map((format) => <span key={format} className="rounded-full border border-rose-300/60 bg-rose-400/15 px-3 py-1 text-xs font-semibold text-rose-800">{format}</span>)}</div>
            <div className="mt-auto flex items-center gap-2 rounded-full bg-white/60 px-3 py-2 text-xs text-zinc-600"><ShieldCheckIcon className="size-4 text-rose-600" /> FFmpeg secured workflow</div>
          </aside>
        </section>
      </div>
    </div>
  );
}
