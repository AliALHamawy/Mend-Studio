/**
 * Server-side media conversion client.
 *
 * Uploads a file to the Express backend for FFmpeg processing, then streams the
 * converted result back as a downloadable blob. This bypasses browser memory limits
 * that affect the in-browser WebAssembly converter.
 */

import { contentTypeForFormat } from "@/lib/media-mime";

/* ------------------------------------------------------------------ */
/*  Configuration                                                      */
/* ------------------------------------------------------------------ */

/**
 * Backend base URL. Falls back to localhost for local development.
 * Override with the `NEXT_PUBLIC_BACKEND_URL` environment variable.
 *
 * Example: NEXT_PUBLIC_BACKEND_URL=https://your-vps-hostinger.com
 */
const BACKEND_URL =
  typeof process.env.NEXT_PUBLIC_BACKEND_URL !== "undefined" &&
  process.env.NEXT_PUBLIC_BACKEND_URL !== ""
    ? process.env.NEXT_PUBLIC_BACKEND_URL
    : "http://localhost:5000";

/** Maximum time to wait for the server to finish conversion (5 minutes). */
const SERVER_TIMEOUT_MS = 300_000;

/* ------------------------------------------------------------------ */
/*  Error types                                                        */
/* ------------------------------------------------------------------ */

/** Describes which layer of the pipeline failed. */
export type ServerConversionErrorKind =
  | "network"       // Cannot reach the backend at all
  | "server"        // Backend returned an HTTP error (4xx / 5xx)
  | "timeout"       // Conversion took too long
  | "unknown";      // Unexpected failure

/**
 * Thrown when the server-side conversion pipeline fails.
 * Carries a user-facing message and the underlying cause for debugging.
 */
export class ServerConversionError extends Error {
  constructor(
    public readonly kind: ServerConversionErrorKind,
    message: string,
    cause?: unknown,
  ) {
    super(message, { cause });
    this.name = "ServerConversionError";
  }
}

/* ------------------------------------------------------------------ */
/*  Timeout helper                                                     */
/* ------------------------------------------------------------------ */

class TimeoutError extends Error {}

/**
 * Rejects `promise` with a `TimeoutError` if it does not settle within
 * `timeoutMs` milliseconds.
 */
function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;

  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new TimeoutError(`Timeout after ${timeoutMs} ms`)),
      timeoutMs,
    );
  });

  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

/* ------------------------------------------------------------------ */
/*  Core conversion function                                           */
/* ------------------------------------------------------------------ */

export interface ServerConversionResult {
  /** The converted file as a Blob. */
  blob: Blob;
  /** Suggested filename for the download. */
  filename: string;
}

/**
 * Sends a media file to the Express backend for server-side FFmpeg conversion.
 *
 * @param file - The source media file to convert.
 * @param targetFormat - Target format (e.g., "mp3", "mp4", "wav").
 * @param onProgress - Optional callback reporting progress (0-100).
 *   Note: the backend does not currently stream progress, so this fires
 *   0 at the start and 100 on completion.
 * @returns A promise resolving to the converted blob and filename.
 * @throws {ServerConversionError} When the conversion fails for any reason.
 */
