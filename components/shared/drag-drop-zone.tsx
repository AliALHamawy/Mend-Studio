"use client";

import { ChangeEvent, DragEvent, ReactNode, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function DragDropZone({ accept, onFile, children }: { accept: string; onFile: (file?: File) => void; children: ReactNode }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => onFile(event.target.files?.[0]);
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    onFile(event.dataTransfer.files[0]);
  };

  return (
    <div
      className={cn("relative flex min-h-52 cursor-pointer items-center justify-center rounded-lg border border-dashed border-slate-400/70 p-6 transition-colors hover:border-accent hover:bg-accent/5", dragging && "border-accent bg-accent/10")}
      onClick={() => inputRef.current?.click()}
      onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") inputRef.current?.click(); }}
      role="button"
      tabIndex={0}
    >
      <input ref={inputRef} className="hidden" type="file" accept={accept} onChange={handleChange} />
      {children}
    </div>
  );
}
