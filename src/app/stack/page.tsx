import type { Metadata } from "next";
import { LabBench } from "@/components/lab/lab-bench";
import { Doorways, Gallery, RoomFrame, RoomHeader } from "@/components/rooms/room";
import { ArsenalShowcase } from "@/components/ui/arsenal-showcase";
import { ExpertiseMap } from "@/components/ui/expertise-map";
import { Reveal } from "@/components/ui/reveal";
import { domains } from "@/content/profile";
import { t } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Stack & Lab",
  description:
    "The stack Truong Vinh Thanh works in — React, Next.js, TypeScript, NestJS, PostgreSQL, Redis and more — and an interactive Three.js lab.",
  alternates: { canonical: "/stack" },
};

const techniques = domains.reduce((sum, domain) => sum + domain.items.length, 0);

export default function StackRoom() {
  return (
    <RoomFrame>
      <RoomHeader
        id="stack"
        facts={[
          t(`${domains.length} domains`, `${domains.length} mảng`),
          t(`${techniques} techniques`, `${techniques} kỹ thuật`),
        ]}
      />

      <Gallery
        id="tools"
        aside={t("On the wall", "Trên tường")}
        title={t("Tools & capabilities", "Công cụ & năng lực")}
        intro={t(
          "Segment thickness and node density show where the ground is broadest — hover or tap a segment to read what is actually in it.",
          "Độ dày cung và mật độ điểm cho thấy mảng nào rộng nhất — rê chuột hoặc chạm vào một cung để xem bên trong có gì.",
        )}
      >
        <div className="placard p-5 sm:p-8">
          <Reveal>
            <ArsenalShowcase />
          </Reveal>
          <Reveal delay={120}>
            <ExpertiseMap />
          </Reveal>
        </div>
      </Gallery>

      <Gallery
        id="lab"
        aside={t("On the bench", "Trên bàn")}
        title={t("3D lab", "Phòng thí nghiệm 3D")}
        intro={t(
          "A small collection of interactive models exploring structure, motion, and data visualization.",
          "Một số mô hình tương tác để khám phá cấu trúc, chuyển động và cách hiển thị dữ liệu.",
        )}
      >
        <LabBench />
      </Gallery>

      <Doorways current="stack" />
    </RoomFrame>
  );
}
