import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConversionWorkspace } from "@/components/shared/conversion-workspace";
import { buildPageMetadata } from "@/lib/page-metadata";
import {
  findConversionTarget,
  isWorkspaceSlug,
  listConversionTargets,
  targetMetadata,
  targetPath,
  WORKSPACE_SLUGS,
} from "@/lib/conversion-pairs";

type TargetParams = Promise<{ workspace: string; target: string }>;

/**
 * Every output each workspace can produce, pre-rendered as `/convert/image/to-webp` and friends so a
 * search for the output format lands on a page that names it.
 */
export function generateStaticParams() {
  return WORKSPACE_SLUGS.flatMap((workspace) =>
    listConversionTargets(workspace).map((target) => ({ workspace, target: target.slug })),
  );
}

/** Anything outside that list is a 404 rather than a page generated on request. */
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: TargetParams }): Promise<Metadata> {
  const { workspace, target: slug } = await params;
  if (!isWorkspaceSlug(workspace)) return {};

  const target = findConversionTarget(workspace, slug);
  if (!target) return {};

  return buildPageMetadata({ ...targetMetadata(target), path: targetPath(target) });
}

export default async function ConversionTargetPage({ params }: { params: TargetParams }) {
  const { workspace, target: slug } = await params;
  if (!isWorkspaceSlug(workspace)) notFound();

  const target = findConversionTarget(workspace, slug);
  if (!target) notFound();

  return <ConversionWorkspace workspace={target.workspace} target={target} />;
}
