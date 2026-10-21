"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRightIcon, CheckCircle2Icon, DownloadIcon, FileImageIcon, HardDriveIcon, ImageIcon, LoaderCircleIcon, LockKeyholeIcon, SlidersHorizontalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DragDropZone } from "@/components/converter/drag-drop-zone";
import { ConversionStatus } from "@/components/converter/conversion-status";
import { FormatSelector } from "@/components/converter/format-selector";
import { QualityControl } from "@/components/converter/quality-control";

type ImageFormat = "image/jpeg" | "image/png" | "image/webp" | "image/avif";
const formats = [
  { label: "JPG", value: "image/jpeg", extension: "jpg" },
  { label: "PNG", value: "image/png", extension: "png" },
  { label: "WEBP", value: "image/webp", extension: "webp" },
  { label: "AVIF", value: "image/avif", extension: "avif" }
] as const;

const size = (bytes: number) => bytes < 1024 ? `${bytes} B` : `${(bytes / 1024 / 1024).toFixed(2)} MB`;

export function ImageConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [target, setTarget] = useState<ImageFormat>("image/webp");
  const [quality, setQuality] = useState(0.86);
  const [preview, setPreview] = useState("");
  const [output, setOutput] = useState<{ url: string; bytes: number; name: string } | null>(null);
  const [error, setError] = useState("");
  const [working, setWorking] = useState(false);

  useEffect(() => {
    if (!file) { setPreview(""); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => () => { if (output) URL.revokeObjectURL(output.url); }, [output]);

  function acceptFile(next?: File) {
    if (!next) return;
    if (!next.type.startsWith("image/")) { setError("Choose an image file."); return; }
    if (next.size > 50 * 1024 * 1024) { setError("Images must be 50 MB or smaller."); return; }
    setFile(next);
    setOutput(null);
    setError("");
  }

  async function convert() {
    if (!file) return;
    setWorking(true);
    setError("");
    try {
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas is unavailable in this browser.");
      context.drawImage(bitmap, 0, 0);
      bitmap.close();
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, target, target === "image/png" ? undefined : quality));
      if (!blob) throw new Error("This browser could not create that image format.");
      const format = formats.find((item) => item.value === target);
      const name = `${file.name.replace(/\.[^/.]+$/, "")}.${format?.extension ?? "converted"}`;
      const url = URL.createObjectURL(blob);
      setOutput({ url, bytes: blob.size, name });
      const link = document.createElement("a");
      link.href = url;
      link.download = name;
      link.click();
    } catch (conversionError) {
      setError(conversionError instanceof Error ? conversionError.message : "Conversion failed.");
    } finally {
      setWorking(false);
    }
  }

  return (
    <Card className="!p-8 max-md:!p-4">
      <CardContent className="!p-0">
        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-5">
              <DragDropZone accept="image/*" onFile={acceptFile}>
                <div>
                  <p className="text-lg font-semibold text-zinc-900">Drop your image here</p>
                  <p className="mt-2 text-sm text-zinc-500">JPG, PNG, WebP, or AVIF · up to 50 MB</p>
                </div>
              </DragDropZone>
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-zinc-500">
                <span className="flex items-center gap-1.5"><LockKeyholeIcon className="size-3.5 text-emerald-500" /> Processed in your browser</span>
                <span className="flex items-center gap-1.5"><SlidersHorizontalIcon className="size-3.5 text-primary" /> Smart compression</span>
              </div>
            </motion.div>
          ) : (
            <motion.div key="selected" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
              <div className="flex items-center gap-3 rounded-2xl border border-white/90 bg-white/50 p-3 shadow-[inset_0_1px_2px_rgba(255,255,255,1)] ring-1 ring-inset ring-white/80 backdrop-blur-3xl sm:gap-4">
                <div className="size-16 shrink-0 overflow-hidden rounded-xl bg-zinc-200 sm:size-20">
                  {preview ? <img src={preview} alt={`Preview of ${file.name}`} className="size-full object-cover" /> : <ImageIcon className="m-6 size-8 text-slate-400" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-zinc-900">{file.name}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-zinc-500"><HardDriveIcon className="size-3.5" /> {size(file.size)} · {file.type.replace("image/", "").toUpperCase()}</p>
                </div>
                <CheckCircle2Icon className="size-5 shrink-0 text-emerald-500" />
              </div>
              <div className="grid gap-6 rounded-2xl border border-white/90 bg-white/35 p-4 shadow-[inset_0_1px_2px_rgba(255,255,255,1)] ring-1 ring-inset ring-white/80 backdrop-blur-3xl sm:p-5">
                <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700"><span>Convert to</span>
                  <FormatSelector value={target} formats={formats.map((format) => format.value)} labels={formats.map((format) => format.label)} accent="amber" onChange={(value) => setTarget(value as ImageFormat)} />
                </label>
                <QualityControl label="Smart compression" value={quality} min={0.1} max={1} step={0.01} valueLabel={`${Math.round(quality * 100)}%`} hint="Higher quality keeps more detail and creates a larger file." accent="amber" onChange={setQuality} />
              </div>
              <Button onClick={convert} disabled={working} className="mt-2 h-auto w-full border border-white/20 bg-zinc-900 px-6 py-3.5 text-base font-medium shadow-[0_10px_25px_-5px_rgba(24,24,27,0.3)] transition-all duration-300 hover:bg-zinc-800 active:scale-[0.99]">
                {working ? <><LoaderCircleIcon className="animate-spin" /> Converting your image…</> : <>Convert File Now <ArrowRightIcon /></>}
              </Button>
              {working && <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2 }} className="h-1 origin-left rounded-full bg-primary" />}
              <ConversionStatus error={error} output={output ? `Converted to ${output.name} · ${size(output.bytes)}` : undefined} />
              {output && <a href={output.url} download={output.name} className="inline-flex items-center justify-center gap-2 text-sm font-medium text-primary hover:underline"><DownloadIcon className="size-4" /> Download again</a>}
              <p className="flex items-center justify-center gap-2 text-xs text-zinc-500"><LockKeyholeIcon className="size-3.5 text-emerald-500" /> Your image never leaves this browser.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
