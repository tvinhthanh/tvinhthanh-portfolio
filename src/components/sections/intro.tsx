import { pages, profile, resumes } from "@/content/profile";
import { T, t } from "@/lib/i18n";
import { Reveal } from "../ui/reveal";
import { Section } from "../ui/section";

const page = pages[1];

export function Intro() {
  return (
    <Section id="intro" index="01" title={page.label} aside={page.aside}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,19rem)] lg:gap-14">
        <div>
          <Reveal>
            <p className="text-step-1 leading-[1.75] text-ink">
              <T v={profile.intro} />
            </p>
          </Reveal>

          <Reveal delay={90}>
            <p className="mt-6 text-ink-soft">
              <T v={profile.introSecondary} />
            </p>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-step--1">
              <span className="mono text-step--2 uppercase tracking-[0.14em] text-ink-faint">
                <T v={t("Résumé", "CV")} />
              </span>
              {resumes.map((cv) => (
                <a
                  key={cv.file}
                  href={cv.file}
                  download
                  className="text-ink-soft underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                >
                  <T v={cv.label} /> (PDF)
                </a>
              ))}
            </p>
          </Reveal>
        </div>

        <Reveal delay={120}>
          {/* The recruiter panel: role, years, stack, impact — the four
              things a hiring reader needs before they decide to keep going.
              Kept at step-0 so it reads without leaning in. */}
          <dl className="divide-y divide-line-soft rounded-base border border-line bg-surface-2/50">
            {profile.facts.map((fact) => (
              <div key={fact.label.en} className="px-4 py-3.5">
                <dt className="mono text-step--2 uppercase tracking-[0.14em] text-ink-faint">
                  <T v={fact.label} />
                </dt>
                <dd className="mt-1 text-step-0 leading-[1.5] text-ink">
                  <T v={fact.value} />
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  );
}
