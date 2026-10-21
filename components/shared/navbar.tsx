import Link from "next/link";
import type { Route } from "next";
import { ShieldCheckIcon, SparklesIcon } from "lucide-react";

export function Navbar() {
  return (
    <header className="before:absolute before:inset-0 before:-z-10 before:rounded-full before:bg-gradient-to-r before:from-orange-500/10 before:to-transparent before:blur-xl fixed left-1/2 top-6 z-50 flex w-[92%] max-w-4xl -translate-x-1/2 items-center justify-between rounded-full border border-white/90 bg-white/50 px-8 py-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.08),_0_10px_20px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,1),_inset_0_-2px_4px_rgba(0,0,0,0.03)] ring-1 ring-inset ring-white/80 backdrop-blur-3xl transition-all duration-300 hover:bg-white/60">
      <div className="pointer-events-none absolute inset-x-8 top-px h-px bg-gradient-to-r from-transparent via-white to-transparent" aria-hidden="true" />
      <Link href={"/" as Route} className="relative flex shrink-0 items-center gap-2.5 text-base font-semibold tracking-tight text-zinc-900">
        <span className="grid size-8 place-items-center rounded-xl bg-zinc-900/85 text-white shadow-sm"><SparklesIcon className="size-4" aria-hidden="true" /></span>
        <span>Mend Studio</span>
      </Link>
      <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 text-sm text-zinc-500 md:flex" aria-label="Converters">
        <Link href={"/convert/image" as Route} className="rounded-full px-4 py-2 transition-colors hover:bg-white/60 hover:text-zinc-900">Images</Link>
        <Link href={"/convert/audio" as Route} className="rounded-full px-4 py-2 transition-colors hover:bg-white/60 hover:text-zinc-900">Audio</Link>
        <Link href={"/convert/video" as Route} className="rounded-full px-4 py-2 transition-colors hover:bg-white/60 hover:text-zinc-900">Video</Link>
      </nav>
      <div className="relative flex shrink-0 items-center gap-2 text-xs font-medium text-zinc-500">
        <ShieldCheckIcon className="size-4 text-emerald-600" aria-hidden="true" />
        <span className="hidden sm:inline">Local-first &amp; Private</span>
      </div>
    </header>
  );
}
