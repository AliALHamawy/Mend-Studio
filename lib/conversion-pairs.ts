/**
 * The output formats each workspace can produce.
 *
 * Metadata is rendered on the server, so a page can only advertise a specific output if that output is
 * part of its URL — a format selected in client state is invisible to a crawler. These tables therefore
 * back both the static routes under `/convert/<workspace>/to-<format>` and the output the converter
 * starts with, so the two can never drift apart.
 */

export type WorkspaceSlug = "image" | "audio" | "video";

export const WORKSPACE_SLUGS: readonly WorkspaceSlug[] = ["image", "audio", "video"];

/** Narrows a URL segment to a workspace the app actually serves. */
export function isWorkspaceSlug(value: string): value is WorkspaceSlug {
  return (WORKSPACE_SLUGS as readonly string[]).includes(value);
}

export type FormatDescriptor = {
  /** Token used in the URL segment, e.g. the `webp` of `to-webp`, and as the download extension. */
  token: string;
  /** Label shown in metadata and on the converter chip, e.g. `WebP`. */
  label: string;
  /** Value the converter's format selector compares against. */
  target: string;
};

/** Ordered exactly as the format selector renders the chips. */
const FORMATS: Record<WorkspaceSlug, readonly FormatDescriptor[]> = {
  image: [
    { token: "jpg", label: "JPG", target: "image/jpeg" },
    { token: "png", label: "PNG", target: "image/png" },
    { token: "webp", label: "WebP", target: "image/webp" },
    { token: "avif", label: "AVIF", target: "image/avif" },
  ],
  audio: [
    { token: "mp3", label: "MP3", target: "mp3" },
    { token: "wav", label: "WAV", target: "wav" },
    { token: "flac", label: "FLAC", target: "flac" },
    { token: "aac", label: "AAC", target: "aac" },
    { token: "ogg", label: "OGG", target: "ogg" },
    { token: "m4a", label: "M4A", target: "m4a" },
  ],
  video: [
    { token: "mp4", label: "MP4", target: "mp4" },
    { token: "webm", label: "WebM", target: "webm" },
    { token: "mkv", label: "MKV", target: "mkv" },
    { token: "mov", label: "MOV", target: "mov" },
    { token: "avi", label: "AVI", target: "avi" },
  ],
};

export type ConversionTarget = {
  workspace: WorkspaceSlug;
  /** URL segment, e.g. `to-webp`. */
  slug: string;
  /** The format this page produces. */
  output: FormatDescriptor;
  /** Value handed to the converter so this output starts selected. */
  target: string;
};

/** The workspace's formats in selector order — the one source for chips, labels and output pages. */
export function workspaceFormats(workspace: WorkspaceSlug): readonly FormatDescriptor[] {
  return FORMATS[workspace];
}

/** Just the targets, for workspaces whose selector works in plain format strings. */
export function workspaceTargets(workspace: WorkspaceSlug): string[] {
  return FORMATS[workspace].map((format) => format.target);
}

const cache = new Map<WorkspaceSlug, ConversionTarget[]>();

/** One page per output the workspace can produce, addressed as `/convert/<workspace>/to-<format>`. */
export function listConversionTargets(workspace: WorkspaceSlug): ConversionTarget[] {
  const cached = cache.get(workspace);
  if (cached) return cached;

  const targets = FORMATS[workspace].map((output) => ({
    workspace,
    slug: `to-${output.token}`,
    output,
    target: output.target,
  }));

  cache.set(workspace, targets);
  return targets;
}

/** Resolves a `[target]` URL segment, or `null` when the workspace cannot produce that output. */
export function findConversionTarget(
  workspace: WorkspaceSlug,
  slug: string,
): ConversionTarget | null {
  return listConversionTargets(workspace).find((target) => target.slug === slug) ?? null;
}

/** The workspace's own page — what the hero's tabs link to and where a dropped file is sent. */
const WORKSPACE_PATHS: Record<WorkspaceSlug, `/convert/${WorkspaceSlug}`> = {
  image: "/convert/image",
  audio: "/convert/audio",
  video: "/convert/video",
};

export function workspacePath(workspace: WorkspaceSlug): `/convert/${WorkspaceSlug}` {
  return WORKSPACE_PATHS[workspace];
}

/** Canonical path of an output page, used for its canonical tag and its sitemap entry. */
export function targetPath(target: ConversionTarget): `/${string}` {
  return `/convert/${target.workspace}/${target.slug}`;
}

const WORKSPACE_NOUNS: Record<WorkspaceSlug, { kind: string; subject: string }> = {
  image: { kind: "image", subject: "picture" },
  audio: { kind: "audio", subject: "track" },
  video: { kind: "video", subject: "footage" },
};

/** Title, description and keywords for an output page — unique per route, so no two pages compete. */
export function targetMetadata(target: ConversionTarget): {
  title: string;
  description: string;
  keywords: string[];
} {
  const { kind, subject } = WORKSPACE_NOUNS[target.workspace];
  const { label, token } = target.output;

  return {
    title: `Convert to ${label}`,
    description: `Convert your ${kind} to ${label} free in your browser. Local ${kind} conversion — your ${subject} is processed on your device and never uploaded.`,
    keywords: [
      `convert to ${token}`,
      `free ${token} converter`,
      `${kind} to ${token}`,
      `${token} converter`,
      `${kind} converter`,
    ],
  };
}
