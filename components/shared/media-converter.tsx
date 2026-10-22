"use client";

import { useEffect, useState } from "react";
import { ArrowRightIcon, DownloadIcon, LoaderCircleIcon } from "lucide-react";
import { CONVERSION_FAILED_MESSAGE, FILE_TOO_LARGE_MESSAGE } from "@/lib/conversion-messages";
import { convertMediaLocally, MediaConversionError } from "@/lib/ffmpeg-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DragDropZone } from "@/components/converter/drag-drop-zone";
import { FormatSelector } from "@/components/converter/format-selector";
import { ConversionStatus } from "@/components/converter/conversion-status";
import { QualityControl } from "@/components/converter/quality-control";

const formatSize = (bytes: number) =>
    bytes < 1024 ? `${bytes} B` : `${(bytes / 1024 / 1024).toFixed(2)} MB`;

/**
 * In-browser encoding holds the whole file in memory alongside the WebAssembly heap, so inputs are
 * capped below the size where browsers start swapping or killing the worker. Anything bigger should
 * be trimmed before it reaches the encoder instead of freezing the tab.
 */
const MAX_INPUT_MB = 50;
const MAX_INPUT_BYTES = MAX_INPUT_MB * 1024 * 1024;

export function MediaConverter({ kind, title, description, formats }: { kind: "audio" | "video"; title: string; description: string; formats: string[] }) {
    const accent: "crimson" | "emerald" = kind === "audio" ? "crimson" : "emerald";
    const [file, setFile] = useState<File | null>(null);
    const [target, setTarget] = useState(formats[0]);
    const [quality, setQuality] = useState(kind === "audio" ? 192 : 2);
    const [working, setWorking] = useState(false);
    const [stage, setStage] = useState("Converting your file…");
    const [progress, setProgress] = useState<number | null>(null);
    const [error, setError] = useState("");
    const [download, setDownload] = useState<{ url: string; name: string; bytes: number } | null>(null);

    useEffect(() => () => {
        if (download?.url) URL.revokeObjectURL(download.url);
    }, [download]);

    function revokeDownload() {
        if (download?.url) URL.revokeObjectURL(download.url);
    }

    async function convert() {
        if (!file) return;
        setWorking(true);
        setStage("Starting the in-browser FFmpeg engine…");
        setProgress(null);
        setError("");
        revokeDownload();
        setDownload(null);
        try {
            const { blob, filename } = await convertMediaLocally(file, target, quality, (percent) => {
                setStage("Converting in your browser…");
                setProgress(percent);
            });
            const url = URL.createObjectURL(blob);
            setDownload({ url, name: filename, bytes: blob.size });
            const link = document.createElement("a");
            link.href = url;
            link.download = filename;
            link.click();
        } catch (conversionError) {
            // Wasm/FFmpeg details stay in the console; the badge only shows a friendly message.
            console.error("[convert] local conversion failed", conversionError);
            setError(conversionError instanceof MediaConversionError ? conversionError.message : CONVERSION_FAILED_MESSAGE);
        } finally {
            setProgress(null);
            setWorking(false);
        }
    }

    function acceptFile(next?: File) {
        if (!next) return;
        if (next.size > MAX_INPUT_BYTES) {
            // Reject before anything reaches the encoder, and clear the selection so the error is
            // never shown next to a convert button that still points at an earlier file.
            revokeDownload();
            setDownload(null);
            setFile(null);
            setError(FILE_TOO_LARGE_MESSAGE);
            return;
        }
        revokeDownload();
        setDownload(null);
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
                        <p className="mt-2 text-xs text-muted-foreground">Up to {MAX_INPUT_MB} MB · converted locally in your browser</p>
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
                    className={`mt-2 h-auto w-full border border-white/20 px-6 py-3.5 text-base font-medium shadow-[0_10px_25px_-5px_rgba(24,24,27,0.3)] transition-all duration-300 active:scale-[0.99] ${kind === "audio"
                            ? "bg-rose-950 hover:bg-rose-900"
                            : "bg-emerald-950 hover:bg-emerald-900"
                        }`}
                    onClick={convert}
                    disabled={!file || working}
                >
                    {working ? <><LoaderCircleIcon className="animate-spin" aria-hidden="true" /> Converting…</> : <>Convert &amp; download <ArrowRightIcon aria-hidden="true" /></>}
                </Button>
                <ConversionStatus
                    error={error}
                    working={working}
                    status={stage}
                    progress={progress}
                    output={download ? `Converted to ${download.name} · ${formatSize(download.bytes)}` : undefined}
                />
                {download && (
                    <a
                        href={download.url}
                        download={download.name}
                        className={`inline-flex items-center justify-center gap-2 text-sm font-medium hover:underline ${kind === "audio" ? "text-rose-800" : "text-emerald-800"}`}
                    >
                        <DownloadIcon className="size-4" aria-hidden="true" />
                        Download again
                    </a>
                )}
            </CardContent>
        </Card>
    );
}
