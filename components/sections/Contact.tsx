import Link from "next/link";
import TextReveal from "@/components/TextReveal";
import type { SiteContent } from "@/lib/content";

export default function Contact({ content }: { content: SiteContent }) {
  const socials = [
    { label: "Instagram", href: content.contactInstagram },
    { label: "YouTube", href: content.contactYoutube },
    { label: "LinkedIn", href: content.contactLinkedin },
  ];

  return (
    <section
      id="contact"
      className="relative w-full bg-background px-6 py-24 sm:px-10 md:px-14 md:py-32"
    >
      <div className="mb-10 text-[11px] uppercase tracking-[0.2em] text-muted">
        Contact
      </div>

      <div className="mb-12 flex flex-col gap-3">
        {content.contactEmails.map((email) => (
          <a
            key={email}
            href={`mailto:${email}`}
            className="text-2xl font-medium text-foreground transition-colors hover:text-accent sm:text-3xl md:text-4xl"
          >
            {email}
          </a>
        ))}
      </div>

      <div className="mb-16 flex flex-wrap gap-4 text-sm uppercase tracking-wide sm:text-base">
        {socials.map((social) =>
          social.href ? (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition-colors hover:text-accent"
            >
              {social.label}
            </a>
          ) : (
            <span
              key={social.label}
              className="border border-dashed border-white/20 px-3 py-1 text-muted"
            >
              {social.label} [TODO]
            </span>
          )
        )}
      </div>

      <TextReveal
        as="p"
        className="max-w-2xl text-lg text-foreground sm:text-xl md:text-2xl"
      >
        {content.closingLine}
      </TextReveal>

      <div className="mt-20 text-xs text-muted">
        © {new Date().getFullYear()} {content.name}
        <Link
          href="/admin"
          aria-label="관리자"
          className="ml-3 text-muted/40 no-underline hover:text-muted"
        >
          ·
        </Link>
      </div>
    </section>
  );
}
