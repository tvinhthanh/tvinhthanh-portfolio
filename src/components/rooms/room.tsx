import Link from "next/link";
import { ViewTransition, type ReactNode } from "react";
import { getRoom, roomIndex, rooms, tour, type RoomId } from "@/content/rooms";
import { T, type L } from "@/lib/i18n";

/* Directional travel between rooms. Each page wraps itself, never the layout:
   layouts persist across navigations, so enter and exit would never fire
   there. Untyped transitions (the browser's back button) just swap. */
const travel = { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" };

export function RoomTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter={travel} exit={travel} default="none">
      {children}
    </ViewTransition>
  );
}

/** The frame every room shares: gutters, and the foot kept clear of the plan.
 *  The lobby opens on a full screen of its own, so it starts at the top. */
export function RoomFrame({ children, lobby = false }: { children: ReactNode; lobby?: boolean }) {
  return (
    <RoomTransition>
      <div className={lobby ? "room room--lobby" : "room"}>
        <div className="doc-wide">{children}</div>
      </div>
    </RoomTransition>
  );
}

/** A room's title. Shares its name with the doorway that leads here, so the
 *  label you clicked travels into place as the heading. */
export function RoomTitle({ id, children }: { id: RoomId; children: ReactNode }) {
  return (
    <ViewTransition name={`room-${id}`} share="morph" default="none">
      {children}
    </ViewTransition>
  );
}

/** The wall text at the entrance: where you are, what the room holds. */
export function RoomHeader({ id, facts = [] }: { id: RoomId; facts?: L[] }) {
  const room = getRoom(id);
  return (
    <header className="text-shield max-w-[62rem]">
      <p className="meta flex items-center gap-3 text-ink-soft">
        <span aria-hidden="true" className="h-[7px] w-[7px] rounded-full bg-accent shadow-[0_0_0_3px_var(--accent-wash)]" />
        <T v={room.aside} />
      </p>
      <RoomTitle id={id}>
        <h1 className="display mt-5 text-step-hero text-ink">
          <T v={room.label} />
        </h1>
      </RoomTitle>
      <p className="mt-6 max-w-[58ch] text-step-1 leading-[1.7] text-ink-soft">
        <T v={room.wall} />
      </p>
      {facts.length > 0 ? (
        <ul className="mono mt-7 flex flex-wrap gap-x-6 gap-y-2 text-step--2 uppercase tracking-[0.13em] text-ink-faint">
          {facts.map((fact) => (
            <li key={fact.en} className="flex items-center gap-2">
              <span aria-hidden="true" className="h-px w-3 bg-hairline" />
              <T v={fact} />
            </li>
          ))}
        </ul>
      ) : null}
    </header>
  );
}

/** A heading inside a room, for the groups of exhibits it holds. */
export function Gallery({
  id,
  title,
  aside,
  intro,
  children,
}: {
  id: string;
  title: L;
  aside?: L;
  intro?: L;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-8 pt-[var(--s-section)]">
      <div className="text-shield max-w-[52rem]">
        {aside ? (
          <p className="meta text-ink-faint">
            <T v={aside} />
          </p>
        ) : null}
        <h2 id={`${id}-title`} className="display mt-3 text-step-4 text-ink">
          <T v={title} />
        </h2>
        {intro ? (
          <p className="mt-4 max-w-[56ch] text-ink-soft">
            <T v={intro} />
          </p>
        ) : null}
      </div>
      <div className="mt-10">{children}</div>
    </section>
  );
}

/** The way on. The last room's onward door leads back to the front desk. */
export function Doorways({ current }: { current: RoomId }) {
  const at = roomIndex(current);
  const previous = rooms[at - 1];
  const next = rooms[at + 1];

  return (
    <nav aria-labelledby={`${current}-onward`} className="pt-[var(--s-section)]">
      <h2 id={`${current}-onward`} className="meta text-ink-faint">
        <T v={tour.continue} />
      </h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {previous ? (
          <Link href={previous.href} transitionTypes={["nav-back"]} className="placard doorway group">
            <span className="meta text-ink-faint">
              <span aria-hidden="true">← </span>
              <T v={previous.numeral ? tour.previous : tour.backToLobby} />
            </span>
            <span className="display mt-2 block text-step-3 text-ink transition-colors group-hover:text-accent">
              {previous.numeral ? <span className="mono mr-3 text-step-1 text-accent">{previous.numeral}</span> : null}
              <T v={previous.label} />
            </span>
          </Link>
        ) : (
          <span aria-hidden="true" />
        )}

        {next ? (
          <Link href={next.href} transitionTypes={["nav-forward"]} className="placard doorway group sm:text-right">
            <span className="meta text-ink-faint">
              <T v={tour.next} />
              <span aria-hidden="true"> →</span>
            </span>
            <RoomTitle id={next.id}>
              <span className="display mt-2 block text-step-3 text-ink transition-colors group-hover:text-accent">
                <span className="mono mr-3 text-step-1 text-accent">{next.numeral}</span>
                <T v={next.label} />
              </span>
            </RoomTitle>
          </Link>
        ) : (
          <Link href="/#contact" transitionTypes={["nav-back"]} className="placard doorway group sm:text-right">
            <span className="meta text-ink-faint">
              <T v={tour.deskNote} />
              <span aria-hidden="true"> →</span>
            </span>
            <span className="display mt-2 block text-step-3 text-ink transition-colors group-hover:text-accent">
              <T v={tour.desk} />
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
}
