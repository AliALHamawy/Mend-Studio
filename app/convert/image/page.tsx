import { ConversionWorkspace } from "@/components/shared/conversion-workspace";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/page-metadata";

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: "Image Converter",
    description:
      "Convert JPG, PNG, WebP, and AVIF privately in your browser. Secure local image converter with smart compression—files stay on your device.",
    path: "/convert/image",
    keywords: [
      "image converter",
      "convert JPG PNG WebP AVIF",
      "browser image conversion",
      "private image converter",
      "local image compression",
    ],
  });
}

export default function ImageConvertPage() {
  return <ConversionWorkspace workspace="image" />;
}
