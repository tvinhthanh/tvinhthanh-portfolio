"use client";

import { useCallback, useState } from "react";
import { T, t } from "@/lib/i18n";

const coreData = {
  statusBadge: t("Full-stack & Frontend", "Kỹ sư Full-stack & Frontend"),
  architectureSub: t("Production-Grade Systems", "Hệ Thống Thực Chiến"),
  frontendLabel: t("Frontend Architecture", "Thế Mạnh Frontend"),
  frontendVal: t("React 19 · Next.js · TypeScript", "React 19 · Next.js · TypeScript"),
  backendLabel: t("Backend & Realtime", "Backend & Hàng Đợi"),
  backendVal: t("NestJS · Redis · BullMQ", "NestJS · Redis · BullMQ"),
  prodMetric: t("3+ Years Production", "3+ Năm Thực Chiến"),
  reposMetric: t("31 Repositories", "31 Repositories"),
  pulseHint: t("Click core to pulse interactive scene", "Nhấp để tương tác không gian 3D"),
};

export function HeroCore() {
  const [pulsing, setPulsing] = useState(false);

  const channelQi = useCallback(() => {
    setPulsing(true);
    window.dispatchEvent(new CustomEvent("world:pulse"));
    setTimeout(() => setPulsing(false), 900);
  }, []);

  return (
    <div className="panel glow-subtle relative overflow-hidden p-6 sm:p-7">
      {/* Luminous corner accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-accent/15 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -left-16 h-36 w-36 rounded-full bg-status-live/10 blur-2xl"
      />

      {/* Header status bar */}
      <div className="flex items-center justify-between border-b border-line-soft pb-4">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="pulse absolute inline-flex h-full w-full rounded-full bg-status-live opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-status-live" />
          </span>
          <span className="mono text-step--2 uppercase tracking-[0.14em] text-accent">
            <T v={coreData.statusBadge} />
          </span>
        </div>
        <span className="mono text-step--2 text-ink-faint">
          <T v={coreData.architectureSub} />
        </span>
      </div>

      {/* Center: The Celestial Core / Linh Trận */}
      <div className="relative my-6 flex flex-col items-center justify-center">
        <button
          type="button"
          onClick={channelQi}
          onMouseEnter={channelQi}
          aria-label="Channel Qi into the celestial world"
          className="group relative flex h-36 w-36 cursor-pointer items-center justify-center rounded-full transition-transform duration-300 active:scale-95"
        >
          {/* Outer rotating celestial ring */}
          <svg
            className="celestial-spin absolute inset-0 h-full w-full text-accent/30 transition-colors duration-300 group-hover:text-accent/60"
            viewBox="0 0 144 144"
            fill="none"
          >
            <circle
              cx="72"
              cy="72"
              r="68"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="4 8"
            />
            <circle cx="72" cy="4" r="2.5" fill="currentColor" />
            <circle cx="72" cy="140" r="2.5" fill="currentColor" />
            <circle cx="4" cy="72" r="2.5" fill="currentColor" />
            <circle cx="140" cy="72" r="2.5" fill="currentColor" />
          </svg>

          {/* Inner counter-rotating ring */}
          <svg
            className="celestial-spin-rev absolute inset-3 h-30 w-30 text-hairline transition-colors duration-300 group-hover:text-accent/40"
            viewBox="0 0 120 120"
            fill="none"
          >
            <circle
              cx="60"
              cy="60"
              r="56"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="12 12"
            />
            <polygon
              points="60,10 103,35 103,85 60,110 17,85 17,35"
              stroke="currentColor"
              strokeWidth="0.8"
              strokeOpacity="0.4"
              fill="none"
            />
          </svg>

          {/* Center Orb */}
          <div
            className={`relative flex h-16 w-16 items-center justify-center rounded-full border transition-all duration-300 ${
              pulsing
                ? "border-accent bg-accent/25 shadow-[0_0_24px_rgba(237,212,154,0.6)]"
                : "border-accent/40 bg-surface-2/70 shadow-[0_0_12px_rgba(237,212,154,0.15)] group-hover:border-accent group-hover:shadow-[0_0_20px_rgba(237,212,154,0.35)]"
            }`}
          >
            <span className="mono text-step-0 font-medium text-accent">TVT</span>
          </div>
        </button>

        <p className="mono mt-2 text-step--2 text-ink-faint transition-colors duration-200 group-hover:text-accent">
          <T v={coreData.pulseHint} />
        </p>
      </div>

      {/* Telemetry Metrics Grid */}
      <div className="grid grid-cols-2 gap-2.5 pt-2">
        <div className="rounded-base border border-line-soft bg-surface-2/40 p-3 transition-colors duration-200 hover:border-line">
          <p className="mono text-[0.65rem] uppercase tracking-[0.12em] text-ink-faint">
            <T v={coreData.frontendLabel} />
          </p>
          <p className="mt-1 text-step--1 font-medium text-ink">
            <T v={coreData.frontendVal} />
          </p>
        </div>

        <div className="rounded-base border border-line-soft bg-surface-2/40 p-3 transition-colors duration-200 hover:border-line">
          <p className="mono text-[0.65rem] uppercase tracking-[0.12em] text-ink-faint">
            <T v={coreData.backendLabel} />
          </p>
          <p className="mt-1 text-step--1 font-medium text-ink">
            <T v={coreData.backendVal} />
          </p>
        </div>

        <div className="rounded-base border border-line-soft bg-surface-2/40 p-3 transition-colors duration-200 hover:border-line">
          <p className="mono text-[0.65rem] uppercase tracking-[0.12em] text-ink-faint">EXP</p>
          <p className="mt-1 text-step--1 font-medium text-accent">
            <T v={coreData.prodMetric} />
          </p>
        </div>

        <div className="rounded-base border border-line-soft bg-surface-2/40 p-3 transition-colors duration-200 hover:border-line">
          <p className="mono text-[0.65rem] uppercase tracking-[0.12em] text-ink-faint">CODEBASE</p>
          <p className="mt-1 text-step--1 font-medium text-ink">
            <T v={coreData.reposMetric} />
          </p>
        </div>
      </div>
    </div>
  );
}
