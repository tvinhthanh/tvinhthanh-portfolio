import { T, t } from "@/lib/i18n";

type Weapon = {
  name: string;
  role: { en: string; vi: string };
  badge: string;
};

const weapons: Weapon[] = [
  {
    name: "Next.js 16",
    role: t("SSR, Edge & Full-stack", "SSR, Edge & Full-stack"),
    badge: "Core",
  },
  {
    name: "React 19",
    role: t("Concurrent UI & RSC", "Giao diện đa luồng & RSC"),
    badge: "UI",
  },
  {
    name: "TypeScript",
    role: t("Type Contracts & Safety", "Hợp đồng kiểu & An toàn"),
    badge: "Lang",
  },
  {
    name: "NestJS",
    role: t("Modular Enterprise Services", "Dịch vụ doanh nghiệp module"),
    badge: "Backend",
  },
  {
    name: "PostgreSQL",
    role: t("ACID & Immutable Ledgers", "ACID & Sổ cái bất biến"),
    badge: "Database",
  },
  {
    name: "Redis & BullMQ",
    role: t("Event Queues & Low-latency", "Hàng đợi sự kiện & Độ trễ thấp"),
    badge: "Async",
  },
  {
    name: "Docker",
    role: t("Containerised Delivery", "Đóng gói & Phân phối"),
    badge: "DevOps",
  },
  {
    name: "Three.js",
    role: t("WebGL & Interactive 3D", "WebGL & Không gian 3D"),
    badge: "Graphics",
  },
];

const arsenalTitle = t("Core Technical Pillars", "Công Nghệ Chủ Lực");

export function ArsenalShowcase() {
  return (
    <div className="mb-12">
      <div className="mb-5 flex items-center justify-between">
        <p className="mono text-step--2 uppercase tracking-[0.14em] text-accent">
          <T v={arsenalTitle} />
        </p>
        <span className="mono text-step--2 text-ink-faint">8 Core Pillars</span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {weapons.map((w) => (
          <div
            key={w.name}
            className="panel group relative flex flex-col justify-between p-4 transition-all duration-300 hover:border-hairline hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(237,212,154,0.12)]"
          >
            <div className="flex items-start justify-between">
              <span className="mono rounded-chip border border-line-soft bg-surface-2/60 px-2 py-0.5 text-[0.6875rem] text-ink-faint group-hover:border-accent/40 group-hover:text-accent">
                {w.badge}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-line-soft transition-colors duration-200 group-hover:bg-accent group-hover:shadow-[0_0_6px_var(--accent)]" />
            </div>

            <div className="mt-4">
              <h4 className="font-medium text-step--1 text-ink group-hover:text-accent transition-colors duration-200">
                {w.name}
              </h4>
              <p className="mt-1 text-step--2 text-ink-soft leading-snug">
                <T v={w.role} />
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
