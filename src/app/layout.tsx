import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Cormorant_Garamond, JetBrains_Mono } from "next/font/google";
import { profile } from "@/content/profile";
import "./globals.css";

/* Display — Cormorant Garamond. Old, high-contrast, quiet: it carries the
   world without shouting, and it has a real Vietnamese cut. */
const title = Cormorant_Garamond({
  variable: "--font-title",
  subsets: ["latin", "latin-ext", "vietnamese"],
  display: "swap",
  weight: ["400", "500", "600"],
});

/* Body — Be Vietnam Pro, drawn for Vietnamese. Tone marks are designed rather
   than stacked, which matters on a page that sets "Trương Vĩnh Thành" large
   and full Vietnamese paragraphs at reading size. */
const body = Be_Vietnam_Pro({
  variable: "--font-body",
  subsets: ["latin", "latin-ext", "vietnamese"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

/* Technical metadata — coordinates, dates, counts, labels. */
const code = JetBrains_Mono({
  variable: "--font-code",
  subsets: ["latin", "latin-ext", "vietnamese"],
  display: "swap",
  weight: ["400", "500"],
});

const description =
  "Full-stack software engineer in Ho Chi Minh City. Business systems — rental, point of sale, warehouse, e-commerce — built with React, Next.js, TypeScript, NestJS and whichever backend the problem calls for.";

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: {
    default: `${profile.nameLatin} — Full-stack software engineer`,
    template: `%s · ${profile.nameLatin}`,
  },
  description,
  keywords: [
    "Truong Vinh Thanh",
    "Trương Vĩnh Thành",
    "full-stack developer",
    "software engineer",
    "React",
    "Next.js",
    "TypeScript",
    "NestJS",
    "Ho Chi Minh City",
  ],
  authors: [{ name: profile.nameLatin, url: profile.githubUrl }],
  creator: profile.nameLatin,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    locale: "en_US",
    alternateLocale: "vi_VN",
    url: profile.siteUrl,
    title: `${profile.nameLatin} — Full-stack software engineer`,
    description,
    siteName: profile.nameLatin,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.nameLatin} — Full-stack software engineer`,
    description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f1f2f3" },
    { media: "(prefers-color-scheme: dark)", color: "#080c0d" },
  ],
};

/** Theme, language and JS capability are resolved before first paint: no flash
 *  of the wrong palette, no flash of the wrong language. */
const boot = `(function(){try{var d=document.documentElement;d.setAttribute("data-js","on");var t=localStorage.getItem("theme");if(t==="light"||t==="dark")d.setAttribute("data-theme",t);var l=localStorage.getItem("lang");if(l!=="vi"&&l!=="en"){l=(navigator.language||"").toLowerCase().indexOf("vi")===0?"vi":"en"}d.setAttribute("data-lang",l);d.setAttribute("lang",l)}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.nameLatin,
    alternateName: profile.name,
    jobTitle: "Full-stack software engineer",
    email: `mailto:${profile.email}`,
    url: profile.siteUrl,
    sameAs: [profile.githubUrl, profile.linkedinUrl],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ho Chi Minh City",
      addressCountry: "VN",
    },
    knowsAbout: [
      "React",
      "Next.js",
      "TypeScript",
      "NestJS",
      "PostgreSQL",
      "Redis",
      "WebSocket",
      "Docker",
      "Three.js",
    ],
  };

  return (
    <html
      lang="en"
      data-lang="en"
      className={`${title.variable} ${body.variable} ${code.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      {/* Browser extensions (password managers, ColorZilla, Grammarly) stamp
          attributes onto <body> before React hydrates. Suppression here covers
          this element's own attributes only — never its children. */}
      <body className="min-h-full" suppressHydrationWarning>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
        />
      </body>
    </html>
  );
}
