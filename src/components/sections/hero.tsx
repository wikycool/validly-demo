"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { AnimatedBackground } from "@/components/site/animated-background";
import {
  Magnetic,
  useMousePosition,
  Reveal,
} from "@/components/site/motion-primitives";
import { cn } from "@/lib/utils";
import { useView } from "@/lib/view-store";

/* Floating verdict orb */
function VerdictOrb({
  label,
  sub,
  tone,
  className,
  parallax,
  delay,
}: {
  label: string;
  sub: string;
  tone: "go" | "notyet" | "nogo";
  className?: string;
  parallax: { x: number; y: number };
  delay: number;
}) {
  const tones = {
    go: {
      ring: "ring-[oklch(0.62_0.13_155/0.4)]",
      glow: "bg-[oklch(0.62_0.13_155/0.25)]",
      dot: "bg-sage",
      text: "text-sage-deep",
    },
    notyet: {
      ring: "ring-[oklch(0.80_0.14_75/0.45)]",
      glow: "bg-[oklch(0.80_0.14_75/0.22)]",
      dot: "bg-amber-warm",
      text: "text-[oklch(0.55_0.12_60)]",
    },
    nogo: {
      ring: "ring-[oklch(0.62_0.12_35/0.4)]",
      glow: "bg-[oklch(0.62_0.12_35/0.2)]",
      dot: "bg-clay",
      text: "text-clay",
    },
  }[tone];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn("absolute z-20", className)}
      style={{
        transform: `translate(${parallax.x * 18}px, ${parallax.y * 18}px)`,
      }}
    >
      <div className="animate-float-soft">
        <div
          className={cn(
            "relative rounded-2xl border border-border/60 bg-card/85 px-4 py-3 shadow-[0_20px_60px_-20px_oklch(0.45_0.11_160/0.35)] backdrop-blur-xl ring-1",
            tones.ring,
          )}
        >
          <div
            className={cn(
              "absolute -inset-px -z-10 rounded-2xl blur-xl",
              tones.glow,
            )}
          />
          <div className="flex items-center gap-2.5">
            <span className={cn("h-2.5 w-2.5 rounded-full", tones.dot)} />
            <span
              className={cn(
                "font-mono text-xs font-bold uppercase tracking-[0.2em]",
                tones.text,
              )}
            >
              {label}
            </span>
          </div>
          <p className="mt-1 text-base font-medium text-muted-foreground">
            {sub}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function Hero() {
  const mouse = useMousePosition();
  const openWorkspace = useView((s) => s.openWorkspace);
  const parallaxGo = { x: mouse.x * -1, y: mouse.y * -1 };
  const parallaxNotYet = { x: mouse.x, y: mouse.y };
  const parallaxNoGo = { x: mouse.x * 0.6, y: mouse.y * 0.6 };

  return (
    <section
      id="top"
      className="relative min-h-[100svh] w-full overflow-hidden pt-28 sm:pt-32"
    >
      <AnimatedBackground variant="hero" />

      {/* Floating verdict orbs (desktop) */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        <VerdictOrb
          label="GO"
          sub="Netherlands · strong signal"
          tone="go"
          parallax={parallaxGo}
          delay={0.8}
          className="left-[6%] top-[34%]"
        />
        <VerdictOrb
          label="NOT YET"
          sub="Germany · 3.7% conversion"
          tone="notyet"
          parallax={parallaxNotYet}
          delay={1.0}
          className="right-[7%] top-[28%]"
        />
        <VerdictOrb
          label="NO-GO"
          sub="park the market"
          tone="nogo"
          parallax={parallaxNoGo}
          delay={1.2}
          className="right-[18%] bottom-[14%]"
        />
      </div>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-4 pb-24 text-center sm:px-6 lg:px-8">
        {/* Eyebrow */}
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-4 py-2 text-base font-medium text-muted-foreground backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-amber-warm" />
            For Shopify brands expanding internationally
          </div>
        </Reveal>

        {/* Headline */}
        <Reveal delay={0.08} className="mt-8">
          <h1 className="font-display text-[clamp(2.6rem,7vw,5.5rem)] font-semibold leading-[0.98] tracking-[-0.02em] text-balance">
            <span className="block text-foreground">
              Which country should your
            </span>
            <span className="relative inline-block">
              <span className="bg-gradient-to-br from-sage-deep via-sage to-[oklch(0.55_0.12_60)] bg-clip-text text-transparent">
                brand enter next?
              </span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.7, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -bottom-1 left-0 h-1 w-full origin-left rounded-full bg-gradient-to-r from-sage via-amber-warm to-clay"
              />
            </span>
          </h1>
        </Reveal>

        {/* Subhead */}
        <Reveal delay={0.16} className="mt-7 max-w-3xl">
          <p className="text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Validly reads your store data, compares it with brands that already
            entered each market, and returns a verdict plus a specific entry plan.
          </p>
        </Reveal>

        {/* CTAs - primary "See a verdict" (anchor), secondary "Connect Shopify" (opens workspace) */}
        <Reveal delay={0.28} className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <Magnetic strength={0.3}>
            <Link
              href="#verdict"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-lg font-semibold text-primary-foreground shadow-[0_16px_40px_-12px_oklch(0.45_0.11_160/0.55)] transition-all hover:shadow-[0_20px_50px_-12px_oklch(0.45_0.11_160/0.65)]"
            >
              See a verdict
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Magnetic>
          <Magnetic strength={0.2}>
            <button
              onClick={openWorkspace}
              className="group inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/50 px-7 py-3.5 text-lg font-semibold text-foreground backdrop-blur-sm transition-colors hover:bg-accent/40"
            >
              Connect Shopify
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </Magnetic>
        </Reveal>

        {/* Core insight */}
        <Reveal delay={0.38} className="mt-14 max-w-2xl">
          <p className="text-pretty text-base leading-relaxed text-muted-foreground/80 sm:text-lg">
            Your data shows the spark. Peer outcomes show whether to act.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
