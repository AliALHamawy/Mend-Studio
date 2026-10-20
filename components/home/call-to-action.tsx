import Link from "next/link";
import type { Route } from "next";
import { ArrowRightIcon } from "lucide-react";

export function CallToAction() {
  return (
    <section className="flex flex-col gap-5 border-y border-border py-12 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Start with the file in front of you.</h2>
        <p className="text-sm text-muted-foreground">No account, no queue, no advertising between you and the result.</p>
      </div>
      <Link href={"/convert/image" as Route} className="relative inline-flex h-10 items-center justify-center gap-2 overflow-hidden rounded-full border border-white/20 bg-zinc-900/85 px-6 py-2.5 text-sm font-medium text-white shadow-[0_20px_50px_rgba(0,0,0,0.08),_0_10px_20px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.4)] backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:bg-zinc-900 active:scale-95">
        <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        Convert an image <ArrowRightIcon aria-hidden="true" className="size-4" />
      </Link>
    </section>
  );
}
