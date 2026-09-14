"use client";

import { useCallback, useState } from "react";
import { T, t } from "@/lib/i18n";

const coreData = {
  statusBadge: t("Full-stack & Mobile", "Kỹ sư Full-stack & Mobile"),
  architectureSub: t("Production-Grade Systems", "Hệ Thống Thực Chiến"),
  pulseHint: t("Click core to pulse interactive scene", "Nhấp để tương tác không gian 3D"),
};

const stackDomains = [
  {
    label: t("Web & UI", "Web & UI"),
    items: ["React 19", "Next.js", "TypeScript", "Tailwind"],
    highlight: true,
  },
  {
    label: t("Mobile", "Mobile"),
    items: ["React Native", "Flutter", "Android", "Cross-plat"],
    highlight: true,
  },
  {
    label: t("Backend", "Backend"),
    items: ["NestJS", "Node.js", "WebSocket", "BullMQ"],
    highlight: false,
  },
  {
    label: t("Cloud & AI", "Cloud & AI"),
    items: ["PostgreSQL", "Redis", "Docker", "OpenAI"],
    highlight: false,
  },
];

export function HeroCore() {
  const [pulsing, setPulsing] = useState(false);

  const channelQi = useCallback(() => {
    setPulsing(true);
    window.dispatchEvent(new CustomEvent("world:pulse"));
    setTimeout(() => setPulsing(false), 900);
  }, []);

  return (
    <div className="panel glow-subtle relative overflow-hidden p-5 sm:p-6">
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
      <div className="flex items-center justify-between border-b border-line-soft pb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="pulse absolute inline-flex h-full w-full rounded-full bg-status-live opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-status-live" />
          </span>
          <span className="mono text-[0.6875rem] uppercase tracking-[0.14em] text-accent font-medium">
            <T v={coreData.statusBadge} />
          </span>
        </div>
        <span className="mono text-[0.6875rem] text-ink-faint">
          <T v={coreData.architectureSub} />
        </span>
      </div>

      {/* Center: The Celestial Core */}
      <div className="relative my-4 flex flex-col items-center justify-center">
        <button
          type="button"
          onClick={channelQi}
          onMouseEnter={channelQi}
          onFocus={channelQi}
          aria-label="Channel pulse into the celestial world"
          className="group relative flex h-32 w-32 cursor-pointer items-center justify-center rounded-full transition-transform duration-300 active:scale-95 focus:outline-none focus-visible:outline-none"
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
            className="celestial-spin-rev absolute inset-2.5 h-27 w-27 text-hairline transition-colors duration-300 group-hover:text-accent/40"
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
            className={`relative flex h-14 w-14 items-center justify-center rounded-full border transition-all duration-300 ${
              pulsing
                ? "border-accent bg-accent/25 shadow-[0_0_24px_rgba(237,212,154,0.6)]"
                : "border-accent/40 bg-surface-2/70 shadow-[0_0_12px_rgba(237,212,154,0.15)] group-hover:border-accent group-hover:shadow-[0_0_20px_rgba(237,212,154,0.35)]"
            }`}
          >
            <span className="mono text-step--1 font-medium text-accent">TVT</span>
          </div>
        </button>

        <p className="mono mt-1 text-[0.625rem] uppercase tracking-[0.12em] text-ink-faint transition-colors duration-200 group-hover:text-accent">
          <T v={coreData.pulseHint} />
        </p>
      </div>

      {/* Telemetry Stack Grid - Sleek Developer Badges */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        {stackDomains.map((domain) => (
          <div
            key={domain.label.en}
            className="rounded-base border border-line-soft bg-surface-2/30 p-2.5 transition-colors duration-200 hover:border-line"
          >
            <span
              className={`mono text-[0.625rem] font-medium uppercase tracking-[0.14em] ${
                domain.highlight ? "text-accent" : "text-ink-faint"
              }`}
            >
              <T v={domain.label} />
            </span>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {domain.items.map((tech) => (
                <span
                  key={tech}
                  className="rounded-chip border border-line-soft/80 bg-paper/60 px-1.5 py-0.5 text-[0.6875rem] font-normal leading-tight text-ink-soft transition-colors hover:border-accent/40 hover:text-accent"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
