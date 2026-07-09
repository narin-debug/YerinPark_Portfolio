"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";

type TextRevealProps = {
  children: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  className?: string;
  start?: string;
  stagger?: number;
};

export default function TextReveal({
  children,
  as = "p",
  className = "",
  start = "top 88%",
  stagger = 0.1,
}: TextRevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    let split: SplitText | undefined;
    let ctx: gsap.Context | undefined;

    const setup = () => {
      split = new SplitText(el, {
        type: "lines",
        linesClass: "tr-line",
      });

      split.lines.forEach((line) => {
        const mask = document.createElement("span");
        mask.className = "tr-line-mask";
        line.parentNode?.insertBefore(mask, line);
        mask.appendChild(line);

        const bar = document.createElement("span");
        bar.className = "tr-line-bar";
        mask.appendChild(bar);
      });

      ctx = gsap.context(() => {
        const prefersReduced = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReduced) {
          gsap.set(split!.lines, { opacity: 1 });
          return;
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start,
            toggleActions: "play none none none",
          },
        });

        split!.lines.forEach((line, i) => {
          const bar = line.nextElementSibling;
          tl.fromTo(
            line,
            { yPercent: 115, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.7, ease: "power4.out" },
            i * stagger
          );
          if (bar) {
            tl.fromTo(
              bar,
              { xPercent: -110 },
              { xPercent: 110, duration: 0.85, ease: "power2.inOut" },
              i * stagger
            );
          }
        });
      }, el);
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        setup();
        ScrollTrigger.refresh();
      });
    } else {
      setup();
    }

    return () => {
      ctx?.revert();
      split?.revert();
    };
  }, [children, start, stagger]);

  // polymorphic tag + shared HTMLElement ref: no single intrinsic-element type fits all of h1/h2/h3/p/span/div
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Tag = as as any;
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
