"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Check,
  AlertCircle,
  ArrowLeft,
  Lock,
  LoaderCircle,
  TrendingUp,
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
  const [probeComplete, setProbeComplete] = React.useState(false);

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
      {/* Stepper - compact, projector-readable, active stage obvious */}
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
          {step === "probe" && (
            <ProbeStep
              key="probe"
              onRun={() => {
                setProbeComplete(false);
                goTo("results");
              }}
            />
          )}
          {step === "results" && (
            <ResultsStep
              key="results"
              initialComplete={probeComplete}
              onComplete={() => setProbeComplete(true)}
              onNext={() => goTo("peerset")}
            />
          )}
          {step === "peerset" && <PeerSetStep key="peerset" onNext={() => goTo("verdict")} onBack={() => goTo("results")} />}
          {step === "verdict" && <VerdictStep key="verdict" onPrimary={() => goTo("probe")} onSecondary={() => goTo("peerset")} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------------- 01 Connect ---------------- */
function ConnectStep({ onNext }: { onNext: () => void }) {
  const [phase, setPhase] = React.useState(0);

  React.useEffect(() => {
    const shopifyDone = window.setTimeout(() => setPhase(1), 1100);
    const ga4Done = window.setTimeout(() => setPhase(2), 2400);
    return () => {
      window.clearTimeout(shopifyDone);
      window.clearTimeout(ga4Done);
    };
  }, []);

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
        <ConnectRow
          name="Shopify"
          sub="orders · products · customers"
          done="24 months of orders"
          status={phase === 0 ? "connecting" : "connected"}
        />
        <ConnectRow
          name="GA4"
          sub="sessions · sources · landing pages"
          done="24 months of sessions"
          status={phase === 0 ? "waiting" : phase === 1 ? "connecting" : "connected"}
        />
      </div>

      <PrimaryButton className="mt-8" onClick={onNext} disabled={phase < 2}>
        {phase < 2 ? "Reading store data" : "Continue to signals"}
        <ArrowRight className="h-5 w-5" />
      </PrimaryButton>
    </motion.section>
  );
}

function ConnectRow({
  name,
  sub,
  done,
  status,
}: {
  name: string;
  sub: string;
  done: string;
  status: "waiting" | "connecting" | "connected";
}) {
  const connected = status === "connected";
  const connecting = status === "connecting";

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-2xl border p-4 transition-all duration-700",
        connected && "border-sage/40 bg-sage-soft/45",
        connecting && "border-sage/25 bg-sage-soft/15",
        status === "waiting" && "border-border/60 bg-card/40",
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-xl text-base font-bold transition-colors duration-700",
            connected ? "bg-sage text-white" : "bg-muted text-muted-foreground",
          )}
        >
          {name === "Shopify" ? "S" : "G"}
        </span>
        <div>
          <p className="font-semibold text-foreground">{name}</p>
          <p className="font-mono text-sm text-muted-foreground">{sub}</p>
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <span className={cn("hidden font-mono text-sm sm:inline", connected ? "text-sage-deep" : "text-muted-foreground")}>
          {connected ? done : connecting ? "Connecting..." : "Waiting"}
        </span>
        {connected ? (
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sage text-white"
          >
            <Check className="h-3.5 w-3.5" />
          </motion.span>
        ) : connecting ? (
          <LoaderCircle className="h-5 w-5 animate-spin text-sage-deep" />
        ) : (
          <span className="h-5 w-5 rounded-full border border-border" />
        )}
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
        Germany · 14-day organic probe
      </h1>
      <p className="mt-2 max-w-3xl text-base text-muted-foreground text-pretty">
        We post one native reel with a tracked link in the bio or description. Only
        verified German visits and completed orders count.
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
          {/* LEFT - Traffic creative */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between gap-2">
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">1 · Organic reel</p>
              <span className="inline-flex items-center gap-1 rounded-full bg-sage/15 px-2.5 py-0.5 text-xs font-semibold text-sage-deep">
                <Check className="h-3 w-3" />
                Selected for probe
              </span>
            </div>
            <video
              src="/reels/de-01.mp4"
              poster="/reels/de-01.jpg"
              controls
              playsInline
              preload="metadata"
              className="mt-2 aspect-[9/16] w-full max-w-[280px] rounded-xl border border-border/60 bg-card/60 object-cover shadow-[0_20px_50px_-25px_oklch(0.45_0.11_160/0.5)]"
            />
          </div>

          {/* RIGHT - What German customers see (browser-style, top aligned) */}
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

          </div>
        </div>

        <div className="mt-3 flex justify-end border-t border-border/60 pt-3">
          <PrimaryButton onClick={onRun}>
            Start organic probe
            <ArrowRight className="h-5 w-5" />
          </PrimaryButton>
        </div>
      </div>
    </motion.section>
  );
}

