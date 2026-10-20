"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRightIcon, CheckCircle2Icon, DownloadIcon, FileImageIcon, HardDriveIcon, ImageIcon, LoaderCircleIcon, LockKeyholeIcon, SlidersHorizontalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { DragDropZone } from "@/components/converter/drag-drop-zone";
import { ConversionStatus } from "@/components/converter/conversion-status";

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
    <Card className="overflow-hidden border-zinc-200 bg-white shadow-xl shadow-zinc-200/50 backdrop-blur-xl">
      <CardContent className="p-4 sm:p-7">
        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-5">
              <DragDropZone accept="image/*" onFile={acceptFile}>
                <div>
                  <p className="text-lg font-semibold text-zinc-900">Drop your image here</p>
                  <p className="mt-2 text-sm text-zinc-500">or click to browse · JPG, PNG, WebP, or AVIF · up to 50 MB</p>
                </div>
              </DragDropZone>
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-zinc-500">
                <span className="flex items-center gap-1.5"><LockKeyholeIcon className="size-3.5 text-emerald-500" /> Processed in your browser</span>
                <span className="flex items-center gap-1.5"><SlidersHorizontalIcon className="size-3.5 text-primary" /> Smart compression</span>
              </div>
            </motion.div>
          ) : (
            <motion.div key="selected" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
              <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
                <div className="size-20 shrink-0 overflow-hidden rounded-xl bg-zinc-200">
                  {preview ? <img src={preview} alt={`Preview of ${file.name}`} className="size-full object-cover" /> : <ImageIcon className="m-6 size-8 text-slate-400" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-zinc-900">{file.name}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-zinc-500"><HardDriveIcon className="size-3.5" /> {size(file.size)} · {file.type.replace("image/", "").toUpperCase()}</p>
                </div>
                <CheckCircle2Icon className="size-5 shrink-0 text-emerald-500" />
              </div>
              <div className="grid gap-6 rounded-2xl border border-zinc-200 p-5 md:grid-cols-[180px_1fr]">
                <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700"><span>Convert to</span>
                  <Select value={target} onValueChange={(value) => { if (value) setTarget(value as ImageFormat); }}>
                    <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>{formats.map((format) => <SelectItem key={format.value} value={format.value}>{format.label}</SelectItem>)}</SelectContent>
                  </Select>
                </label>
                <label className="flex flex-col gap-3 text-sm font-medium text-zinc-700"><span className="flex justify-between">Smart compression <output className="font-semibold text-primary">{Math.round(quality * 100)}%</output></span>
                  <Slider min={0.35} max={1} step={0.01} value={[quality]} onValueChange={(values) => setQuality(Array.isArray(values) ? values[0] ?? quality : values)} />
                  <span className="text-xs font-normal text-slate-500">Higher quality keeps more detail and creates a larger file.</span>
                </label>
              </div>
              <Button onClick={convert} disabled={working} size="lg" className="h-12 w-full rounded-xl text-base font-semibold">
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
