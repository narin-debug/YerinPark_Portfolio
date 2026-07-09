"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { tools } from "@/lib/content";

export default function ToolsBand() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const row = rowRef.current;
    if (!section || !row) return;

    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReduced) return;

      gsap.fromTo(
        row,
        { xPercent: -6 },
        {
          xPercent: 6,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="tools"
      ref={sectionRef}
      className="relative w-full overflow-hidden border-y border-white/10 bg-background py-10 sm:py-14"
    >
      <div
        ref={rowRef}
        className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 px-6 text-lg uppercase tracking-wide text-muted sm:gap-x-10 sm:text-2xl md:text-3xl"
      >
        {tools.map((tool, i) => (
          <span key={tool} className="flex items-center gap-x-8 sm:gap-x-10">
            {tool}
            {i < tools.length - 1 && (
              <span aria-hidden className="text-lime">
                /
              </span>
            )}
          </span>
        ))}
      </div>
    </section>
  );
}
