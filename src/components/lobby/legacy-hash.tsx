"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/* Links shared before the site had rooms point at sections of one long page.
   The lobby still answers #home, #intro and #contact itself; the rest moved
   into rooms and are forwarded there. */
const MOVED: Record<string, string> = {
  projects: "/projects",
  experience: "/experience",
  philosophy: "/principles",
  stack: "/stack",
  lab: "/stack#lab",
  background: "/experience#background",
};

export function LegacyHash() {
  const router = useRouter();

  useEffect(() => {
    const to = MOVED[window.location.hash.slice(1)];
    if (to) router.replace(to);
  }, [router]);

  return null;
}
