"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Plug, BarChart3, Users, Gavel } from "lucide-react";
import { Reveal, staggerItem, StaggerGroup } from "@/components/site/motion-primitives";

const PILLARS = [
  {
    n: "01",
    icon: Plug,
    title: "Connect",
    tone: "text-sage-deep",
    ring: "ring-sage/30",
    desc: "Shopify and GA4, read-only. 24 months of orders and sessions. Nothing on your store changes.",
  },
  {
    n: "02",
    icon: BarChart3,
    title: "Calibrate",
    tone: "text-sage-deep",
    ring: "ring-sage/30",
    desc: "We find the markets with enough demand to be worth testing, and disable the ones too thin to read.",
  },
  {
    n: "03",
    icon: Users,
    title: "Compare",
    tone: "text-amber-warm",
    ring: "ring-amber-warm/30",
    desc: "Your numbers against brands in your category that already entered that country. No names, only patterns.",
  },
  {
    n: "04",
    icon: Gavel,
    title: "Decide",
    tone: "text-amber-warm",
    ring: "ring-amber-warm/30",
    desc: "GO, NOT YET, or NO-GO. Why, and three routes in. A NOT YET is a re-test, not a rejection.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(at_50%_0%,oklch(0.62_0.13_155/0.06)_0px,transparent_60%)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <span className="font-mono text-sm font-semibold uppercase tracking-[0.25em] text-sage-deep">
              How it works
            </span>
          </Reveal>
          <Reveal delay={0.05} className="mt-4">
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-balance">
              Connect. Calibrate. Compare.{" "}
              <span className="text-muted-foreground">Decide.</span>
            </h2>
          </Reveal>
        </div>

        <div className="relative mt-16">
          {/* Connector line */}
          <div className="pointer-events-none absolute left-0 right-0 top-[88px] hidden lg:block">
            <motion.svg
              className="mx-auto h-px w-full"
              viewBox="0 0 1000 4"
              preserveAspectRatio="none"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <motion.line
                x1="0"
                y1="2"
                x2="1000"
                y2="2"
                stroke="url(#grad)"
                strokeWidth="2"
                strokeDasharray="6 6"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
              />
              <defs>
                <linearGradient id="grad" x1="0" x2="1">
                  <stop offset="0%" stopColor="oklch(0.62 0.13 155)" />
                  <stop offset="50%" stopColor="oklch(0.80 0.14 75)" />
                  <stop offset="100%" stopColor="oklch(0.62 0.12 35)" />
                </linearGradient>
              </defs>
            </motion.svg>
          </div>

          <StaggerGroup amount={0.12} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((p) => (
              <motion.div
                key={p.n}
                variants={staggerItem}
                className="group relative flex flex-col rounded-3xl border border-border/60 bg-card/60 p-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-border hover:shadow-[0_24px_60px_-30px_oklch(0.45_0.11_160/0.4)]"
              >
                <div className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-background/70 ring-1 ${p.ring}`}>
                  <p.icon className={`h-6 w-6 ${p.tone}`} />
                  <span className="absolute -right-2 -top-2 rounded-full bg-background px-1.5 py-0.5 font-mono text-xs font-bold text-muted-foreground ring-1 ring-border/60">
                    {p.n}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight text-foreground">
                  {p.title}
                </h3>
                <p className="mt-2 flex-1 text-base leading-relaxed text-muted-foreground text-pretty">
                  {p.desc}
                </p>
              </motion.div>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
}
