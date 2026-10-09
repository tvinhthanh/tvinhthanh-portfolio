"use client";

import { useEffect, useRef, useState } from "react";
import { useRobotSettings } from "./robot-settings";

// Probe for hardware-accelerated WebGL before loading Three.js
function hasFastWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const probe = document.createElement("canvas");
    const options = { failIfMajorPerformanceCaveat: true };
    const gl = probe.getContext("webgl2", options) || probe.getContext("webgl", options);
    if (!gl) return false;
    const ext = (gl as WebGLRenderingContext).getExtension("WEBGL_lose_context");
    ext?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export function RobotStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { enabled, setAvailable } = useRobotSettings();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!enabled) {
      if (typeof document !== "undefined") {
        document.body.dataset.robot = "paused";
      }
      return;
    }

    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;

    let cancelled = false;
    let disposeScene: (() => void) | undefined;
    let observer: IntersectionObserver | undefined;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const runInit = async () => {
      if (!hasFastWebGL()) {
        if (typeof document !== "undefined") {
          document.body.dataset.robot = "fallback";
        }
        setAvailable(false);
        return;
      }

      // Allow critical web fonts to finish first for zero CLS
      await document.fonts?.ready;
      if (cancelled) return;

      try {
        const { initRobotScene } = await import("@/lib/robot-scene");
        if (cancelled) return;
        disposeScene = initRobotScene({ stage, canvas, prefersReducedMotion });
        setLoaded(true);
      } catch (err) {
        console.warn("RobotScene failed to initialize:", err);
        if (typeof document !== "undefined") {
          document.body.dataset.robot = "error";
        }
        setAvailable(false);
      }
    };

    let idleId: number | undefined;
    let timerId: ReturnType<typeof setTimeout> | undefined;

    const schedule = () => {
      if ("requestIdleCallback" in window) {
        idleId = (window as Window).requestIdleCallback(runInit, { timeout: 2500 });
      } else {
        timerId = setTimeout(runInit, 150);
      }
    };

    // Wait until at least one anchor is in or near viewport before loading 3D assets
    const anchors = document.querySelectorAll("[data-robot-anchor]");
    if (anchors.length && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting || e.intersectionRatio > 0.1)) {
            observer?.disconnect();
            schedule();
          }
        },
        { rootMargin: "200px" }
      );
      anchors.forEach((a) => observer?.observe(a));
    } else {
      schedule();
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
      if (idleId && "cancelIdleCallback" in window) {
        (window as Window).cancelIdleCallback(idleId);
      }
      if (timerId) {
        clearTimeout(timerId);
      }
      disposeScene?.();
      setLoaded(false);
    };
  }, [enabled, setAvailable]);

  return (
    <>
      {/* 3D Fixed Viewport Canvas Overlay */}
      <div
        ref={stageRef}
        aria-hidden="true"
        className={`robot-stage fixed inset-0 pointer-events-none z-20 transition-opacity duration-700 ${
          enabled && loaded ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <canvas ref={canvasRef} id="robot-canvas" className="h-full w-full block" />
      </div>

    </>
  );
}
