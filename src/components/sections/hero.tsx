import { profile } from "@/content/profile";
import { T, t } from "@/lib/i18n";
import { Reveal } from "../ui/reveal";

const cta = {
  work: t("Explore my work", "Xem dự án"),
};

/** Ho Chi Minh City, to four decimals. A real coordinate, not decoration. */
const COORDS = "10.8231° N · 106.6297° E";

export function Hero() {
  return (
    <section
      id="home"
      aria-labelledby="hero-name"
      className="relative flex min-h-[86svh] flex-col justify-end px-5 pb-14 pt-24 sm:px-8 lg:min-h-[94svh] lg:px-16 lg:pb-20"
    >
      <div className="doc-wide">
        <Reveal>
          <p className="meta text-metal">
            <T v={profile.discipline} />
          </p>

          {/* One name, one block. It wraps where the column ends — no hand-placed
              line break, and no indent on the second line. */}
          <h1
            id="hero-name"
            className="display mt-8 max-w-[18ch] text-balance text-step-hero text-ink"
          >
            {profile.name}
          </h1>
        </Reveal>

        <Reveal delay={140}>
          <p className="mt-8 max-w-[46ch] text-step-1 leading-[1.65] text-ink-soft">
            <T v={profile.statement} />
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="inline-flex h-12 items-center rounded-base bg-accent px-6 text-step--1 font-medium text-on-accent no-underline transition-colors duration-200 hover:bg-accent-hot"
            >
              <T v={cta.work} />
            </a>
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex h-12 items-center gap-2 rounded-base border border-line px-5 text-step--1 text-ink no-underline transition-colors duration-200 hover:border-accent hover:text-accent"
            >
              GitHub
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 17 17 7M8 7h9v9" />
              </svg>
            </a>
          </div>
        </Reveal>

        <Reveal delay={340}>
          <dl className="mono mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 text-step--2 uppercase tracking-[0.13em] text-ink-faint">
            <div className="flex items-center gap-2">
              <dt className="sr-only">Location</dt>
              <dd>
                <T v={profile.location} />
                <span aria-hidden="true" className="ml-2 text-hairline">
                  {COORDS}
                </span>
              </dd>
            </div>
            <div className="flex items-center gap-2">
              <dt className="sr-only">Availability</dt>
              <dd className="flex items-center gap-2 text-ink-soft">
                <span aria-hidden="true" className="pulse h-1.5 w-1.5 rounded-full bg-status-live" />
                <T v={profile.availability} />
              </dd>
            </div>
            <div>
              <dt className="sr-only">Core stack</dt>
              <dd>{profile.headline}</dd>
            </div>
          </dl>
        </Reveal>

      </div>
    </section>
  );
}
