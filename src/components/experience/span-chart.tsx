import { roles } from "@/content/profile";
import { T, t } from "@/lib/i18n";
import {
  concurrencyWindow,
  endOf,
  label,
  labelFromMonths,
  peakConcurrency,
  timeline,
  toMonths,
} from "./span";

/* Three bars on one axis. Deliberately hand-drawn rather than pulled from a
   chart library: it is three rows against a year grid, and no library themes
   cleanly into these tokens for less than 40KB. */

const SPAN = timeline.end - timeline.start;
const pct = (m: number) => ((m - timeline.start) / SPAN) * 100;

const firstYear = Math.ceil(timeline.start / 12);
const lastYear = Math.floor(timeline.end / 12);
const years = Array.from({ length: lastYear - firstYear + 1 }, (_, i) => firstYear + i);

const window = concurrencyWindow();
const peak = peakConcurrency();

const COLS = "grid grid-cols-[var(--lbl)_minmax(0,1fr)] gap-x-5";

export function SpanChart() {
  return (
    // Label column widens once there is room; on a phone the date line is
    // dropped rather than clipped — the timeline below carries it anyway.
    <figure className="mb-14 [--lbl:6.5rem] sm:[--lbl:10rem]">
      <div aria-hidden="true" className="relative">
        {/* Plot overlay: the year grid and the overlap band sit behind every row */}
        <div className="pointer-events-none absolute inset-y-0 right-0 left-[calc(var(--lbl)+1.25rem)]">
          {years.map((year) => (
            <span
              key={year}
              className="absolute inset-y-0 w-px bg-line-soft"
              style={{ left: `${pct(year * 12)}%` }}
            />
          ))}

          {window ? (
            <span
              className="absolute inset-y-0 border-x border-dashed border-accent/45 bg-accent-wash"
              style={{
                left: `${pct(window.from)}%`,
                width: `${pct(window.to) - pct(window.from)}%`,
              }}
            />
          ) : null}
        </div>

        {window ? (
          <div className={`${COLS} relative`}>
            <span />
            <span className="relative block h-5">
              <span
                className="mono absolute -translate-x-1/2 whitespace-nowrap text-step--2 uppercase tracking-[0.12em] text-accent"
                style={{ left: `${(pct(window.from) + pct(window.to)) / 2}%` }}
              >
                <T v={t("Concurrent", "Song song")} />
              </span>
            </span>
          </div>
        ) : null}

        {roles.map((role) => {
          const from = toMonths(role.start);
          const to = endOf(role);
          const running = role.end === null;
          return (
            <div key={role.id} className={`${COLS} relative items-center py-2.5`}>
              <div className="min-w-0 text-right">
                <p className="truncate text-step--1 text-ink">{role.company}</p>
                <p className="mono hidden whitespace-nowrap text-step--2 tabular-nums text-ink-faint sm:block">
                  {label(role.start)} → {role.end ? label(role.end) : "now"}
                </p>
              </div>
              <div className="relative h-2.5">
                <span
                  className={`absolute inset-y-0 rounded-chip ${
                    running
                      ? "bg-accent shadow-[0_0_14px_-2px_var(--accent)]"
                      : "bg-metal opacity-70"
                  }`}
                  style={{ left: `${pct(from)}%`, width: `${((to - from) / SPAN) * 100}%` }}
                />
              </div>
            </div>
          );
        })}

        {/* Year axis, sitting on the same grid the bars are read against */}
        <div className={`${COLS} mt-1`}>
          <span />
          <span className="relative block h-5 border-t border-line">
            {years.map((year) => (
              <span
                key={year}
                className="mono absolute top-1.5 -translate-x-1/2 text-step--2 tabular-nums text-ink-faint"
                style={{ left: `${pct(year * 12)}%` }}
              >
                {year}
              </span>
            ))}
            <span className="mono absolute right-0 top-1.5 text-step--2 uppercase tracking-[0.12em] text-accent">
              <T v={t("now", "nay")} />
            </span>
          </span>
        </div>
      </div>

      {window ? (
        <figcaption className="mt-9 max-w-[58ch] text-step--1 text-ink-soft">
          <T
            v={t(
              `The overlaps are real, not typos. Freelance work is project-based and runs outside the full-time role — more than one has been live since ${labelFromMonths(window.from)}, ${peak} of them at the busiest point.`,
              `Các đoạn chồng lấn là thật, không phải gõ nhầm. Việc freelance theo dự án, chạy ngoài giờ công việc chính — từ ${labelFromMonths(window.from)} tới nay luôn có hơn một việc chạy cùng lúc, lúc bận nhất là ${peak}.`,
            )}
          />
        </figcaption>
      ) : null}
    </figure>
  );
}
