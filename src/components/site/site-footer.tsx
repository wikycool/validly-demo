"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { ValidlyWordmark } from "./validly-mark";

const INTEGRATIONS = ["Shopify", "Meta", "Google", "TikTok"];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Single row: wordmark, nav, logo strip, copyright */}
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-center">
          <Link href="#top" className="group inline-flex items-center">
            <ValidlyWordmark />
          </Link>

          <nav className="flex items-center gap-5 text-base font-medium text-muted-foreground">
            <Link href="#how" className="transition-colors hover:text-foreground">
              How it works
            </Link>
            <Link href="#verdict" className="transition-colors hover:text-foreground">
              Verdict
            </Link>
            <Link href="#pricing" className="transition-colors hover:text-foreground">
              Pricing
            </Link>
          </nav>

          {/* Logo strip - kept once, here only */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {INTEGRATIONS.map((name) => (
              <div
                key={name}
                className="flex items-center gap-1.5 text-sm font-semibold text-foreground/55 transition-colors hover:text-foreground"
              >
                <Check className="h-3.5 w-3.5 text-sage" />
                {name}
              </div>
            ))}
          </div>

          <p className="font-mono text-sm text-muted-foreground/60">
            © {new Date().getFullYear()} validly
          </p>
        </div>
      </div>
    </footer>
  );
}
