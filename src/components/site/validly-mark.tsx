"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * validly mark — a refined lowercase "v".
 * Two converging strokes forming a check-like v, inside a soft rounded
 * square. The strokes draw on once, then breathe gently. No fourth wall.
 */
export function ValidlyMark({
  className,
  animate = true,
}: {
  className?: string;
  animate?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      aria-hidden
    >
      {/* Soft container — a rounded square, very faint */}
      <rect
        x="2"
        y="2"
        width="28"
        height="28"
        rx="9"
        stroke="currentColor"
        strokeWidth="1.4"
        opacity="0.16"
      />

      {/* The "v" — two strokes meeting at the bottom center */}
      <motion.path
        d="M8 11 L16 23 L24 11"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={animate ? { pathLength: 0, opacity: 0 } : false}
        animate={
          animate
            ? {
                pathLength: 1,
                opacity: 1,
              }
            : undefined
        }
        transition={
          animate
            ? {
                pathLength: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 },
                opacity: { duration: 0.3, delay: 0.1 },
              }
            : undefined
        }
      />

      {/* Small accent dot at the apex — a subtle "decision point" */}
      <motion.circle
        cx="16"
        cy="23"
        r="1.4"
        fill="currentColor"
        initial={animate ? { scale: 0, opacity: 0 } : false}
        animate={
          animate
            ? {
                scale: [0, 1, 1, 1],
                opacity: [0, 1, 1, 1],
              }
            : undefined
        }
        transition={
          animate
            ? {
                duration: 2.4,
                times: [0, 0.4, 0.7, 1],
                delay: 0.9,
                repeat: Infinity,
                repeatDelay: 1.2,
                ease: "easeInOut",
              }
            : undefined
        }
      />
    </svg>
  );
}

/** The full wordmark — mark + lowercase word. Hover spins the mark gently. */
export function ValidlyWordmark({
  className,
  markClassName,
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <span className={cn("group inline-flex items-center gap-2", className)}>
      <motion.span
        whileHover={{ rotate: -8 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        className="inline-flex"
      >
        <ValidlyMark className={cn("h-6 w-6 text-sage-deep", markClassName)} />
      </motion.span>
      <span className="font-display text-xl font-semibold tracking-[-0.02em] text-foreground">
        validly
      </span>
    </span>
  );
}
