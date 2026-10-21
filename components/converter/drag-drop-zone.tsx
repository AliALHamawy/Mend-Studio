"use client";

import { ChangeEvent, DragEvent, ReactNode, useRef, useState } from "react";
import { UploadCloudIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type DropzoneAccent = "amber" | "emerald" | "crimson";

const accents: Record<DropzoneAccent, { border: string; icon: string; wash: string }> = {
  amber: { border: "hover:border-amber-500", icon: "text-amber-600", wash: "hover:bg-amber-400/10" },
  emerald: { border: "hover:border-emerald-500", icon: "text-emerald-600", wash: "hover:bg-emerald-400/10" },
  crimson: { border: "hover:border-rose-500", icon: "text-rose-600", wash: "hover:bg-rose-400/10" },
};

export function DragDropZone({ accept, onFile, children, accent = "amber" }: { accept: string; onFile: (file?: File) => void; children: ReactNode; accent?: DropzoneAccent }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);
  const [dragging, setDragging] = useState(false);

  const pickFile = (event: ChangeEvent<HTMLInputElement>) => onFile(event.target.files?.[0]);

  const dropFile = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    onFile(event.dataTransfer.files[0]);
  };

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragDepth.current += 1;
    setDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragDepth.current -= 1;
    if (dragDepth.current <= 0) {
      dragDepth.current = 0;
      setDragging(false);
    }
  };

  return (
    <div
      className={cn("group flex min-h-64 transform-gpu cursor-pointer select-none items-center justify-center rounded-3xl border-2 border-dashed border-zinc-300/80 bg-white/50 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.08),_0_10px_20px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,1)] ring-1 ring-inset ring-white/80 backdrop-blur-3xl transition-all duration-300 will-change-transform [backface-visibility:hidden] motion-safe:hover:scale-[1.01] hover:shadow-[0_24px_60px_rgba(0,0,0,0.12),_0_12px_24px_rgba(0,0,0,0.05)] sm:min-h-72 sm:p-8", accents[accent].border, accents[accent].wash, dragging && "scale-[1.015] border-zinc-900 bg-white/70 shadow-[0_0_0_6px_hsl(var(--ring)/0.12),0_20px_55px_-25px_hsl(var(--ring)/0.5)]")}
      onClick={() => inputRef.current?.click()}
      onDragEnter={handleDragEnter}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={handleDragLeave}
      onDrop={dropFile}
      onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") inputRef.current?.click(); }}
      role="button"
      tabIndex={0}
    >
      <input ref={inputRef} className="hidden" type="file" accept={accept} onChange={pickFile} />
      <div className="flex flex-col items-center gap-4 text-center">
        <div
          className={cn("grid size-16 place-items-center rounded-2xl border border-white/90 bg-white/65 shadow-[0_20px_50px_rgba(0,0,0,0.08)] ring-1 ring-inset ring-white/80 backdrop-blur-3xl transition-transform duration-300", accents[accent].icon, dragging ? "-translate-y-1.5" : "motion-safe:animate-float")}
        >
          <UploadCloudIcon className="size-8" strokeWidth={1.7} />
        </div>
        {children}
        <button
          type="button"
          className="inline-flex items-center rounded-full bg-zinc-900/85 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(0,0,0,0.12)] transition-colors hover:bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/40"
          onClick={(event) => { event.stopPropagation(); inputRef.current?.click(); }}
        >
          Browse files
        </button>
        <p className="text-xs text-zinc-500">or drag and drop anywhere in this zone</p>
      </div>
    </div>
  );
}