export async function convertMediaViaServer(
  file: File,
  targetFormat: string,
  onProgress?: (percent: number) => void,
): Promise<ServerConversionResult> {
  const url = `${BACKEND_URL}/api/convert`;

  // Report initial progress
  onProgress?.(0);

  console.info(`[api-converter] Uploading ${file.name} (${file.size} bytes) to ${url} for ${targetFormat} conversion`);

  // Build form data payload
  const formData = new FormData();
  formData.append("file", file);
  formData.append("format", targetFormat.toLowerCase());

  try {
    // Execute the fetch with a timeout guard
    const response = await withTimeout(
      fetch(url, {
        method: "POST",
        body: formData,
        // Note: Do NOT set Content-Type header manually; the browser sets
        // the correct multipart/form-data boundary automatically.
      }),
      SERVER_TIMEOUT_MS,
    );

    // Handle HTTP errors from the backend
    if (!response.ok) {
      // Try to parse the error body as JSON
      let serverMessage = `Server returned HTTP ${response.status}`;
      try {
        const errorBody = await response.json();
        if (errorBody?.error) {
          serverMessage = errorBody.error;
        }
      } catch {
        // If parsing fails, fall back to status text
        serverMessage = `${response.status} ${response.statusText}`;
      }

      console.error(`[api-converter] Server error: ${serverMessage}`);
      throw new ServerConversionError(
        "server",
        serverMessage,
        { status: response.status },
      );
    }

    // Read the response as a blob
    const blob = await response.blob();
    console.info(`[api-converter] Received converted file: ${blob.size} bytes`);

    // Extract filename from Content-Disposition header if available
    const contentDisposition = response.headers.get("Content-Disposition");
    let filename: string | null = null;

    if (contentDisposition) {
      // Parse: attachment; filename="converted_file.mp3"
      const filenameMatch = contentDisposition.match(/filename="?([^";]+)"?/);
      filename = filenameMatch ? filenameMatch[1].trim() : null;
    }

    // Fall back to generating a filename from the original
    if (!filename) {
      const originalName = file.name.replace(/\.[^/.]+$/, "");
      filename = `${originalName}.${targetFormat.toLowerCase()}`;
    }

    // Determine MIME type for the blob
    const mimeType = contentTypeForFormat(targetFormat.toLowerCase());

    // Wrap in a typed blob if the server returned application/octet-stream
    const typedBlob =
      blob.type === "application/octet-stream"
        ? new Blob([blob], { type: mimeType })
        : blob;

    // Report completion
    onProgress?.(100);

    console.info(`[api-converter] Conversion complete: ${filename}`);

    return {
      blob: typedBlob,
      filename,
    };
  } catch (error) {
    // Classify the error
    if (error instanceof TimeoutError) {
      console.error(`[api-converter] Conversion timed out after ${SERVER_TIMEOUT_MS} ms`);
      throw new ServerConversionError(
        "timeout",
        "This file took too long to convert on the server. Try a smaller file or a different format.",
        error,
      );
    }

    if (error instanceof ServerConversionError) {
      // Re-throw as-is (already classified)
      throw error;
    }

    // Network errors (DNS failure, server down, CORS, etc.)
    if (error instanceof Error && "code" in error) {
      const err = error as Error & { code?: string };
      if (err.code === "ERR_NETWORK_REQUEST_FAILED" || err.message.includes("fetch")) {
        console.error("[api-converter] Network error — is the backend server running?");
        throw new ServerConversionError(
          "network",
          "Cannot reach the conversion server. Please check your connection and try again.",
          error,
        );
      }
    }

    // Generic fetch/network errors
    if (error instanceof Error) {
      const isNetworkError =
        error.message.includes("fetch") ||
        error.message.includes("network") ||
        error.message.includes("Failed to fetch") ||
        error.message.includes("ECONNREFUSED") ||
        error.message.includes("NetworkError");

      if (isNetworkError) {
        console.error("[api-converter] Network error:", error.message);
        throw new ServerConversionError(
          "network",
          "Cannot reach the conversion server. Please check your connection and try again.",
          error,
        );
      }
    }

    // Unknown error
    console.error("[api-converter] Unexpected error:", error);
    throw new ServerConversionError(
      "unknown",
      "An unexpected error occurred during conversion. Please try again.",
      error,
    );
  }
}

/* ------------------------------------------------------------------ */
/*  Health check helper                                                */
/* ------------------------------------------------------------------ */

/**
 * Checks whether the backend server is reachable.
 * @returns true if the server responds to /health, false otherwise.
 */
export async function isBackendAvailable(): Promise<boolean> {
  try {
    const response = await withTimeout(
      fetch(`${BACKEND_URL}/health`, { method: "GET" }),
      5000,
    );
    return response.ok;
  } catch {
    return false;
  }
}
