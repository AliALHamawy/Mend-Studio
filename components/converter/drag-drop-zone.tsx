"use client";

import { ChangeEvent, DragEvent, ReactNode, useRef, useState } from "react";
import { motion } from "framer-motion";
import { UploadCloudIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function DragDropZone({ accept, onFile, children }: { accept: string; onFile: (file?: File) => void; children: ReactNode }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const pickFile = (event: ChangeEvent<HTMLInputElement>) => onFile(event.target.files?.[0]);
  const dropFile = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    onFile(event.dataTransfer.files[0]);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      animate={{ scale: dragging ? 1.015 : 1, boxShadow: dragging ? "0 0 0 6px hsl(var(--ring) / 0.12), 0 20px 55px -25px hsl(var(--ring) / 0.5)" : "0 0 0 0 transparent" }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={cn("group flex min-h-72 cursor-pointer items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-8 transition-colors hover:border-zinc-400 hover:bg-white", dragging && "border-primary bg-primary/5")}
      onClick={() => inputRef.current?.click()}
      onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={() => setDragging(false)}
      onDrop={dropFile}
      onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") inputRef.current?.click(); }}
      role="button"
      tabIndex={0}
    >
      <input ref={inputRef} className="hidden" type="file" accept={accept} onChange={pickFile} />
      <div className="flex flex-col items-center gap-4 text-center">
        <motion.div animate={{ y: dragging ? -6 : [0, -5, 0] }} transition={{ duration: 2.4, repeat: dragging ? 0 : Infinity, ease: "easeInOut" }} className="grid size-16 place-items-center rounded-2xl bg-white text-primary shadow-lg shadow-zinc-200/80 ring-1 ring-zinc-200 group-hover:text-primary">
          <UploadCloudIcon className="size-8" strokeWidth={1.7} />
        </motion.div>
        {children}
      </div>
    </motion.div>
  );
}
