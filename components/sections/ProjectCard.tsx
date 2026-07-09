"use client";

import { useLayoutEffect, useRef } from "react";
import Placeholder from "@/components/Placeholder";
import { FRAME_PATH } from "@/lib/content";

type ProjectCardProps = {
  index: number;
};

export default function ProjectCard({ index }: ProjectCardProps) {
  const hoverPathRef = useRef<SVGPathElement>(null);

  useLayoutEffect(() => {
    const path = hoverPathRef.current;
    if (!path) return;
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;
  }, []);

  const clipId = `card-clip-${index}`;

  return (
    <div className="group relative w-full" style={{ aspectRatio: "407 / 411" }}>
      <svg viewBox="0 0 407 411" className="h-full w-full" aria-hidden="true">
        <defs>
          <clipPath id={clipId}>
            <path d={FRAME_PATH} />
          </clipPath>
        </defs>

        <g clipPath={`url(#${clipId})`}>
          <foreignObject x={0} y={0} width={407} height={411}>
            <div
              {...{ xmlns: "http://www.w3.org/1999/xhtml" }}
              className="relative h-full w-full"
            >
              <Placeholder
                label={`[TODO] 기본 썸네일 · 프로젝트 ${index + 1}`}
                className="absolute inset-0 h-full w-full transition-opacity duration-500 group-hover:opacity-0"
              />
              <Placeholder
                label={`[TODO] 호버 썸네일(이미지/GIF) · 프로젝트 ${index + 1}`}
                className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-t from-black/75 via-black/20 to-transparent p-4">
                <span className="text-sm font-medium text-[#f2f2ec]">
                  [TODO] 프로젝트명 {index + 1}
                </span>
                <span className="text-xs text-[#8b8b85]">
                  [TODO] 연도 · 카테고리
                </span>
              </div>
            </div>
          </foreignObject>
        </g>

        <path d={FRAME_PATH} className="frame-stroke" />
        <path ref={hoverPathRef} d={FRAME_PATH} className="frame-stroke-hover" />
      </svg>
    </div>
  );
}
