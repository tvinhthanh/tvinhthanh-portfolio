import { pages, profile, resumes } from "@/content/profile";
import { T, t } from "@/lib/i18n";
import { Reveal } from "../ui/reveal";
import { Section } from "../ui/section";

const page = pages[7];

const channels = [
  { label: t("Email", "Email"), value: profile.email, href: `mailto:${profile.email}` },
  { label: t("Phone", "Điện thoại"), value: profile.phone, href: `tel:${profile.phoneHref}` },
  {
    label: t("GitHub", "GitHub"),
    value: `github.com/${profile.github}`,
    href: profile.githubUrl,
    external: true,
  },
  {
    label: t("LinkedIn", "LinkedIn"),
    value: "Vĩnh Thành Trương",
    href: profile.linkedinUrl,
    external: true,
  },
  { label: t("Location", "Địa điểm"), value: null, text: profile.locationFull },
];

export function Contact() {
  return (
    <Section
      id="contact"
      index="07"
      title={page.label}
      aside={page.aside}
      intro={t(
        "Tell me what the product does and what is currently breaking. That is usually the fastest way to work out whether I am the right fit.",
        "Cứ nói sản phẩm của bạn làm gì và hiện đang hỏng ở đâu. Đó thường là cách nhanh nhất để biết tôi có hợp hay không.",
      )}
    >
      <Reveal>
        <a
          href={`mailto:${profile.email}`}
          className="display block break-words text-step-4 text-ink no-underline transition-colors duration-200 hover:text-accent"
        >
          {profile.email}
        </a>
      </Reveal>

      <Reveal delay={80} className="mt-12">
        <dl>
          {channels.map((channel) => (
            <div
              key={channel.label.en}
              className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 border-t border-line py-3.5"
            >
              <dt className="mono text-step--2 uppercase tracking-[0.14em] text-ink-faint">
                <T v={channel.label} />
              </dt>
              <dd className="text-step--1 text-ink">
                {channel.href ? (
                  <a
                    href={channel.href}
                    {...(channel.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                    className="text-ink underline decoration-line underline-offset-[5px] transition-colors hover:text-accent hover:decoration-accent"
                  >
                    {channel.value}
                  </a>
                ) : channel.text ? (
                  <T v={channel.text} />
                ) : null}
              </dd>
            </div>
          ))}
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
      </Reveal>
    </Section>
  );
}
