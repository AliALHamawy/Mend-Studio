import { absoluteUrl } from "@/lib/page-metadata";
import { siteConfig } from "@/lib/site-config";

type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

function JsonLdScript({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function RootStructuredData() {
  const siteUrl = absoluteUrl("/");
  const webSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteUrl,
    description: siteConfig.defaultDescription,
    inLanguage: "en-US",
  };

  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteConfig.name,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web Browser",
    url: siteUrl,
    description: siteConfig.defaultDescription,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Client-side image format conversion and compression",
      "Server-side audio conversion via FFmpeg",
      "Server-side video conversion via FFmpeg",
      "Privacy-focused, local-first workflow",
    ],
  };

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteUrl,
  };

  return <JsonLdScript data={[webSite, softwareApplication, organization]} />;
}
