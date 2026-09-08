"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Check,
  AlertCircle,
  ArrowLeft,
  Lock,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  HEELY,
  DEMAND,
  PROBE,
  PROBE_DESIGN,
  PEER_FILTERS,
  type CountryCode,
  type ProbeResult,
} from "@/lib/workspace-data";

type Step = "connect" | "signals" | "probe" | "results" | "peerset" | "verdict";

const STEP_LABELS: { id: Step; label: string }[] = [
  { id: "connect", label: "Connect" },
  { id: "signals", label: "Signals" },
  { id: "probe", label: "Probe" },
  { id: "results", label: "Results" },
  { id: "peerset", label: "Peer set" },
  { id: "verdict", label: "Verdict" },
];

export function Workspace() {
  const [step, setStep] = React.useState<Step>("connect");
  const [maxStep, setMaxStep] = React.useState<Step>("connect");

  const goTo = (s: Step) => {
    setStep(s);
    const idx = STEP_LABELS.findIndex((x) => x.id === s);
    const cur = STEP_LABELS.findIndex((x) => x.id === maxStep);
    if (idx > cur) setMaxStep(s);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" });
  };

  const canGoTo = (s: Step) => {
    const idx = STEP_LABELS.findIndex((x) => x.id === s);
    const max = STEP_LABELS.findIndex((x) => x.id === maxStep);
    return idx <= max;
  };

  return (
    <div className="flex flex-1 flex-col bg-background">
      {/* Stepper — compact, projector-readable, active stage obvious */}
      <div className="sticky top-14 z-30 border-b border-border/60 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-1 px-4 py-2.5 sm:px-6">
          {STEP_LABELS.map((s, i) => {
            const active = step === s.id;
            const done = canGoTo(s.id) && step !== s.id;
            const locked = !canGoTo(s.id);
            return (
              <React.Fragment key={s.id}>
                <button
                  onClick={() => canGoTo(s.id) && goTo(s.id)}
                  disabled={locked}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-base font-medium transition-colors",
                    active && "bg-foreground text-background",
                    !active && done && "text-foreground/80 hover:text-foreground",
                    !active && locked && "cursor-not-allowed text-muted-foreground/60",
                  )}
                >
                  <span className={cn("font-mono text-xs", active ? "text-background/70" : "text-muted-foreground/70")}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.label}
                </button>
                {i < STEP_LABELS.length - 1 && <span className="h-px w-2 shrink-0 bg-border sm:w-4" />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-3 sm:px-6 sm:py-4">
        <AnimatePresence mode="wait">
          {step === "connect" && <ConnectStep key="connect" onNext={() => goTo("signals")} />}
          {step === "signals" && <SignalsStep key="signals" onPick={() => goTo("probe")} />}
          {step === "probe" && <ProbeStep key="probe" onRun={() => goTo("results")} />}
          {step === "results" && <ResultsStep key="results" onNext={() => goTo("peerset")} />}
          {step === "peerset" && <PeerSetStep key="peerset" onNext={() => goTo("verdict")} onBack={() => goTo("results")} />}
          {step === "verdict" && <VerdictStep key="verdict" onPrimary={() => goTo("probe")} onSecondary={() => goTo("peerset")} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------------- 01 Connect ---------------- */
function ConnectStep({ onNext }: { onNext: () => void }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-xl"
    >
      <Eyebrow n="01" label="Connect" tone="sage" />
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Connecting {HEELY.name}
      </h1>
      <p className="mt-2 text-lg text-muted-foreground text-pretty">
        Shopify and GA4, read-only. 24 months of orders and sessions. Nothing on
        your store changes.
      </p>

      <div className="mt-8 space-y-3">
        <ConnectRow name="Shopify" sub="orders · products · customers" done="24 months of orders" />
        <ConnectRow name="GA4" sub="sessions · sources · landing pages" done="24 months of sessions" />
      </div>

      <PrimaryButton className="mt-8" onClick={onNext}>
        Continue to signals
        <ArrowRight className="h-5 w-5" />
      </PrimaryButton>
    </motion.section>
  );
}

function ConnectRow({ name, sub, done }: { name: string; sub: string; done: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-sage/40 bg-sage-soft/30 p-4">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sage text-base font-bold text-white">
          {name === "Shopify" ? "S" : "G"}
        </span>
        <div>
          <p className="font-semibold text-foreground">{name}</p>
          <p className="font-mono text-sm text-muted-foreground">{sub}</p>
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <span className="hidden font-mono text-sm text-sage-deep sm:inline">{done}</span>
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sage text-white">
          <Check className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );
}

/* ---------------- 02 Signals ---------------- */
function SignalsStep({ onPick }: { onPick: () => void }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
    >
      <Eyebrow n="02" label="Signals" tone="sage" />
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Where does demand already exist?
      </h1>
      <p className="mt-2 max-w-2xl text-lg text-muted-foreground text-pretty">
        Validly reads 24 months of Shopify demand and separates strong
        opportunities from markets that need a controlled probe.
      </p>

      <div className="mt-4 overflow-hidden rounded-2xl border border-border/60 bg-card/60">
        <div className="overflow-x-auto">
          <table className="w-full text-base">
            <thead className="border-b border-border/60 bg-muted/30">
              <tr className="text-left font-mono text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3 font-semibold">Country</th>
                <th className="px-4 py-3 text-right font-semibold">Sessions · 24mo</th>
                <th className="px-4 py-3 text-right font-semibold">Orders</th>
                <th className="px-4 py-3 text-right font-semibold">Conversion vs Denmark</th>
                <th className="px-4 py-3 font-semibold">Reading</th>
                <th className="px-4 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {DEMAND.map((row) => (
                <tr
                  key={row.code}
                  className={cn(
                    "border-b border-border/40 last:border-0 transition-colors",
                    row.disabled && "opacity-70",
                    row.status === "recommended" && "bg-sage/10",
                    row.status === "ambiguous" && "bg-amber-warm/10",
                  )}
                >
                  <td className="px-4 py-3.5">
                    <span className="flex items-center gap-2.5">
                      <span className="text-lg">{row.flag}</span>
                      <span className="font-semibold text-foreground">{row.country}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-foreground/80">
                    {row.sessions.toLocaleString("en-US")}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-foreground/80">{row.orders}</td>
                  <td className="px-4 py-3.5 text-right font-mono text-foreground/80">{row.index}</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={cn(
                        "inline-block rounded-full px-2.5 py-1 text-sm font-medium",
                        row.status === "recommended" && "bg-sage/20 text-sage-deep",
                        row.status === "ambiguous" && "bg-amber-warm/20 text-[oklch(0.55_0.12_60)]",
                        row.status === "thin" && "bg-muted text-muted-foreground",
                        row.status === "weak" && "bg-clay/15 text-clay",
                      )}
                    >
                      {row.note}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    {row.code === "DE" ? (
                      <button
                        onClick={onPick}
                        className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-sm font-semibold text-background transition-transform hover:scale-105"
                      >
                        Test Germany
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    ) : row.status === "recommended" ? (
                      <span className="font-mono text-sm font-medium text-sage-deep">
                        Recommended next
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-mono text-sm text-muted-foreground/60">
                        <Lock className="h-3.5 w-3.5" />
                        Locked
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-3 font-mono text-sm text-muted-foreground/70">
        Netherlands is the strongest opportunity. Germany has more traffic but
        weaker purchase intent—a controlled probe will show whether the problem
        is demand, localization or the offer.
      </p>
    </motion.section>
  );
}

/* ---------------- 03 Probe ---------------- */
function ProbeStep({ onRun }: { onRun: () => void }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
    >
      <Eyebrow n="03" label="Probe" tone="amber" />
      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Germany · 14-day market probe
      </h1>
      <p className="mt-2 max-w-3xl text-base text-muted-foreground text-pretty">
        The selected creative sends German customers to a localized Heely product
        page. Orders—not views—determine the verdict.
      </p>

      {/* Three summary cards */}
      <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
        {PROBE_DESIGN.map((d) => (
          <div key={d.label} className="rounded-lg border border-border/60 bg-card/50 p-3">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{d.label}</p>
            <p className="mt-0.5 text-sm font-medium text-foreground">{d.value}</p>
          </div>
        ))}
      </div>

      {/* Unified "Probe customer journey" section */}
      <div className="mt-3 rounded-2xl border border-border/60 bg-card/40 p-4">
        <p className="font-mono text-sm font-semibold uppercase tracking-wider text-foreground/80">
          Probe customer journey
        </p>

        {/* Two-column: 38 / 62, tops aligned, max 1100px, gap 32px */}
        <div className="mt-3 grid gap-8 lg:grid-cols-[38fr_62fr] lg:items-start">
          {/* LEFT — Traffic creative */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between gap-2">
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">1 · Traffic creative</p>
              <span className="inline-flex items-center gap-1 rounded-full bg-sage/15 px-2.5 py-0.5 text-xs font-semibold text-sage-deep">
                <Check className="h-3 w-3" />
                Selected for probe
              </span>
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">2 concepts evaluated · DE-01 selected</p>

            <video
              src="/reels/de-01.mp4"
              poster="/reels/de-01.jpg"
              controls
              playsInline
              preload="metadata"
              className="mt-2 aspect-[9/16] w-full max-w-[280px] rounded-xl border border-border/60 bg-card/60 object-cover shadow-[0_20px_50px_-25px_oklch(0.45_0.11_160/0.5)]"
            />
            <p className="mt-2 font-mono text-sm uppercase tracking-wider text-muted-foreground/70">
              DE-01 · Problem-led · 15 seconds
            </p>
          </div>

          {/* RIGHT — What German customers see (browser-style, top aligned) */}
          <div className="flex flex-col">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">2 · What German customers see</p>

            {/* Browser-style preview */}
            <div className="mt-2.5 overflow-hidden rounded-xl border border-border/60 bg-card/60 shadow-[0_20px_50px_-30px_oklch(0.45_0.11_160/0.5)]">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 border-b border-border/60 bg-muted/40 px-3 py-1.5">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.80_0.14_75/0.5)]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.62_0.13_155/0.5)]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.62_0.12_35/0.5)]" />
                </div>
                <div className="flex-1 rounded-md bg-background/70 px-3 py-1 text-center font-mono text-xs text-muted-foreground/70">
                  heely.com/de
                </div>
              </div>
              {/* Page content */}
              <div className="px-6 py-4 text-center sm:px-8">
                <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{HEELY.name}</p>
                <h2 className="mt-1.5 font-display text-xl font-semibold tracking-tight text-foreground">
                  {HEELY.product}
                </h2>
                <p className="mt-1 text-base font-semibold text-foreground">{HEELY.price}</p>
                <p className="mt-2 font-display text-base leading-snug text-foreground/90">
                  {HEELY.headline}
                </p>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background"
                >
                  Buy the All-Day Heel · €189
                </button>
              </div>
            </div>

            <p className="mt-2 font-mono text-sm text-muted-foreground/70">
              Every completed order is attributed back to DE-01.
            </p>
          </div>
        </div>

        {/* Bottom action row — spans full width */}
        <div className="mt-3 flex flex-col items-stretch justify-between gap-3 border-t border-border/60 pt-3 sm:flex-row sm:items-center">
          <p className="font-mono text-sm text-muted-foreground">
            €2,000 media cap · Heely&apos;s own ad account · 14 days
          </p>
          <PrimaryButton onClick={onRun}>
            Start 14-day probe
            <ArrowRight className="h-5 w-5" />
          </PrimaryButton>
        </div>
      </div>
    </motion.section>
  );
}

/* ---------------- 04 Results ---------------- */
function ResultsStep({ onNext }: { onNext: () => void }) {
  const p = PROBE;
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
    >
      <Eyebrow n="04" label="Results" tone="clay" />
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Germany · day 14 of 14
      </h1>
      <p className="mt-2 max-w-2xl text-lg text-muted-foreground text-pretty">
        The probe reached the time limit before the €2,000 media cap.
      </p>

      {/* Status strip */}
      <div className="mt-5 flex flex-wrap items-center gap-2 rounded-xl border border-border/60 bg-card/50 px-4 py-2.5 font-mono text-sm font-medium text-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Check className="h-4 w-4 text-sage-deep" />
          14 days complete
        </span>
        <span className="text-muted-foreground/40">·</span>
        <span>{p.actualSpend} of {p.budgetCap} cap</span>
        <span className="text-muted-foreground/40">·</span>
        <span>{p.orders} orders</span>
      </div>

      {/* Diagnostics — quiet */}
      <div className="mt-6">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground/60">Diagnostics</p>
        <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <QuietMetric label="Views" value={p.reelViews.toLocaleString("en-US")} />
          <QuietMetric label="Engaged" value={p.engaged.toLocaleString("en-US")} />
          <QuietMetric label="Product-page visits" value={String(p.pageVisits)} />
          <QuietMetric label="Add to carts" value={String(p.addToCarts)} />
        </div>
      </div>

      {/* Decision metrics — dominant */}
      <div className="mt-6">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground/60">Decision metrics</p>
        <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <BigMetric label="Orders" value={String(p.orders)} tone="sage" />
          <BigMetric label="Probe CAC" value={p.probeCac} tone="sage" />
          <SmallMetric label="Home CAC baseline" value={p.homeCac} />
          <SmallMetric label="Difference" value={p.cacVsHome + " home"} />
        </div>
      </div>

      {/* Stop rule */}
      <div className="mt-5 flex items-center justify-between rounded-xl border border-border/60 bg-card/50 px-4 py-2.5">
        <span className="font-mono text-sm text-muted-foreground">Stop rule reached</span>
        <span className="font-mono text-sm font-semibold text-foreground">14 days</span>
      </div>

      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground text-pretty">
        The reel generated attention and real orders. The question is whether €86
        is normal for a Nordic footwear brand entering Germany.
      </p>

      <PrimaryButton className="mt-6" onClick={onNext}>
        Compare with peers
        <ArrowRight className="h-5 w-5" />
      </PrimaryButton>
    </motion.section>
  );
}

function QuietMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/40 bg-background/30 p-3">
      <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground/60">{label}</p>
      <p className="mt-1 font-display text-xl font-semibold tabular-nums tracking-tight text-muted-foreground">
        {value}
      </p>
    </div>
  );
}

function BigMetric({ label, value, tone }: { label: string; value: string; tone: "sage" }) {
  return (
    <div className={cn("rounded-xl border p-4", tone === "sage" && "border-sage/40 bg-sage-soft/40")}>
      <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={cn("mt-1 font-display text-4xl font-semibold tabular-nums tracking-tight", tone === "sage" && "text-sage-deep")}>
        {value}
      </p>
    </div>
  );
}

function SmallMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/40 bg-background/30 p-3">
      <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground/60">{label}</p>
      <p className="mt-1 font-display text-xl font-semibold tabular-nums tracking-tight text-foreground/80">{value}</p>
    </div>
  );
}

