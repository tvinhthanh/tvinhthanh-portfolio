import { profile } from "@/content/profile";
import { T, t } from "@/lib/i18n";
import { Reveal } from "../ui/reveal";
import { HeroCore } from "./hero-core";

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
      <div className="doc-wide grid gap-12 lg:grid-cols-12 lg:items-center">
        {/* Left column: Profile statements and CTAs */}
        <div className="lg:col-span-7">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-3 py-1 text-step--2 backdrop-blur-md">
              <span className="pulse h-1.5 w-1.5 rounded-full bg-status-live" />
              <span className="mono uppercase tracking-[0.14em] text-ink-soft font-medium">
                <T v={profile.discipline} />
              </span>
            </div>

            {/* One name, one block. It wraps where the column ends */}
            <h1
              id="hero-name"
              className="display mt-6 max-w-[18ch] text-balance text-step-hero text-ink"
            >
              {profile.name}
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="mt-7 max-w-[46ch] text-step-1 leading-[1.68] text-ink-soft">
              <T v={profile.statement} />
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-9 flex flex-wrap items-center gap-3.5">
              <a
                href="#projects"
                className="shimmer-gold-btn inline-flex h-12 items-center rounded-base bg-accent px-6 text-step--1 font-medium text-on-accent no-underline shadow-[0_0_24px_rgba(237,212,154,0.28)] transition-all duration-200 hover:bg-accent-hot hover:shadow-[0_0_36px_rgba(237,212,154,0.48)] hover:-translate-y-0.5"
              >
                <T v={cta.work} />
              </a>
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex h-12 items-center gap-2 rounded-base border border-line bg-surface/50 px-5 text-step--1 text-ink no-underline backdrop-blur-md transition-all duration-200 hover:border-accent hover:text-accent hover:-translate-y-0.5"
              >
                GitHub
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 17 17 7M8 7h9v9" />
                </svg>
              </a>
            </div>
          </Reveal>

          <Reveal delay={340}>
            <dl className="mono mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-step--2 uppercase tracking-[0.13em] text-ink-faint">
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

        {/* Right column: Interactive System Core */}
        <div className="lg:col-span-5">
          <Reveal delay={200}>
            <HeroCore />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
