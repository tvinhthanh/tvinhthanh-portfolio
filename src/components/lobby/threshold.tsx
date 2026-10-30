import Image from "next/image";
import Link from "next/link";
import { profile, resumes } from "@/content/profile";
import { T, t } from "@/lib/i18n";
import { RobotToggle } from "../navigation/controls";
import { Reveal } from "../ui/reveal";

const copy = {
  enter: t("Enter the collection", "Vào bộ sưu tập"),
  cv: t("Résumé", "CV"),
  glance: t("At a glance", "Tóm tắt nhanh"),
};

/** Ho Chi Minh City, to four decimals. A real coordinate, not decoration. */
const COORDS = "10.8231° N · 106.6297° E";

/** The docent: the 3D guide who stands at the entrance and nowhere else, over
 *  the card a hiring reader needs before deciding to walk in. */
function Docent() {
  return (
    <div className="flex flex-col items-center">
      <div className="robot-anchor robot-anchor--hero" data-robot-anchor="hero" aria-hidden="true">
        <span className="robot-loader" />
        <Image className="robot-poster" src="/models/robot-poster.webp" alt="" width={400} height={432} />
      </div>
      <Reveal delay={200} className="w-full">
        <div className="placard p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="mono text-step--2 uppercase tracking-[0.14em] text-accent">
              <T v={copy.glance} />
            </h2>
            <RobotToggle />
          </div>
          <dl className="mt-3 divide-y divide-line-soft">
            {profile.facts.map((fact) => (
              <div key={fact.label.en} className="grid grid-cols-[8.5rem_minmax(0,1fr)] gap-x-4 py-2.5">
                <dt className="mono pt-0.5 text-step--2 uppercase tracking-[0.13em] text-ink-faint">
                  <T v={fact.label} />
                </dt>
                <dd className="text-step--1 text-ink">
                  <T v={fact.value} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>
    </div>
  );
}

/** The first thing through the door: who this is, and where to go next. */
export function Threshold() {
  return (
    <section
      id="home"
      aria-labelledby="lobby-title"
      className="flex min-h-[calc(100svh-var(--plan))] flex-col justify-end pb-10 pt-20"
    >
      <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
        {/* The shield keeps the statement readable where the river crosses it. */}
        <div className="text-shield lg:col-span-7">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-step--2">
              <span aria-hidden="true" className="pulse h-1.5 w-1.5 rounded-full bg-status-live" />
              <span className="mono font-medium uppercase tracking-[0.14em] text-ink-soft">
                <T v={profile.discipline} />
              </span>
            </p>
            <h1 id="lobby-title" className="display mt-6 max-w-[18ch] text-balance text-step-hero text-ink">
              {profile.name}
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="mt-7 max-w-[46ch] text-step-1 leading-[1.68] text-ink-soft">
              <T v={profile.statement} />
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/projects"
                transitionTypes={["nav-forward"]}
                className="group inline-flex h-12 items-center gap-3 rounded-base bg-accent px-6 text-step--1 font-medium text-on-accent no-underline transition-colors duration-200 hover:bg-accent-hot"
              >
                <T v={copy.enter} />
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex h-12 items-center gap-2 rounded-base border border-line bg-surface px-5 text-step--1 text-ink no-underline transition-colors duration-200 hover:border-accent hover:text-accent"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                {profile.email}
              </a>
            </div>
            <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-step--1">
              <span className="mono text-step--2 uppercase tracking-[0.14em] text-ink-faint">
                <T v={copy.cv} />
              </span>
              {resumes.map((cv) => (
                <a
                  key={cv.file}
                  href={cv.file}
                  download
                  className="text-ink underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                >
                  <T v={cv.label} /> (PDF)
                </a>
              ))}
            </p>
          </Reveal>

          <Reveal delay={340}>
            <dl className="mono mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-step--2 uppercase tracking-[0.13em]">
              <div>
                <dt className="sr-only">
                  <T v={t("Location", "Địa điểm")} />
                </dt>
                <dd className="text-ink-soft">
                  <T v={profile.location} />
                  <span aria-hidden="true" className="mt-1 block whitespace-nowrap text-ink-faint sm:ml-2 sm:mt-0 sm:inline">
                    {COORDS}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="sr-only">
                  <T v={t("Availability", "Tình trạng")} />
                </dt>
                <dd className="flex items-center gap-2 text-ink-soft">
                  <span aria-hidden="true" className="pulse h-1.5 w-1.5 rounded-full bg-status-live" />
                  <T v={profile.availability} />
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>

        <div className="lg:col-span-5">
          <Docent />
        </div>
      </div>
    </section>
  );
}
