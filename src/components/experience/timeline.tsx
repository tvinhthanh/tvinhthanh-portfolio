import { roles } from "@/content/profile";
import { T, t } from "@/lib/i18n";
import { Reveal } from "../ui/reveal";
import { concurrentWith, duration, label } from "./span";

const now = t("now", "hiện tại");
const current = t("Current", "Hiện tại");

/** One thread, three stations. Nodes light as each role comes into view. */
export function Timeline() {
  return (
    <ol className="relative pl-8 sm:pl-10">
      <span aria-hidden="true" className="thread absolute bottom-4 left-[3px] top-3 w-px" />

      {roles.map((role, i) => {
        const running = role.end === null;
        const alongside = concurrentWith(role);

        return (
          <Reveal
            key={role.id}
            as="li"
            delay={i * 80}
            className="group relative block pb-14 last:pb-0"
          >
            <span
              aria-hidden="true"
              className={`absolute -left-8 top-2 h-[9px] w-[9px] rounded-full border transition-all duration-700 sm:-left-10 ${
                running ? "border-accent" : "border-hairline"
              } bg-paper group-data-[shown=true]:bg-accent group-data-[shown=true]:shadow-[0_0_0_3px_var(--accent-wash),0_0_14px_var(--accent)]`}
            />

            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <p className="mono text-step--2 uppercase tracking-[0.14em] text-ink-faint">
                <span className="tnum">{label(role.start)}</span>
                <span aria-hidden="true" className="mx-2 text-hairline">
                  →
                </span>
                <span className="tnum">{role.end ? label(role.end) : <T v={now} />}</span>
                <span aria-hidden="true" className="mx-2 text-hairline">
                  ·
                </span>
                <span className="tnum">{duration(role)}</span>
              </p>

              {running ? (
                <span className="mono inline-flex items-center gap-2 rounded-base border border-accent/40 bg-accent-wash px-2 py-0.5 text-step--2 uppercase tracking-[0.12em] text-accent">
                  <span aria-hidden="true" className="pulse h-1.5 w-1.5 rounded-full bg-status-live" />
                  <T v={current} />
                </span>
              ) : null}

              {/* Held at the same time as another role — stated, so it cannot be
                  mistaken for a typo in the dates. */}
              {alongside.length > 0 ? (
                <span className="mono inline-flex items-center rounded-base border border-line px-2 py-0.5 text-step--2 uppercase tracking-[0.12em] text-metal">
                  <T
                    v={t(
                      `Alongside ${alongside.map((r) => r.company).join(", ")}`,
                      `Song song với ${alongside.map((r) => r.company).join(", ")}`,
                    )}
                  />
                </span>
              ) : null}
            </div>

            <h3 className="display mt-3 text-step-2 text-ink">
              <T v={role.title} />
              <span aria-hidden="true" className="mx-2 text-ink-faint">
                ·
              </span>
              <span className="text-accent">{role.company}</span>
            </h3>

            <p className="mono mt-1 text-step--2 uppercase tracking-[0.13em] text-ink-faint">
              <T v={role.location} />
            </p>

            <p className="mt-4 max-w-[62ch] text-ink-soft">
              <T v={role.summary} />
            </p>

            <ul className="mt-5 max-w-[66ch] space-y-2.5">
              {role.work.map((line) => (
                <li
                  key={line.en}
                  className="relative pl-5 text-step--1 leading-[1.72] text-ink-soft"
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-[0.72em] h-px w-2.5 bg-hairline"
                  />
                  <T v={line} />
                </li>
              ))}
            </ul>

            <ul className="mt-5 flex flex-wrap gap-1.5">
              {role.stack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-chip border border-line px-2 py-0.5 text-step--2 text-ink-faint"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </Reveal>
        );
      })}
    </ol>
  );
}
