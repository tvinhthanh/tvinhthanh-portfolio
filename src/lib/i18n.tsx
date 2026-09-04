import type { ReactNode } from "react";

export type L = { en: string; vi: string };

/** Authoring helper so content files read as `t("English", "Tiếng Việt")`. */
export const t = (en: string, vi: string): L => ({ en, vi });

/**
 * Both languages ship in the HTML; CSS on <html data-lang> decides which one
 * is painted. The language is set before first paint by the boot script, so
 * switching never flashes the wrong copy and never waits for hydration.
 */
export function T({ v }: { v: L }) {
  return (
    <>
      <span data-l="en">{v.en}</span>
      <span data-l="vi">{v.vi}</span>
    </>
  );
}

/** Same idea, for a whole block of JSX rather than a string. */
export function Lang({ en, vi }: { en: ReactNode; vi: ReactNode }) {
  return (
    <>
      <span data-l="en">{en}</span>
      <span data-l="vi">{vi}</span>
    </>
  );
}
