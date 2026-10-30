"use client";

import type { ReactNode } from "react";

const send = () => window.dispatchEvent(new CustomEvent("world:pulse"));

/**
 * Coming up to an exhibit sends one pulse into the scene: the river brightens
 * and quickens for about a second, then settles. A plain DOM event, so no
 * component ever holds a handle to the world.
 */
export function Pulse({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div onPointerEnter={send} onFocusCapture={send} className={className}>
      {children}
    </div>
  );
}
