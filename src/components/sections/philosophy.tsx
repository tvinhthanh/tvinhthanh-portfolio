import { pages, philosophy } from "@/content/profile";
import { T, t } from "@/lib/i18n";
import { Reveal } from "../ui/reveal";
import { Section } from "../ui/section";

const page = pages[2];

const columns = {
  where: t("Where", "Ở đâu"),
  how: t("How it shows up", "Nó hiện ra thế nào"),
};

export function Philosophy() {
  return (
    <Section
      id="philosophy"
      index="02"
      title={page.label}
      aside={page.aside}
      intro={philosophy.eyebrow}
    >
      {/* The hinge of the page: everything above leads here, everything below
          is evidence for it. */}
      <Reveal>
        <figure className="panel relative overflow-hidden px-6 py-8 sm:px-10 sm:py-10">
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-accent to-transparent"
          />
          <blockquote>
            <p className="display max-w-[42ch] text-step-3 leading-[1.24] text-ink sm:text-step-4">
              <T v={philosophy.statement} />
            </p>
          </blockquote>
        </figure>
      </Reveal>

      <Reveal delay={90} className="mt-12">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-line">
                <th
                  scope="col"
                  className="mono w-[10rem] pb-3 pr-6 text-step--2 font-normal uppercase tracking-[0.14em] text-ink-faint"
                >
                  <T v={columns.where} />
                </th>
                <th
                  scope="col"
                  className="mono pb-3 text-step--2 font-normal uppercase tracking-[0.14em] text-ink-faint"
                >
                  <T v={columns.how} />
                </th>
              </tr>
            </thead>
            <tbody>
              {philosophy.examples.map((row) => (
                <tr key={row.where.en} className="border-b border-line-soft align-top">
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

      <Reveal delay={140} className="mt-8">
        <p className="max-w-[58ch] text-ink-soft">
          <T v={philosophy.closing} />
        </p>
      </Reveal>
    </Section>
  );
}
