"use client";

import Link from "next/link";
import type { Route } from "next";
import { MenuIcon, ShieldCheckIcon, XIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navigation = [
  { href: "/convert/image" as Route, label: "Images", note: "Resize, compress, and reframe" },
  { href: "/convert/audio" as Route, label: "Audio", note: "Find the right container" },
  { href: "/convert/video" as Route, label: "Video", note: "Make footage playable" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    if (!isMenuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="before:absolute before:inset-0 before:-z-10 before:rounded-full before:bg-gradient-to-r before:from-orange-500/10 before:to-transparent before:blur-xl fixed left-1/2 top-6 z-50 flex w-[92%] max-w-4xl -translate-x-1/2 items-center justify-between rounded-full border border-white/90 bg-white/50 px-5 py-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.08),_0_10px_20px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,1),_inset_0_-2px_4px_rgba(0,0,0,0.03)] ring-1 ring-inset ring-white/80 backdrop-blur-3xl transition-all duration-300 hover:bg-white/60 sm:px-8">
      <div className="pointer-events-none absolute inset-x-8 top-px h-px bg-gradient-to-r from-transparent via-white to-transparent" aria-hidden="true" />
      <Link href={"/" as Route} className="relative flex shrink-0 items-center gap-2.5 text-base font-semibold tracking-tight text-zinc-900">
        <img src="/top-logo.png" alt="" width={40} height={40} className="size-12 shrink-0" aria-hidden="true" />
        <span>Mend Studio</span>
      </Link>
      <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 text-sm text-zinc-500 md:flex" aria-label="Converters">
        {navigation.map((item) => (
          <Link key={item.href} href={item.href} aria-current={isActive(item.href) ? "page" : undefined} className={`rounded-full px-4 py-2 transition-colors ${isActive(item.href) ? "bg-white/60 text-zinc-900" : "hover:bg-white/60 hover:text-zinc-900"}`}>{item.label}</Link>
        ))}
      </nav>
      <div className="relative flex shrink-0 items-center gap-2 text-xs font-medium text-zinc-500">
        <ShieldCheckIcon className="size-4 text-emerald-600" aria-hidden="true" />
        <span className="hidden sm:inline">Local-first &amp; Private</span>
        <button type="button" className="grid size-9 place-items-center rounded-full bg-white/70 text-zinc-700 transition-colors hover:bg-white md:hidden" aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={isMenuOpen} aria-controls="mobile-navigation" onClick={() => setIsMenuOpen((open) => !open)}>
          {isMenuOpen ? <XIcon className="size-4" aria-hidden="true" /> : <MenuIcon className="size-4" aria-hidden="true" />}
        </button>
      </div>
      </header>
      {isMenuOpen && (
        <>
          <button type="button" className="fixed inset-0 z-40 bg-zinc-950/15 backdrop-blur-sm motion-safe:animate-fade-in md:hidden" aria-label="Close navigation menu" onClick={() => setIsMenuOpen(false)} />
          <aside id="mobile-navigation" role="dialog" aria-modal="true" aria-label="Mobile navigation" className="fixed inset-x-3 top-24 z-50 flex max-h-[calc(100vh-7rem)] flex-col overflow-y-auto rounded-[2rem] border border-white/90 bg-white/75 p-5 shadow-[0_28px_80px_rgba(0,0,0,0.16),inset_0_1px_2px_rgba(255,255,255,1)] ring-1 ring-inset ring-white/80 backdrop-blur-3xl motion-safe:animate-menu-in md:hidden">
            <div className="mb-3 flex items-center justify-between px-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
              <span>Conversion bench</span>
              <span className="text-emerald-600">Private by default</span>
            </div>
            <nav className="flex flex-col gap-2" aria-label="Mobile converters">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)} aria-current={isActive(item.href) ? "page" : undefined} className={`group rounded-2xl border px-4 py-4 transition-colors ${isActive(item.href) ? "border-zinc-900/10 bg-white/90" : "border-white/80 bg-white/55 hover:bg-white/90"}`}>
                  <span className="flex items-center justify-between text-lg font-semibold tracking-tight text-zinc-900">{item.label}<span className="text-zinc-300 transition-transform group-hover:translate-x-1">→</span></span>
                  <span className="mt-1 block text-sm text-zinc-500">{item.note}</span>
                </Link>
              ))}
            </nav>
            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-zinc-200/70 pt-4 text-sm font-medium">
              <Link href={"/privacy" as Route} onClick={() => setIsMenuOpen(false)} className="rounded-xl px-3 py-2 text-zinc-600 hover:bg-white/70 hover:text-zinc-900">Privacy policy</Link>
              <Link href={"/terms" as Route} onClick={() => setIsMenuOpen(false)} className="rounded-xl px-3 py-2 text-zinc-600 hover:bg-white/70 hover:text-zinc-900">Terms</Link>
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-2xl bg-emerald-500/10 px-4 py-3 text-xs leading-5 text-emerald-800"><ShieldCheckIcon className="size-4 shrink-0 text-emerald-600" /> Your files stay in your browser whenever possible.</div>
          </aside>
        </>
      )}
    </>
  );
}
