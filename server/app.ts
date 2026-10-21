import express from "express";
import multer from "multer";
import { CONVERSION_FAILED_MESSAGE, INVALID_FILE_MESSAGE } from "@/lib/conversion-messages";
import { convertMediaBuffer, MediaConversionError } from "./media-conversion";

const app = express();
const MAX_FILE_SIZE = 50 * 1024 * 1024;
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE }
});

app.get("/health", (_request, response) => {
  response.json({ ok: true, service: "universal-media-converter" });
});

const convertMedia = async (request: express.Request, response: express.Response) => {
  if (!request.file) {
    response.status(400).json({ error: INVALID_FILE_MESSAGE });
    return;
  }

  try {
    const result = await convertMediaBuffer(
      request.file.buffer,
      request.file.originalname,
      request.body?.target,
      request.body?.quality,
    );
    response
      .status(200)
      .type(result.targetFormat)
      .setHeader("Content-Disposition", `attachment; filename="${result.filename}"`)
      .setHeader("Content-Length", result.buffer.length)
      .send(result.buffer);
  } catch (error) {
    // Only friendly messages ever reach the client; anything unexpected is logged here instead.
    if (!(error instanceof MediaConversionError)) {
      console.error("[convert] unexpected conversion failure", error);
    }
    const invalidInput = error instanceof MediaConversionError && error.kind === "input";
    response.status(invalidInput ? 400 : 422).json({
      error: error instanceof MediaConversionError ? error.message : CONVERSION_FAILED_MESSAGE,
    });
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
