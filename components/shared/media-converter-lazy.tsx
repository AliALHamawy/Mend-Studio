"use client";

import dynamic from "next/dynamic";

/**
 * FFmpeg WebAssembly reaches for browser-only globals (Worker, SharedArrayBuffer), so the
 * converter is loaded on the client only and is never evaluated while rendering on the server.
 */
export const LazyMediaConverter = dynamic(
  () => import("@/components/shared/media-converter").then((module) => module.MediaConverter),
  {
    ssr: false,
    loading: () => (
      <div
        className="rounded-2xl border border-white/90 bg-white/50 p-8 text-sm text-muted-foreground"
        role="status"
      >
        Preparing the in-browser converter…
      </div>
    ),
  },
);
