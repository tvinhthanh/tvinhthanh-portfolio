"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { stationFor } from "./stations";

/**
 * three.js is never in the first payload. The document renders, the CSS ridge
 * holds the frame, and the scene swaps in once it has downloaded.
 *
 * The world lives in the root layout, so it is mounted once for the whole
 * visit: changing rooms moves the camera, it never rebuilds the scene.
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
  const pathname = usePathname();
  // One object per room, so the scene is only told to move when the room changes.
  const station = useMemo(() => stationFor(pathname), [pathname]);

  return (
    <>
      <WorldCanvas station={station} />
      <div className="world-veil" aria-hidden="true" />
    </>
  );
}
