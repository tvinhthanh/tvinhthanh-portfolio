"use client";

import { useCallback } from "react";
import { profile } from "@/content/profile";
import type { Category, FeaturedDetail, Project } from "@/content/projects";
import { T, t } from "@/lib/i18n";
import { Reveal } from "../ui/reveal";
import { Sigil } from "./sigil";

const labels = {
  role: t("Role", "Vai trò"),
  challenge: t("The hard part", "Phần khó"),
  outcome: t("Impact", "Kết quả"),
  updated: t("Updated", "Cập nhật"),
  source: t("View source", "Xem mã nguồn"),
  study: t("Read the case study", "Đọc case study"),
  split: t("My share of the work", "Phần việc của tôi"),
  built: t("Built with", "Công nghệ"),
};

const categoryLabel: Record<Category, ReturnType<typeof t>> = {
  business: t("Business system", "Hệ thống nghiệp vụ"),
  commerce: t("Commerce", "Thương mại"),
  ai: t("AI & tooling", "AI & công cụ"),
  mobile: t("Mobile", "Mobile"),
  game: t("Game", "Game"),
  frontend: t("Web & frontend", "Web & frontend"),
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDate(iso: string) {
  const [y, m] = iso.split("-");
  return `${MONTHS[Number(m) - 1]} ${y}`;
}

type Props = { project: Project; detail: FeaturedDetail; delay: number };

export function FeaturedCard({ project, detail, delay }: Props) {
  /* Hovering a card sends one pulse into the scene: the qi river brightens and
     quickens for about a second, then settles. */
  const pulse = useCallback(() => {
    window.dispatchEvent(new CustomEvent("world:pulse"));
  }, []);

  const source = project.repo ? `${profile.githubUrl}/${project.repo}` : null;

  return (
    <Reveal as="article" delay={delay}>
      <div
        onMouseEnter={pulse}
        onFocusCapture={pulse}
        className="panel group relative overflow-hidden transition-colors duration-500 hover:border-hairline"
      >
        {/* COVER — the visual anchor. Sigil at full scale, index numeral as a
            secondary mark, and a warm gold wash so the card has an image even
            without a screenshot. */}
        <div className="relative aspect-[16/6] w-full overflow-hidden border-b border-line-soft bg-surface-2/40 sm:aspect-[16/5]">
          <span
            aria-hidden="true"
            className="absolute inset-0 text-accent opacity-40 transition-opacity duration-700 group-hover:opacity-60"
          >
            <Sigil seed={project.id} className="h-full w-full" />
          </span>

          {/* Gradient rest so the sigil recedes toward the reading edge */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, transparent 55%, color-mix(in srgb, var(--paper) 62%, transparent) 100%)",
            }}
          />

          {/* The oversized index — sits behind the eye, not fights for it */}
          <span
            aria-hidden="true"
            className="display pointer-events-none absolute right-6 top-4 select-none text-[clamp(4.5rem,10vw,7.5rem)] leading-none text-accent/25 sm:right-10"
          >
            {detail.index}
          </span>

          {/* Category chip, top-left */}
          <span className="mono absolute left-6 top-6 rounded-chip border border-line bg-paper/70 px-2.5 py-1 text-step--2 uppercase tracking-[0.14em] text-ink-soft sm:left-10">
            <T v={categoryLabel[project.category]} />
          </span>
        </div>

        {/* HEADER — title + one-line summary, at recruiter-scan size. */}
        <div className="relative px-6 pb-5 pt-7 sm:px-10 sm:pt-9">
          <h3 className="display text-step-4 text-ink">
            {source ? (
              <a
                href={source}
                target="_blank"
                rel="noreferrer noopener"
                className="text-ink no-underline transition-colors duration-200 hover:text-accent"
              >
                <T v={project.name} />
              </a>
            ) : (
              <T v={project.name} />
            )}
          </h3>

          <p className="mt-4 max-w-[62ch] text-step-0 leading-[1.7] text-ink-soft">
            <T v={project.summary} />
          </p>
        </div>

        {/* 10-SECOND SCAN — Role · Challenge · Impact on one row for desktop,
            stacked for mobile. Body copy stays at step-0 so it is readable. */}
        <div className="grid gap-x-8 gap-y-6 border-t border-line-soft px-6 py-7 sm:px-10 md:grid-cols-3">
          <div>
            <p className="mono text-step--2 uppercase tracking-[0.14em] text-ink-faint">
              <T v={labels.role} />
            </p>
            <p className="mt-2 text-step-0 leading-[1.55] text-ink">
              <T v={detail.role} />
            </p>
          </div>
          <div>
            <p className="mono text-step--2 uppercase tracking-[0.14em] text-ink-faint">
              <T v={labels.challenge} />
            </p>
            <p className="mt-2 text-step-0 leading-[1.6] text-ink-soft">
              <T v={detail.challenge} />
            </p>
          </div>
          <div>
            <p className="mono text-step--2 uppercase tracking-[0.14em] text-ink-faint">
              <T v={labels.outcome} />
            </p>
            <p className="mt-2 text-step-0 leading-[1.6] text-ink-soft">
              <T v={detail.outcome} />
            </p>
          </div>
        </div>

        {/* Optional breakdown table */}
        {detail.breakdown ? (
          <div className="border-t border-line-soft px-6 py-6 sm:px-10">
            <p className="mono text-step--2 uppercase tracking-[0.14em] text-ink-faint">
              <T v={labels.split} />
            </p>
            <table className="mt-3 w-full border-collapse text-left">
              <tbody>
                {detail.breakdown.map((row) => (
                  <tr key={row.surface} className="border-b border-line-soft last:border-b-0">
                    <th scope="row" className="py-2 pr-4 text-step--1 font-normal text-ink">
                      {row.surface}
                    </th>
                    <td className="tnum mono py-2 pr-4 text-step--2 text-accent">
                      {row.share}
                    </td>
                    <td className="py-2 text-step--2 text-ink-faint">
                      <T v={row.note} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {detail.breakdown.some((r) => r.share.includes("/")) ? (
              <p className="mt-2 text-step--2 text-ink-faint">commits</p>
            ) : null}
          </div>
        ) : null}

        {project.note ? (
          <p className="mx-6 mb-5 border-l border-hairline pl-4 text-step--2 text-ink-faint sm:mx-10">
            <T v={project.note} />
          </p>
        ) : null}

        {/* BOTTOM BAR — tech chips left, meta + link right. This is the
            metadata a recruiter checks last, so it earns its bottom position. */}
        <div className="flex flex-col gap-4 border-t border-line-soft bg-surface/40 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <div className="flex-1">
            <p className="sr-only">
              <T v={labels.built} />
            </p>
            <ul className="flex flex-wrap gap-1.5">
              {project.built.map((tech) => (
                <li
                  key={tech}
                  className="rounded-chip border border-line bg-paper/60 px-2 py-1 text-step--2 text-ink-soft"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>

          <div className="mono flex flex-wrap items-center gap-x-5 gap-y-1 text-step--2 uppercase tracking-[0.13em] text-ink-faint">
            {project.language ? <span className="text-ink-soft">{project.language}</span> : null}
            <span className="tnum">{formatDate(project.updated)}</span>
            {project.stars > 0 ? <span className="tnum">★ {project.stars}</span> : null}
            {source ? (
              <a
                href={source}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 text-ink no-underline transition-colors hover:text-accent"
              >
                <T v={project.note ? labels.study : labels.source} />
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M7 17 17 7M8 7h9v9" />
                </svg>
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </Reveal>
  );
}
