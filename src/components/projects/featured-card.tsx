"use client";

import { useCallback, useState } from "react";
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
  artifactTag: t("Featured Project", "Dự án tiêu biểu"),
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
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, active: false });

  /* Hovering a card sends one pulse into the scene: the qi river brightens and
     quickens for about a second, then settles. */
  const pulse = useCallback(() => {
    window.dispatchEvent(new CustomEvent("world:pulse"));
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpotlight({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  const handleMouseLeave = () => {
    setSpotlight((prev) => ({ ...prev, active: false }));
  };

  const source = project.repo ? `${profile.githubUrl}/${project.repo}` : null;

  return (
    <Reveal as="article" delay={delay}>
      <div
        onMouseEnter={pulse}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onFocusCapture={pulse}
        className="panel group relative overflow-hidden transition-all duration-300 hover:border-hairline hover:-translate-y-1"
      >
        {/* Dynamic Cursor Spotlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-10"
          style={{
            opacity: spotlight.active ? 1 : 0,
            background: `radial-gradient(550px circle at ${spotlight.x}px ${spotlight.y}px, rgba(237, 212, 154, 0.08), transparent 70%)`,
          }}
        />

        {/* Ethereal top edge glow line */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-20"
        />

        {/* COVER — the visual anchor. Sigil at full scale, index numeral as a
            secondary mark, and a warm gold wash so the card has an image even
            without a screenshot. */}
        <div className="relative aspect-[16/6] w-full overflow-hidden border-b border-line-soft bg-surface-2/40 sm:aspect-[16/5]">
          <span
            aria-hidden="true"
            className="absolute inset-0 text-accent opacity-40 transition-all duration-700 group-hover:opacity-70 group-hover:scale-105"
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

          {/* The oversized index */}
          <span
            aria-hidden="true"
            className="display pointer-events-none absolute right-6 top-4 select-none text-[clamp(4.5rem,10vw,7.5rem)] leading-none text-accent/65 transition-colors duration-300 group-hover:text-accent font-medium sm:right-10"
          >
            {detail.index}
          </span>

          {/* Category & Artifact chips, top-left */}
          <div className="absolute left-6 top-6 flex items-center gap-2 sm:left-10">
            <span className="mono rounded-chip border border-line bg-paper/80 px-2.5 py-1 text-step--2 uppercase tracking-[0.14em] text-ink-soft backdrop-blur-md">
              <T v={categoryLabel[project.category]} />
            </span>
            <span className="mono hidden sm:inline-flex rounded-chip border border-accent/30 bg-accent/10 px-2.5 py-1 text-step--2 uppercase tracking-[0.12em] text-accent backdrop-blur-md">
              <T v={labels.artifactTag} />
            </span>
          </div>
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
                  className="rounded-chip border border-line bg-paper/60 px-2.5 py-1 text-step--2 text-ink-soft transition-all duration-200 hover:border-accent/60 hover:text-accent hover:bg-surface-2 hover:shadow-[0_0_10px_rgba(237,212,154,0.15)]"
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
                className="inline-flex items-center gap-1.5 rounded-chip border border-line/70 bg-surface/80 px-2.5 py-1 text-ink no-underline backdrop-blur-sm transition-all duration-200 hover:border-accent hover:text-accent hover:shadow-[0_0_14px_rgba(237,212,154,0.25)]"
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
