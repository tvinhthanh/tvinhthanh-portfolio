import type { Category } from "@/content/projects";
import { t, type L } from "@/lib/i18n";

/* The words on a museum label, shared by the gallery wall and the exhibit
   pages so the two never describe the same thing differently. */
export const labels = {
  exhibit: t("Exhibit", "Hiện vật"),
  of: t("of", "trên"),
  role: t("Role", "Vai trò"),
  challenge: t("The hard part", "Phần khó"),
  outcome: t("Delivered", "Đã triển khai"),
  updated: t("Updated", "Cập nhật"),
  category: t("Category", "Thể loại"),
  language: t("Language", "Ngôn ngữ"),
  stars: t("Stars", "Sao"),
  built: t("Built with", "Công nghệ"),
  status: t("Status", "Trạng thái"),
  split: t("My share of the work", "Phần việc của tôi"),
  byCommits: t("Shares counted by commits.", "Tỷ lệ tính theo số commit."),
  view: t("View exhibit", "Xem hiện vật"),
  live: t("Live demo", "Bản chạy thật"),
  source: t("View source", "Xem mã nguồn"),
  study: t("Read the case study", "Đọc case study"),
  rules: t("AI rules (.ai)", "Bộ quy tắc AI (.ai)"),
  aiNative: t("AI-native workflow", "Quy trình AI-native"),
  links: t("Links", "Liên kết"),
  wallLabel: t("Wall label", "Nhãn trưng bày"),
  onward: t("More from the collection", "Xem tiếp trong bộ sưu tập"),
  back: t("Back to the collection", "Về bộ sưu tập"),
  previous: t("Previous exhibit", "Hiện vật trước"),
  next: t("Next exhibit", "Hiện vật kế tiếp"),
};

export const categoryLabel: Record<Category, L> = {
  business: t("Business system", "Hệ thống nghiệp vụ"),
  commerce: t("Commerce", "Thương mại"),
  ai: t("AI & tooling", "AI & công cụ"),
  mobile: t("Mobile", "Mobile"),
  game: t("Game", "Game"),
  frontend: t("Web & frontend", "Web & frontend"),
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatDate(iso: string) {
  const [y, m] = iso.split("-");
  return `${MONTHS[Number(m) - 1]} ${y}`;
}
