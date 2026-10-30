import { roomForPath, type RoomId } from "@/content/rooms";

/**
 * Where the camera stands in each room.
 *
 * `depth` is how far along the valley the room sits (0 at the lobby). `drift`
 * sways the camera a little to either bank, so consecutive rooms do not frame
 * the river identically; it stays small because the range is only 155 units
 * wide and a larger sway shows its edge. `calm` slows the current.
 */
export type Station = { depth: number; drift: number; calm: number };

const STATIONS: Record<RoomId, Station> = {
  lobby: { depth: 0, drift: 0, calm: 0 },
  projects: { depth: 0.22, drift: -5, calm: 0 },
  experience: { depth: 0.44, drift: 4, calm: 0 },
  principles: { depth: 0.62, drift: 0, calm: 1 },
  stack: { depth: 0.8, drift: 6, calm: 0 },
};

/** An exhibit is a few steps further into the room it hangs in. */
const EXHIBIT_STEP = 0.06;

export function stationFor(pathname: string): Station {
  const room = roomForPath(pathname);
  const base = STATIONS[room.id];
  if (room.id === "lobby" || pathname === room.href) return base;
  return { ...base, depth: base.depth + EXHIBIT_STEP, drift: base.drift - 1.5 };
}
