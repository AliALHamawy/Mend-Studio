import Link from "next/link";
import type { Route } from "next";
import { ArrowRightIcon } from "lucide-react";

export function CallToAction() {
  return (
    <section className="flex flex-col gap-5 border-y border-border py-12 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Start with the file in front of you.</h2>
        <p className="text-sm text-muted-foreground">No account, no queue, no advertising between you and the result.</p>
      </div>
      <Link href={"/convert/image" as Route} className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">Convert an image <ArrowRightIcon aria-hidden="true" className="size-4" /></Link>
    </section>
  );
}
