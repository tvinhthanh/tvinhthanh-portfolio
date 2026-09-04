import { profile } from "@/content/profile";

export function Footer() {
  return (
    <footer className="border-t border-line px-5 py-10 sm:px-8 lg:px-16">
      <p className="doc-wide mono text-step--2 uppercase tracking-[0.14em] text-ink-faint">
        {profile.nameLatin}
        <span aria-hidden="true" className="mx-2 text-hairline">
          /
        </span>
        <span className="tnum">{new Date().getFullYear()}</span>
      </p>
    </footer>
  );
}
