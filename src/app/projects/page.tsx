import type { Metadata } from "next";
import { Archive } from "@/components/projects/archive";
import { Exhibit } from "@/components/projects/exhibit";
import { Doorways, Gallery, RoomFrame, RoomHeader } from "@/components/rooms/room";
import { archive, exhibits } from "@/content/projects";
import { t } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Featured projects by Truong Vinh Thanh — production platforms, business systems and AI-assisted tooling, each with role, scope and outcome.",
  alternates: { canonical: "/projects" },
};

/* The principal works get a wall each; the rest hang together beside them. */
const principal = new Set(["pvt-space", "cms-pos", "social-platform-case-study"]);
const mainHall = exhibits.filter((entry) => principal.has(entry.project.id));
const sideGallery = exhibits.filter((entry) => !principal.has(entry.project.id));

export default function ProjectsRoom() {
  return (
    <RoomFrame>
      <RoomHeader
        id="projects"
        facts={[
          t(`${exhibits.length} exhibits`, `${exhibits.length} hiện vật`),
          t(`${archive.length} in the store room`, `${archive.length} trong kho`),
        ]}
      />

      <Gallery
        id="selected"
        aside={t("Main hall", "Gian chính")}
        title={t("Selected projects", "Dự án chọn lọc")}
        intro={t(
          "Real-time product delivery, business data integrity, and web architecture.",
          "Sản phẩm thời gian thực, tính đúng đắn của dữ liệu nghiệp vụ và kiến trúc web.",
        )}
      >
        <div className="space-y-10 lg:space-y-16">
          {mainHall.map((entry, i) => (
            <Exhibit key={entry.project.id} {...entry} variant="hang" flip={i % 2 === 1} />
          ))}
        </div>
      </Gallery>

      <Gallery
        id="more"
        aside={t("Side gallery", "Gian phụ")}
        title={t("Also in the collection", "Cũng trong bộ sưu tập")}
      >
        <div className="grid gap-6 md:grid-cols-2">
          {sideGallery.map((entry, i) => (
            <Exhibit key={entry.project.id} {...entry} variant="salon" delay={(i % 2) * 70} />
          ))}
        </div>
      </Gallery>

      <Gallery
        id="archive"
        aside={t("Store room", "Kho")}
        title={t("Archive", "Kho lưu trữ")}
        intro={t(
          "Coursework, client work and experiments. Kept public because the comparisons between them are the interesting part.",
          "Bài tập lớn, việc cho khách và các thử nghiệm. Để công khai vì phần thú vị nằm ở chỗ so sánh chúng với nhau.",
        )}
      >
        <div className="placard p-5 sm:p-8">
          <Archive />
        </div>
      </Gallery>

      <Doorways current="projects" />
    </RoomFrame>
  );
}
