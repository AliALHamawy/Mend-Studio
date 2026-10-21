"use client";

import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type FormatAccent = "amber" | "emerald" | "crimson";

// Only the selected option is allowed to render an accent border/fill.
// Every chip is a direct sibling with no shared or positional state, and hover
// is a surface-only change (background + text) applied by `hover:` on the
// hovered element itself — no hover rule can introduce a border, a ring or an
// accent color on any chip, so hovering one option can never restyle another.
const idleClasses = "border-transparent bg-white/55 text-zinc-600 hover:bg-white/85 hover:text-zinc-900";

const accents: Record<FormatAccent, { active: string }> = {
  amber: { active: "border-amber-400 bg-amber-400 text-zinc-950 ring-2 ring-amber-400/35 shadow-[0_8px_18px_rgba(0,0,0,0.12)]" },
  emerald: { active: "border-emerald-500 bg-emerald-500 text-white ring-2 ring-emerald-500/35 shadow-[0_8px_18px_rgba(0,0,0,0.12)]" },
  crimson: { active: "border-rose-500 bg-rose-500 text-white ring-2 ring-rose-500/35 shadow-[0_8px_18px_rgba(0,0,0,0.12)]" },
};

export function FormatSelector({ value, formats, labels, accent = "amber", onChange }: { value: string; formats: string[]; labels?: string[]; accent?: FormatAccent; onChange: (value: string) => void }) {
  const tone = accents[accent];

  return (
    <div className="flex flex-wrap gap-2 rounded-2xl border border-white/90 bg-white/45 p-2 shadow-[inset_0_1px_2px_rgba(255,255,255,1)] backdrop-blur-xl">
      {formats.map((format, index) => {
        const active = value === format;
        return (
          <button
            key={format}
            type="button"
            onClick={() => onChange(format)}
            aria-pressed={active}
            data-state={active ? "active" : "idle"}
            className={cn(
              "inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-xl border px-3 text-xs font-bold tracking-wide transition-colors duration-200 motion-safe:active:scale-95 max-md:flex-none",
              active ? tone.active : idleClasses
            )}
          >
            {active && <CheckIcon className="size-3.5" aria-hidden="true" />}
            {labels?.[index] ?? format.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