/* ---------------- 04 Results ---------------- */
function ResultsStep({
  initialComplete,
  onComplete,
  onNext,
}: {
  initialComplete: boolean;
  onComplete: () => void;
  onNext: () => void;
}) {
  const p = PROBE;
  const [day, setDay] = React.useState(initialComplete ? 14 : 1);

  React.useEffect(() => {
    if (initialComplete) return;

    let currentDay = 1;
    const timer = window.setInterval(() => {
      currentDay += 1;
      setDay(currentDay);
      if (currentDay === 14) {
        window.clearInterval(timer);
        onComplete();
      }
    }, 350);

    return () => window.clearInterval(timer);
  }, [initialComplete, onComplete]);

  const complete = day === 14;
  const progress = (day - 1) / 13;
  const atDay = (total: number) => Math.round(total * progress);
  const views = atDay(p.reelViews);
  const engaged = atDay(p.engaged);
  const visits = atDay(p.pageVisits);
  const carts = atDay(p.addToCarts);
  const orders = atDay(p.orders);
  const pageConversion = visits ? `${((orders / visits) * 100).toFixed(1)}%` : "0.0%";
  const viewToVisit = views ? `${((visits / views) * 100).toFixed(2)}%` : "0.00%";

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
    >
      <Eyebrow n="04" label="Results" tone="clay" />
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Germany · day {day} of 14
      </h1>
      <p className="mt-2 max-w-2xl text-lg text-muted-foreground text-pretty">
        {complete
          ? "Organic attention reached the product page. Now we measure purchase intent."
          : "Tracking verified German visitors from the organic reel to completed orders."}
      </p>

      <div className="mt-5 overflow-hidden rounded-xl border border-border/60 bg-card/50">
        <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 font-mono text-sm font-medium text-foreground">
          <span className="inline-flex items-center gap-1.5">
            {complete ? (
              <Check className="h-4 w-4 text-sage-deep" />
            ) : (
              <LoaderCircle className="h-4 w-4 animate-spin text-sage-deep" />
            )}
            {complete ? "14 days complete" : `Day ${day} in progress`}
          </span>
          <span className="text-muted-foreground/40">·</span>
          <span>{visits} verified German visits</span>
          <span className="text-muted-foreground/40">·</span>
          <span>{orders} orders</span>
        </div>
        <div className="h-1 bg-muted">
          <motion.div
            className="h-full bg-sage"
            animate={{ width: `${(day / 14) * 100}%` }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="mt-6">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground/60">Diagnostics</p>
        <div className="mt-2 grid grid-cols-3 gap-3">
          <QuietMetric label="Views" value={views.toLocaleString("en-US")} />
          <QuietMetric label="Engaged" value={engaged.toLocaleString("en-US")} />
          <QuietMetric label="Add to carts" value={String(carts)} />
        </div>
      </div>

      <div className="mt-6">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground/60">Decision metrics</p>
        <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <BigMetric label="Orders" value={String(orders)} tone="sage" />
          <BigMetric label="Product-page conversion" value={pageConversion} tone="sage" />
          <SmallMetric label="Verified German visits" value={String(visits)} />
          <SmallMetric label="View-to-visit rate" value={viewToVisit} />
        </div>
      </div>

      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground text-pretty">
        {complete
          ? "Eight German customers bought. Now Validly checks whether 3.7% conversion is competitive for a Nordic footwear brand entering Germany."
          : "The verdict stays locked until the 14-day observation window is complete."}
      </p>

      <PrimaryButton className="mt-6" onClick={onNext} disabled={!complete}>
        {complete ? "Compare with peers" : `Collecting day ${day} data`}
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
        How does 3.7% compare?
      </h1>
      <p className="mt-2 max-w-2xl text-lg text-muted-foreground text-pretty">
        Validly found 46 comparable Nordic brands that already entered Germany.
        Names stay private.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {PEER_FILTERS.map((f) => (
          <span key={f} className="rounded-full bg-accent/50 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-accent-foreground">
            {f}
          </span>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-border/60 bg-card/70 p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Your product-page conversion</p>
              <p className="mt-1 font-display text-5xl font-semibold tabular-nums tracking-tight text-clay">{p.pageConversion}</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Peer median</p>
              <p className="mt-1 font-display text-3xl font-semibold tabular-nums tracking-tight text-foreground">{peers.medianConversion}</p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">{peers.n} comparable brands</p>
            </div>
          </div>

          <div className="mt-7">
            <div className="relative h-4 rounded-full bg-muted">
              <div className="absolute h-full rounded-full bg-sage/30" style={{ left: "45%", width: "40%" }} />
              <div className="absolute top-1/2 h-7 w-1.5 -translate-y-1/2 rounded-full bg-clay" style={{ left: "18%" }} />
            </div>
            <div className="relative mt-2 h-5 font-mono text-xs text-muted-foreground">
              <span className="absolute left-[18%] -translate-x-1/2 font-semibold text-clay">You 3.7%</span>
              <span className="absolute left-[45%] -translate-x-1/2">4.8%</span>
              <span className="absolute left-[85%] -translate-x-1/2">6.4%</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <span className="h-2.5 w-6 rounded-full bg-sage/30" />
              Brands that later scaled converted between 4.8% and 6.4%
            </div>
          </div>

          <div className="mt-5 inline-block rounded-full bg-clay/15 px-3 py-1.5 font-mono text-sm font-semibold text-clay">
            {peers.ranking}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
            <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 border-b border-border/50 pb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
              <span>Full funnel</span>
              <span>You</span>
              <span>Peers</span>
            </div>
            {[
              ["View to visit", peers.visitRateYou, peers.visitRatePeer],
              ["Visit to cart", p.addToCartRate, peers.addToCartRate],
              ["Visit to order", p.pageConversion, peers.medianConversion],
              ["Revenue / visit", p.revenuePerVisit, peers.revenuePerVisit],
            ].map(([label, you, median]) => (
              <div key={label} className="grid grid-cols-[1fr_auto_auto] gap-x-4 border-b border-border/35 py-2.5 last:border-0 last:pb-0">
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className="font-mono text-sm font-semibold tabular-nums text-clay">{you}</span>
                <span className="min-w-12 text-right font-mono text-sm tabular-nums text-foreground">{median}</span>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">What successful peers did next</p>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="font-display text-3xl font-semibold tabular-nums tracking-tight text-foreground">
                {peers.scaledCount}
              </p>
              <p className="text-sm text-muted-foreground">scaled within 18 months</p>
            </div>
            <p className="mt-2 border-t border-border/40 pt-2 text-sm font-medium text-foreground">{peers.routeMix}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-sage/20 bg-sage-soft/40 p-4">
        <TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-sage-deep" />
        <p className="text-base leading-relaxed text-foreground text-pretty">
          Germany can work. Comparable brands converted more of their organic
          visitors, so Heely&apos;s current route is not ready to scale.
        </p>
      </div>

      <div className="mt-4 flex justify-end">
        <PrimaryButton onClick={onNext}>
          See the verdict
          <ArrowRight className="h-5 w-5" />
        </PrimaryButton>
      </div>
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
          Germany is not ready to scale.
        </h1>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-warm px-3.5 py-1.5 text-base font-bold uppercase tracking-wider text-[oklch(0.40_0.10_60)]">
          <AlertCircle className="h-4 w-4" />
          NOT YET
        </span>
      </div>
      <p className="mt-1 text-lg text-muted-foreground text-pretty">
        Demand exists. The current route creates too much purchase friction.
      </p>

      {/* Four summary metrics */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryMetric label="Product-page conversion" value={p.pageConversion} />
        <SummaryMetric label="Peer median" value={p.peers.medianConversion} />
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

      <div className="mt-2.5">
        <p className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">Three routes forward</p>
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

      <div className="mt-4 flex flex-wrap gap-3">
        <PrimaryButton onClick={onPrimary}>
          Prepare Germany re-test
          <ArrowRight className="h-5 w-5" />
        </PrimaryButton>
        <SecondaryButton onClick={onSecondary}>
          <ArrowLeft className="h-4 w-4" />
          Review peer set
        </SecondaryButton>
      </div>

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

function PrimaryButton({
  children,
  className,
  onClick,
  disabled = false,
}: {
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-[0_12px_30px_-10px_oklch(0.45_0.11_160/0.5)] transition-all hover:shadow-[0_16px_36px_-10px_oklch(0.45_0.11_160/0.6)] disabled:cursor-wait disabled:opacity-50 disabled:shadow-none",
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
