import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition, type ReactNode } from "react";
import { Artwork } from "@/components/projects/exhibit";
import { categoryLabel, formatDate, labels } from "@/components/projects/labels";
import { RoomFrame } from "@/components/rooms/room";
import { profile } from "@/content/profile";
import { exhibits, type ExhibitEntry } from "@/content/projects";
import { getRoom } from "@/content/rooms";
import { T, type L } from "@/lib/i18n";

/** Only the works on the wall have a page; anything else is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return exhibits.map(({ project }) => ({ id: project.id }));
}

const find = (id: string) => exhibits.findIndex((entry) => entry.project.id === id);

export async function generateMetadata({ params }: PageProps<"/projects/[id]">): Promise<Metadata> {
  const { id } = await params;
  const entry = exhibits[find(id)];
  if (!entry) return {};
  return {
    title: entry.project.name.en,
    description: entry.project.summary.en,
    alternates: { canonical: `/projects/${id}` },
  };
}

function Arrow() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

function LabelRow({ term, children }: { term: L; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-x-4 border-t border-line-soft py-3 first:border-t-0 first:pt-0">
      <dt className="mono pt-0.5 text-step--2 uppercase tracking-[0.13em] text-ink-faint">
        <T v={term} />
      </dt>
      <dd className="text-step--1 text-ink">{children}</dd>
    </div>
  );
}

function Neighbour({ entry, direction }: { entry: ExhibitEntry; direction: "previous" | "next" }) {
  const forward = direction === "next";
  return (
    <Link
      href={`/projects/${entry.project.id}`}
      transitionTypes={[forward ? "nav-forward" : "nav-back"]}
      className={`placard doorway group ${forward ? "sm:col-start-2 sm:text-right" : ""}`}
    >
      <span className="meta text-ink-faint">
        {forward ? null : <span aria-hidden="true">← </span>}
        <T v={forward ? labels.next : labels.previous} />
        {forward ? <span aria-hidden="true"> →</span> : null}
      </span>
      <span className="display mt-2 block text-step-3 font-semibold text-ink transition-colors group-hover:text-accent">
        <span className="mono mr-3 text-step-1 text-accent">{entry.detail.index}</span>
        <T v={entry.project.name} />
      </span>
    </Link>
  );
}

export default async function ExhibitPage({ params }: PageProps<"/projects/[id]">) {
  const { id } = await params;
  const at = find(id);
  if (at < 0) notFound();

  const { project, detail } = exhibits[at];
  const previous = exhibits[at - 1];
  const next = exhibits[at + 1];
  const room = getRoom("projects");
  const source = project.repo ? `${profile.githubUrl}/${project.repo}` : null;
  const total = String(exhibits.length).padStart(2, "0");

  const links = [
    project.demoUrl ? { href: project.demoUrl, label: labels.live } : null,
    project.rulesUrl ? { href: project.rulesUrl, label: labels.rules } : null,
    source ? { href: source, label: project.note ? labels.study : labels.source } : null,
  ].filter((link): link is { href: string; label: L } => link !== null);

  const sections = [
    { term: labels.role, body: detail.role, lead: true },
    { term: labels.challenge, body: detail.challenge, lead: false },
    { term: labels.outcome, body: detail.outcome, lead: false },
  ];

  return (
    <RoomFrame>
      <article aria-labelledby="exhibit-title">
        <Link
          href="/projects"
          transitionTypes={["nav-back"]}
          className="meta inline-flex min-h-11 items-center gap-2 text-ink-soft no-underline transition-colors hover:text-accent"
        >
          <span aria-hidden="true">←</span>
          <T v={room.aside} />
        </Link>

        <header className="text-shield mt-6 max-w-[62rem]">
          <p className="meta text-ink-faint">
            <T v={labels.exhibit} /> <span className="tnum text-accent">{detail.index}</span>{" "}
            <T v={labels.of} /> <span className="tnum">{total}</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <T v={categoryLabel[project.category]} />
          </p>
          <ViewTransition name={`exhibit-${project.id}`} share="morph" default="none">
            <h1 id="exhibit-title" className="display mt-4 text-step-hero font-semibold text-ink">
              <T v={project.name} />
            </h1>
          </ViewTransition>
          <p className="mt-6 max-w-[62ch] text-step-1 leading-[1.7] text-ink-soft">
            <T v={project.summary} />
          </p>
        </header>

        <div className="group mt-12 overflow-hidden rounded-base border border-line">
          <Artwork id={project.id} index={detail.index} className="aspect-[16/8] sm:aspect-[16/5]" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-start">
          <div className="placard space-y-9 p-6 sm:p-10 lg:col-span-8">
            {sections.map((section) => (
              <section key={section.term.en}>
                <h2 className="mono text-step--2 uppercase tracking-[0.14em] text-ink-faint">
                  <T v={section.term} />
                </h2>
                <p className={`mt-3 max-w-[68ch] leading-[1.75] ${section.lead ? "text-step-1 text-ink" : "text-ink-soft"}`}>
                  <T v={section.body} />
                </p>
              </section>
            ))}

            {detail.breakdown ? (
              <section>
                <h2 className="mono text-step--2 uppercase tracking-[0.14em] text-ink-faint">
                  <T v={labels.split} />
                </h2>
                <div className="-mx-2 mt-3 overflow-x-auto px-2">
                  <table className="w-full min-w-[22rem] border-collapse text-left">
                    <tbody>
                      {detail.breakdown.map((row) => (
                        <tr key={row.surface} className="border-b border-line-soft last:border-b-0">
                          <th scope="row" className="py-2.5 pr-4 text-step--1 font-normal text-ink">
                            {row.surface}
                          </th>
                          <td className="mono tnum whitespace-nowrap py-2.5 pr-4 text-step--2 text-accent">{row.share}</td>
                          <td className="py-2.5 text-step--2 text-ink-soft">
                            <T v={row.note} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {detail.breakdown.some((row) => row.share.includes("/")) ? (
                  <p className="mt-3 text-step--2 text-ink-faint">
                    <T v={labels.byCommits} />
                  </p>
                ) : null}
              </section>
            ) : null}
          </div>

          <aside aria-labelledby="wall-label" className="placard p-6 sm:p-8 lg:col-span-4">
            <h2 id="wall-label" className="mono text-step--2 uppercase tracking-[0.14em] text-accent">
              <T v={labels.wallLabel} />
            </h2>
            <dl className="mt-5">
              <LabelRow term={labels.category}>
                <T v={categoryLabel[project.category]} />
              </LabelRow>
              <LabelRow term={labels.updated}>
                <span className="tnum">{formatDate(project.updated)}</span>
              </LabelRow>
              {project.language ? <LabelRow term={labels.language}>{project.language}</LabelRow> : null}
              {project.stars > 0 ? (
                <LabelRow term={labels.stars}>
                  <span className="tnum">{project.stars}</span>
                </LabelRow>
              ) : null}
              {project.note ? (
                <LabelRow term={labels.status}>
                  <span className="text-ink-soft">
                    <T v={project.note} />
                  </span>
                </LabelRow>
              ) : null}
            </dl>

            <h3 className="mono mt-7 text-step--2 uppercase tracking-[0.14em] text-ink-faint">
              <T v={labels.built} />
            </h3>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {project.built.map((tech) => (
                <li key={tech} className="rounded-chip border border-line px-2.5 py-1 text-step--2 text-ink-soft">
                  {tech}
                </li>
              ))}
            </ul>

            {links.length > 0 ? (
              <>
                <h3 className="mono mt-7 text-step--2 uppercase tracking-[0.14em] text-ink-faint">
                  <T v={labels.links} />
                </h3>
                <ul className="mt-3 space-y-1">
                  {links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex min-h-11 items-center gap-2 text-step--1 text-ink underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                      >
                        <T v={link.label} />
                        <Arrow />
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </aside>
        </div>

        <nav aria-labelledby="exhibit-onward" className="pt-[var(--s-section)]">
          <h2 id="exhibit-onward" className="meta text-ink-faint">
            <T v={labels.onward} />
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {previous ? <Neighbour entry={previous} direction="previous" /> : null}
            {next ? (
              <Neighbour entry={next} direction="next" />
            ) : (
              <Link href="/projects" transitionTypes={["nav-back"]} className="placard doorway group sm:col-start-2 sm:text-right">
                <span className="meta text-ink-faint">
                  <T v={labels.back} />
                </span>
                <span className="display mt-2 block text-step-3 font-semibold text-ink transition-colors group-hover:text-accent">
                  <span className="mono mr-3 text-step-1 text-accent">{room.numeral}</span>
                  <T v={room.label} />
                </span>
              </Link>
            )}
          </div>
        </nav>
      </article>
    </RoomFrame>
  );
}
