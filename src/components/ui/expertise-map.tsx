"use client";

import { useId, useState } from "react";
import { domains } from "@/content/profile";
import { T, t } from "@/lib/i18n";
import { useT } from "@/lib/use-lang";

const SIZE = 420;
const C = SIZE / 2;
const R_INNER = 92;
const R_TICK = 176;
const R_LABEL = 196;
const GAP_DEG = 2.6;

const round = (n: number) => Math.round(n * 100) / 100;

function polar(radius: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: round(C + radius * Math.cos(rad)), y: round(C + radius * Math.sin(rad)) };
}

/** Annular sector — the shape of one domain in the wheel. */
function sector(rInner: number, rOuter: number, from: number, to: number) {
  const large = to - from > 180 ? 1 : 0;
  const a = polar(rOuter, from);
  const b = polar(rOuter, to);
  const c = polar(rInner, to);
  const d = polar(rInner, from);
  return [
    `M ${a.x} ${a.y}`,
    `A ${rOuter} ${rOuter} 0 ${large} 1 ${b.x} ${b.y}`,
    `L ${c.x} ${c.y}`,
    `A ${rInner} ${rInner} 0 ${large} 0 ${d.x} ${d.y}`,
    "Z",
  ].join(" ");
}

/* Geometry is computed once at module scope: it never changes, and this keeps
   the server and client markup byte-identical. */
const SWEEP = 360 / domains.length;

const segments = domains.map((domain, i) => {
  const from = i * SWEEP + GAP_DEG / 2;
  const to = (i + 1) * SWEEP - GAP_DEG / 2;
  const mid = (from + to) / 2;
  // Thickness is the depth signal: a broader domain reaches further out.
  const rOuter = R_INNER + 22 + domain.depth * 10;

  // A constellation inside each segment, one node per technology.
  const nodes = domain.items.map((item, j) => {
    const step = (to - from) / (domain.items.length + 1);
    const angle = from + step * (j + 1);
    const radius = R_INNER + 14 + ((j * 7) % (rOuter - R_INNER - 22));
    const p = polar(radius, angle);
    return { key: item, ...p, r: round(1.1 + ((j * 3) % 5) * 0.32) };
  });

  return {
    domain,
    path: sector(R_INNER, rOuter, from, to),
    spoke: { from: polar(R_INNER - 2, mid), to: polar(rOuter - 6, mid) },
    label: polar(R_LABEL, mid),
    mid,
    nodes,
  };
});

// Ninety marks around the rim: one per four degrees, long every ninth.
const ticks = Array.from({ length: 90 }, (_, i) => {
  const angle = i * 4;
  const long = i % 9 === 0;
  return {
    key: i,
    from: polar(long ? R_TICK : R_TICK + 3, angle),
    to: polar(R_TICK + 6, angle),
    long,
  };
});

