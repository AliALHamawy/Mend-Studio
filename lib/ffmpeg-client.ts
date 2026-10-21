import type { FFmpeg } from "@ffmpeg/ffmpeg";
import { CONVERSION_FAILED_MESSAGE, INVALID_FILE_MESSAGE } from "@/lib/conversion-messages";
import { contentTypeForFormat } from "@/lib/media-mime";

export type ConversionErrorKind = "input" | "processing";

/**
 * A conversion failure that already carries a friendly, user-facing message.
 * Raw FFmpeg output and unexpected exceptions stay in the browser console.
 */
export class MediaConversionError extends Error {
  constructor(readonly kind: ConversionErrorKind, message: string) {
    super(message);
    this.name = "MediaConversionError";
  }
}

/** FFmpeg phrases that mean the selected file is unusable, rather than an internal failure. */
const INVALID_INPUT_SIGNATURES = [
  "invalid data found when processing input",
  "could not find codec parameters",
  "does not contain any stream",
  "unknown decoder",
  "decoder not found",
  "moov atom not found",
];

function looksLikeInvalidInput(log: string) {
  const haystack = log.toLowerCase();
  return INVALID_INPUT_SIGNATURES.some((signature) => haystack.includes(signature));
}

/**
 * Maps a logical target format to its FFmpeg muxer and the matching output extension.
 * Two names are not valid FFmpeg muxers: AAC/M4A audio lives in an M4A (MP4/iPod) container,
 * and Matroska must be muxed as "matroska" — passing "-f mkv" makes FFmpeg fail to initialise.
 */
const CONTAINER_BY_FORMAT: Record<string, { muxer: string; extension: string }> = {
  aac: { muxer: "ipod", extension: "m4a" },
  m4a: { muxer: "ipod", extension: "m4a" },
  mkv: { muxer: "matroska", extension: "mkv" },
  mp3: { muxer: "mp3", extension: "mp3" },
  wav: { muxer: "wav", extension: "wav" },
  flac: { muxer: "flac", extension: "flac" },
  ogg: { muxer: "ogg", extension: "ogg" },
  mp4: { muxer: "mp4", extension: "mp4" },
  mov: { muxer: "mov", extension: "mov" },
  webm: { muxer: "webm", extension: "webm" },
  avi: { muxer: "avi", extension: "avi" },
};

/** MP4 is the safest container, so anything without a known muxer falls back to it instead of failing. */
const MP4_FALLBACK = { muxer: "mp4", extension: "mp4" };

const AUDIO_FORMATS = new Set(["aac", "flac", "m4a", "mp3", "ogg", "wav"]);

/** Speed-first encoder settings: a slow default preset makes browser encodes feel broken. */
function encodingArgs(targetFormat: string, quality: number | null) {
  if (AUDIO_FORMATS.has(targetFormat)) {
    return quality === null ? [] : ["-b:a", `${quality}k`];
  }

  const crf = String(quality === 1 ? 32 : quality === 3 ? 18 : 24);

  if (targetFormat === "webm") {
    return ["-c:v", "libvpx-vp9", "-deadline", "realtime", "-cpu-used", "5", "-row-mt", "1", "-b:v", "0", "-crf", crf, "-c:a", "libopus", "-b:a", "96k"];
  }
  if (targetFormat === "avi") {
    return ["-c:v", "mpeg4", "-q:v", "6", "-c:a", "mp3", "-b:a", "192k"];
  }
  // MP4 / MOV / MKV share the H.264 + AAC path; `ultrafast` keeps encode times low.
  return ["-c:v", "libx264", "-preset", "ultrafast", "-crf", crf, "-c:a", "aac", "-b:a", "128k"];
}

/** ffmpeg-core release that ships alongside the installed @ffmpeg/ffmpeg build. */
const CORE_VERSION = "0.12.9";
const CORE_BASE_URL = `https://unpkg.com/@ffmpeg/core@${CORE_VERSION}/dist/umd`;
const CORE_MT_BASE_URL = `https://unpkg.com/@ffmpeg/core-mt@${CORE_VERSION}/dist/umd`;

