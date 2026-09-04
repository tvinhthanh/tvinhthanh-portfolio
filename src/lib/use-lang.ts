"use client";

import { useSyncExternalStore } from "react";
import type { L } from "./i18n";

/**
 * For the few places that need the language as a *string* rather than markup
 * — <option> labels, aria-labels — where the CSS approach in `T` cannot reach.
 */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-lang"],
  });
  return () => observer.disconnect();
}

const read = (): "en" | "vi" =>
  document.documentElement.dataset.lang === "vi" ? "vi" : "en";

export function useLang() {
  return useSyncExternalStore(subscribe, read, () => "en" as const);
}

export function useT() {
  const lang = useLang();
  return (value: L) => value[lang];
}
