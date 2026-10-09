import { getPage } from "@/content/profile";
import { featured, featuredDetail } from "@/content/projects";
import { T, t } from "@/lib/i18n";
import { Archive } from "../projects/archive";
import { FeaturedCard } from "../projects/featured-card";
import { Reveal } from "../ui/reveal";
import { Section } from "../ui/section";

const page = getPage("projects");
const selectedIds = new Set(["pvt-space", "cms-pos", "social-platform-case-study"]);
const selected = featured.filter((project) => selectedIds.has(project.id));
const more = featured.filter((project) => !selectedIds.has(project.id));

export function Projects() {
  return (
    <Section
      id="projects"
      index="02"
      wide
      title={page.label}
      aside={page.aside}
      intro={t(
        "Three selected projects: real-time product delivery, business data integrity, and web architecture. Expand each card for engineering details and ownership.",
        "Ba dự án chọn lọc: sản phẩm thời gian thực, tính đúng đắn của dữ liệu nghiệp vụ và kiến trúc web. Mở từng thẻ để xem quyết định kỹ thuật và phạm vi đóng góp.",
      )}
    >
      <div
        className="robot-anchor robot-anchor--projects"
        data-robot-anchor="projects"
        aria-hidden="true"
      />
      <div className="space-y-6">
        {selected.map((project, i) => {
          const detail = featuredDetail[project.id];
          if (!detail) return null;
          return (
            <FeaturedCard key={project.id} project={project} detail={detail} delay={i * 60} />
          );
        })}
      </div>

      <details className="mt-8 rounded-card border border-line p-5">
        <summary className="cursor-pointer text-step-0 font-medium text-ink">
          <T v={t("More projects", "Các dự án khác")} /> ({more.length})
        </summary>
        <div className="mt-6 space-y-6">
          {more.map((project) => {
            const detail = featuredDetail[project.id];
            return detail ? <FeaturedCard key={project.id} project={project} detail={detail} delay={0} /> : null;
          })}
        </div>
      </details>

      <Reveal className="mt-20">
        <h3 className="display text-step-2 text-ink">
          <T v={t("Archive", "Kho lưu trữ")} />
        </h3>
        <p className="mt-3 max-w-[54ch] text-step--1 text-ink-soft">
          <T
            v={t(
              "Coursework, client work and experiments. Kept public because the comparisons between them are the interesting part.",
              "Bài tập lớn, việc cho khách và các thử nghiệm. Để công khai vì phần thú vị nằm ở chỗ so sánh chúng với nhau.",
            )}
          />
        </p>
      </Reveal>

      <Reveal delay={80} className="mt-8">
        <Archive />
      </Reveal>
    </Section>
  );
}
