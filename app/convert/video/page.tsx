import { VideoConverter } from "@/components/video/video-converter";
import { Footer } from "@/components/shared/footer";
import { Navbar } from "@/components/shared/navbar";
import { PageHeader } from "@/components/shared/page-header";
import type { Metadata } from "next";
import { CheckCircle2Icon, FilmIcon, ShieldCheckIcon } from "lucide-react";

export function generateMetadata(): Metadata {
  return {
    title: "Video Converter | Mend Studio",
    description: "Convert MP4, WebM, MKV, MOV, and AVI video files with a focused FFmpeg-powered workflow.",
  };
}

export default function VideoConvertPage() {
  return (
    <main className="relative isolate min-h-screen overflow-x-clip bg-[#fafafa] text-zinc-900">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/2 top-1/4 size-[32rem] -translate-x-1/2 rounded-full bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-cyan-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 size-[28rem] rounded-full bg-gradient-to-br from-teal-400/15 via-cyan-200/20 to-transparent blur-3xl" />
      </div>
      <Navbar />
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-8 pt-28 sm:gap-12 sm:px-6 lg:px-10 lg:py-32">
        <PageHeader eyebrow="Video bench" title="Make the footage playable." description="Convert video for editing, sharing, archiving, or the next screen using the FFmpeg backend." />
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_240px]">
          <VideoConverter />
          <aside className="flex flex-col gap-5 rounded-3xl border border-white/90 bg-white/60 p-8 text-sm text-muted-foreground shadow-[0_20px_50px_rgba(0,0,0,0.06),_0_10px_20px_rgba(0,0,0,0.03)] ring-1 ring-inset ring-white/80 backdrop-blur-3xl max-md:p-5 lg:border-l lg:pl-6">
            <div className="flex items-center gap-2 text-emerald-700"><FilmIcon className="size-4" /><p className="font-semibold">Best for</p></div>
            <p className="rounded-2xl bg-emerald-400/10 p-4 text-zinc-700">Social clips, editing handoffs, screen recordings, and archive-ready exports.</p>
            <div className="flex items-center gap-2 text-emerald-700"><CheckCircle2Icon className="size-4" /><p className="font-semibold">Supported output</p></div>
            <div className="flex flex-wrap gap-2">{["MP4", "WebM", "MKV", "MOV", "AVI"].map((format) => <span key={format} className="rounded-full border border-emerald-300/60 bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-800">{format}</span>)}</div>
            <div className="mt-auto flex items-center gap-2 rounded-full bg-white/60 px-3 py-2 text-xs text-zinc-600"><ShieldCheckIcon className="size-4 text-emerald-600" /> FFmpeg secured workflow</div>
          </aside>
        </section>
        <Footer />
      </div>
    </main>
  );
}