/* ---------------- 05 Peer set ---------------- */
function PeerSetStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const p = PROBE;
  const peers = p.peers;
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
    >
      <Eyebrow n="05" label="Peer set" tone="sage" />
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Is €86 a Germany problem—or a Heely problem?
      </h1>
      <p className="mt-2 max-w-2xl text-lg text-muted-foreground text-pretty">
        Six comparable brands already entered Germany. Names are hidden; patterns
        remain.
      </p>

      {/* Equation — no animation */}
      <p className="mt-4 font-mono text-base text-muted-foreground">
        6 comparable peers + Heely = <span className="font-semibold text-foreground">7 anonymous probe outcomes</span>
      </p>

      {/* Filters */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        {PEER_FILTERS.map((f) => (
          <span key={f} className="rounded-full bg-accent/50 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-accent-foreground">
            {f}
          </span>
        ))}
      </div>

      {/* Comparison cards */}
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {/* Primary — probe CAC */}
        <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Probe CAC</p>
          <div className="mt-3 flex items-end gap-3">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">You</p>
              <p className="font-display text-3xl font-semibold tabular-nums tracking-tight text-clay">€86</p>
            </div>
            <span className="pb-1 font-mono text-xs text-muted-foreground/50">vs</span>
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Peer median</p>
              <p className="font-display text-2xl font-semibold tabular-nums tracking-tight text-muted-foreground">€68</p>
            </div>
          </div>

          {/* Shaded band visual — Heely marker visibly outside */}
          <div className="mt-5">
            <div className="relative h-3 rounded-full bg-muted">
              <div className="absolute h-full rounded-full bg-sage/25" style={{ left: "28%", right: "32%" }} />
              <div className="absolute top-1/2 h-5 w-1.5 -translate-y-1/2 rounded-full bg-clay" style={{ left: "82%" }} />
            </div>
            <div className="mt-1.5 flex justify-between font-mono text-xs text-muted-foreground/70">
              <span>€59</span>
              <span>€74</span>
            </div>
            <p className="mt-1.5 font-mono text-xs text-muted-foreground/70">Later-scaler band: €59–€74</p>
          </div>

          <div className="mt-4 inline-block rounded-full bg-clay/15 px-2.5 py-1 font-mono text-xs font-semibold text-clay">
            {peers.ranking}
          </div>
        </div>

        {/* Secondary — pre-entry conversion */}
        <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Pre-entry conversion vs home</p>
          <div className="mt-3 flex items-end gap-3">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">You</p>
              <p className="font-display text-3xl font-semibold tabular-nums tracking-tight text-foreground">0.22×</p>
            </div>
            <span className="pb-1 font-mono text-xs text-muted-foreground/50">vs</span>
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Peer median</p>
              <p className="font-display text-2xl font-semibold tabular-nums tracking-tight text-muted-foreground">0.38×</p>
            </div>
          </div>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground text-pretty">
            Your pre-order conversion is 0.22× your home rate. Peers hit 0.38× in
            Germany.
          </p>
        </div>

        {/* Outcome — 18-month */}
        <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">18-month outcome</p>
          <p className="mt-3 font-display text-3xl font-semibold tabular-nums tracking-tight text-foreground">
            {peers.scaledCount}
          </p>
          <p className="mt-1 text-base text-muted-foreground text-pretty">
            comparable brands later scaled
          </p>
        </div>
      </div>

      {/* Conclusion */}
      <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-sage/20 bg-sage-soft/40 p-4">
        <TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-sage-deep" />
        <p className="text-base leading-relaxed text-foreground text-pretty">
          Comparable brands acquired German customers for less. The market is
          viable; Heely&apos;s current route is not.
        </p>
      </div>

      {/* Privacy */}
      <p className="mt-4 flex items-center gap-1.5 font-mono text-sm text-muted-foreground/60">
        <ShieldCheck className="h-4 w-4" />
        No brand names. No raw customer data. Only cohort-level outcomes.
      </p>

      <PrimaryButton className="mt-6" onClick={onNext}>
        See the verdict
        <ArrowRight className="h-5 w-5" />
      </PrimaryButton>
    </motion.section>
  );
}

