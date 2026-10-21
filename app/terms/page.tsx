import type { Metadata } from "next";
import { FileCheck2Icon } from "lucide-react";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms and Conditions",
  description:
    "Terms of use for Mend Studio's secure, private media conversion tools for images, audio, and video.",
  path: "/terms",
  keywords: ["Mend Studio terms", "media converter terms of service"],
});

export default function TermsPage() {
  return (
    <div className="relative isolate flex-1 overflow-x-clip bg-[#fafafa] text-zinc-900">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true"><div className="absolute left-1/2 top-1/4 size-[34rem] -translate-x-1/2 rounded-full bg-gradient-to-tr from-orange-500/15 via-amber-500/10 to-transparent blur-3xl" /><div className="absolute bottom-1/4 right-1/4 size-[26rem] rounded-full bg-gradient-to-br from-rose-400/10 via-orange-200/20 to-transparent blur-3xl" /></div>
      <article className="mx-auto flex max-w-4xl flex-col gap-10 px-5 pb-8 pt-32 sm:px-8 lg:pt-40">
        <header className="border-b border-zinc-200 pb-10">
          <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-orange-700"><FileCheck2Icon className="size-4" aria-hidden="true" /> Clear by design</div>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">Terms that stay out of the way.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-600">These terms keep the Mend Studio workspace useful, safe, and understandable. By using the service, you agree to use it responsibly and within the law.</p>
          <p className="mt-5 text-sm text-zinc-400">Last updated October 21, 2026</p>
        </header>
        <div className="grid gap-8 text-[15px] leading-7 text-zinc-600 sm:grid-cols-[150px_minmax(0,1fr)]">
          <p className="font-semibold text-zinc-900">Using Mend Studio</p>
          <p>You may use the conversion tools for lawful personal or commercial work. You are responsible for the files you select, the rights you have to them, and checking the converted output before using or distributing it.</p>
          <p className="font-semibold text-zinc-900">Your content</p>
          <p>You keep ownership of your media. Mend Studio does not claim ownership of your files. You grant only the limited permission needed to process a file when a conversion uses the local FFmpeg workflow.</p>
          <p className="font-semibold text-zinc-900">Fair use</p>
          <div className="space-y-5"><p>Do not use the service to infringe copyright, distribute malware, abuse infrastructure, or process content that violates applicable law. Do not attempt to disrupt the service or bypass reasonable technical limits.</p><p>We may limit or suspend access when necessary to protect the service, its users, or our infrastructure.</p></div>
          <p className="font-semibold text-zinc-900">Output and availability</p>
          <p>Conversions are provided as a practical tool, not a guarantee of compatibility or fitness for a particular purpose. Media codecs, containers, and third-party players can behave differently. The service may change, pause, or become unavailable as it is maintained.</p>
          <p className="font-semibold text-zinc-900">No warranties</p>
          <p>To the extent permitted by law, Mend Studio is provided without warranties and is not liable for indirect loss, lost data, or downstream issues caused by relying on a conversion. Keep your original files and review important exports.</p>
          <p className="font-semibold text-zinc-900">Updates</p>
          <p>We may update these terms as the product changes. The date above identifies the current version. Continued use after an update means you accept the revised terms.</p>
        </div>
      </article>
    </div>
  );
}
