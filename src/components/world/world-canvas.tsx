"use client";

import { useEffect, useRef } from "react";
import { detectTier } from "@/hooks/use-device-capability";
import { createCelestialScene } from "./scene/celestial-scene";
import type { Station } from "./stations";

type Scene = ReturnType<typeof createCelestialScene>;

/** Mounts the scene once and hands it the element. React never re-renders it;
 *  moving between rooms only tells the camera where to walk. */
export default function WorldCanvas({ station }: { station: Station }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<Scene | null>(null);
  const firstStation = useRef(station);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const scene = createCelestialScene(host, detectTier(), firstStation.current);
    sceneRef.current = scene;
    return () => {
      sceneRef.current = null;
      scene.dispose();
    };
  }, []);

  useEffect(() => {
    sceneRef.current?.setStation(station);
  }, [station]);

  return (
    <div ref={hostRef} className="world" aria-hidden="true">
      {/* Holds the frame until WebGL is confirmed, and stays if it never is */}
      <div className="world-still" />
    </div>
  );
}