/* ---------------- 06 Verdict ---------------- */
function VerdictStep({
  onPrimary,
  onSecondary,
}: {
  onPrimary: () => void;
  onSecondary: () => void;
}) {
  const p = PROBE;
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
    >
      <Eyebrow n="06" label="Verdict" tone="amber" />

      <div className="mt-2 flex items-center gap-4">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Keep Germany in probe.
        </h1>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-warm px-3.5 py-1.5 text-base font-bold uppercase tracking-wider text-[oklch(0.40_0.10_60)]">
          <AlertCircle className="h-4 w-4" />
          NOT YET
        </span>
      </div>
      <p className="mt-1 text-lg text-muted-foreground text-pretty">Do not scale it yet.</p>

      {/* Four summary metrics */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryMetric label="Probe CAC" value={p.probeCac} />
        <SummaryMetric label="Peer median" value={p.peers.medianCac} />
        <SummaryMetric label="Later-scaler band" value={p.peers.scaledBand} />
        <SummaryMetric label="Orders" value={String(p.orders)} />
      </div>

      {/* Why */}
      <div className="mt-4 rounded-xl bg-muted/40 p-3.5">
        <p className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">Why</p>
        <p className="mt-1.5 text-base leading-relaxed text-foreground/85 text-pretty">{p.why}</p>
      </div>

      {/* What changes the verdict */}
      <div className="mt-2.5 rounded-xl border border-sage/20 bg-sage-soft/40 p-3.5">
        <p className="font-mono text-xs font-bold uppercase tracking-wider text-sage-deep">What changes the verdict</p>
        <p className="mt-1.5 text-base leading-relaxed text-foreground text-pretty">{p.whatChanges}</p>
      </div>

      {/* Recommended route */}
      <div className="mt-2.5">
        <p className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">Recommended route</p>
        <div className="mt-2 grid gap-2.5 sm:grid-cols-3">
          {p.routes.map((r) => (
            <div
              key={r.title}
              className={cn(
                "rounded-xl border p-3.5",
                r.badge ? "border-sage/40 bg-sage-soft/30" : "border-border/60 bg-card/50",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-display text-base font-semibold text-foreground">{r.title}</p>
                {r.badge && (
                  <span className="rounded-full bg-sage px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white">
                    {r.badge}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground text-pretty">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex flex-wrap gap-3">
        <PrimaryButton onClick={onPrimary}>
          Prepare the next probe
          <ArrowRight className="h-5 w-5" />
        </PrimaryButton>
        <SecondaryButton onClick={onSecondary}>
          <ArrowLeft className="h-4 w-4" />
          Review peer set
        </SecondaryButton>
      </div>

      {/* Pool note */}
      <p className="mt-4 font-mono text-sm text-muted-foreground/60">
        Heely&apos;s result is added anonymously. The next comparable brand gets a
        sharper verdict. n = 7.
      </p>
    </motion.section>
  );
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/50 bg-background/50 p-3.5">
      <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold tabular-nums tracking-tight text-foreground">{value}</p>
    </div>
  );
}

/* ---------------- Shared ---------------- */
function Eyebrow({ n, label, tone }: { n: string; label: string; tone: "sage" | "amber" | "clay" }) {
  return (
    <p className={cn("font-mono text-sm font-semibold uppercase tracking-[0.2em]", tone === "sage" && "text-sage-deep", tone === "amber" && "text-amber-warm", tone === "clay" && "text-clay")}>
      {n} · {label}
    </p>
  );
}

function PrimaryButton({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-[0_12px_30px_-10px_oklch(0.45_0.11_160/0.5)] transition-all hover:shadow-[0_16px_36px_-10px_oklch(0.45_0.11_160/0.6)]",
        className,
      )}
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/50 px-5 py-3 text-base font-semibold text-foreground transition-colors hover:bg-accent/40"
    >
      {children}
    </button>
  );
}
