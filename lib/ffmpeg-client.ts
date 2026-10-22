import type { FFmpeg } from "@ffmpeg/ffmpeg";
import {
  CONVERSION_FAILED_MESSAGE,
  CONVERSION_TIMEOUT_MESSAGE,
  INVALID_FILE_MESSAGE,
  OUT_OF_MEMORY_MESSAGE,
} from "@/lib/conversion-messages";
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

/** FFmpeg/WebAssembly phrases that mean the browser ran out of memory rather than a bad file. */
const OUT_OF_MEMORY_SIGNATURES = [
  "out of memory",
  "cannot enlarge memory arrays",
  "memory access out of bounds",
  "not enough memory",
  "failed to allocate",
  "aborted",
];

function looksOutOfMemory(detail: string) {
  const haystack = detail.toLowerCase();
  return OUT_OF_MEMORY_SIGNATURES.some((signature) => haystack.includes(signature));
}

/**
 * Console-only diagnostics. Browser-side failures have no server log to inspect, so each step of the
 * pipeline reports itself here with the `[ffmpeg]` prefix and the UI never sees any of it.
 */
function logStep(step: string, detail?: unknown) {
  console.info(`[ffmpeg] ${step}`, detail ?? "");
}

function logFailure(step: string, error: unknown) {
  console.error(`[ffmpeg] ${step} failed`, error);
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

/**
 * Fast, explicit audio encoders: picking the codec keeps FFmpeg from falling back to a slower
 * default for the container, and every one of them is far quicker than a video encode.
 */
const AUDIO_ENCODER_BY_FORMAT: Record<string, string> = {
  aac: "aac",
  m4a: "aac",
  flac: "flac",
  mp3: "libmp3lame",
  ogg: "libvorbis",
  wav: "pcm_s16le",
};

/** Lossless containers ignore the bitrate control, so it is only applied to the lossy encoders. */
const LOSSLESS_AUDIO_FORMATS = new Set(["flac", "wav"]);

/** Speed-first encoder settings: a slow default preset makes browser encodes feel broken. */
function encodingArgs(targetFormat: string, quality: number | null) {
  const audioEncoder = AUDIO_ENCODER_BY_FORMAT[targetFormat];
  if (audioEncoder) {
    return [
      "-c:a", audioEncoder,
      ...(quality === null || LOSSLESS_AUDIO_FORMATS.has(targetFormat) ? [] : ["-b:a", `${quality}k`]),
    ];
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

/**
 * The FFmpeg core is served from this app's own origin rather than a third-party CDN: the ~30 MB
 * download from unpkg was what stalled the engine load. The files live in `public/ffmpeg/`, so
 * these paths resolve to http://localhost:3000/ffmpeg/… in development and to the deployment's own
 * origin in production.
 *
 * The ESM build is required: @ffmpeg/ffmpeg always spawns its worker with `{ type: "module" }`,
 * where `importScripts` is unavailable, so the worker falls back to `import(coreURL)` and needs a
 * module with a default export.
 *
 * Only the single-threaded core is used, because the multithreaded build needs a second worker
 * script (`ffmpeg-core.worker.js`) which cannot be handed to a module worker as a blob URL.
 */
const CORE_BASE_URL = "/ffmpeg";

let enginePromise: Promise<FFmpeg> | null = null;
let progressListener: ((percent: number) => void) | null = null;
let engineLog = "";
let lastPercent = -1;

/**
 * There is no serverless timeout to lean on in the browser, so a stalled or pathologically slow
 * encode is cut off here instead of leaving the progress bar spinning forever.
 */
const ENCODE_TIMEOUT_MS = 300_000;

/** Downloading the ~30 MB WebAssembly core can also stall; that must not hang the UI either. */
const ENGINE_LOAD_TIMEOUT_MS = 120_000;

/** Distinguishes the watchdog firing from a genuine FFmpeg failure. */
class EncodeTimeoutError extends Error {}

/** Rejects with an EncodeTimeoutError once `work` has been pending for longer than `timeoutMs`. */
function raceWithDeadline<T>(work: Promise<T>, timeoutMs: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;

  return Promise.race([
    work,
    new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new EncodeTimeoutError(`no completion after ${timeoutMs} ms`)), timeoutMs);
    }),
  ]).finally(() => clearTimeout(timer));
}

/**
 * ffmpeg.wasm reports progress per output stream, so values can arrive as NaN when the duration is
 * unknown or slip backwards. The bar is only ever allowed to move forward, and unknown values are
 * ignored so the UI keeps its indeterminate state instead of rendering "NaN%".
 */
function reportProgress(progress: number) {
  if (!Number.isFinite(progress)) return;

  const percent = Math.max(0, Math.min(100, Math.round(progress * 100)));
  if (percent <= lastPercent) return;

  lastPercent = percent;
  progressListener?.(percent);
}

/**
 * Fetches one of the core assets and wraps the bytes in an object URL.
 *
 * `fetch` performs the request at runtime, and the value handed on is a `blob:` URL — neither can
 * be mistaken for a module specifier by the bundler. Checking `ok` first turns a missing asset into
 * an error naming the file, instead of a worker that fails while importing an HTML error page.
 *
 * The MIME type is set explicitly rather than taken from the response: the worker imports the core
 * as a module, which requires a JavaScript type, and the wasm needs `application/wasm` to keep the
 * streaming instantiation path.
 */
async function toObjectURL(path: string, mimeType: string) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`${path} responded with ${response.status} ${response.statusText}`);
  }
  return URL.createObjectURL(new Blob([await response.arrayBuffer()], { type: mimeType }));
}

