import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { RootStructuredData } from "@/components/seo/structured-data";
import { Footer } from "@/components/shared/footer";
import { Navbar } from "@/components/shared/navbar";
import { rootMetadata } from "@/lib/page-metadata";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = rootMetadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#18181b" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="flex min-h-screen flex-col bg-[#fafafa] text-zinc-900">
        <RootStructuredData />
        <Navbar />
        <main className="flex flex-1 flex-col">{children}</main>
        <div className="mx-auto w-full max-w-7xl px-6">
          <Footer />
        </div>
      </body>
    </html>
  );
}
