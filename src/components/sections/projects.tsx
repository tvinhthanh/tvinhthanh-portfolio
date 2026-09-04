import { pages } from "@/content/profile";
import { featured, featuredDetail } from "@/content/projects";
import { T, t } from "@/lib/i18n";
import { Archive } from "../projects/archive";
import { FeaturedCard } from "../projects/featured-card";
import { Reveal } from "../ui/reveal";
import { Section } from "../ui/section";

const page = pages[3];

export function Projects() {
  return (
    <Section
      id="projects"
      index="03"
      wide
      title={page.label}
      aside={page.aside}
      intro={t(
        "Six systems worth reading in detail, then everything else in a table. Each one is a public repository — the descriptions are the ones I wrote for the code.",
        "Sáu hệ thống đáng đọc kỹ, phần còn lại nằm trong bảng. Mỗi mục đều là một repository công khai — mô tả chính là những gì tôi viết cho mã nguồn đó.",
      )}
    >
      <div className="space-y-6">
        {featured.map((project, i) => {
          const detail = featuredDetail[project.id];
          if (!detail) return null;
          return (
            <FeaturedCard key={project.id} project={project} detail={detail} delay={i * 60} />
          );
        })}
      </div>

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