let enginePromise: Promise<FFmpeg> | null = null;
let progressListener: ((percent: number) => void) | null = null;
let engineLog = "";

/**
 * Loads ffmpeg-core into a blob URL so it survives the cross-origin isolation headers,
 * and prefers the multithreaded build whenever SharedArrayBuffer is actually available.
 */
async function createEngine(): Promise<FFmpeg> {
  const [{ FFmpeg: FFmpegClass }, { toBlobURL }] = await Promise.all([import("@ffmpeg/ffmpeg"), import("@ffmpeg/util")]);
  const engine = new FFmpegClass();

  engine.on("log", ({ message }) => {
    engineLog = `${engineLog}${message}\n`.slice(-8000);
  });
  engine.on("progress", ({ progress }) => {
    progressListener?.(Math.max(0, Math.min(100, Math.round(progress * 100))));
  });

  const multithreaded = typeof SharedArrayBuffer !== "undefined" && self.crossOriginIsolated;
  const baseURL = multithreaded ? CORE_MT_BASE_URL : CORE_BASE_URL;
  const coreURL = await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript");
  const wasmURL = await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm");

  if (multithreaded) {
    await engine.load({ coreURL, wasmURL, workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, "text/javascript") });
  } else {
    await engine.load({ coreURL, wasmURL });
  }

  return engine;
}

async function loadEngine(): Promise<FFmpeg> {
  if (!enginePromise) {
    enginePromise = createEngine().catch((error) => {
      // Let the next attempt start from scratch instead of caching a rejected promise.
      enginePromise = null;
      console.error("[ffmpeg] the WebAssembly engine failed to load", error);
      throw new MediaConversionError("processing", CONVERSION_FAILED_MESSAGE);
    });
  }
  return enginePromise;
}

function failureFrom(log: string) {
  // The FFmpeg log is the debugging detail; the caller only ever sees a friendly message.
  console.error(`[ffmpeg] conversion failed.\n${log.trim() || "(no log output)"}`);
  const invalidInput = looksLikeInvalidInput(log);
  return new MediaConversionError(
    invalidInput ? "input" : "processing",
    invalidInput ? INVALID_FILE_MESSAGE : CONVERSION_FAILED_MESSAGE,
  );
}

/**
 * Converts a file entirely in the browser with FFmpeg WebAssembly. Nothing is uploaded,
 * so no serverless runtime, timeout or FFmpeg binary is involved.
 */
export async function convertMediaLocally(
  file: File,
  target: string,
  quality: number | null,
  onProgress?: (percent: number) => void,
): Promise<{ blob: Blob; filename: string }> {
  const { muxer, extension } = CONTAINER_BY_FORMAT[target] ?? MP4_FALLBACK;
  const engine = await loadEngine();
  const { fetchFile } = await import("@ffmpeg/util");

  const inputName = `input${file.name.match(/\.[^./\\]+$/)?.[0] ?? ".bin"}`;
  const outputName = `output.${extension}`;
  engineLog = "";
  progressListener = onProgress ?? null;

  try {
    await engine.writeFile(inputName, await fetchFile(file));
    const exitCode = await engine.exec([
      "-hide_banner", "-y", "-i", inputName, "-map_metadata", "-1",
      ...encodingArgs(target, quality), "-f", muxer, outputName,
    ]);
    if (exitCode !== 0) throw failureFrom(engineLog);

    const data = await engine.readFile(outputName) as Uint8Array;
    return {
      blob: new Blob([data], { type: contentTypeForFormat(extension) }),
      filename: `${file.name.replace(/\.[^/.]+$/, "")}.${extension}`,
    };
  } catch (error) {
    if (error instanceof MediaConversionError) throw error;
    throw failureFrom(engineLog);
  } finally {
    progressListener = null;
    await engine.deleteFile(inputName).catch(() => undefined);
    await engine.deleteFile(outputName).catch(() => undefined);
  }
}
