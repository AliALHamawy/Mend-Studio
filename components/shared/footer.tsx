import Link from "next/link";
import type { Route } from "next";
import { CheckCircle2Icon } from "lucide-react";

export function Footer() {
  return (
    <footer className="flex flex-col gap-6 border-t border-zinc-200 py-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2"><CheckCircle2Icon className="size-4 text-emerald-500" aria-hidden="true" /> Ready when you are.</div>
      <nav className="flex flex-wrap gap-4" aria-label="Footer navigation">
        <Link href={"/convert/image" as Route} className="transition-colors hover:text-zinc-950">Images</Link>
        <Link href={"/convert/audio" as Route} className="transition-colors hover:text-zinc-950">Audio</Link>
        <Link href={"/convert/video" as Route} className="transition-colors hover:text-zinc-950">Video</Link>
        <span className="text-zinc-400">Private by default</span>
      </nav>
    </footer>
  );
}
