import Link from "next/link";
import { ViewTransition } from "react";
import type { ExhibitEntry } from "@/content/projects";
import { T } from "@/lib/i18n";
import { Reveal } from "../ui/reveal";
import { Pulse } from "../world/pulse";
import { categoryLabel, labels } from "./labels";
import { Sigil } from "./sigil";

type Props = ExhibitEntry & {
  /** `hang` is a principal work on its own wall; `salon` hangs beside others. */
  variant: "hang" | "salon";
  /** Principal works alternate sides down the wall. */
  flip?: boolean;
  delay?: number;
};

/** The work itself: the project's constellation behind glass. Shares a name
 *  with the exhibit page, so opening it carries the picture with you. */
export function Artwork({ id, index, className = "" }: { id: string; index: string; className?: string }) {
  return (
    <ViewTransition name={`exhibit-art-${id}`} share="morph" default="none">
      <span className={`vitrine block ${className}`}>
        <span aria-hidden="true" className="absolute inset-0 text-accent opacity-60 transition-opacity duration-700 group-hover:opacity-90">
          <Sigil seed={id} className="h-full w-full" />
        </span>
        <span aria-hidden="true" className="display absolute bottom-3 left-5 text-step-5 leading-none text-accent/50 sm:left-6">
          {index}
        </span>
      </span>
    </ViewTransition>
  );
}

/** One exhibit on the gallery wall: the work, and the label beside it. */
export function Exhibit({ project, detail, variant, flip = false, delay = 0 }: Props) {
  const href = `/projects/${project.id}`;
  const hang = variant === "hang";

  return (
    <Reveal as="article" delay={delay}>
      <Pulse
        className={`group exhibit grid overflow-hidden ${
          hang ? "lg:grid-cols-12" : ""
        }`}
      >
        {/* The picture repeats the title link for pointer users only; keyboard
            and screen reader users get one stop per exhibit, on the title. */}
        <Link
          href={href}
          transitionTypes={["nav-forward"]}
          tabIndex={-1}
          aria-hidden="true"
          className={`relative block ${
            hang ? `lg:col-span-7 ${flip ? "lg:order-2" : ""}` : ""
          }`}
        >
          <Artwork
            id={project.id}
            index={detail.index}
            className={hang ? "aspect-[16/8] lg:aspect-auto lg:h-full lg:min-h-[21rem]" : "aspect-[16/6]"}
          />
          <span className="absolute left-5 top-4 flex flex-wrap items-center gap-2 sm:left-6">
            <span className="mono rounded-chip border border-line bg-paper/85 px-2.5 py-0.5 text-step--2 uppercase tracking-[0.14em] text-ink-soft">
              <T v={categoryLabel[project.category]} />
            </span>
            {project.rulesUrl ? (
              <span className="mono rounded-chip border border-accent/40 bg-paper/85 px-2.5 py-0.5 text-step--2 uppercase tracking-[0.12em] text-accent">
                <T v={labels.aiNative} />
              </span>
            ) : null}
          </span>
        </Link>

        <div className={`wall-label flex flex-col p-6 sm:p-8 ${hang ? "lg:col-span-5" : ""}`}>
          <p className="meta text-ink-faint">
            <T v={labels.exhibit} /> <span className="tnum text-accent">{detail.index}</span>
          </p>

          <ViewTransition name={`exhibit-${project.id}`} share="morph" default="none">
            <h3 className={`display mt-3 font-semibold text-ink ${hang ? "text-step-4" : "text-step-3"}`}>
              <Link
                href={href}
                transitionTypes={["nav-forward"]}
                className="text-ink no-underline transition-colors duration-200 hover:text-accent"
              >
                <T v={project.name} />
              </Link>
            </h3>
          </ViewTransition>

          <p className={`mt-3 text-ink-soft ${hang ? "line-clamp-5 text-step-0" : "line-clamp-3 text-step--1"}`}>
            <T v={project.summary} />
          </p>

          <dl className="mt-5 space-y-2.5 border-t border-line-soft pt-4 text-step--1">
            <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-4">
              <dt className="mono pt-0.5 text-step--2 uppercase tracking-[0.13em] text-ink-faint">
                <T v={labels.built} />
              </dt>
              <dd className="text-ink-soft">{project.built.join(" · ")}</dd>
            </div>
            {hang ? (
              <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-4">
                <dt className="mono pt-0.5 text-step--2 uppercase tracking-[0.13em] text-ink-faint">
                  <T v={labels.role} />
                </dt>
                <dd className="line-clamp-3 text-ink-soft">
                  <T v={detail.role} />
                </dd>
              </div>
            ) : null}
          </dl>

          <p className="mt-auto pt-6">
            <Link
              href={href}
              transitionTypes={["nav-forward"]}
              tabIndex={-1}
              aria-hidden="true"
              className="mono inline-flex items-center gap-2 text-step--2 uppercase tracking-[0.14em] text-accent no-underline"
            >
              <T v={labels.view} />
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </p>
        </div>
      </Pulse>
    </Reveal>
  );
}
