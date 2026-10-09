"use client";

import { useCallback, useState } from "react";
import { T, t } from "@/lib/i18n";

const coreData = {
  statusBadge: t("Interactive demo", "Demo tương tác"),
  architectureSub: t("Full-stack toolkit", "Công nghệ Full-stack"),
  pulseHint: t("Click to preview the animation", "Nhấp để xem hiệu ứng"),
};


const stackDomains = [
  {
    label: t("Frontend", "Frontend"),
    items: ["React 19", "Next.js", "TypeScript", "Tailwind"],
    highlight: true,
  },
  {
    label: t("Mobile", "Mobile"),
    items: ["React Native", "Flutter", "iOS / Android"],
    highlight: true,
  },
  {
    label: t("Backend", "Backend"),
    items: ["NestJS", "Node.js", "WebSocket", "Redis Fan-out"],
    highlight: false,
  },
  {
    label: t("Data & AI", "Dữ liệu & AI"),
    items: ["PostgreSQL RLS", "Context Engineering", "Docker"],
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
    <div className="cockpit-panel rounded-card glow-subtle relative overflow-hidden p-5 sm:p-6">
      {/* Corner aerodynamic light flares */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-accent/20 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -left-16 h-36 w-36 rounded-full bg-status-live/15 blur-2xl"
      />

      {/* Header telemetry status bar */}
      <div className="flex items-center justify-between border-b border-line-soft pb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="pulse absolute inline-flex h-full w-full rounded-full bg-status-live opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-status-live" />
          </span>
          <span className="mono text-[0.6875rem] uppercase tracking-[0.16em] text-accent font-semibold">
            <T v={coreData.statusBadge} />
          </span>
        </div>
        <span className="mono text-[0.6875rem] uppercase tracking-[0.12em] text-ink-faint">
          <T v={coreData.architectureSub} />
        </span>
      </div>

      {/* Center: The Tachometer Ignition Core */}
      <div className="relative my-4 flex flex-col items-center justify-center">
        <button
          type="button"
          onClick={channelQi}
          onMouseEnter={channelQi}
          onFocus={channelQi}
          aria-label="Preview animation"
          className="group relative flex h-34 w-34 cursor-pointer items-center justify-center rounded-full transition-transform duration-300 active:scale-95"
        >
          {/* Outer rotating tachometer gauge ring with tick notches */}
          <svg
            className="celestial-spin absolute inset-0 h-full w-full text-accent/35 transition-colors duration-300 group-hover:text-accent/70"
            viewBox="0 0 144 144"
            fill="none"
          >
            <circle
              cx="72"
              cy="72"
              r="68"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeDasharray="4 6"
            />
            {/* Speedometer tick accents */}
            <circle cx="72" cy="4" r="3" fill="currentColor" />
            <circle cx="72" cy="140" r="3" fill="currentColor" />
            <circle cx="4" cy="72" r="3" fill="currentColor" />
            <circle cx="140" cy="72" r="3" fill="currentColor" />
          </svg>

          {/* Inner counter-rotating aero turbine ring */}
          <svg
            className="celestial-spin-rev absolute inset-2.5 h-29 w-29 text-accent/20 transition-colors duration-300 group-hover:text-accent/50"
            viewBox="0 0 120 120"
            fill="none"
          >
            <circle
              cx="60"
              cy="60"
              r="56"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="14 10"
            />
            {/* Aerodynamic hexagon core cage */}
            <polygon
              points="60,8 105,34 105,86 60,112 15,86 15,34"
              stroke="currentColor"
              strokeWidth="1"
              strokeOpacity="0.5"
              fill="none"
            />
          </svg>

          {/* Center Engine Ignition Orb */}
          <div
            className={`relative flex h-16 w-16 flex-col items-center justify-center rounded-full border transition-all duration-300 ${
              pulsing
                ? "border-accent bg-accent/30 shadow-[0_0_32px_rgba(237,212,154,0.7)] scale-105"
                : "border-accent/50 bg-surface-2/80 shadow-[0_0_16px_rgba(237,212,154,0.2)] group-hover:border-accent group-hover:shadow-[0_0_24px_rgba(237,212,154,0.4)]"
            }`}
          >
            <span className="mono text-step-0 font-bold tracking-wider text-accent">PLAY</span>
            <span className="mono text-[0.5625rem] uppercase tracking-widest text-ink-faint">DEMO</span>
          </div>
        </button>

        <p className="mono mt-1 text-[0.625rem] uppercase tracking-[0.14em] text-ink-faint transition-colors duration-200 group-hover:text-accent">
          <T v={coreData.pulseHint} />
        </p>
      </div>

      {/* Drivetrain Powertrain Stack Grid */}
      <div className="grid grid-cols-2 gap-2 border-t border-line-soft pt-4 mt-3">
        {stackDomains.map((domain) => (
          <div
            key={domain.label.en}
            className="rounded-base border border-line-soft bg-surface-2/40 p-2.5 transition-colors duration-200 hover:border-line hover:bg-surface-2/60"
          >
            <span
              className={`mono text-[0.625rem] font-semibold uppercase tracking-[0.14em] ${
                domain.highlight ? "text-accent" : "text-ink-faint"
              }`}
            >
              <T v={domain.label} />
            </span>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {domain.items.map((tech) => (
                <span
                  key={tech}
                  className="rounded-chip border border-line-soft/80 bg-paper/70 px-1.5 py-0.5 text-[0.6875rem] font-normal leading-tight text-ink-soft transition-colors hover:border-accent/40 hover:text-accent"
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
