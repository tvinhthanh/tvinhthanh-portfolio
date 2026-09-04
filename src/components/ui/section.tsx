import type { ReactNode } from "react";
import { T, type L } from "@/lib/i18n";
import { Reveal } from "./reveal";

type Props = {
  id: string;
  /** The professional name. This is what a recruiter reads. */
  title: L;
  /** The world's name for it. Small, secondary, never load-bearing. */
  aside: L;
  index: string;
  intro?: L;
  wide?: boolean;
  children: ReactNode;
};

export function Section({ id, title, aside, index, intro, wide, children }: Props) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`relative scroll-mt-24 pt-[var(--s-section)] ${wide ? "doc-wide" : "doc"}`}
    >
      <Reveal>
        <p className="meta flex items-center gap-3 text-ink-faint">
          <span className="tnum text-accent">{index}</span>
          <T v={aside} />
        </p>

        <div className="heading-row mt-5 flex items-baseline gap-3">
          <h2 id={`${id}-title`} className="display text-step-4 text-ink">
            <T v={title} />
          </h2>
          <a
            href={`#${id}`}
            aria-label="Link to this section"
            className="anchor mono text-step--1 text-ink-faint no-underline hover:text-accent"
          >
            #
          </a>
        </div>

        {intro ? (
          <p className="mt-4 max-w-[56ch] text-ink-soft">
            <T v={intro} />
          </p>
        ) : null}
      </Reveal>

      <div className="mt-12">{children}</div>
    </section>
  );
}
