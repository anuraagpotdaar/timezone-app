import type { TimeOfDay } from "@/types";

export const SKY_GRADIENTS: Record<TimeOfDay, string> = {
  night: "linear-gradient(180deg,#0c1445,#1a1a4e 30%,#2d1b69 60%,#1a1a3e)",
  dawn:  "linear-gradient(180deg,#2d1b69,#e17055 30%,#fdcb6e 60%,#fab1a0)",
  day:   "linear-gradient(180deg,#74b9ff,#a8d8ff 35%,#dfe6e9 80%,#ffeaa7)",
  dusk:  "linear-gradient(180deg,#2d3436,#6c5ce7 20%,#e17055 50%,#fdcb6e 80%,#fab1a0)",
};

/**
 * Returns consistent white-on-dark styling with text shadows.
 *
 * Previous approach: binary dark/light split failed on dawn/dusk gradients
 * because the background has both light and dark regions.
 *
 * New approach: always use white text + text-shadow for legibility on any
 * gradient state. Scrim overlays on the card handle the rest.
 */
export function getCardColors(_tod: TimeOfDay) {
  return {
    text:         "#fff",
    subtext:      "rgba(255,255,255,0.75)",
    pillBg:       "rgba(0,0,0,0.2)",
    pillBorder:   "rgba(255,255,255,0.15)",
    dstColor:     "#ffeaa7",
    dstBg:        "rgba(255,234,167,0.2)",
    // Soft shadow behind text for readability on any sky
    textShadow:   "0 1px 4px rgba(0,0,0,0.4), 0 0px 12px rgba(0,0,0,0.15)",
    // Lighter variant for large time digits (they're already bold)
    timeShadow:   "0 2px 8px rgba(0,0,0,0.35), 0 0px 20px rgba(0,0,0,0.15)",
  };
}

/**
 * Scrim gradients applied at the top and bottom of cards.
 * These provide a darkened region behind the city info (top) and date (bottom)
 * so text contrast is always adequate regardless of the sky gradient.
 */
export function getScrimGradients(_tod: TimeOfDay) {
  return {
    top:    "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.12) 60%, transparent 100%)",
    bottom: "linear-gradient(to top, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.08) 50%, transparent 100%)",
  };
}

export const FONTS = {
  sans: "'DM Sans', sans-serif",
  mono: "'DM Mono', monospace",
} as const;
