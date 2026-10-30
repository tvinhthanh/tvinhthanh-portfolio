import { t, type L } from "@/lib/i18n";

/**
 * The floor plan. The site is a pavilion: a lobby and four rooms along the
 * river, each its own URL, walked in order or entered directly.
 *
 * Same rule as the old section names: `label` is the professional name a
 * recruiter reads, `aside` is the room's name in the world, small and
 * secondary, never load-bearing.
 */

export type RoomId = "lobby" | "projects" | "experience" | "principles" | "stack";

export type Room = {
  id: RoomId;
  href: string;
  /** Roman numeral on the plan. The lobby has none. */
  numeral: string;
  label: L;
  aside: L;
  /** The wall text at the entrance of the room. */
  wall: L;
};

export const rooms = [
  {
    id: "lobby",
    href: "/",
    numeral: "",
    label: t("Lobby", "Sảnh"),
    aside: t("Entrance", "Lối vào"),
    wall: t(
      "Walk them in order, or go straight to the one you came for.",
      "Đi lần lượt, hoặc vào thẳng phòng bạn cần.",
    ),
  },
  {
    id: "projects",
    href: "/projects",
    numeral: "I",
    label: t("Projects", "Dự án"),
    aside: t("Room I · The collection", "Phòng I · Bộ sưu tập"),
    wall: t(
      "The systems worth a close look, each hung with a museum label: what it is, what I owned, what shipped. Open an exhibit to read the full case. The store room at the back keeps everything else.",
      "Những hệ thống đáng xem kỹ, mỗi hiện vật kèm một nhãn trưng bày: nó là gì, phần nào do tôi phụ trách, cái gì đã chạy thật. Mở một hiện vật để đọc đầy đủ. Kho phía sau giữ phần còn lại.",
    ),
  },
  {
    id: "experience",
    href: "/experience",
    numeral: "II",
    label: t("Experience", "Kinh nghiệm"),
    aside: t("Room II · The path", "Phòng II · Con đường"),
    wall: t(
      "Every role since 2023 on one axis. Some ran in parallel; the chart shows where they overlap, and each plaque below says what the role involved and the stack it ran on.",
      "Mọi vị trí từ 2023 trên cùng một trục. Có những việc chạy song song; biểu đồ cho thấy chỗ chồng lên nhau, và mỗi tấm bảng bên dưới ghi rõ công việc cùng công nghệ đã dùng.",
    ),
  },
  {
    id: "principles",
    href: "/principles",
    numeral: "III",
    label: t("Principles", "Nguyên tắc"),
    aside: t("Room III · The reading room", "Phòng III · Phòng đọc"),
    wall: t(
      "One idea, and where it shows up in the work. The quiet room: the river slows down here.",
      "Một ý tưởng, và những chỗ nó hiện ra trong công việc. Căn phòng yên tĩnh: dòng sông chảy chậm lại ở đây.",
    ),
  },
  {
    id: "stack",
    href: "/stack",
    numeral: "IV",
    label: t("Stack & Lab", "Công nghệ & Lab"),
    aside: t("Room IV · The workshop", "Phòng IV · Xưởng"),
    wall: t(
      "The tools on the bench. Nine domains around one core, and a 3D lab you can take apart.",
      "Đồ nghề trên bàn. Chín mảng quanh một lõi, và một phòng thí nghiệm 3D bạn có thể tháo rời.",
    ),
  },
] as const satisfies readonly Room[];

export const tourRooms = rooms.filter((room) => room.id !== "lobby");

export function getRoom(id: RoomId): Room {
  const room = rooms.find((entry) => entry.id === id);
  if (!room) throw new Error(`Unknown room: ${id}`);
  return room;
}

/** The room a path belongs to. Exhibit pages belong to the room they hang in. */
export function roomForPath(pathname: string): Room {
  const match = tourRooms.find(
    (room) => pathname === room.href || pathname.startsWith(`${room.href}/`),
  );
  return match ?? rooms[0];
}

export function roomIndex(id: RoomId) {
  return rooms.findIndex((room) => room.id === id);
}

/** Moving to a later room reads as forward; anything else reads as back. */
export function directionTo(from: RoomId, to: RoomId) {
  return roomIndex(to) > roomIndex(from) ? "nav-forward" : "nav-back";
}

/* Labels the plan and the doorways share. */
export const tour = {
  plan: t("Floor plan", "Sơ đồ"),
  continue: t("Continue the tour", "Đi tiếp"),
  next: t("Next room", "Phòng kế tiếp"),
  previous: t("Previous room", "Phòng trước"),
  backToLobby: t("Back to the lobby", "Về sảnh"),
  desk: t("Front desk", "Quầy liên hệ"),
  deskNote: t("Email, phone and CVs", "Email, điện thoại và CV"),
  skip: t("Skip to content", "Bỏ qua, tới nội dung"),
};
