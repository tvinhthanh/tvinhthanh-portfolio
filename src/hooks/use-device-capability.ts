"use client";

import { useSyncExternalStore } from "react";

export type Tier = "full" | "reduced" | "minimal";

/**
 * How much world this device should be asked to render.
 *
 * `minimal` also covers "the visitor asked for less motion" — in that case the
 * scene composes one still frame instead of running a loop.
 */
export function detectTier(): Tier {
  if (typeof window === "undefined") return "minimal";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "minimal";

  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.innerWidth < 768;

  if (cores <= 4 || memory <= 4 || (coarse && narrow)) return "reduced";
  return "full";
}

const subscribeMotion = (onChange: () => void) => {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
};

export function useReducedMotion() {
  return useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}
