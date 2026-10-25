"use client";

import { useEffect, useState } from "react";
import { CONVERSION_FAILED_MESSAGE, INVALID_FILE_MESSAGE } from "@/lib/conversion-messages";
import { fitImageDimensions } from "@/lib/image-dimensions";
import { ArrowRightIcon, CheckCircle2Icon, DownloadIcon, FileImageIcon, HardDriveIcon, ImageIcon, LoaderCircleIcon, LockKeyholeIcon, SlidersHorizontalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DragDropZone } from "@/components/converter/drag-drop-zone";
import { ConversionStatus } from "@/components/converter/conversion-status";
import { FormatSelector } from "@/components/converter/format-selector";
import { QualityControl } from "@/components/converter/quality-control";
import { workspaceFormats } from "@/lib/conversion-pairs";
import { takePendingFile } from "@/lib/pending-file";

type ImageFormat = "image/jpeg" | "image/png" | "image/webp" | "image/avif";
/** Chip order, labels and extensions come from the shared table so output routes cannot drift from it. */
const formats = workspaceFormats("image");

const size = (bytes: number) => bytes < 1024 ? `${bytes} B` : `${(bytes / 1024 / 1024).toFixed(2)} MB`;

/**
 * `defaultTarget` pre-selects an output for the output routes (`/convert/image/to-webp`). It only
 * changes which chip starts active, and falls back to WebP on the plain workspace route.
 */
export function ImageConverter({ defaultTarget }: { defaultTarget?: string } = {}) {
  const [file, setFile] = useState<File | null>(null);
  const [target, setTarget] = useState<ImageFormat>((defaultTarget as ImageFormat | undefined) ?? "image/webp");
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

  /**
   * A file dropped on the homepage hero arrives through `lib/pending-file`, because a `File` cannot
   * travel in a URL. It is claimed once, so returning to this page does not reload a stale selection.
   */
  useEffect(() => {
    const pending = takePendingFile("image");
    if (!pending) return;
    if (!pending.type.startsWith("image/")) { setError(INVALID_FILE_MESSAGE); return; }
    if (pending.size > 50 * 1024 * 1024) { setError("Images must be 50 MB or smaller."); return; }
    setFile(pending);
  }, []);

  function acceptFile(next?: File) {
    if (!next) return;
    if (!next.type.startsWith("image/")) { setError(INVALID_FILE_MESSAGE); return; }
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
      let bitmap: ImageBitmap;
      try {
        bitmap = await createImageBitmap(file);
      } catch (decodeError) {
        // A file the browser cannot decode is an input problem, not a converter failure.
        console.error("[image-converter] could not decode the selected file", decodeError);
        setError(INVALID_FILE_MESSAGE);
        return;
      }
      const { width, height } = fitImageDimensions(bitmap.width, bitmap.height);
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas is unavailable in this browser.");
      context.drawImage(bitmap, 0, 0, width, height);
      bitmap.close();
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, target, target === "image/png" ? undefined : quality));
      if (!blob) throw new Error("This browser could not create that image format.");
      const format = formats.find((item) => item.target === target);
      const name = `${file.name.replace(/\.[^/.]+$/, "")}.${format?.token ?? "converted"}`;
      const url = URL.createObjectURL(blob);
      setOutput({ url, bytes: blob.size, name });
      const link = document.createElement("a");
      link.href = url;
      link.download = name;
      link.click();
    } catch (conversionError) {
      // Technical details stay in the console; the badge only shows a friendly message.
      console.error("[image-converter] conversion failed", conversionError);
      setError(CONVERSION_FAILED_MESSAGE);
    } finally {
      setWorking(false);
    }
  }

  return (
    <Card className="!p-8 max-md:!p-4">
      <CardContent className="!p-0">
        {!file ? (
          <div className="flex flex-col gap-5 motion-safe:animate-fade-in">
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
          </div>
        ) : (
          <div className="flex flex-col gap-6 motion-safe:animate-swap-in">
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
                <FormatSelector value={target} formats={formats.map((format) => format.target)} labels={formats.map((format) => format.label)} accent="amber" onChange={(value) => setTarget(value as ImageFormat)} />
              </label>
              <QualityControl label="Smart compression" value={quality} min={0.1} max={1} step={0.01} valueLabel={`${Math.round(quality * 100)}%`} hint="Higher quality keeps more detail and creates a larger file." accent="amber" onChange={setQuality} />
            </div>
            <Button onClick={convert} disabled={working} className="mt-2 h-auto w-full border border-white/20 bg-zinc-900 px-6 py-3.5 text-base font-medium shadow-[0_10px_25px_-5px_rgba(24,24,27,0.3)] transition-all duration-300 hover:bg-zinc-800 active:scale-[0.99]">
              {working ? <><LoaderCircleIcon className="animate-spin" /> Converting your image…</> : <>Convert File Now <ArrowRightIcon /></>}
            </Button>
            {working && <div className="h-1 origin-left rounded-full bg-primary motion-safe:animate-progress" role="presentation" />}
            <ConversionStatus error={error} output={output ? `Converted to ${output.name} · ${size(output.bytes)}` : undefined} />
            {output && <a href={output.url} download={output.name} className="inline-flex items-center justify-center gap-2 text-sm font-medium text-primary hover:underline"><DownloadIcon className="size-4" /> Download again</a>}
            <p className="flex items-center justify-center gap-2 text-xs text-zinc-500"><LockKeyholeIcon className="size-3.5 text-emerald-500" /> Your image never leaves this browser.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
