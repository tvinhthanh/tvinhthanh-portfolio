"use client";

import { useEffect, useRef } from "react";
import { detectTier } from "@/hooks/use-device-capability";
import { createCelestialScene } from "./scene/celestial-scene";

/** Mounts the scene once and hands it the element. React never re-renders it. */
export default function WorldCanvas() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const scene = createCelestialScene(host, detectTier());
    return () => scene.dispose();
  }, []);

  return (
    <div ref={hostRef} className="world" aria-hidden="true">
      {/* Holds the frame until WebGL is confirmed, and stays if it never is */}
      <div className="world-still" />
    </div>
  );
}
