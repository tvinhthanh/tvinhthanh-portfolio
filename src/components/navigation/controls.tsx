"use client";

import { useCallback, useSyncExternalStore } from "react";

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

  const toggle = useCallback(() => {
    const next: Theme = readTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Blocked storage: the choice applies now, it just won't be remembered.
    }
  }, []);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="grid h-9 w-9 place-items-center rounded-base border border-transparent text-ink-faint transition-colors duration-200 hover:border-line hover:text-accent"
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

export function LangToggle() {
  const lang = useSyncExternalStore(subscribe, readLang, () => "en" as Lang);

  const set = useCallback((next: Lang) => {
    document.documentElement.dataset.lang = next;
    document.documentElement.lang = next;
    try {
      localStorage.setItem("lang", next);
    } catch {
      // Same as the theme: applies now, may not persist.
    }
  }, []);

  return (
    <div
      role="group"
      aria-label="Language"
      className="flex items-center gap-px rounded-base border border-line p-0.5"
    >
      {(["en", "vi"] as const).map((code) => {
        const active = lang === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => set(code)}
            aria-pressed={active}
            className={`mono min-h-11 rounded-chip px-3 text-step--2 tracking-widest transition-colors duration-200 lg:min-h-0 lg:px-2 lg:py-1 ${
              active ? "bg-accent text-on-accent" : "text-ink-faint hover:text-ink"
            }`}
          >
            {code.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
