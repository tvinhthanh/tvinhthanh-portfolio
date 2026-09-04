"use client";

import { useEffect, useState } from "react";
import { pages, profile } from "@/content/profile";
import { T, t } from "@/lib/i18n";
import { LangToggle, ThemeToggle } from "./controls";

function useActiveSection() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const targets = pages
      .map((p) => document.getElementById(p.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (top) setActive(top.target.id);
      },
      { rootMargin: "-92px 0px -62% 0px", threshold: 0 },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return active;
}

const links = [
  { label: "GitHub", href: profile.githubUrl, external: true },
  { label: "LinkedIn", href: profile.linkedinUrl, external: true },
  { label: "Email", href: `mailto:${profile.email}`, external: false },
  // Public on purpose: a recruiter should be able to dial from any screen.
  { label: profile.phone, href: `tel:${profile.phoneHref}`, external: false },
];

function Marks({ active, onNavigate }: { active: string; onNavigate?: () => void }) {
  return (
    <nav aria-label="Sections">
      <ul className="relative space-y-px pl-4">
        {/* The thread every marker sits on */}
        <span
          aria-hidden="true"
          className="thread absolute bottom-2 left-[3px] top-2 w-px"
        />
        {pages.map((page) => {
          const current = active === page.id;
          return (
            <li key={page.id}>
              <a
                href={`#${page.id}`}
                onClick={onNavigate}
                aria-current={current ? "page" : undefined}
                className={`group relative flex items-center py-1.5 text-step--1 no-underline transition-colors duration-300 ${
                  current ? "text-ink" : "text-ink-faint hover:text-ink-soft"
                }`}
              >
                {/* The pearl: it lights when you arrive at that section */}
                <span
                  aria-hidden="true"
                  className={`absolute -left-4 top-1/2 h-[7px] w-[7px] -translate-y-1/2 rounded-full transition-all duration-500 ${
                    current
                      ? "bg-accent shadow-[0_0_0_3px_var(--accent-wash),0_0_12px_var(--accent)]"
                      : "bg-hairline group-hover:bg-ink-faint"
                  }`}
                />
                <T v={page.label} />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function Ledger() {
  return (
    <div className="space-y-4">
      <ul className="space-y-1.5">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              {...(link.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
              className="mono inline-flex items-center gap-1.5 text-step--2 uppercase tracking-[0.14em] text-ink-faint no-underline transition-colors duration-200 hover:text-accent"
            >
              {link.label}
              {link.external ? (
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 17 17 7M8 7h9v9" />
                </svg>
              ) : null}
            </a>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between gap-2 border-t border-line pt-4">
        <LangToggle />
        <ThemeToggle />
      </div>
    </div>
  );
}

function Identity() {
  return (
    <div>
      <p className="display text-step-1 leading-tight text-ink">{profile.name}</p>
      <p className="mono mt-1.5 text-step--2 uppercase tracking-[0.14em] text-ink-faint">
        <T v={profile.role} />
      </p>
      <p className="mt-3 flex items-center gap-2 text-step--2 text-ink-soft">
        <span aria-hidden="true" className="pulse h-1.5 w-1.5 rounded-full bg-status-live" />
        <T v={profile.availability} />
      </p>
    </div>
  );
}

export function Rail() {
  const active = useActiveSection();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[var(--rail)] flex-col justify-between border-r border-line px-6 py-8 lg:flex">
        <Identity />
        <Marks active={active} />
        <Ledger />
      </aside>

      {/* Mobile: a compact command bar that opens the same index */}
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between gap-3 border-b border-line bg-paper/80 px-4 backdrop-blur-md lg:hidden">
        <a href="#home" className="display text-step-1 text-ink no-underline">
          {profile.name}
        </a>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="section-index"
            className="mono flex h-11 items-center gap-2 rounded-base border border-line px-3 text-step--2 uppercase tracking-[0.14em] text-ink-soft transition-colors hover:border-accent hover:text-accent"
          >
            <T v={t("Index", "Mục lục")} />
          </button>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close index"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-paper/85 backdrop-blur-sm"
          />
          <div
            id="section-index"
            className="panel absolute inset-x-3 top-3 max-h-[calc(100dvh-24px)] overflow-y-auto p-5 shadow-[var(--shadow-pop)]"
          >
            <div className="flex items-start justify-between gap-3">
              <Identity />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close index"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-base text-ink-faint hover:text-accent"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            <ul className="mt-6 space-y-px">
              {pages.map((page, i) => (
                <li key={page.id}>
                  <a
                    href={`#${page.id}`}
                    onClick={() => setOpen(false)}
                    aria-current={active === page.id ? "page" : undefined}
                    className={`flex min-h-11 items-baseline gap-4 rounded-base px-2 py-2 no-underline transition-colors ${
                      active === page.id ? "bg-accent-wash text-ink" : "text-ink-soft"
                    }`}
                  >
                    <span className="mono text-step--2 text-accent">
                      {String(i).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="block">
                        <T v={page.label} />
                      </span>
                      <span className="block text-step--2 text-ink-faint">
                        <T v={page.aside} />
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-6 border-t border-line pt-5">
              <Ledger />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
