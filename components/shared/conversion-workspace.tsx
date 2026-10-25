import type { LucideIcon } from "lucide-react";
import {
  AudioLinesIcon,
  CheckCircle2Icon,
  FileImageIcon,
  FilmIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { AudioConverter } from "@/components/audio/audio-converter";
import { ImageConverter } from "@/components/images/image-converter";
import { MotionPage } from "@/components/shared/motion-page";
import { PageHeader } from "@/components/shared/page-header";
import { VideoConverter } from "@/components/video/video-converter";
import { cn } from "@/lib/utils";
import type { ConversionTarget, WorkspaceSlug } from "@/lib/conversion-pairs";

type WorkspaceSkin = {
  eyebrow: string;
  heading: string;
  description: string;
  /** Full class list for the two fixed background glows, gradient direction included. */
  glowTop: string;
  glowBottom: string;
  /** Sidebar accent utilities. */
  accentText: string;
  accentSoft: string;
  accentChip: string;
  accentBadge: string;
  icon: LucideIcon;
  bestFor: string;
  outputs: readonly string[];
  badge: string;
  /** Only the image workspace animates its entrance today. */
  motion: boolean;
};

const SKINS: Record<WorkspaceSlug, WorkspaceSkin> = {
  image: {
    eyebrow: "Image bench",
    heading: "Give your image a new shape.",
    description: "Switch formats and tune compression in your browser. Your original file never leaves this page.",
    glowTop: "bg-gradient-to-tr from-amber-500/15 via-orange-500/10 to-rose-500/5",
    glowBottom: "bg-gradient-to-br from-orange-400/15 via-amber-200/20 to-transparent",
    accentText: "text-amber-700",
    accentSoft: "bg-amber-400/10",
    accentChip: "border-amber-300/60 bg-amber-400/15 text-amber-800",
    accentBadge: "text-emerald-600",
    icon: FileImageIcon,
    bestFor: "Web images, social exports, email attachments, and quick format changes.",
    outputs: ["JPG", "PNG", "WebP", "AVIF"],
    badge: "Browser-first processing",
    motion: true,
  },
  audio: {
    eyebrow: "Audio bench",
    heading: "Put the track in the right container.",
    description: "Convert audio through the FFmpeg backend and download a clean result without creating an account.",
    glowTop: "bg-gradient-to-tr from-red-500/15 via-rose-500/10 to-pink-500/5",
    glowBottom: "bg-gradient-to-br from-rose-400/15 via-pink-200/20 to-transparent",
    accentText: "text-rose-700",
    accentSoft: "bg-rose-400/10",
    accentChip: "border-rose-300/60 bg-rose-400/15 text-rose-800",
    accentBadge: "text-rose-600",
    icon: AudioLinesIcon,
    bestFor: "Podcasts, music players, production workflows, and high-fidelity delivery.",
    outputs: ["MP3", "WAV", "FLAC", "AAC", "OGG", "M4A"],
    badge: "FFmpeg secured workflow",
    motion: false,
  },
  video: {
    eyebrow: "Video bench",
    heading: "Make the footage playable.",
    description: "Convert video for editing, sharing, archiving, or the next screen using the FFmpeg backend.",
    glowTop: "bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-cyan-500/5",
    glowBottom: "bg-gradient-to-br from-teal-400/15 via-cyan-200/20 to-transparent",
    accentText: "text-emerald-700",
    accentSoft: "bg-emerald-400/10",
    accentChip: "border-emerald-300/60 bg-emerald-400/15 text-emerald-800",
    accentBadge: "text-emerald-600",
    icon: FilmIcon,
    bestFor: "Social clips, editing handoffs, screen recordings, and archive-ready exports.",
    outputs: ["MP4", "WebM", "MKV", "MOV", "AVI"],
    badge: "FFmpeg secured workflow",
    motion: false,
  },
};

/**
 * The whole page body for one workspace, shared by `/convert/<workspace>` and its output routes.
 *
 * A `target` only changes the visible copy and which output starts selected — the converter markup,
 * controls and sidebar are identical, so an output URL adds no interface of its own.
 */
export function ConversionWorkspace({
  workspace,
  target,
}: {
  workspace: WorkspaceSlug;
  target?: ConversionTarget;
}) {
  const skin = SKINS[workspace];
  const Icon = skin.icon;
  const header = target
    ? {
        eyebrow: `${target.output.label} output`,
        heading: `Convert to ${target.output.label}`,
        description: `Everything you drop here is turned into ${target.output.label} in your browser. ${skin.description}`,
      }
    : { eyebrow: skin.eyebrow, heading: skin.heading, description: skin.description };

  const converter =
    workspace === "image" ? (
      <ImageConverter defaultTarget={target?.target} />
    ) : workspace === "audio" ? (
      <AudioConverter defaultTarget={target?.target} />
    ) : (
      <VideoConverter defaultTarget={target?.target} />
    );

  const body = (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-8 pt-28 sm:gap-12 sm:px-6 lg:px-10 lg:py-32">
      <PageHeader eyebrow={header.eyebrow} title={header.heading} description={header.description} />
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_240px]">
        {converter}
        <aside className="flex flex-col gap-5 rounded-3xl border border-white/90 bg-white/60 p-8 text-sm text-muted-foreground shadow-[0_20px_50px_rgba(0,0,0,0.06),_0_10px_20px_rgba(0,0,0,0.03)] ring-1 ring-inset ring-white/80 backdrop-blur-3xl max-md:p-5 lg:border-l lg:pl-6">
          <div className={cn("flex items-center gap-2", skin.accentText)}><Icon className="size-4" /><p className="font-semibold">Best for</p></div>
          <p className={cn("rounded-2xl p-4 text-zinc-700", skin.accentSoft)}>{skin.bestFor}</p>
          <div className={cn("flex items-center gap-2", skin.accentText)}><CheckCircle2Icon className="size-4" /><p className="font-semibold">Supported output</p></div>
          <div className="flex flex-wrap gap-2">{skin.outputs.map((format) => <span key={format} className={cn("rounded-full border px-3 py-1 text-xs font-semibold", skin.accentChip)}>{format}</span>)}</div>
          <div className="mt-auto flex items-center gap-2 rounded-full bg-white/60 px-3 py-2 text-xs text-zinc-600"><ShieldCheckIcon className={cn("size-4", skin.accentBadge)} /> {skin.badge}</div>
        </aside>
      </section>
    </div>
  );

  return (
    <div className="relative isolate flex-1 overflow-x-clip bg-[#fafafa] text-zinc-900">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className={cn("absolute left-1/2 top-1/4 size-[32rem] -translate-x-1/2 rounded-full blur-3xl", skin.glowTop)} />
        <div className={cn("absolute bottom-1/4 left-1/4 size-[28rem] rounded-full blur-3xl", skin.glowBottom)} />
      </div>
      {skin.motion ? <MotionPage>{body}</MotionPage> : body}
    </div>
  );
}
