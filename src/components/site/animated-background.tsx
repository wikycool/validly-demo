"use client";

import { cn } from "@/lib/utils";

/**
 * Animated aurora + floating verdict-orbs background.
 * Pure CSS gradients + drifting blobs to keep it cheap.
 */
export function AnimatedBackground({
  variant = "hero",
  className,
}: {
  variant?: "hero" | "soft" | "dramatic";
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      {/* Base aurora gradient mesh */}
      <div
        className={cn(
          "absolute inset-0",
          variant === "hero" && "aurora-bg",
          variant === "soft" &&
            "bg-[radial-gradient(at_20%_30%,oklch(0.62_0.13_155/0.10)_0px,transparent_50%),radial-gradient(at_80%_70%,oklch(0.80_0.14_75/0.08)_0px,transparent_50%)]",
          variant === "dramatic" &&
            "bg-[radial-gradient(at_50%_0%,oklch(0.45_0.11_160/0.18)_0px,transparent_55%),radial-gradient(at_0%_100%,oklch(0.62_0.12_35/0.12)_0px,transparent_50%),radial-gradient(at_100%_100%,oklch(0.80_0.14_75/0.10)_0px,transparent_50%)]",
        )}
      />

      {/* Drifting blobs */}
      <div className="absolute -top-24 -left-24 h-[42rem] w-[42rem] rounded-full bg-[oklch(0.62_0.13_155/0.18)] blur-[120px] animate-drift-a" />
      <div className="absolute top-1/3 -right-32 h-[38rem] w-[38rem] rounded-full bg-[oklch(0.80_0.14_75/0.16)] blur-[120px] animate-drift-b" />
      <div className="absolute -bottom-40 left-1/4 h-[36rem] w-[36rem] rounded-full bg-[oklch(0.62_0.12_35/0.12)] blur-[130px] animate-drift-a [animation-delay:-8s]" />

      {/* Fine grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(0.22 0.012 95) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.22 0.012 95) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }}
      />

      {/* Vignette to anchor content */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,oklch(0.985_0.006_95/0.4)_100%)]" />
    </div>
  );
}
