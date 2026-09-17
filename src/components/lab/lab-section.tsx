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
          <span>Mounting Spatial WebGL Engine...</span>
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
    modelId: "ai-stream",
    streamState: "streaming",
    streamSpeed: 1.0,
    exploded: 0.2,
    activeTier: null,
    networkMode: "p2p-direct",
    packetJitter: 0,
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

  // Scroll-driven interaction for the Architecture Blade
  useEffect(() => {
    if (state.modelId !== "architecture" || isUserScrubbing) return;

    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress as section scrolls through viewport
      const totalTravel = windowHeight + rect.height;
      const current = windowHeight - rect.top;
      const progress = Math.min(Math.max(current / totalTravel, 0), 1);

      // Smooth sine curve: 0 at entry, 1.0 at center, 0 at exit
      const normalized = Math.sin(progress * Math.PI);
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
              02.5 / ARCHITECTURE & SYSTEMS LAB
            </span>
            <span className="h-px flex-1 bg-line-soft" />
            <span className="mono rounded-chip border border-accent/40 bg-accent/10 px-2 py-0.5 text-step--2 text-accent">
              Live WebGL Visualization
            </span>
          </div>

          <h2 className="display text-step-3 text-ink sm:text-step-4">
            <T
              v={t(
                "Interactive Systems & Spatial Architecture",
                "Mô Hình Không Gian & Kiến Trúc Hệ Thống"
              )}
            />
          </h2>

          <p className="max-w-[72ch] text-step-0 leading-relaxed text-ink-soft">
            <T
              v={t(
                "Interactive 3D representations of core production systems I have built: the streaming LLM token pipeline driving 28 automated locales in pvt.space, scroll-driven full-stack architectural disassembly, and real-time WebRTC P2P signaling mesh. Built with Three.js and React Three Fiber with zero impact on initial page speed.",
                "Mô hình không gian 3D hóa các hệ thống thực tế tôi đã xây dựng: pipeline stream token LLM dịch tự động 28 ngôn ngữ trong pvt.space, bóc tách cơ khí đa tầng kiến trúc theo cuộn trang, và mạng lưới tín hiệu WebRTC P2P. Tối ưu bằng Three.js & R3F với 0 CLS và bảo toàn hiệu năng trang chủ.",
              )}
            />
          </p>
        </div>

        {/* 3D Lab Interactive Container */}
        <div className="panel mt-8 grid grid-cols-1 overflow-hidden rounded-card border border-line-soft bg-surface/90 shadow-2xl backdrop-blur-md lg:grid-cols-12">
          {/* 3D Viewport Column */}
          <div className="relative min-h-[380px] bg-gradient-to-b from-paper/30 to-surface-2/40 sm:min-h-[460px] lg:col-span-7 lg:min-h-[540px]">
            <DynamicLabCanvas state={state} isIntersecting={isIntersecting} />

            {/* Viewport Overlay Controls & HUD */}
            <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-center justify-between text-step--2">
              <span className="mono rounded-chip border border-line/60 bg-paper/80 px-2.5 py-1 text-ink-faint backdrop-blur-md">
                <T v={t("Drag to orbit · Scroll to zoom", "Kéo chuột để xoay 360° · Cuộn để zoom")} />
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
