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

const flags = {
  en: (
    <svg width="18" height="12" viewBox="0 0 640 480" className="rounded-[2px] shadow-xs shrink-0 block" aria-hidden="true">
      <path fill="#012169" d="M0 0h640v480H0z"/>
      <path fill="#FFF" d="m75 0 244 181L562 0h78v62L439 240l201 177v63h-77L320 299 78 480H0v-63l201-177L0 62V0h75z"/>
      <path fill="#C8102E" d="m424 288 216 162v30h-40L384 318v-30zm-208 0L0 450v30h40l216-162v-30zM0 0l216 162v30h-40L0 30V0zm640 0L424 162v30h40l176-132V0z"/>
      <path fill="#FFF" d="M240 0h160v480H240zM0 160h640v160H0z"/>
      <path fill="#C8102E" d="M267 0h106v480H267zM0 187h640v106H0z"/>
    </svg>
  ),
  vi: (
    <svg width="18" height="12" viewBox="0 0 640 480" className="rounded-[2px] shadow-xs shrink-0 block" aria-hidden="true">
      <path fill="#da251d" d="M0 0h640v480H0z"/>
      <path
        fill="#ff0"
        d="m320 102 42.4 130.4h137.2l-111 80.6 42.4 130.4-111-80.6-111 80.6 42.4-130.4-111-80.6h137.2z"
      />
    </svg>
  ),
};

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
      className="inline-flex items-center rounded-full border border-line-soft bg-surface-2/40 px-2.5 py-1.5 backdrop-blur-md"
    >
      {(["en", "vi"] as const).map((code) => {
        const active = lang === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => set(code)}
            aria-pressed={active}
            className={`group inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[0.6875rem] font-medium tracking-wider transition-all duration-300 ${
              active
                ? "text-accent"
                : "text-ink-faint hover:text-ink"
            }`}
          >
            <span
              className={`flex items-center shrink-0 transition-all duration-300 ${
                active
                  ? "grayscale-0 opacity-100 drop-shadow-[0_0_8px_rgba(237,212,154,0.4)]"
                  : "grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-75"
              }`}
            >
              {flags[code]}
            </span>
            <span className={`mono uppercase text-[0.6875rem] font-medium leading-none transition-colors duration-200 ${active ? "text-accent font-semibold" : "text-ink-faint group-hover:text-ink"}`}>
              {code}
            </span>
          </button>
        );
      })}
    </div>
  );
}
