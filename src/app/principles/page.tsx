import type { Metadata } from "next";
import { Doorways, Gallery, RoomFrame, RoomHeader } from "@/components/rooms/room";
import { Reveal } from "@/components/ui/reveal";
import { philosophy } from "@/content/profile";
import { T, t } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Principles",
  description:
    "Engineering principles of Truong Vinh Thanh: data integrity at the system boundary, deterministic state at the interface, and where that shows up in the work.",
  alternates: { canonical: "/principles" },
};

const columns = {
  where: t("Where", "Ở đâu"),
  how: t("How it shows up", "Nó hiện ra thế nào"),
};

export default function PrinciplesRoom() {
  return (
    <RoomFrame>
      <RoomHeader
        id="principles"
        facts={[t(`${philosophy.examples.length} places it shows up`, `${philosophy.examples.length} nơi nó hiện ra`)]}
      />

      {/* The one piece in this room, hung alone on the wall with space around
          it. Everything after it is commentary. */}
      <Reveal className="pt-[var(--s-section)]">
        <figure className="text-shield mx-auto max-w-[52rem] text-center">
          <p className="meta text-ink-faint">
            <T v={philosophy.eyebrow} />
          </p>
          <span aria-hidden="true" className="mx-auto mt-8 block h-px w-24 bg-gradient-to-r from-transparent via-accent to-transparent" />
          <blockquote className="mt-8">
            <p className="display text-balance text-step-5 font-medium leading-[1.2] text-ink">
              <T v={philosophy.statement} />
            </p>
          </blockquote>
          <span aria-hidden="true" className="mx-auto mt-8 block h-px w-24 bg-gradient-to-r from-transparent via-accent to-transparent" />
        </figure>
      </Reveal>

      <Gallery id="where" aside={t("Commentary", "Chú giải")} title={t("Where it shows up", "Nó hiện ra ở đâu")}>
        <Reveal className="placard p-5 sm:p-8">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="mono w-[12rem] pb-3 pr-6 text-step--2 font-normal uppercase tracking-[0.14em] text-ink-faint">
                    <T v={columns.where} />
                  </th>
                  <th scope="col" className="mono pb-3 text-step--2 font-normal uppercase tracking-[0.14em] text-ink-faint">
                    <T v={columns.how} />
                  </th>
                </tr>
              </thead>
              <tbody>
                {philosophy.examples.map((row) => (
                  <tr key={row.where.en} className="border-b border-line-soft align-top last:border-b-0">
                    <th scope="row" className="py-4 pr-6 text-step--1 font-medium text-ink">
                      <T v={row.where} />
                    </th>
                    <td className="py-4 text-step--1 leading-[1.7] text-ink-soft">
                      <T v={row.how} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal delay={90} className="text-shield mt-10 max-w-[60ch]">
          <p className="text-step-1 leading-[1.7] text-ink-soft">
            <T v={philosophy.closing} />
          </p>
        </Reveal>
      </Gallery>

      <Doorways current="principles" />
    </RoomFrame>
  );
}
