import express from "express";
import multer from "multer";
import ffmpegPath from "ffmpeg-static";
import { randomUUID } from "node:crypto";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, extname, join } from "node:path";
import { spawn } from "node:child_process";

const app = express();
const MAX_FILE_SIZE = 50 * 1024 * 1024;
const SUPPORTED_FORMATS = new Set([
  "aac", "avi", "flac", "m4a", "mkv", "mov", "mp3", "mp4", "ogg", "wav", "webm"
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE }
});

app.get("/health", (_request, response) => {
  response.json({ ok: true, service: "universal-media-converter" });
});

function getTargetFormat(value: unknown) {
  if (typeof value !== "string") return null;
  const format = value.toLowerCase().replace(/^\./, "");
  return SUPPORTED_FORMATS.has(format) ? format : null;
}

function safeBaseName(filename: string) {
  const name = basename(filename, extname(filename)).replace(/[^a-zA-Z0-9_-]+/g, "-");
  return name || `converted-${randomUUID().slice(0, 8)}`;
}

function runFfmpeg(inputPath: string, outputPath: string, targetFormat: string) {
  return new Promise<void>((resolve, reject) => {
    if (!ffmpegPath) {
      reject(new Error("FFmpeg is not available in this deployment."));
      return;
    }

    const process = spawn(ffmpegPath, [
      "-hide_banner",
      "-loglevel", "error",
      "-y",
      "-i", inputPath,
      "-map_metadata", "-1",
      "-f", targetFormat,
      outputPath
    ]);
    let errorOutput = "";
    const timeout = setTimeout(() => {
      process.kill("SIGKILL");
      reject(new Error("Conversion timed out. Try a smaller file."));
    }, 55_000);

    process.stderr.on("data", (chunk: Buffer) => {
      errorOutput += chunk.toString();
    });
    process.once("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    process.once("close", (code) => {
      clearTimeout(timeout);
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(errorOutput.trim() || "FFmpeg could not convert this media file."));
    });
  });
}

const convertMedia = async (request: express.Request, response: express.Response) => {
  if (!request.file) {
    response.status(400).json({ error: "A media file is required." });
    return;
  }

  const targetFormat = getTargetFormat(request.body?.target);
  if (!targetFormat) {
    response.status(400).json({
      error: "Unsupported target format.",
      supported: Array.from(SUPPORTED_FORMATS)
    });
    return;
  }

  if (!ffmpegPath) {
    response.status(503).json({ error: "FFmpeg is not available in this deployment." });
    return;
  }

  let workingDirectory = "";
  try {
    workingDirectory = await mkdtemp(join(tmpdir(), "universal-converter-"));
    const inputPath = join(workingDirectory, `input${extname(request.file.originalname) || ".bin"}`);
    const outputPath = join(workingDirectory, `output.${targetFormat}`);
    await writeFile(inputPath, request.file.buffer);
    await runFfmpeg(inputPath, outputPath, targetFormat);
    const output = await readFile(outputPath);
    const filename = `${safeBaseName(request.file.originalname)}.${targetFormat}`;

    response
      .status(200)
      .type(targetFormat)
      .setHeader("Content-Disposition", `attachment; filename="${filename}"`)
      .setHeader("Content-Length", output.length)
      .send(output);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Media conversion failed.";
    response.status(422).json({ error: message });
  } finally {
    if (workingDirectory) {
      await rm(workingDirectory, { recursive: true, force: true });
    }
  }
};

app.post(["/", "/convert"], upload.single("file"), convertMedia);

app.use((error: unknown, _request: express.Request, response: express.Response, next: express.NextFunction) => {
  if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
    response.status(413).json({ error: `Files must be ${MAX_FILE_SIZE / 1024 / 1024} MB or smaller.` });
    return;
  }
  next(error);
});

app.use((_request, response) => {
  response.status(404).json({ error: "Route not found." });
});

export default app;
