import TextReveal from "@/components/TextReveal";
import type { SiteContent } from "@/lib/content";

export default function Hero({ content }: { content: SiteContent }) {
  return (
    <section
      id="hero"
      className="relative flex h-screen w-full items-end overflow-hidden bg-background"
    >
      {content.heroImageUrl && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={content.heroImageUrl}
            alt={content.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/10" />
        </>
      )}

      <div className="relative z-10 w-full px-6 pb-16 sm:px-10 sm:pb-20 md:px-14">
        <TextReveal
          as="h1"
          className="text-[13vw] font-semibold uppercase leading-[0.95] tracking-tight sm:text-[9vw] md:text-[7vw]"
        >
          {content.name}
        </TextReveal>
        <TextReveal
          as="p"
          className="mt-4 max-w-xl text-sm text-muted sm:text-base md:text-lg"
          start="top 92%"
        >
          {`${content.role} (${content.field}) · ${content.experienceNote}`}
        </TextReveal>
      </div>

      <div className="absolute bottom-6 right-6 z-10 text-[11px] uppercase tracking-[0.2em] text-muted sm:right-10">
        Scroll
      </div>
    </section>
  );
}
