import { WORKSPACE_SLUGS, workspaceFormats, type WorkspaceSlug } from "@/lib/conversion-pairs";

/**
 * Which workspace can convert this file: the MIME family when the browser reports one, and the file
 * extension otherwise — MKV, AVI, FLAC and OGG files arrive with an empty `type` in several browsers,
 * and `conversion-pairs` already lists every accepted extension as a format token.
 */
export function workspaceForFile(file: File): WorkspaceSlug | null {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("audio/")) return "audio";
  if (file.type.startsWith("video/")) return "video";

  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!extension) return null;

  return (
    WORKSPACE_SLUGS.find((workspace) =>
      workspaceFormats(workspace).some((format) => format.token === extension),
    ) ?? null
  );
}

/**
 * A dropped file waiting for the page it was dropped for.
 *
 * Client-side navigation keeps the same JavaScript runtime, so a module-level slot is all this
 * needs — and it is the only workable option: a `File` cannot travel in a URL, and neither
 * sessionStorage nor localStorage can hold one.
 */
let pending: { workspace: WorkspaceSlug; file: File } | null = null;

export function handOffFile(workspace: WorkspaceSlug, file: File) {
  pending = { workspace, file };
}

/**
 * Claims the stashed file when it was meant for this workspace. A file for a different workspace is
 * left in place, so navigating elsewhere first does not lose it.
 */
export function takePendingFile(workspace: WorkspaceSlug): File | null {
  if (pending?.workspace !== workspace) return null;

  const { file } = pending;
  pending = null;
  return file;
}
