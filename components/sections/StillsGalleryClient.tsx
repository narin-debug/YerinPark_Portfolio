"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import Placeholder from "@/components/Placeholder";

export type GalleryFigureItem = {
  caption: string;
  image: { url: string } | { placeholderLabel: string };
};

export default function StillsGalleryClient({ items }: { items: GalleryFigureItem[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;

      // 모바일: 네이티브 가로 스크롤(snap)로 대체, pin/scrub 애니메이션 생략
      if (prefersReduced || !isDesktop) return;

      const getDistance = () => track.scrollWidth - window.innerWidth;

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${getDistance()}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        animation: gsap.to(track, { x: () => -getDistance(), ease: "none" }),
      });

      // 은은한 패럴랙스: 캡션이 이미지와 살짝 다른 속도로 이동
      track.querySelectorAll<HTMLElement>("[data-parallax]").forEach((cap) => {
        gsap.fromTo(
          cap,
          { xPercent: 8 },
          {
            xPercent: -8,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${getDistance()}`,
              scrub: 1,
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, [items.length]);

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-background md:h-screen"
    >
      <div className="pointer-events-none absolute left-6 top-8 z-10 text-[11px] uppercase tracking-[0.2em] text-muted sm:left-10">
        작업 스타일 하이라이트
      </div>
      <div
        ref={trackRef}
        className="flex h-full gap-4 overflow-x-auto px-6 pb-10 pt-24 snap-x snap-mandatory sm:gap-6 sm:px-10 md:h-screen md:w-max md:items-center md:overflow-x-visible md:pb-0 md:pt-0 md:snap-none"
      >
        {items.map((item, i) => (
          <figure
            key={i}
            className="relative h-[60vh] w-[78vw] shrink-0 snap-start sm:h-[65vh] sm:w-[46vw] md:h-[70vh] md:w-[32vw]"
          >
            {"url" in item.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.image.url}
                alt={item.caption}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <Placeholder
                label={item.image.placeholderLabel}
                className="absolute inset-0 h-full w-full"
              />
            )}
            <figcaption
              data-parallax
              className="absolute bottom-4 left-4 text-sm text-foreground sm:text-base"
            >
              {item.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
