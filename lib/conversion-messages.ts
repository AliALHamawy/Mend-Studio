/**
 * Canonical, user-facing conversion messages.
 *
 * Raw FFmpeg log output, stack traces and other technical detail stay in the browser console;
 * the UI only ever surfaces these strings.
 */
export const INVALID_FILE_MESSAGE = "Invalid or unsupported file format. Please try uploading a different file.";
export const CONVERSION_FAILED_MESSAGE = "Conversion failed. Please try again or select a different format.";
export const FILE_TOO_LARGE_MESSAGE = "File is too large for browser processing. Please choose a smaller file (under 50MB).";
export const OUT_OF_MEMORY_MESSAGE = "Your browser ran out of memory while converting this file. Try a smaller file, or a lower quality setting.";
export const CONVERSION_TIMEOUT_MESSAGE = "This file took too long to convert, so it was stopped. Try a smaller file, a lower quality setting, or a different output format.";

// Server-side conversion messages (used by api-converter.ts)
export const SERVER_UNREACHABLE_MESSAGE = "Cannot reach the conversion server. Please check your connection and try again.";
export const SERVER_CONVERSION_FAILED_MESSAGE = "The server failed to convert this file. Please try again or select a different format.";
export const SERVER_CONVERSION_TIMEOUT_MESSAGE = "This file took too long to convert on the server. Try a smaller file or a different format.";
