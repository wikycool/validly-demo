"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Magnetic } from "./motion-primitives";
import { ValidlyMark, ValidlyWordmark } from "./validly-mark";
import { useView } from "@/lib/view-store";

const NAV_LINKS = [
  { label: "How it works", href: "#how" },
  { label: "Verdict", href: "#verdict" },
  { label: "Pricing", href: "#pricing" },
];

/** Marketing nav - appears on the marketing view */
export function SiteNav() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-500 sm:px-6 lg:px-8",
          scrolled
            ? "my-2 rounded-2xl border border-border/60 bg-background/80 py-2.5 shadow-[0_8px_40px_-12px_oklch(0.45_0.11_160/0.18)] backdrop-blur-xl lg:my-3"
            : "my-3 py-3 lg:my-4",
        )}
      >
        {/* Logo */}
        <Link href="#top" className="group flex items-center">
          <ValidlyWordmark />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="relative rounded-full px-3.5 py-2 text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CTA - single primary button */}
        <div className="hidden md:flex">
          <Magnetic strength={0.4}>
            <Link
              href="#verdict"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-base font-semibold text-primary-foreground shadow-[0_8px_24px_-8px_oklch(0.45_0.11_160/0.5)] transition-all hover:shadow-[0_12px_32px_-8px_oklch(0.45_0.11_160/0.6)]"
            >
              See a verdict
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </Magnetic>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/60 text-foreground md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mx-3 overflow-hidden rounded-2xl border border-border/60 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <nav className="flex flex-col p-2">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-lg font-medium text-foreground/80 transition-colors hover:bg-accent/50 hover:text-foreground"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="#verdict"
                onClick={() => setOpen(false)}
                className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-lg font-semibold text-primary-foreground"
              >
                See a verdict
                <ArrowRight className="h-4 w-4" />
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/** Workspace header - appears on the workspace view. Brand-aware. */
export function WorkspaceNav() {
  const backToMarketing = useView((s) => s.backToMarketing);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={backToMarketing}
            className="group flex items-center gap-2 text-foreground transition-opacity hover:opacity-70"
            aria-label="Back to site"
          >
            <ValidlyMark className="h-6 w-6 text-sage-deep" />
            <span className="font-display text-lg font-semibold tracking-[-0.02em]">
              validly
            </span>
          </button>
          <span className="hidden h-5 w-px bg-border sm:block" />
          <div className="hidden items-center gap-2 sm:flex">
            <span className="font-display text-base font-semibold text-foreground">
              Heely
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
