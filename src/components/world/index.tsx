"use client";

import dynamic from "next/dynamic";

/**
 * three.js is never in the first payload. The document renders, the CSS ridge
 * holds the frame, and the scene swaps in once it has downloaded.
 */
const WorldCanvas = dynamic(() => import("./world-canvas"), {
  ssr: false,
  loading: () => (
    <div className="world" data-ready="true" aria-hidden="true">
      <div className="world-still" />
    </div>
  ),
});

export function World() {
  return (
    <>
      <WorldCanvas />
      <div className="world-veil" aria-hidden="true" />
    </>
  );
}
