import type { Metadata } from "next";
import { getSiteUrl, siteConfig, type PageMetaInput } from "@/lib/site-config";

/**
 * Social preview image (public/share-logo.jpg) shared by every route.
 * Relative URL is resolved against `metadataBase` into an absolute URL.
 */
const shareImage = {
  url: "/share-logo.jpg",
  width: 1024,
  height: 1024,
  alt: "Mend Studio Preview",
};

export function absoluteUrl(path: PageMetaInput["path"]): string {
  const base = getSiteUrl();
  if (path === "/") return `${base}/`;
  return `${base}${path}`;
}

/** Shared Open Graph + Twitter fields for public marketing pages. */
export function buildPageMetadata({
  title,
  description,
  path,
  keywords,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const keywordList = keywords ?? [...siteConfig.defaultKeywords];

  return {
    title,
    description,
    keywords: keywordList,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url,
      siteName: siteConfig.name,
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [shareImage],
    },
    twitter: {
      card: siteConfig.twitterCard,
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [shareImage.url],
    },
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: siteConfig.defaultTitle,
    template: siteConfig.titleTemplate,
  },
  description: siteConfig.defaultDescription,
  keywords: [...siteConfig.defaultKeywords],
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  icons: {
    icon: "/top-logo.png",
    shortcut: "/top-logo.png",
    apple: "/top-logo.png",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: "/",
    siteName: siteConfig.name,
    title: siteConfig.defaultTitle,
    description: siteConfig.defaultDescription,
    images: [shareImage],
  },
  twitter: {
    card: siteConfig.twitterCard,
    title: siteConfig.defaultTitle,
    description: siteConfig.defaultDescription,
    images: [shareImage.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
