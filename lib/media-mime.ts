/** Accurate MIME types for converted media download responses. */
const MIME_BY_FORMAT: Record<string, string> = {
  aac: "audio/aac",
  avi: "video/x-msvideo",
  flac: "audio/flac",
  m4a: "audio/mp4",
  mkv: "video/x-matroska",
  mov: "video/quicktime",
  mp3: "audio/mpeg",
  mp4: "video/mp4",
  ogg: "audio/ogg",
  wav: "audio/wav",
  webm: "video/webm",
};

export function contentTypeForFormat(format: string): string {
  return MIME_BY_FORMAT[format.toLowerCase()] ?? "application/octet-stream";
}
