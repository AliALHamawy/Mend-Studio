import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/page-metadata";
import { siteConfig } from "@/lib/site-config";

const ImmersiveHome = dynamic(
  () => import("@/components/home/immersive-home").then((module) => module.ImmersiveHome),
  {
    loading: () => (
      <div
        className="mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-5xl flex-col items-center justify-center gap-4 px-6"
        aria-busy="true"
        aria-label="Loading Mend Studio"
      >
        <div className="h-10 w-48 animate-pulse motion-reduce:animate-none rounded-full bg-white/60 ring-1 ring-inset ring-white/80" />
        <div className="h-16 w-full max-w-3xl animate-pulse motion-reduce:animate-none rounded-3xl bg-white/50 ring-1 ring-inset ring-white/80" />
        <div className="h-56 w-full max-w-3xl animate-pulse motion-reduce:animate-none rounded-3xl bg-white/45 ring-1 ring-inset ring-white/80" />
      </div>
    ),
  },
);

const homeMetadata = buildPageMetadata({
  title: "Secure Local Media Converter",
  description: siteConfig.defaultDescription,
  path: "/",
  keywords: [
    "secure local media converter",
    "convert video audio image privately",
    "private media conversion online",
    "Mend Studio",
    "local-first converter",
  ],
});

export const metadata: Metadata = {
  ...homeMetadata,
  title: { absolute: siteConfig.defaultTitle },
  openGraph: {
    ...homeMetadata.openGraph,
    title: siteConfig.defaultTitle,
    description: siteConfig.defaultDescription,
  },
  twitter: {
    ...homeMetadata.twitter,
    title: siteConfig.defaultTitle,
    description: siteConfig.defaultDescription,
  },
};

export default function Home() {
  return (
    <div className="relative isolate flex-1 overflow-x-clip bg-[#fafafa] text-zinc-900">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/2 top-1/4 h-[350px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-[#f59e0b]/45 via-orange-300/30 to-zinc-200/40 blur-3xl opacity-80" />
        <div className="absolute left-1/3 top-2/3 h-[300px] w-[500px] rounded-full bg-gradient-to-br from-zinc-200/50 via-amber-300/35 to-transparent blur-3xl opacity-80" />
      </div>
      <div className="relative z-10 overflow-visible">
        <ImmersiveHome />
      </div>
    </div>
  );
}
