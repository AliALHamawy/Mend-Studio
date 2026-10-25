const DEFAULT_SITE_URL = "https://mendstudio.vercel.app";

/** Canonical origin for metadata, sitemap, and JSON-LD (no trailing slash). */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/+$/, "");
  }
  // VERCEL_URL identifies one immutable deployment (`<project>-<hash>.vercel.app`), which would put
  // a different origin in every page's canonical tag. The production URL is the stable one.
  const vercel = (process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL)?.trim();
  if (vercel) {
    return `https://${vercel.replace(/^https?:\/\//, "").replace(/\/+$/, "")}`;
  }
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }
  return DEFAULT_SITE_URL;
}

export const siteConfig = {
  name: "Mend Studio",
  tagline: "Secure local media converter",
  defaultTitle: "Mend Studio — Secure Local Media Converter",
  titleTemplate: "%s | Mend Studio",
  defaultDescription:
    "Convert video, audio, and images privately in your browser. Mend Studio is a fast, local-first media converter—no account, minimal uploads, privacy by design.",
  defaultKeywords: [
    "Mend Studio",
    "local media converter",
    "secure media converter",
    "private video converter",
    "private audio converter",
    "image converter",
    "convert video audio image privately",
    "browser image conversion",
    "FFmpeg audio video conversion",
    "local-first",
    "privacy-focused converter",
    // Image pairs: the workspace accepts JPG, PNG, WebP and AVIF.
    "jpg to webp",
    "convert jpg to webp",
    "png to webp",
    "webp to jpg",
    "webp to png",
    "png to jpg",
    "jpg to png",
    "jpg to avif",
    "avif to jpg",
    "webp to avif",
    "image compressor",
    // Video pairs: MP4, WebM, MKV, MOV and AVI containers.
    "mp4 to webm",
    "webm to mp4",
    "mov to mp4",
    "mkv to mp4",
    "avi to mp4",
    "mp4 to mov",
    "convert video to mp4",
    // Audio pairs: MP3, WAV, FLAC, AAC, OGG and M4A.
    "mp3 to wav",
    "wav to mp3",
    "m4a to mp3",
    "flac to mp3",
    "flac to wav",
    "aac to mp3",
    "ogg to mp3",
    "mp3 to ogg",
    "convert audio to mp3",
  ],
  locale: "en_US",
  twitterCard: "summary_large_image" as const,
} as const;

export type PageMetaInput = {
  title: string;
  description: string;
  path: `/${string}` | "/";
  keywords?: string[];
};
