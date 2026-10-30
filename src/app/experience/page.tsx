import type { Metadata } from "next";
import { SpanChart } from "@/components/experience/span-chart";
import { Timeline } from "@/components/experience/timeline";
import { Doorways, Gallery, RoomFrame, RoomHeader } from "@/components/rooms/room";
import { Reveal } from "@/components/ui/reveal";
import { education, languages, roles } from "@/content/profile";
import { T, t } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Experience of Truong Vinh Thanh: full-stack and frontend roles since 2023, with the work and stack of each, plus education and languages.",
  alternates: { canonical: "/experience" },
};

const since = roles.reduce((first, role) => (role.start < first ? role.start : first), roles[0].start).slice(0, 4);

export default function ExperienceRoom() {
  return (
    <RoomFrame>
      <RoomHeader
        id="experience"
        facts={[
          t(`${roles.length} roles`, `${roles.length} vị trí`),
          t(`Since ${since}`, `Từ ${since}`),
        ]}
      />

      <Gallery id="roles" aside={t("Along the wall", "Dọc bức tường")} title={t("Roles", "Các vị trí")}>
        <Reveal className="placard p-5 sm:p-8">
          <SpanChart />
        </Reveal>
        <div className="placard mt-6 p-6 sm:p-10">
          <Timeline />
        </div>
      </Gallery>

      <Gallery id="background" aside={t("Education & languages", "Học vấn & ngôn ngữ")} title={t("Background", "Nền tảng")}>
        <Reveal className="placard grid gap-x-10 gap-y-8 p-6 sm:p-10 md:grid-cols-2">
          <div>
            <h3 className="mono text-step--2 uppercase tracking-[0.14em] text-ink-faint">
              <T v={t("Education", "Học vấn")} />
            </h3>
            <p className="display mt-3 text-step-3 font-semibold text-ink">{education.school}</p>
            <p className="mt-1 text-ink-soft">
              <T v={education.program} />
            </p>
          </div>
          <div>
            <h3 className="mono text-step--2 uppercase tracking-[0.14em] text-ink-faint">
              <T v={t("Languages", "Ngôn ngữ")} />
            </h3>
            <ul className="mt-3 space-y-1.5">
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
          </div>
        </Reveal>
      </Gallery>

      <Doorways current="experience" />
    </RoomFrame>
  );
}