/**
 * Loads the FFmpeg core into @ffmpeg/ffmpeg's own worker, handing it object URLs for the two
 * same-origin assets in `public/ffmpeg/` rather than paths or CDN addresses.
 *
 * Only `coreURL` and `wasmURL` are passed: the library keeps its own bundled worker, and no
 * `workerURL`/`classWorkerURL` override is supplied.
 */
async function createEngine(): Promise<FFmpeg> {
  const { FFmpeg: FFmpegClass } = await import("@ffmpeg/ffmpeg");
  const engine = new FFmpegClass();

  engine.on("log", ({ message }) => {
    engineLog = `${engineLog}${message}\n`.slice(-8000);
  });
  engine.on("progress", ({ progress }) => reportProgress(progress));

  const coreURL = await toObjectURL(`${CORE_BASE_URL}/ffmpeg-core.js`, "text/javascript");
  const wasmURL = await toObjectURL(`${CORE_BASE_URL}/ffmpeg-core.wasm`, "application/wasm");

  // Whether the isolation headers reached the document is still worth knowing: it decides whether
  // SharedArrayBuffer (and therefore multithreading) is available at all.
  logStep("loading the core", {
    coreURL,
    wasmURL,
    crossOriginIsolated: self.crossOriginIsolated,
    sharedArrayBuffer: typeof SharedArrayBuffer !== "undefined",
  });

  try {
    await engine.load({ coreURL, wasmURL });
  } catch (error) {
    // Startup failures surface here: a worker that never spawns, a missing export, or a core that
    // cannot instantiate its WebAssembly memory.
    logFailure(`loading ${coreURL} into the WebAssembly worker`, error);
    throw error;
  }

  logStep("the core is ready");

  return engine;
}

async function loadEngine(): Promise<FFmpeg> {
  if (!enginePromise) {
    enginePromise = raceWithDeadline(createEngine(), ENGINE_LOAD_TIMEOUT_MS).catch((error) => {
      // Let the next attempt start from scratch instead of caching a rejected promise.
      enginePromise = null;
      if (error instanceof EncodeTimeoutError) {
        console.error(`[ffmpeg] the WebAssembly engine was still loading after ${ENGINE_LOAD_TIMEOUT_MS} ms; giving up. Check that ${CORE_BASE_URL}/ffmpeg-core.js and ${CORE_BASE_URL}/ffmpeg-core.wasm are served from this origin.`);
      } else {
        console.error("[ffmpeg] the WebAssembly engine failed to load", error);
      }
      throw new MediaConversionError("processing", CONVERSION_FAILED_MESSAGE);
    });
  }
  return enginePromise;
}

function failureFrom(cause?: unknown) {
  const detail = `${engineLog}\n${cause instanceof Error ? cause.message : cause ?? ""}`;
  // The FFmpeg log is the debugging detail; the caller only ever sees a friendly message.
  console.error(`[ffmpeg] conversion failed.\n${detail.trim() || "(no log output)"}`, cause ?? "");

  if (looksOutOfMemory(detail)) return new MediaConversionError("processing", OUT_OF_MEMORY_MESSAGE);

  const invalidInput = looksLikeInvalidInput(engineLog);
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
  lastPercent = -1;
  progressListener = onProgress ?? null;
  let timedOut = false;

  const args = [
    "-hide_banner", "-y", "-i", inputName, "-map_metadata", "-1",
    ...encodingArgs(target, quality), "-f", muxer, outputName,
  ];

  try {
    logStep(`converting ${file.name} (${file.size} bytes) to ${target}`, args);

    await engine.writeFile(inputName, await fetchFile(file));
    logStep(`wrote ${inputName} into the WebAssembly file system`);

    const exitCode = await raceWithDeadline(engine.exec(args), ENCODE_TIMEOUT_MS);
    logStep(`ffmpeg exited with code ${exitCode}`);
    if (exitCode !== 0) throw failureFrom();

    const data = await engine.readFile(outputName) as Uint8Array;
    logStep(`read ${outputName} (${data.byteLength} bytes) back out`);

    return {
      // readFile hands back a view that may be backed by the WebAssembly heap (ArrayBufferLike), so
      // copy it into a plain Uint8Array — a valid BlobPart that is detached from that heap.
      blob: new Blob([new Uint8Array(data)], { type: contentTypeForFormat(extension) }),
      filename: `${file.name.replace(/\.[^/.]+$/, "")}.${extension}`,
    };
  } catch (error) {
    if (error instanceof EncodeTimeoutError) {
      // exec() cannot be cancelled, so the whole engine is dropped: terminate() frees the stuck
      // worker, and the next conversion lazily boots a fresh WebAssembly instance.
      timedOut = true;
      enginePromise = null;
      engine.terminate();
      // The last reported percentage separates "stuck before it started" from "slow but working".
      console.error(`[ffmpeg] conversion exceeded ${ENCODE_TIMEOUT_MS} ms (last progress ${lastPercent}%) and was terminated`);
      throw looksOutOfMemory(engineLog)
        ? new MediaConversionError("processing", OUT_OF_MEMORY_MESSAGE)
        : new MediaConversionError("processing", CONVERSION_TIMEOUT_MESSAGE);
    }
    if (error instanceof MediaConversionError) throw error;
    throw failureFrom(error);
  } finally {
    progressListener = null;
    // A terminated worker never answers deleteFile(), so cleanup after a timeout would hang forever.
    if (!timedOut) {
      await engine.deleteFile(inputName).catch((error) => logFailure(`deleting ${inputName}`, error));
      await engine.deleteFile(outputName).catch((error) => logFailure(`deleting ${outputName}`, error));
    }
  }
}
