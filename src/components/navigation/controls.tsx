"use client";

import { useCallback, useSyncExternalStore } from "react";
import { useLang } from "@/lib/use-lang";
import { useRobotSettings } from "@/components/robot/robot-settings";

/* Both controls read their state straight off <html>. The boot script has
   already written it before first paint, so there is one source of truth and
   never a flash of the wrong theme or the wrong language. */

function subscribe(onChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const observer = new MutationObserver(onChange);
  media.addEventListener("change", onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme", "data-lang"],
  });
  return () => {
    media.removeEventListener("change", onChange);
    observer.disconnect();
  };
}

type Theme = "light" | "dark";

const readTheme = (): Theme => {
  const chosen = document.documentElement.dataset.theme;
  if (chosen === "light" || chosen === "dark") return chosen;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, readTheme, () => null);
  const lang = useLang();

  const toggle = useCallback(() => {
    const next: Theme = readTheme() === "dark" ? "light" : "dark";
    const root = document.documentElement;

    /* A colour that resolves through a custom property and sits on a transition
       can keep the *previous* theme's value after the swap: the element is
       never marked dirty, so it stays stale indefinitely — the rail links held
       light-theme grey on obsidian (3.6:1) until something else forced a
       recalc. Holding transitions still across the flip leaves nothing to go
       stale; they come back on the next frame. */
    /* All three steps are synchronous on purpose. Handing the restore to
       requestAnimationFrame left transitions switched off for good whenever the
       frame never came (a backgrounded tab), and a half-applied swap is a worse
       failure than the one being fixed. Each reflow commits the step before it,
       so by the time transitions come back the colours have already landed and
       there is nothing left to animate. */
    root.setAttribute("data-theme-swapping", "");
    void root.offsetHeight;
    root.dataset.theme = next;
    void root.offsetHeight;
    root.removeAttribute("data-theme-swapping");

    try {
      localStorage.setItem("theme", next);
    } catch {
      // Blocked storage: the choice applies now, it just won't be remembered.
    }
  }, []);

  const isDark = theme === "dark";
  const label =
    lang === "vi"
      ? isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"
      : isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      className="grid h-11 w-11 shrink-0 place-items-center rounded-base border border-line bg-surface text-ink-soft transition-colors duration-200 hover:border-accent hover:text-accent"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {isDark ? (
          <>
            <circle cx="12" cy="12" r="4.1" />
            <path d="M12 2.8v2M12 19.2v2M4.5 4.5 6 6M18 18l1.5 1.5M2.8 12h2M19.2 12h2M4.5 19.5 6 18M18 6l1.5-1.5" />
          </>
        ) : (
          <path d="M20.2 14.6A8.4 8.4 0 1 1 9.4 3.8a6.6 6.6 0 0 0 10.8 10.8Z" />
        )}
      </svg>
    </button>
  );
}

type Lang = "en" | "vi";

const readLang = (): Lang => (document.documentElement.dataset.lang === "vi" ? "vi" : "en");

export function LangToggle({ compact = false }: { compact?: boolean }) {
  const lang = useSyncExternalStore(subscribe, readLang, () => "en" as Lang);
  const set = (next: Lang) => {
    document.documentElement.dataset.lang = next;
    document.documentElement.lang = next;
    try { localStorage.setItem("lang", next); } catch { /* Storage may be blocked. */ }
  };

  return (
    <div className={compact ? "relative w-[4.25rem] shrink-0" : "relative min-w-0 flex-1"}>
      <select
        aria-label={lang === "vi" ? "Ngôn ngữ" : "Language"}
        value={lang}
        onChange={(event) => set(event.target.value as Lang)}
        className="h-11 w-full cursor-pointer appearance-none rounded-base border border-line bg-surface pl-3 pr-8 text-step--1 font-medium text-ink transition-colors hover:border-accent"
      >
        <option value="en">{compact ? "EN" : "English"}</option>
        <option value="vi">{compact ? "VI" : "Tiếng Việt"}</option>
      </select>
      <svg aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  );
}

export function RobotToggle() {
  const { enabled, toggle } = useRobotSettings();
  const lang = useLang();
  const label = lang === "vi" ? "Robot hướng dẫn 3D" : "3D docent";
  const status = enabled ? (lang === "vi" ? "Bật" : "On") : (lang === "vi" ? "Tắt" : "Off");

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={enabled}
      title={label + ": " + status}
      onClick={toggle}
      className={"grid h-11 w-11 shrink-0 place-items-center rounded-base border transition-colors " + (enabled ? "border-accent/40 bg-accent-wash text-accent hover:border-accent" : "border-line bg-surface text-ink-faint hover:border-accent hover:text-ink")}
    >
      <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v3M9 18v3m6-3v3M3 10v4m18-4v4" />
        <circle cx="12" cy="2" r="1" fill="currentColor" stroke="none" />
        <rect x="5" y="6" width="14" height="12" rx="4" />
        <circle cx="9" cy="11" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="15" cy="11" r="1.2" fill="currentColor" stroke="none" />
        <path d="M9 15h6" />
      </svg>
    </button>
  );
}
