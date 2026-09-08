"use client";

import * as React from "react";
import { AlertCircle, TrendingUp } from "lucide-react";
import { Reveal } from "@/components/site/motion-primitives";

export function VerdictDemo() {
  return (
    <section id="verdict" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(at_80%_30%,oklch(0.80_0.14_75/0.08)_0px,transparent_55%)]" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <span className="font-mono text-sm font-semibold uppercase tracking-[0.25em] text-clay">
              The verdict
            </span>
          </Reveal>
          <Reveal delay={0.05} className="mt-4">
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-balance">
              A compass, not a judge.
            </h2>
          </Reveal>
        </div>

        {/* The verdict card - NOT YET · Germany */}
        <Reveal delay={0.1} className="mx-auto mt-10 max-w-3xl">
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/80 p-7 shadow-[0_30px_80px_-40px_oklch(0.45_0.11_160/0.5)] backdrop-blur-xl sm:p-9">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-warm/25 blur-3xl" />

            <div className="relative flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-warm text-white ring-1 ring-amber-warm/40">
                <AlertCircle className="h-5 w-5" />
              </span>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl font-semibold tracking-tight text-[oklch(0.55_0.12_60)]">
                    NOT YET
                  </span>
                  <span className="font-mono text-base uppercase tracking-wider text-muted-foreground">
                    · Germany
                  </span>
                </div>
                <p className="mt-0.5 text-base font-medium text-foreground/80">
                  Interest is real. The economics are not.
                </p>
              </div>
            </div>

            {/* Five metrics */}
            <div className="relative mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {[
                { label: "Reel views", value: "92,400" },
                { label: "Landing visits", value: "214" },
                { label: "Orders", value: "8" },
                { label: "Implied CAC", value: "€86" },
                { label: "vs home market", value: "1.76×" },
              ].map((m) => (
                <div key={m.label} className="rounded-xl border border-border/50 bg-background/50 p-3">
                  <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{m.label}</p>
                  <p className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground">
                    {m.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Why */}
            <div className="relative mt-6 rounded-xl bg-muted/40 p-4">
              <p className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">Why NOT YET</p>
              <p className="mt-2 text-base leading-relaxed text-foreground/85 text-pretty">
                Heely acquired German customers at €86. The peer median is €68,
                and brands that later scaled landed between €59 and €74. Heely is
                currently outside the viable range.
              </p>
            </div>

            {/* What changes the verdict */}
            <div className="relative mt-3 flex items-start gap-2.5 rounded-xl border border-sage/20 bg-sage-soft/40 p-4">
              <TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-sage-deep" />
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-wider text-sage-deep">What changes the verdict</p>
                <p className="mt-1.5 text-base leading-relaxed text-foreground text-pretty">
                  Bring probe CAC into the €59 to €74 range for two consecutive rounds.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* The only video on the page */}
        <Reveal delay={0.1} className="mx-auto mt-12 flex max-w-[380px] flex-col items-center">
          <video
            src="/reels/de-01.mp4"
            poster="/reels/de-01.jpg"
            controls
            playsInline
            className="aspect-[9/16] w-full rounded-2xl border border-border/60 bg-card/60 object-cover shadow-[0_30px_80px_-40px_oklch(0.45_0.11_160/0.5)]"
          />
        </Reveal>
      </div>
    </section>
  );
}
