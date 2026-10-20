import Link from "next/link";
import type { Route } from "next";
import { ArrowLeftIcon } from "lucide-react";

type AppRoute = "/" | "/convert/image" | "/convert/audio" | "/convert/video";

export function PageHeader({ eyebrow, title, description, backHref = "/" }: { eyebrow: string; title: string; description: string; backHref?: AppRoute }) {
  return (
    <div className="flex flex-col gap-6 border-b border-zinc-200 pb-10">
      <Link href={backHref as Route} className="flex w-fit items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-900">
        <ArrowLeftIcon className="size-4" aria-hidden="true" /> Back to convert
      </Link>
      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium text-primary">{eyebrow}</p>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-5xl">{title}</h1>
        <p className="max-w-xl text-base leading-7 text-zinc-600">{description}</p>
      </div>
    </div>
  );
}
