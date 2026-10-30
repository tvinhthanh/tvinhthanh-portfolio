import Link from "next/link";
import { domains, philosophy, roles } from "@/content/profile";
import { archive, exhibits } from "@/content/projects";
import { getRoom, tourRooms, type RoomId } from "@/content/rooms";
import { T, t, type L } from "@/lib/i18n";
import { RoomTitle } from "../rooms/room";
import { Reveal } from "../ui/reveal";

const since = roles.reduce((first, role) => (role.start < first ? role.start : first), roles[0].start).slice(0, 4);

/* What is inside each door, counted from the content so it never goes stale. */
const holds: Record<Exclude<RoomId, "lobby">, L> = {
  projects: t(`${exhibits.length} exhibits · ${archive.length} in store`, `${exhibits.length} hiện vật · ${archive.length} trong kho`),
  experience: t(`${roles.length} roles · since ${since}`, `${roles.length} vị trí · từ ${since}`),
  principles: t(`1 thesis · ${philosophy.examples.length} examples`, `1 luận điểm · ${philosophy.examples.length} ví dụ`),
  stack: t(`${domains.length} domains · 3D lab`, `${domains.length} mảng · lab 3D`),
};

const copy = {
  eyebrow: t("Floor directory", "Sơ đồ các phòng"),
  title: t(`${tourRooms.length} rooms along the river`, `${tourRooms.length} phòng dọc dòng sông`),
  enter: t("Enter", "Vào phòng"),
};

/** The doorways out of the lobby. Each arch carries the room's name, which
 *  travels with you and becomes the heading of the room you walk into. */
export function Directory() {
  const lobby = getRoom("lobby");

  return (
    <section id="directory" aria-labelledby="directory-title" className="pt-[var(--s-section)]">
      <div className="text-shield max-w-[48rem]">
        <p className="meta text-ink-faint">
          <T v={copy.eyebrow} />
        </p>
        <h2 id="directory-title" className="display mt-3 text-step-5 text-ink">
          <T v={copy.title} />
        </h2>
        <p className="mt-4 max-w-[52ch] text-ink-soft">
          <T v={lobby.wall} />
        </p>
      </div>

      <ol className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {tourRooms.map((room, i) => (
          <li key={room.id}>
            <Reveal delay={i * 70} className="h-full">
              <Link href={room.href} transitionTypes={["nav-forward"]} className="arch group">
                <span aria-hidden="true" className="display text-step-5 leading-none text-accent">
                  {room.numeral}
                </span>
                <RoomTitle id={room.id}>
                  <span className="display mt-4 block text-step-3 font-semibold leading-tight text-ink transition-colors group-hover:text-accent">
                    <T v={room.label} />
                  </span>
                </RoomTitle>
                <span className="mono mt-3 block text-step--2 uppercase tracking-[0.12em] text-ink-faint">
                  <T v={holds[room.id]} />
                </span>
                <span aria-hidden="true" className="mono mt-auto inline-flex items-center gap-2 pt-6 text-step--2 uppercase tracking-[0.14em] text-accent">
                  <T v={copy.enter} />
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </Link>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
