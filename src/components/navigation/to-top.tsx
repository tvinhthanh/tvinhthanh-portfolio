"use client";

import { useEffect, useState } from "react";
import { T, t } from "@/lib/i18n";

/**
 * Floating return-to-top. Bottom right, where this control is conventionally
 * looked for, and clear of the navigation rail on the opposite edge. It only
 * appears once there is something to go back up from.
 */
export function ToTop() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      setShown(window.scrollY > window.innerHeight * 0.9);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };

    check();
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
    };
  }, []);

  return (
    <a
      href="#home"
      aria-hidden={!shown}
      tabIndex={shown ? 0 : -1}
      className={`panel fixed bottom-5 right-4 z-40 grid h-11 w-11 place-items-center text-ink-soft shadow-[var(--shadow-pop)] transition-[opacity,transform,color,border-color] duration-300 hover:border-accent hover:text-accent lg:right-6 ${
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
      }`}
    >
      <span className="sr-only">
        <T v={t("Back to top", "Lên đầu trang")} />
      </span>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 19V6M6 12l6-6 6 6" />
      </svg>
    </a>
  );
}
