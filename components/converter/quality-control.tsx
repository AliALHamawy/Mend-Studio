"use client";

import { motion } from "framer-motion";
import { GaugeIcon } from "lucide-react";

export type QualityAccent = "amber" | "emerald" | "crimson";

const accents: Record<QualityAccent, { text: string; range: string; track: string }> = {
  amber: { text: "text-amber-700", range: "accent-amber-500", track: "from-amber-400 to-orange-500" },
  emerald: { text: "text-emerald-700", range: "accent-emerald-500", track: "from-emerald-400 to-teal-500" },
  crimson: { text: "text-rose-700", range: "accent-rose-500", track: "from-red-400 to-rose-500" },
};

export function QualityControl({
  label,
  value,
  min,
  max,
  step = 1,
  valueLabel,
  hint,
  accent = "amber",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  valueLabel: string;
  hint: string;
  accent?: QualityAccent;
  onChange: (value: number) => void;
}) {
  const tone = accents[accent];
  const progress = `${((value - min) / (max - min)) * 100}%`;

  return (
    <div className="rounded-2xl border border-white/90 bg-white/45 p-4 shadow-[inset_0_1px_2px_rgba(255,255,255,1)] ring-1 ring-inset ring-white/70 backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <label className={`flex items-center gap-2 text-sm font-semibold ${tone.text}`}>
          <GaugeIcon className="size-4" aria-hidden="true" />
          {label}
        </label>
        <motion.output
          key={valueLabel}
          initial={{ opacity: 0, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-full bg-white/70 px-3 py-1 text-xs font-bold ${tone.text}`}
        >
          {valueLabel}
        </motion.output>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className={`h-2 min-w-0 flex-1 cursor-pointer appearance-none rounded-full bg-gradient-to-r ${tone.track} bg-no-repeat ${tone.range} [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-zinc-200/80 [&::-webkit-slider-thumb]:mt-[-3px] [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-zinc-900 [&::-webkit-slider-thumb]:shadow-md`}
          style={{ backgroundSize: `${progress} 100%` }}
          aria-label={label}
        />
      </div>
      <p className="mt-2 text-xs text-zinc-500">{hint}</p>
    </div>
  );
}
