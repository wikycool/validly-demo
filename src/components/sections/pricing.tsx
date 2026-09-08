"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { Reveal, staggerItem, StaggerGroup, Magnetic } from "@/components/site/motion-primitives";
import { useView } from "@/lib/view-store";
import { cn } from "@/lib/utils";

const TIERS = [
  {
    name: "Audit",
    price: "free",
    cadence: "",
    tagline: "Read your demand",
    features: [
      "Shopify + GA4 read-only connection",
      "24-month demand map by country",
      "GO / NOT YET / NO-GO per market",
      "Peer calibration",
      "Three go-to-market routes",
    ],
    note: "Free permanently. You contribute your outcome anonymously, and that is how the peer set grows.",
    cta: "Connect Shopify",
    ctaAction: "workspace" as const,
    featured: false,
  },
  {
    name: "Probe",
    price: "€2,500",
    cadence: "",
    tagline: "When your data is too thin to read",
    features: [
      "Localized creative and landing page",
      "14 days",
      "Measured CAC against the peer band",
    ],
    note: "Your €2,000 test budget runs on your own ad account. We never touch it.",
    cta: "Run a probe",
    ctaAction: "workspace" as const,
    featured: true,
  },
  {
    name: "Plan",
    price: "€990",
    cadence: "/ month",
    tagline: "Continuous",
    features: [
      "Ongoing demand monitoring",
      "Unlimited verdicts",
      "Route playbooks",
      "Probes at €1,900",
    ],
    note: "",
    cta: "Talk to us",
    ctaAction: "anchor" as const,
    featured: false,
  },
];

export function Pricing() {
  const openWorkspace = useView((s) => s.openWorkspace);
  return (
    <section id="pricing" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(at_50%_0%,oklch(0.62_0.13_155/0.06)_0px,transparent_60%)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <span className="font-mono text-sm font-semibold uppercase tracking-[0.25em] text-sage-deep">
              Pricing
            </span>
          </Reveal>
          <Reveal delay={0.05} className="mt-4">
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-balance">
              The audit is free.{" "}
              <span className="text-muted-foreground">
                You pay when you want to move.
              </span>
            </h2>
          </Reveal>
        </div>

        <StaggerGroup amount={0.1} className="mt-14 grid gap-6 lg:grid-cols-3">
          {TIERS.map((tier) => (
            <motion.div
              key={tier.name}
              variants={staggerItem}
              className={cn(
                "relative flex flex-col rounded-3xl border p-7 backdrop-blur-sm transition-all",
                tier.featured
                  ? "border-sage/40 bg-card/90 shadow-[0_30px_80px_-40px_oklch(0.45_0.11_160/0.5)] lg:-translate-y-3"
                  : "border-border/60 bg-card/50 hover:-translate-y-1 hover:border-border",
              )}
            >
              {tier.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-lg">
                    <Sparkles className="h-3 w-3" />
                    Run a probe
                  </span>
                </div>
              )}

              <div>
                <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                  {tier.name}
                </h3>
                <p className="mt-1 text-base text-muted-foreground">{tier.tagline}</p>
              </div>

              <div className="mt-5">
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-4xl font-semibold tracking-tight text-foreground">
                    {tier.price}
                  </span>
                  {tier.cadence && (
                    <span className="text-base text-muted-foreground">{tier.cadence}</span>
                  )}
                </div>
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <span className={cn("mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full", tier.featured ? "bg-sage/20" : "bg-muted")}>
                      <Check className={cn("h-3 w-3", tier.featured ? "text-sage-deep" : "text-muted-foreground")} />
                    </span>
                    <span className="text-base text-foreground/80 text-pretty">{f}</span>
                  </li>
                ))}
              </ul>

              {tier.note && (
                <p className="mt-5 rounded-xl bg-muted/40 p-3 text-base leading-relaxed text-muted-foreground text-pretty">
                  {tier.note}
                </p>
              )}

              <Magnetic strength={0.2} className="mt-7">
                {tier.ctaAction === "anchor" ? (
                  <a
                    href="#cta"
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-border/70 bg-background/50 px-5 py-3 text-base font-semibold text-foreground transition-colors hover:bg-accent/40"
                  >
                    {tier.cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </a>
                ) : (
                  <button
                    onClick={openWorkspace}
                    className={cn(
                      "group inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-base font-semibold transition-all",
                      tier.featured
                        ? "bg-primary text-primary-foreground shadow-[0_12px_30px_-10px_oklch(0.45_0.11_160/0.5)] hover:shadow-[0_16px_36px_-10px_oklch(0.45_0.11_160/0.6)]"
                        : "border border-border/70 bg-background/50 text-foreground hover:bg-accent/40",
                    )}
                  >
                    {tier.cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                )}
              </Magnetic>
            </motion.div>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
