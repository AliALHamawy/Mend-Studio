import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/page-metadata";
import { listConversionTargets, targetPath, WORKSPACE_SLUGS } from "@/lib/conversion-pairs";

const publicRoutes: Array<{
  path: "/" | `/${string}`;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/convert/image", changeFrequency: "weekly", priority: 0.9 },
  { path: "/convert/audio", changeFrequency: "weekly", priority: 0.9 },
  { path: "/convert/video", changeFrequency: "weekly", priority: 0.9 },
  { path: "/privacy", changeFrequency: "monthly", priority: 0.5 },
  { path: "/terms", changeFrequency: "monthly", priority: 0.5 },
];

/** The output pages are the ones most likely to match a "convert to x" search, so they are listed too. */
const outputRoutes: typeof publicRoutes = WORKSPACE_SLUGS.flatMap((workspace) =>
  listConversionTargets(workspace).map((target) => ({
    path: targetPath(target),
    changeFrequency: "weekly",
    priority: 0.7,
  })),
);

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [...publicRoutes, ...outputRoutes].map(({ path, changeFrequency, priority }) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
  }));
}
