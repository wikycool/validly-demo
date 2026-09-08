"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { AnimatedBackground } from "@/components/site/animated-background";
import { Magnetic, Reveal } from "@/components/site/motion-primitives";
import { useView } from "@/lib/view-store";

export function FinalCta() {
  const openWorkspace = useView((s) => s.openWorkspace);
  return (
    <section
      id="cta"
      className="relative scroll-mt-24 overflow-hidden py-28 sm:py-36"
    >
      <AnimatedBackground variant="dramatic" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-4 py-2 text-base font-medium text-muted-foreground backdrop-blur-sm">
            <Play className="h-4 w-4 text-sage-deep" />
            The probe, not the pitch
          </div>
        </Reveal>

        <Reveal delay={0.05} className="mt-6">
          <h2 className="font-display text-[clamp(2.4rem,6vw,5rem)] font-semibold leading-[0.98] tracking-[-0.02em] text-balance">
            <span className="block">Stop guessing.</span>
            <span className="bg-gradient-to-br from-sage-deep via-sage to-[oklch(0.55_0.12_60)] bg-clip-text text-transparent">
              Run a probe.
            </span>
          </h2>
        </Reveal>

        <Reveal delay={0.12} className="mt-6 max-w-2xl mx-auto">
          <p className="text-lg leading-relaxed text-muted-foreground text-pretty sm:text-xl">
            Connect Shopify. Validly reads 24 months of demand. You get a
            verdict, the routes in, and a peer set that already made the move.
          </p>
        </Reveal>

        <Reveal delay={0.2} className="mt-10 flex justify-center">
          <Magnetic strength={0.3}>
            <button
              onClick={openWorkspace}
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground shadow-[0_20px_50px_-12px_oklch(0.45_0.11_160/0.55)] transition-all hover:shadow-[0_24px_60px_-12px_oklch(0.45_0.11_160/0.65)]"
            >
              Connect Shopify
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}
