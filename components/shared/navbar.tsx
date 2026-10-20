import Link from "next/link";
import type { Route } from "next";
import { CircleDotIcon } from "lucide-react";

export function Navbar() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-5 lg:px-10">
        <Link href="/" className="flex items-center gap-2.5 text-lg font-semibold tracking-tight text-zinc-900">
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground"><CircleDotIcon className="size-4" /></span>convert
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-muted-foreground md:flex" aria-label="Converters">
          <Link href={"/convert/image" as Route} className="transition-colors hover:text-foreground">Images</Link>
          <Link href={"/convert/audio" as Route} className="transition-colors hover:text-foreground">Audio</Link>
          <Link href={"/convert/video" as Route} className="transition-colors hover:text-foreground">Video</Link>
        </nav>
        <div className="flex items-center gap-4">
          <p className="hidden text-xs text-zinc-500 sm:block">
            No account. No ads.
          </p>
        </div>
      </div>
    </header>
  );
}
