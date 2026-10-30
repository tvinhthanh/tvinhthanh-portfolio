import { profile, resumes } from "@/content/profile";
import { T, t } from "@/lib/i18n";
import { Reveal } from "../ui/reveal";

const channels = [
  { label: t("Email", "Email"), value: profile.email, href: `mailto:${profile.email}` },
  { label: t("Phone", "Điện thoại"), value: profile.phone, href: `tel:${profile.phoneHref}` },
  { label: t("GitHub", "GitHub"), value: `github.com/${profile.github}`, href: profile.githubUrl, external: true },
  { label: t("LinkedIn", "LinkedIn"), value: "Vĩnh Thành Trương", href: profile.linkedinUrl, external: true },
];

/** The curator's note: the longer introduction, for anyone who stayed. */
export function About() {
  return (
    <section id="intro" aria-labelledby="intro-title" className="pt-[var(--s-section)]">
      <div className="grid lg:grid-cols-12">
        <Reveal className="placard p-6 sm:p-10 lg:col-span-8">
          <p className="meta text-ink-faint">
            <T v={t("Curator's note", "Lời giới thiệu")} />
          </p>
          <h2 id="intro-title" className="display mt-3 text-step-4 font-semibold text-ink">
            <T v={t("About", "Giới thiệu")} />
          </h2>
          <p className="mt-6 text-step-1 leading-[1.75] text-ink">
            <T v={profile.intro} />
          </p>
          <p className="mt-5 text-ink-soft">
            <T v={profile.introSecondary} />
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/** The front desk, at the foot of the lobby. Every room's last door leads here. */
export function Desk() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-8 pt-[var(--s-section)]">
      <div className="grid lg:grid-cols-12">
        <Reveal className="placard p-6 sm:p-10 lg:col-span-8 lg:col-start-5">
          <p className="meta text-ink-faint">
            <T v={t("The front desk", "Quầy liên hệ")} />
          </p>
          <h2 id="contact-title" className="display mt-3 text-step-4 font-semibold text-ink">
            <T v={t("Contact", "Liên hệ")} />
          </h2>
          <p className="mt-4 max-w-[54ch] text-ink-soft">
            <T
              v={t(
                "Tell me what the product does and what is currently breaking. That is usually the fastest way to work out whether I am the right fit.",
                "Cứ nói sản phẩm của bạn làm gì và hiện đang hỏng ở đâu. Đó thường là cách nhanh nhất để biết tôi có hợp hay không.",
              )}
            />
          </p>

          <a
            href={`mailto:${profile.email}`}
            className="display mt-8 block break-words text-step-4 font-semibold text-ink no-underline transition-colors duration-200 hover:text-accent"
          >
            {profile.email}
          </a>

          <dl className="mt-8">
            {channels.map((channel) => (
              <div
                key={channel.label.en}
                className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 border-t border-line py-3.5"
              >
                <dt className="mono text-step--2 uppercase tracking-[0.14em] text-ink-faint">
                  <T v={channel.label} />
                </dt>
                <dd className="text-step--1">
                  <a
                    href={channel.href}
                    {...(channel.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                    className="text-ink underline decoration-line underline-offset-[5px] transition-colors hover:text-accent hover:decoration-accent"
                  >
                    {channel.value}
                  </a>
                </dd>
              </div>
            ))}
            <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 border-t border-line py-3.5">
              <dt className="mono text-step--2 uppercase tracking-[0.14em] text-ink-faint">
                <T v={t("Location", "Địa điểm")} />
              </dt>
              <dd className="text-step--1 text-ink">
                <T v={profile.locationFull} />
              </dd>
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-y border-line py-3.5">
              <dt className="mono text-step--2 uppercase tracking-[0.14em] text-ink-faint">
                <T v={t("Résumé", "CV")} />
              </dt>
              <dd className="flex flex-wrap gap-x-5 gap-y-2">
                {resumes.map((cv) => (
                  <a
                    key={cv.file}
                    href={cv.file}
                    download
                    className="text-step--1 text-ink underline decoration-line underline-offset-[5px] transition-colors hover:text-accent hover:decoration-accent"
                  >
                    <T v={cv.label} />
                  </a>
                ))}
              </dd>
            </div>
          </dl>

          <p className="mono mt-8 text-step--2 uppercase tracking-[0.14em] text-ink-faint">
            {profile.nameLatin}
            <span aria-hidden="true" className="mx-2">
              /
            </span>
            <span className="tnum">{new Date().getFullYear()}</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
