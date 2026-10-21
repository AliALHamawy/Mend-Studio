import ffmpegPath from "ffmpeg-static";
import { randomUUID } from "node:crypto";
import { statSync } from "node:fs";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, extname, join } from "node:path";
import { spawn } from "node:child_process";
import { CONVERSION_FAILED_MESSAGE, INVALID_FILE_MESSAGE, TIMEOUT_MESSAGE } from "@/lib/conversion-messages";

const AUDIO_FORMATS = new Set(["aac", "flac", "m4a", "mp3", "ogg", "wav"]);
const VIDEO_FORMATS = new Set(["avi", "mkv", "mov", "mp4", "webm"]);
export const SUPPORTED_FORMATS = new Set([...AUDIO_FORMATS, ...VIDEO_FORMATS]);

export type ConversionErrorKind = "input" | "processing";

/**
 * A conversion failure that already carries a friendly, user-facing message.
 * Anything else (raw FFmpeg output, unexpected exceptions) is logged server-side only.
 */
export class MediaConversionError extends Error {
  constructor(readonly kind: ConversionErrorKind, message: string) {
    super(message);
    this.name = "MediaConversionError";
  }
}

/** FFmpeg phrases that mean the uploaded file is unusable, rather than an internal failure. */
const INVALID_INPUT_SIGNATURES = [
  "invalid data found when processing input",
  "could not find codec parameters",
  "does not contain any stream",
  "unknown decoder",
  "decoder not found",
  "moov atom not found",
];

function looksLikeInvalidInput(stderr: string) {
  const log = stderr.toLowerCase();
  return INVALID_INPUT_SIGNATURES.some((signature) => log.includes(signature));
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

function resolveContainer(targetFormat: string) {
  return CONTAINER_BY_FORMAT[targetFormat] ?? MP4_FALLBACK;
}

function isRegularFile(path: string) {
  try {
    return statSync(path).isFile();
  } catch {
    return false;
  }
}

function resolveFfmpegPath() {
  const configuredPath = process.env.FFMPEG_PATH?.trim();
  if (configuredPath) {
    if (!isRegularFile(configuredPath)) {
      throw new Error(`FFMPEG_PATH does not point to an FFmpeg executable file: "${configuredPath}".`);
    }
    return configuredPath;
  }

  // Trust ffmpeg-static directly in cloud/serverless environments without strict isRegularFile check
  if (typeof ffmpegPath === "string" && ffmpegPath.trim()) {
    return ffmpegPath;
  }

  return "ffmpeg";
}

function getTargetFormat(value: unknown) {
  if (typeof value !== "string") return null;
  const format = value.toLowerCase().replace(/^\./, "");
  return SUPPORTED_FORMATS.has(format) ? format : null;
}

function safeBaseName(filename: string) {
  const name = basename(filename, extname(filename)).replace(/[^a-zA-Z0-9_-]+/g, "-");
  return name || `converted-${randomUUID().slice(0, 8)}`;
}

/** Long clips are slow to encode, so allow well beyond the previous 55 s before giving up. */
const FFMPEG_TIMEOUT_MS = 300_000;

/**
 * Encoder flags per output container, tuned for speed so heavy files finish before the timeout.
 * Video quality 1/2/3 maps to a constant-quality (CRF) target: 32 (smallest) / 24 / 18 (most detail).
 */
function encodingArgs(targetFormat: string, quality: number | null) {
  if (AUDIO_FORMATS.has(targetFormat)) {
    return quality === null ? [] : ["-b:a", `${quality}k`];
  }

  const crf = String(quality === 1 ? 32 : quality === 3 ? 18 : 24);

  if (targetFormat === "webm") {
    // VP9 in realtime mode: a relaxed `-deadline` plus a high `-cpu-used` trades compression for speed.
    return ["-c:v", "libvpx-vp9", "-deadline", "realtime", "-cpu-used", "5", "-row-mt", "1", "-b:v", "0", "-crf", crf, "-c:a", "libopus", "-b:a", "96k"];
  }
  if (targetFormat === "avi") {
    return ["-c:v", "mpeg4", "-q:v", "6", "-c:a", "mp3", "-b:a", "192k"];
  }
  // MP4 / MOV / MKV share the H.264 + AAC path; `ultrafast` keeps encode times low.
  return ["-c:v", "libx264", "-preset", "ultrafast", "-crf", crf, "-c:a", "aac", "-b:a", "128k"];
}

function runFfmpeg(executablePath: string, inputPath: string, outputPath: string, targetFormat: string, quality: number | null) {
  return new Promise<void>((resolve, reject) => {
    const { muxer } = resolveContainer(targetFormat);
    const args: string[] = [
      "-hide_banner", "-loglevel", "error", "-y", "-i", inputPath,
      "-map_metadata", "-1", ...encodingArgs(targetFormat, quality), "-f", muxer, outputPath
    ];
    const child = spawn(executablePath, args, { windowsHide: true });
    let errorOutput = "";
    const timeout = setTimeout(() => {
      child.kill("SIGKILL");
      console.error(`[convert] ffmpeg timed out after ${FFMPEG_TIMEOUT_MS} ms while writing ${targetFormat}.`);
      reject(new MediaConversionError("processing", TIMEOUT_MESSAGE));
    }, FFMPEG_TIMEOUT_MS);

    child.stderr?.on("data", (chunk: Buffer) => { errorOutput += chunk.toString(); });
    child.once("error", (error: NodeJS.ErrnoException) => {
      clearTimeout(timeout);
      console.error(`[convert] ffmpeg could not start from "${executablePath}".`, error);
      reject(new MediaConversionError("processing", CONVERSION_FAILED_MESSAGE));
    });
    child.once("close", (code) => {
      clearTimeout(timeout);
      if (code === 0) {
        resolve();
        return;
      }
      // The FFmpeg log is the debugging detail; the caller only ever sees a friendly message.
      console.error(`[convert] ffmpeg exited with code ${code}.\n${errorOutput.trim() || "(no stderr output)"}`);
      const invalidInput = looksLikeInvalidInput(errorOutput);
      reject(new MediaConversionError(invalidInput ? "input" : "processing", invalidInput ? INVALID_FILE_MESSAGE : CONVERSION_FAILED_MESSAGE));
    });
  });
}

export async function convertMediaBuffer(buffer: Buffer, originalName: string, target: unknown, requestedQuality: unknown) {
  const targetFormat = getTargetFormat(target);
  if (!targetFormat) throw new MediaConversionError("input", INVALID_FILE_MESSAGE);
  const executablePath = resolveFfmpegPath();
  const { extension } = resolveContainer(targetFormat);

  const numericQuality = Number(requestedQuality);
  const quality = Number.isFinite(numericQuality) && numericQuality > 0 ? numericQuality : null;
  const workingDirectory = await mkdtemp(join(tmpdir(), "universal-converter-"));
  try {
    const inputPath = join(workingDirectory, `input${extname(originalName) || ".bin"}`);
    const outputPath = join(workingDirectory, `output.${extension}`);
    await writeFile(inputPath, buffer);
    await runFfmpeg(executablePath, inputPath, outputPath, targetFormat, quality);
    return {
      buffer: await readFile(outputPath),
      filename: `${safeBaseName(originalName)}.${extension}`,
      targetFormat: extension,
    };
  } finally {
    await rm(workingDirectory, { recursive: true, force: true });
  }
}
