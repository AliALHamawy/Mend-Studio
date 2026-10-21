"use client";

import { motion } from "framer-motion";
import { CheckIcon } from "lucide-react";

export type FormatAccent = "amber" | "emerald" | "crimson";

const accents: Record<FormatAccent, { active: string; glow: string }> = {
  amber: { active: "border-amber-400 bg-amber-400 text-zinc-950", glow: "hover:border-amber-300 hover:text-amber-700" },
  emerald: { active: "border-emerald-500 bg-emerald-500 text-white", glow: "hover:border-emerald-300 hover:text-emerald-700" },
  crimson: { active: "border-rose-500 bg-rose-500 text-white", glow: "hover:border-rose-300 hover:text-rose-700" },
};

export function FormatSelector({ value, formats, labels, accent = "amber", onChange }: { value: string; formats: string[]; labels?: string[]; accent?: FormatAccent; onChange: (value: string) => void }) {
  const tone = accents[accent];

  return (
    <div className="flex flex-wrap gap-2 rounded-2xl border border-white/90 bg-white/45 p-2 shadow-[inset_0_1px_2px_rgba(255,255,255,1)] backdrop-blur-xl">
      {formats.map((format, index) => {
        const active = value === format;
        return (
          <motion.button
            key={format}
            type="button"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onChange(format)}
            className={`inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-xl border px-3 text-xs font-bold tracking-wide transition-all duration-200 max-md:flex-none ${active ? `${tone.active} shadow-[0_8px_18px_rgba(0,0,0,0.12)]` : `border-transparent bg-white/55 text-zinc-600 ${tone.glow}`}`}
            aria-pressed={active}
          >
            {active && <CheckIcon className="size-3.5" aria-hidden="true" />}
            {labels?.[index] ?? format.toUpperCase()}
          </motion.button>
        );
      })}
    </div>
  );
}
