"use client";

import { useState } from "react";
import { ArrowRightIcon, LoaderCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DragDropZone } from "@/components/converter/drag-drop-zone";
import { FormatSelector } from "@/components/converter/format-selector";
import { ConversionStatus } from "@/components/converter/conversion-status";
import { QualityControl } from "@/components/converter/quality-control";

export function ServerMediaConverter({ kind, title, description, formats }: { kind: "audio" | "video"; title: string; description: string; formats: string[] }) {
  const accent: "crimson" | "emerald" = kind === "audio" ? "crimson" : "emerald";
  const [file, setFile] = useState<File | null>(null);
  const [target, setTarget] = useState(formats[0]);
  const [quality, setQuality] = useState(kind === "audio" ? 192 : 2);
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
      body.append("quality", String(quality));
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
    <Card className={`!p-8 max-md:!p-4 ${kind === "audio" ? "shadow-[0_24px_70px_rgba(225,29,72,0.12)]" : "shadow-[0_24px_70px_rgba(16,185,129,0.12)]"}`}>
      <CardContent className="flex flex-col gap-6 !p-0">
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-signal">{kind} conversion</p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-ink">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <DragDropZone accept={`${kind}/*`} onFile={acceptFile} accent={accent}>
          <div className="text-center">
            <strong className="block text-sm text-foreground">{file?.name ?? `Drop a ${kind} file here`}</strong>
            <p className="mt-2 text-xs text-muted-foreground">Processed securely through FFmpeg</p>
          </div>
        </DragDropZone>
        <div className="flex flex-col gap-4">
          <label className="flex min-w-0 flex-1 flex-col gap-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            <span>Translate to</span>
            <FormatSelector value={target} formats={formats} accent={accent} onChange={setTarget} />
          </label>
        </div>
        {kind === "audio" ? (
          <QualityControl label="Audio bitrate" value={quality} min={128} max={320} step={64} valueLabel={`${quality} kbps`} hint="Higher bitrate preserves more detail in music and spoken word." accent="crimson" onChange={setQuality} />
        ) : (
          <QualityControl label="Video quality preset" value={quality} min={1} max={3} valueLabel={["Low", "Medium", "High"][quality - 1] ?? "Medium"} hint="High keeps more detail; Low produces a smaller export." accent="emerald" onChange={setQuality} />
        )}
        <Button
          className={`mt-2 h-auto w-full border border-white/20 px-6 py-3.5 text-base font-medium shadow-[0_10px_25px_-5px_rgba(24,24,27,0.3)] transition-all duration-300 active:scale-[0.99] ${
            kind === "audio"
              ? "bg-rose-950 hover:bg-rose-900"
              : "bg-emerald-950 hover:bg-emerald-900"
          }`}
          onClick={convert}
          disabled={!file || working}
        >
          {working ? <><LoaderCircleIcon className="animate-spin" aria-hidden="true" /> Converting…</> : <>Convert &amp; download <ArrowRightIcon aria-hidden="true" /></>}
        </Button>
        <ConversionStatus error={error} working={working} />
      </CardContent>
    </Card>
  );
}
