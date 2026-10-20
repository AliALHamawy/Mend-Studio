"use client";

import { useState } from "react";
import { ArrowUpRightIcon, AudioLinesIcon, VideoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DragDropZone } from "@/components/converter/drag-drop-zone";
import { FormatSelector } from "@/components/converter/format-selector";
import { ConversionStatus } from "@/components/converter/conversion-status";

export function ServerMediaConverter({ kind, title, description, formats }: { kind: "audio" | "video"; title: string; description: string; formats: string[] }) {
  const [file, setFile] = useState<File | null>(null);
  const [target, setTarget] = useState(formats[0]);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");

  async function convert() {
    if (!file) return;
    setWorking(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("target", target);
      const response = await fetch("/api/convert", { method: "POST", body });
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? "The server could not convert this file.");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${file.name.replace(/\.[^/.]+$/, "")}.${target}`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (conversionError) {
      setError(conversionError instanceof Error ? conversionError.message : "Conversion failed.");
    } finally {
      setWorking(false);
    }
  }

  function acceptFile(next?: File) {
    if (!next) return;
    if (next.size > 50 * 1024 * 1024) { setError("Files must be 50 MB or smaller."); return; }
    setFile(next);
    setError("");
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-signal">{kind} conversion</p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-ink">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <DragDropZone accept={`${kind}/*`} onFile={acceptFile}>
          <div className="text-center">
            <div className="mx-auto mb-3 grid size-12 place-items-center rounded-xl bg-accent/10 text-accent">
              {kind === "audio" ? <AudioLinesIcon className="size-6" aria-hidden="true" /> : <VideoIcon className="size-6" aria-hidden="true" />}
            </div>
            <strong className="block text-sm text-foreground">{file?.name ?? `Drop a ${kind} file here`}</strong>
            <p className="mt-2 text-xs text-muted-foreground">Processed securely through FFmpeg</p>
          </div>
        </DragDropZone>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <label className="flex flex-1 flex-col gap-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            <span>Translate to</span>
            <FormatSelector value={target} formats={formats} onChange={setTarget} />
          </label>
          <Button onClick={convert} disabled={!file || working}>{working ? "Converting…" : "Convert & download"} <ArrowUpRightIcon aria-hidden="true" /></Button>
        </div>
        <ConversionStatus error={error} working={working} />
      </CardContent>
    </Card>
  );
}
