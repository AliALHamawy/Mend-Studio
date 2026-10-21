import ffmpegPath from "ffmpeg-static";
import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, extname, join } from "node:path";
import { spawn } from "node:child_process";

const AUDIO_FORMATS = new Set(["aac", "flac", "m4a", "mp3", "ogg", "wav"]);
const VIDEO_FORMATS = new Set(["avi", "mkv", "mov", "mp4", "webm"]);
export const SUPPORTED_FORMATS = new Set([...AUDIO_FORMATS, ...VIDEO_FORMATS]);
const executablePath = process.env.FFMPEG_PATH || ffmpegPath;

function getTargetFormat(value: unknown) {
  if (typeof value !== "string") return null;
  const format = value.toLowerCase().replace(/^\./, "");
  return SUPPORTED_FORMATS.has(format) ? format : null;
}

function safeBaseName(filename: string) {
  const name = basename(filename, extname(filename)).replace(/[^a-zA-Z0-9_-]+/g, "-");
  return name || `converted-${randomUUID().slice(0, 8)}`;
}

function runFfmpeg(inputPath: string, outputPath: string, targetFormat: string, quality: number | null) {
  return new Promise<void>((resolve, reject) => {
    if (!executablePath) {
      reject(new Error("FFmpeg is not available for this deployment."));
      return;
    }

    const qualityArgs = quality === null ? [] : [
      ...(AUDIO_FORMATS.has(targetFormat) ? ["-b:a", `${quality}k`] : []),
      ...(VIDEO_FORMATS.has(targetFormat) ? ["-crf", String(quality === 1 ? 32 : quality === 3 ? 18 : 24)] : []),
    ];
    const process = spawn(executablePath, [
      "-hide_banner", "-loglevel", "error", "-y", "-i", inputPath,
      "-map_metadata", "-1", ...qualityArgs, "-f", targetFormat, outputPath
    ]);
    let errorOutput = "";
    const timeout = setTimeout(() => {
      process.kill("SIGKILL");
      reject(new Error("Conversion timed out. Try a smaller file."));
    }, 55_000);

    process.stderr.on("data", (chunk: Buffer) => { errorOutput += chunk.toString(); });
    process.once("error", (error: NodeJS.ErrnoException) => {
      clearTimeout(timeout);
      if (error.code === "ENOENT" || error.code === "EACCES" || error.code === "UNKNOWN") {
        reject(new Error("FFmpeg could not start. Install a compatible FFmpeg binary and set FFMPEG_PATH to its executable path."));
        return;
      }
      reject(error);
    });
    process.once("close", (code) => {
      clearTimeout(timeout);
      if (code === 0) resolve();
      else reject(new Error(errorOutput.trim() || "FFmpeg could not convert this media file."));
    });
  });
}

export async function convertMediaBuffer(buffer: Buffer, originalName: string, target: unknown, requestedQuality: unknown) {
  const targetFormat = getTargetFormat(target);
  if (!targetFormat) throw new Error("Unsupported target format.");
  if (!executablePath || !existsSync(executablePath)) {
    throw new Error("FFmpeg binary is unavailable. Reinstall dependencies with package install scripts enabled or set FFMPEG_PATH.");
  }

  const numericQuality = Number(requestedQuality);
  const quality = Number.isFinite(numericQuality) && numericQuality > 0 ? numericQuality : null;
  const workingDirectory = await mkdtemp(join(tmpdir(), "universal-converter-"));
  try {
    const inputPath = join(workingDirectory, `input${extname(originalName) || ".bin"}`);
    const outputPath = join(workingDirectory, `output.${targetFormat}`);
    await writeFile(inputPath, buffer);
    await runFfmpeg(inputPath, outputPath, targetFormat, quality);
    return {
      buffer: await readFile(outputPath),
      filename: `${safeBaseName(originalName)}.${targetFormat}`,
      targetFormat,
    };
  } finally {
    await rm(workingDirectory, { recursive: true, force: true });
  }
}
