"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { profile } from "@/content/profile";
import { directionTo, roomForPath, rooms, tour } from "@/content/rooms";
import { T } from "@/lib/i18n";
import { LangToggle, ThemeToggle } from "./controls";

/**
 * The floor plan: one dock at the foot of the screen, the same in every room.
 * The rooms sit on a thread like stations on the river, in walking order, and
 * the pearl of the room you are in is lit. It replaces the side rail — the
 * page no longer has a sidebar for the reading column to sit beside.
 */
export function FloorPlan() {
  const pathname = usePathname();
  const here = roomForPath(pathname);

  return (
    <div className="plan-dock" data-plan>
      <div className="panel plan flex items-center gap-1 p-1.5 sm:gap-3 sm:pl-4">
        <Link
          href="/"
          transitionTypes={here.id === "lobby" ? undefined : [directionTo(here.id, "lobby")]}
          className="display hidden shrink-0 pr-1 text-step-1 font-semibold text-ink no-underline transition-colors hover:text-accent lg:block"
        >
          {profile.name}
        </Link>
        <span aria-hidden="true" className="hidden h-7 w-px bg-line lg:block" />

        <h2 id="plan-label" className="sr-only">
          <T v={tour.plan} />
        </h2>
        <nav aria-labelledby="plan-label" className="min-w-0 flex-1">
          <ol className="plan-stations">
            {rooms.map((room) => {
              const exact = pathname === room.href;
              const within = here.id === room.id;
              return (
                <li key={room.id}>
                  <Link
                    href={room.href}
                    transitionTypes={exact ? undefined : [directionTo(here.id, room.id)]}
                    aria-current={exact ? "page" : within ? "location" : undefined}
                    data-here={within || undefined}
                    className="plan-station group"
                  >
                    <span aria-hidden="true" className="plan-pearl" />
                    <span className="plan-mark">
                      {/* The numeral stays in the accessible name so a voice
                          user can say what they see; the lobby's mark is only
                          a glyph and is not read out. */}
                      <span className="mono text-accent" aria-hidden={room.numeral ? undefined : true}>
                        {room.numeral || "◇"}
                      </span>
                      {/* Labels collapse to numerals on a phone; they are hidden
                          visually, not removed, so the name is still announced. */}
                      <span className="plan-name">
                        <T v={room.label} />
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </nav>

        <span aria-hidden="true" className="hidden h-7 w-px bg-line sm:block" />
        <div className="flex shrink-0 items-center gap-1">
          <LangToggle compact />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
