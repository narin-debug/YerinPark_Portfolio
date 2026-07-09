"use client";

import { useLayoutEffect, useRef } from "react";
import Placeholder from "@/components/Placeholder";
import { FRAME_PATH } from "@/lib/content";

type ThumbImage = { url: string } | { placeholderLabel: string };

type ProjectCardProps = {
  index: number;
  title: string;
  meta: string;
  baseImage: ThumbImage;
  hoverImage: ThumbImage;
  videoUrl?: string | null;
};

function Thumb({
  image,
  alt,
  className,
}: {
  image: ThumbImage;
  alt: string;
  className: string;
}) {
  if ("url" in image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image.url} alt={alt} className={className} />;
  }
  return <Placeholder label={image.placeholderLabel} className={className} />;
}

export default function ProjectCard({
  index,
  title,
  meta,
  baseImage,
  hoverImage,
  videoUrl,
}: ProjectCardProps) {
  const hoverPathRef = useRef<SVGPathElement>(null);

  useLayoutEffect(() => {
    const path = hoverPathRef.current;
    if (!path) return;
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;
  }, []);

  const clipId = `card-clip-${index}`;

  const card = (
    <div
      className="group relative w-full min-w-0 overflow-hidden"
      style={{ aspectRatio: "407 / 411" }}
    >
      <svg
        viewBox="0 0 407 411"
        className="h-full w-full overflow-hidden"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
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
              <Thumb
                image={baseImage}
                alt={title}
                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0"
              />
              <Thumb
                image={hoverImage}
                alt={`${title} hover`}
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-t from-black/75 via-black/20 to-transparent p-4">
                <span className="text-sm font-medium text-foreground">{title}</span>
                <span className="text-xs text-muted">{meta}</span>
              </div>
            </div>
          </foreignObject>
        </g>

        <path d={FRAME_PATH} className="frame-stroke" />
        <path ref={hoverPathRef} d={FRAME_PATH} className="frame-stroke-hover" />
      </svg>
    </div>
  );

  if (videoUrl) {
    return (
      <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="block min-w-0">
        {card}
      </a>
    );
  }

  return card;
}
