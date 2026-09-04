"use client";

import { useMemo, useState } from "react";
import { profile } from "@/content/profile";
import { archive, categories, type Category } from "@/content/projects";
import { T, t } from "@/lib/i18n";

const copy = {
  count: t("shown", "đang hiện"),
  empty: t("Nothing in this group.", "Không có dự án nào trong nhóm này."),
  emptyAction: t("Show everything", "Xem tất cả"),
  project: t("Project", "Dự án"),
  built: t("Built with", "Công nghệ"),
  updated: t("Updated", "Cập nhật"),
  all: t("All 31 repositories on GitHub", "Toàn bộ 31 repository trên GitHub"),
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDate(iso: string) {
  const [y, m] = iso.split("-");
  return `${MONTHS[Number(m) - 1]} ${y}`;
}

/** The rest of the work, kept dense on purpose: this is a reference table,
 *  not a showcase. Engineers scan it; recruiters can skip it. */
export function Archive() {
  const [category, setCategory] = useState<Category | "all">("all");

  const rows = useMemo(
    () =>
      archive
        .filter((p) => category === "all" || p.category === category)
        .sort((a, b) => b.updated.localeCompare(a.updated)),
    [category],
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((c) => {
          const active = category === c.id;
          const n =
            c.id === "all" ? archive.length : archive.filter((p) => p.category === c.id).length;
          if (n === 0 && c.id !== "all") return null;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              aria-pressed={active}
              className={`mono inline-flex min-h-11 items-center gap-2 rounded-base border px-3 text-step--2 uppercase tracking-[0.12em] transition-colors duration-200 sm:min-h-0 sm:py-1.5 ${
                active
                  ? "border-accent bg-accent-wash text-accent"
                  : "border-line text-ink-faint hover:border-hairline hover:text-ink-soft"
              }`}
            >
              <T v={c.label} />
              <span className="tnum opacity-60">{n}</span>
            </button>
          );
        })}
        <p className="mono ml-auto text-step--2 uppercase tracking-[0.12em] text-ink-faint">
          <span className="tnum">{rows.length}</span> <T v={copy.count} />
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="mt-8 rounded-base border border-dashed border-line px-6 py-12 text-center">
          <p className="text-ink-soft">
            <T v={copy.empty} />
          </p>
          <button
            type="button"
            onClick={() => setCategory("all")}
            className="mt-4 inline-flex h-10 items-center rounded-base border border-accent px-4 text-step--1 text-accent transition-colors hover:bg-accent-wash"
          >
            <T v={copy.emptyAction} />
          </button>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[44rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-line">
                <th
                  scope="col"
                  className="mono pb-3 pr-6 text-step--2 font-normal uppercase tracking-[0.13em] text-ink-faint"
                >
                  <T v={copy.project} />
                </th>
                <th
                  scope="col"
                  className="mono pb-3 pr-6 text-step--2 font-normal uppercase tracking-[0.13em] text-ink-faint"
                >
                  <T v={copy.built} />
                </th>
                <th
                  scope="col"
                  className="mono pb-3 text-step--2 font-normal uppercase tracking-[0.13em] text-ink-faint"
                >
                  <T v={copy.updated} />
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-line-soft align-top transition-colors duration-200 hover:bg-accent-wash/40"
                >
                  <th scope="row" className="max-w-[22rem] py-3.5 pr-6 font-normal">
                    {p.repo ? (
                      <a
                        href={`${profile.githubUrl}/${p.repo}`}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-step--1 font-medium text-ink no-underline transition-colors hover:text-accent"
                      >
                        <T v={p.name} />
                      </a>
                    ) : (
                      <span className="text-step--1 font-medium text-ink">
                        <T v={p.name} />
                      </span>
                    )}
                    <span className="mt-1 block text-step--2 leading-[1.6] text-ink-faint">
                      <T v={p.summary} />
                    </span>
                  </th>
                  <td className="py-3.5 pr-6 text-step--2 text-ink-soft">{p.built.join(" · ")}</td>
                  <td className="tnum whitespace-nowrap py-3.5 text-step--2 text-ink-soft">
                    {formatDate(p.updated)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-8">
        <a
          href={`${profile.githubUrl}?tab=repositories`}
          target="_blank"
          rel="noreferrer noopener"
          className="mono inline-flex items-center gap-2 text-step--2 uppercase tracking-[0.13em] text-ink-soft no-underline transition-colors hover:text-accent"
        >
          <T v={copy.all} />
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7 17 17 7M8 7h9v9" />
          </svg>
        </a>
      </p>
    </div>
  );
}
