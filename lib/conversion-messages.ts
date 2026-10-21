/**
 * Canonical, user-facing conversion messages.
 *
 * Raw FFmpeg log output, stack traces and other technical detail stay in the browser/server
 * console; the UI and the API error payload only ever surface these strings.
 */
export const INVALID_FILE_MESSAGE = "Invalid or unsupported file format. Please try uploading a different file.";
export const CONVERSION_FAILED_MESSAGE = "Conversion failed. Please try again or select a different format.";
export const TIMEOUT_MESSAGE = "This file took too long to convert. Please try a smaller file or a different format.";
