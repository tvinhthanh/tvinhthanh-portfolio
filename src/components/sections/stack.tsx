import { education, languages, pages } from "@/content/profile";
import { T, t } from "@/lib/i18n";
import { ExpertiseMap } from "../ui/expertise-map";
import { Reveal } from "../ui/reveal";
import { Section } from "../ui/section";

const stackPage = pages[5];
const backgroundPage = pages[6];

export function Stack() {
  return (
    <Section
      id="stack"
      index="05"
      wide
      title={stackPage.label}
      aside={stackPage.aside}
      intro={t(
        "Nine domains around one core. Segment thickness and node density show where the ground is broadest — hover or tap a segment to read what is actually in it.",
        "Chín mảng quanh một lõi. Độ dày cung và mật độ điểm cho thấy mảng nào rộng nhất — rê chuột hoặc chạm vào một cung để xem bên trong có gì.",
      )}
    >
      <Reveal>
        <ExpertiseMap />
      </Reveal>
    </Section>
  );
}

export function Background() {
  return (
    <Section id="background" index="06" title={backgroundPage.label} aside={backgroundPage.aside}>
      <div>
        <Reveal className="grid gap-x-10 gap-y-3 border-t border-line py-7 md:grid-cols-[minmax(0,10rem)_minmax(0,1fr)]">
          <p className="mono pt-1 text-step--2 uppercase tracking-[0.14em] text-ink-faint">
            <T v={t("Education", "Học vấn")} />
          </p>
          <div>
            <h3 className="display text-step-2 text-ink">{education.school}</h3>
            <p className="mt-2 text-ink-soft">
              <T v={education.program} />
            </p>
          </div>
        </Reveal>

        <Reveal
          delay={70}
          className="grid gap-x-10 gap-y-3 border-t border-line py-7 md:grid-cols-[minmax(0,10rem)_minmax(0,1fr)]"
        >
          <p className="mono pt-1 text-step--2 uppercase tracking-[0.14em] text-ink-faint">
            <T v={t("Languages", "Ngôn ngữ")} />
          </p>
          <ul className="space-y-1.5">
            {languages.map((lang) => (
              <li key={lang.name.en} className="flex flex-wrap items-baseline gap-x-3">
                <span className="font-medium text-ink">
                  <T v={lang.name} />
                </span>
                <span className="text-step--1 text-ink-soft">
                  <T v={lang.level} />
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
