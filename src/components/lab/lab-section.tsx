"use client";

import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { LabControls } from "./lab-controls";
import type { LabState } from "./types";
import { T, t } from "@/lib/i18n";
import { Reveal } from "@/components/ui/reveal";
import { useReducedMotion } from "@/hooks/use-device-capability";

const DynamicLabCanvas = dynamic(
  () => import("./lab-canvas").then((mod) => mod.LabCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-surface-2/40">
        <div className="mono flex items-center gap-3 text-step--1 text-ink-faint">
          <span className="inline-block h-3 w-3 animate-ping rounded-full bg-accent" />
          <span><T v={t("Loading 3D experiment…", "Đang tải thử nghiệm 3D…")} /></span>
        </div>
      </div>
    ),
  }
);

class LabBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? (
      <div role="status" className="p-8 text-ink-soft">
        <T v={t("3D preview unavailable. You can continue exploring the portfolio.", "Không thể tải bản xem trước 3D. Bạn vẫn có thể xem nội dung portfolio.")} />
      </div>
    ) : this.props.children;
  }
}

export function LabSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const reducedMotion = useReducedMotion();

  const [state, setState] = useState<LabState>({
    modelId: "aero-chassis",
    exploded: 0.15,
    rpm: 5200,
    driveMode: "sport",
    speedKmh: 165,
    gear: 4,
    wireframe: false,
    autoRotate: false,
  });

  const handleStateChange = (patch: Partial<LabState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  };

  // WebGL context power-saver: Only run render loop when in view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting) setHasEntered(true);
      },
      { rootMargin: "100px 0px 100px 0px", threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="lab" className="relative py-[var(--s-section)]">
      <Reveal>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="mono text-step--2 uppercase tracking-[0.18em] text-accent">
              05 / <T v={t("INTERACTIVE 3D LAB", "THỬ NGHIỆM 3D TƯƠNG TÁC")} />
            </span>
            <span className="h-px flex-1 bg-line-soft" />
          </div>

          <h2 className="display text-step-3 text-ink sm:text-step-4">
            <T
              v={t(
                "3D Lab",
                "Thử nghiệm 3D"
              )}
            />
          </h2>

          <p className="max-w-[72ch] text-step-0 leading-relaxed text-ink-soft">
            <T
              v={t(
                "A small collection of interactive models exploring structure, motion, and data visualization.",
                "Một số mô hình tương tác để khám phá cấu trúc, chuyển động và cách hiển thị dữ liệu.",
              )}
            />
          </p>
        </div>

        {/* 3D Lab Interactive Container */}
        <div className="mt-8 grid grid-cols-1 overflow-hidden rounded-card border border-line bg-paper lg:grid-cols-12">
          {/* 3D Viewport Column */}
          <div className="relative min-h-[380px] bg-gradient-to-b from-paper/30 to-surface-2/40 sm:min-h-[460px] lg:col-span-7 lg:min-h-[540px]">
            {hasEntered ? (
              <LabBoundary><DynamicLabCanvas state={{ ...state, autoRotate: state.autoRotate && !reducedMotion }} isIntersecting={isIntersecting} reducedMotion={reducedMotion} /></LabBoundary>
            ) : (
              <div className="flex min-h-[380px] items-center justify-center p-8 text-center text-ink-soft sm:min-h-[460px] lg:min-h-[540px]">
                <T v={t("3D experiment loads when you reach this section.", "Thử nghiệm 3D tải khi bạn đến section này.")} />
              </div>
            )}

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
                      "Kéo để xoay · Cuộn để thu phóng"
                    )}
                  />
                </span>
              </span>

            </div>
          </div>

          {/* Controls & Telemetry Column */}
          <div className="border-t border-line-soft bg-surface/60 lg:col-span-5 lg:border-l lg:border-t-0">
            <LabControls state={{ ...state, autoRotate: state.autoRotate && !reducedMotion }} onChange={handleStateChange} />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
