"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { LabControls } from "./lab-controls";
import type { LabState } from "./types";
import { T, t } from "@/lib/i18n";
import { Reveal } from "@/components/ui/reveal";

const DynamicLabCanvas = dynamic(
  () => import("./lab-canvas").then((mod) => mod.LabCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-surface-2/40">
        <div className="mono flex items-center gap-3 text-step--1 text-ink-faint">
          <span className="inline-block h-3 w-3 animate-ping rounded-full bg-accent" />
          <span>Igniting High-Performance 3D Engine...</span>
        </div>
      </div>
    ),
  }
);

export function LabSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isUserScrubbing, setIsUserScrubbing] = useState(false);

  const [state, setState] = useState<LabState>({
    modelId: "aero-chassis",
    exploded: 0.15,
    rpm: 5200,
    driveMode: "sport",
    speedKmh: 165,
    gear: 4,
    wireframe: false,
    autoRotate: true,
  });

  const handleStateChange = (patch: Partial<LabState>) => {
    if (patch.exploded !== undefined) {
      setIsUserScrubbing(true);
    }
    setState((prev) => ({ ...prev, ...patch }));
  };

  // WebGL context power-saver: Only run render loop when in view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { rootMargin: "100px 0px 100px 0px", threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Scroll-driven interaction for the Aero Chassis
  useEffect(() => {
    if (state.modelId !== "aero-chassis" || isUserScrubbing) return;

    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress as section scrolls through viewport
      const totalTravel = windowHeight + rect.height;
      const current = windowHeight - rect.top;
      const progress = Math.min(Math.max(current / totalTravel, 0), 1);

      // Smooth sine curve: 0 at entry, 0.85 at center, 0 at exit
      const normalized = Math.sin(progress * Math.PI) * 0.85;
      setState((prev) => ({
        ...prev,
        exploded: parseFloat(normalized.toFixed(3)),
      }));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [state.modelId, isUserScrubbing]);

  return (
    <section ref={sectionRef} id="lab" className="relative py-[var(--s-section)]">
      <Reveal>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="mono text-step--2 uppercase tracking-[0.18em] text-accent">
              02.5 / MOTORSPORT & HIGH-PERFORMANCE LAB
            </span>
            <span className="h-px flex-1 bg-line-soft" />
            <span className="mono rounded-chip border border-accent/40 bg-accent/10 px-2 py-0.5 text-step--2 text-accent">
              Live WebGL Telemetry
            </span>
          </div>

          <h2 className="display text-step-3 text-ink sm:text-step-4">
            <T
              v={t(
                "Aerodynamic Engineering & Live Telemetry",
                "Kỹ Thuật Khí Động Học & Dữ Liệu Buồng Lái"
              )}
            />
          </h2>

          <p className="max-w-[72ch] text-step-0 leading-relaxed text-ink-soft">
            <T
              v={t(
                "High-performance 3D visual computing: interactive kinetic disassembly of a carbon-composite hypercar monocoque, twin-turbo V12 powertrain throughput simulation, and F1-grade digital cockpit telemetry. Engineered with Three.js and React Three Fiber with zero impact on initial load.",
                "Không gian đồ họa kỹ thuật hiệu năng cao: bóc tách cơ khí khung gầm siêu xe carbon-composite, mô phỏng lưu lượng động cơ V12 tăng áp kép và cụm đồng hồ đo telemetry buồng lái tiêu chuẩn F1. Xây dựng bằng Three.js & R3F với 0 CLS và bảo toàn trọn vẹn tốc độ tải trang.",
              )}
            />
          </p>
        </div>

        {/* 3D Lab Interactive Container */}
        <div className="cockpit-panel mt-8 grid grid-cols-1 overflow-hidden rounded-card shadow-2xl backdrop-blur-md lg:grid-cols-12">
          {/* 3D Viewport Column */}
          <div className="relative min-h-[380px] bg-gradient-to-b from-paper/30 to-surface-2/40 sm:min-h-[460px] lg:col-span-7 lg:min-h-[540px]">
            <DynamicLabCanvas state={state} isIntersecting={isIntersecting} />

            {/* Viewport Overlay Controls & HUD */}
            <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-center justify-between text-step--2">
              <span className="mono rounded-chip border border-line/60 bg-paper/85 px-2.5 py-1 text-ink-faint backdrop-blur-md">
                <span className="sm:hidden">
                  <T
                    v={t(
                      "Scroll 1 finger · 2 fingers to rotate 3D",
                      "Cuộn 1 ngón · Dùng 2 ngón xoay 3D"
                    )}
                  />
                </span>
                <span className="hidden sm:inline">
                  <T
                    v={t(
                      "Drag to orbit · Scroll to zoom",
                      "Kéo chuột để xoay 360° · Cuộn để zoom"
                    )}
                  />
                </span>
              </span>

              <span className="mono hidden sm:inline-block rounded-chip border border-accent/30 bg-accent/10 px-2.5 py-1 text-accent backdrop-blur-md">
                DPR: 1.5x · GPU Power Managed
              </span>
            </div>
          </div>

          {/* Controls & Telemetry Column */}
          <div className="border-t border-line-soft bg-surface/60 lg:col-span-5 lg:border-l lg:border-t-0">
            <LabControls state={state} onChange={handleStateChange} />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
