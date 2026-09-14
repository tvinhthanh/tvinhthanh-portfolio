import { T, t } from "@/lib/i18n";

/**
 * The tools that carry most of the work, named in one line.
 *
 * This used to be a grid of eight cards, which repeated the hero panel and the
 * expertise map below it for a third time and arrived before the section's own
 * intro had been answered. The map is the thing worth reading here; this is a
 * caption for it, not a competing block.
 */
const core = [
  "Next.js",
  "React",
  "TypeScript",
  "NestJS",
  "PostgreSQL",
  "Redis & BullMQ",
  "Docker",
  "Three.js",
];

const label = t("Reached for first", "Dùng nhiều nhất");

export function ArsenalShowcase() {
  return (
    <div className="mb-10 grid gap-x-10 gap-y-3 border-t border-line pt-7 md:grid-cols-[minmax(0,10rem)_minmax(0,1fr)]">
      <p className="mono pt-0.5 text-step--2 uppercase tracking-[0.14em] text-ink-faint">
        <T v={label} />
      </p>
      <ul className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1.5">
        {core.map((name, i) => (
          <li key={name} className="flex items-baseline gap-2.5 text-step--1 text-ink">
            {i > 0 ? (
              <span aria-hidden="true" className="text-ink-faint">
                ·
              </span>
            ) : null}
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}
