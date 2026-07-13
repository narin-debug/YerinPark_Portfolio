import Image from "next/image";
import Placeholder from "@/components/Placeholder";
import TextReveal from "@/components/TextReveal";
import type { SiteContent } from "@/lib/content";

export default function Hero({ content }: { content: SiteContent }) {
  return (
    <section
      id="hero"
      className="relative flex h-screen w-full items-end overflow-hidden bg-background"
    >
      {content.heroImageUrl ? (
        <Image
          src={content.heroImageUrl}
          alt={content.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <Placeholder
          label="[TODO] 히어로 배경 이미지 / 대표 편집 작업 스틸컷 (추후 영상 교체 가능)"
          className="absolute inset-0 h-full w-full"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/10" />

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