export function ExpertiseMap() {
  const [activeId, setActiveId] = useState(domains[0].id);
  const titleId = useId();
  const tr = useT();

  const active = domains.find((d) => d.id === activeId) ?? domains[0];

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:items-center lg:gap-14">
      {/* ---------- the wheel (pointer + keyboard, desktop and tablet) ---------- */}
      <div className="relative mx-auto hidden w-full max-w-[27rem] px-10 sm:block">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="h-auto w-full overflow-visible"
          role="group"
          aria-labelledby={titleId}
        >
          <title id={titleId}>Technical domains, by breadth</title>

          {/* Outer measuring ring */}
          <g className="text-hairline">
            {ticks.map((tick) => (
              <line
                key={tick.key}
                x1={tick.from.x}
                y1={tick.from.y}
                x2={tick.to.x}
                y2={tick.to.y}
                stroke="currentColor"
                strokeWidth={tick.long ? 1.1 : 0.6}
                opacity={tick.long ? 0.9 : 0.45}
              />
            ))}
          </g>

          {segments.map(({ domain, path, spoke, label, nodes }) => {
            const on = domain.id === active.id;
            return (
              <g
                key={domain.id}
                className={`cursor-pointer transition-opacity duration-500 ${
                  on ? "opacity-100" : "opacity-45 hover:opacity-75"
                }`}
                onMouseEnter={() => setActiveId(domain.id)}
                onFocus={() => setActiveId(domain.id)}
              >
                {/* Energy line from the core out to the segment */}
                <line
                  x1={spoke.from.x}
                  y1={spoke.from.y}
                  x2={spoke.to.x}
                  y2={spoke.to.y}
                  stroke="var(--accent)"
                  strokeWidth={on ? 1.2 : 0.6}
                  opacity={on ? 0.75 : 0.25}
                  className="transition-all duration-500"
                />

                <path
                  d={path}
                  role="button"
                  tabIndex={0}
                  aria-pressed={on}
                  aria-label={`${tr(domain.label)} — ${domain.items.length} technologies`}
                  onClick={() => setActiveId(domain.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveId(domain.id);
                    }
                  }}
                  fill="var(--accent)"
                  fillOpacity={on ? 0.15 : 0.06}
                  stroke="var(--accent)"
                  strokeWidth={on ? 1.1 : 0.55}
                  strokeOpacity={on ? 0.9 : 0.42}
                  className="sector transition-all duration-500"
                />

                {nodes.map((node) => (
                  <circle
                    key={node.key}
                    cx={node.x}
                    cy={node.y}
                    r={node.r}
                    fill="var(--accent)"
                    opacity={on ? 0.95 : 0.4}
                    className="transition-opacity duration-500"
                  />
                ))}

                <text
                  x={label.x}
                  y={label.y}
                  textAnchor={label.x > C + 4 ? "start" : label.x < C - 4 ? "end" : "middle"}
                  dominantBaseline="middle"
                  className="pointer-events-none fill-current uppercase"
                  style={{
                    fontFamily: "var(--font-code), monospace",
                    fontSize: "var(--step--2)",
                    letterSpacing: "0.12em",
                    color: on ? "var(--accent)" : "var(--ink-faint)",
                  }}
                >
                  {domain.short.toUpperCase()}
                </text>
              </g>
            );
          })}

          {/* The core */}
          <circle cx={C} cy={C} r={R_INNER - 12} fill="var(--surface)" stroke="var(--line)" />
          <circle
            cx={C}
            cy={C}
            r={R_INNER - 28}
            fill="none"
            stroke="var(--accent)"
            strokeOpacity="0.35"
            strokeDasharray="2 6"
          />
          <text
            x={C}
            y={C - 8}
            textAnchor="middle"
            className="fill-current uppercase"
            style={{
              fontFamily: "var(--font-code), monospace",
              fontSize: "var(--step--2)",
              letterSpacing: "0.16em",
              color: "var(--ink-faint)",
            }}
          >
            {domains.length} domains
          </text>
          <text
            x={C}
            y={C + 14}
            textAnchor="middle"
            className="fill-current"
            style={{
              fontFamily: "var(--font-code), monospace",
              fontSize: "var(--step--1)",
              letterSpacing: "0.1em",
              color: "var(--accent)",
            }}
          >
            {domains.reduce((n, d) => n + d.items.length, 0)} techniques
          </text>
        </svg>
      </div>

      {/* ---------- detail panel ---------- */}
      <div className="panel hidden p-6 sm:block" aria-live="polite">
        <p className="mono text-step--2 uppercase tracking-[0.14em] text-accent">
          <T v={active.aside} />
        </p>
        <h3 className="display mt-2 text-step-2 text-ink">
          <T v={active.label} />
        </h3>
        <ul key={active.id} className="mt-5 flex flex-wrap gap-1.5">
          {active.items.map((item, i) => (
            <li
              key={item}
              className="reveal-chip rounded-chip border border-line px-2 py-1 text-step--2 text-ink-soft"
              style={{ animationDelay: `${i * 28}ms` }}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* ---------- mobile: same content, opened one domain at a time ---------- */}
      <div className="space-y-2 sm:hidden">
        {domains.map((domain) => {
          const on = domain.id === activeId;
          return (
            <div key={domain.id} className="panel overflow-hidden">
              <h3>
                <button
                  type="button"
                  onClick={() => setActiveId(on ? "" : domain.id)}
                  aria-expanded={on}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
                    <circle
                      cx="12"
                      cy="12"
                      r="8"
                      fill="none"
                      stroke="var(--accent)"
                      strokeOpacity={on ? 0.9 : 0.35}
                      strokeWidth="1.4"
                      strokeDasharray={`${domain.depth * 8} 40`}
                    />
                    <circle cx="12" cy="12" r="2.4" fill="var(--accent)" opacity={on ? 1 : 0.4} />
                  </svg>
                  <span className="flex-1">
                    <span className="block text-step--1 font-medium text-ink">
                      <T v={domain.label} />
                    </span>
                    <span className="mono block text-step--2 uppercase tracking-[0.12em] text-ink-faint">
                      <T v={domain.aside} />
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={`text-ink-faint transition-transform duration-300 ${on ? "rotate-45" : ""}`}
                  >
                    +
                  </span>
                </button>
              </h3>
              {on ? (
                <ul className="flex flex-wrap gap-1.5 border-t border-line-soft px-4 py-4">
                  {domain.items.map((item, i) => (
                    <li
                      key={item}
                      className="reveal-chip rounded-chip border border-line px-2 py-1 text-step--2 text-ink-soft"
                      style={{ animationDelay: `${i * 24}ms` }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          );
        })}
      </div>

      <p className="mono sr-only">
        <T v={t("Thicker segments mean broader ground.", "Vòng cung dày hơn nghĩa là mảng đó rộng hơn.")} />
      </p>
    </div>
  );
}
