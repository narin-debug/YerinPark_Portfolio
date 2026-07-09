"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
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
  style,
}: {
  image: ThumbImage;
  alt: string;
  className: string;
  style?: CSSProperties;
}) {
  if ("url" in image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image.url} alt={alt} className={className} style={style} />;
  }
  return <Placeholder label={image.placeholderLabel} className={className} style={style} />;
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
  const [frameLength, setFrameLength] = useState(0);
  // 마우스 hover(desktop) + 터치(mobile) 둘 다 같은 상태로 다뤄서
  // 썸네일 크로스페이드/프레임 스트로크 리빌이 모바일에서도 동작하게 한다.
  const [active, setActive] = useState(false);

  useLayoutEffect(() => {
    const path = hoverPathRef.current;
    if (!path) return;
    setFrameLength(path.getTotalLength());
  }, []);

  const clipId = `card-clip-${index}`;

  const card = (
    <div
      className="relative w-full min-w-0 overflow-hidden"
      style={{ aspectRatio: "407 / 411" }}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onTouchStart={() => setActive(true)}
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
                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
                style={{ opacity: active ? 0 : 1 }}
              />
              <Thumb
                image={hoverImage}
                alt={`${title} hover`}
                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
                style={{ opacity: active ? 1 : 0 }}
              />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-t from-black/75 via-black/20 to-transparent p-4">
                <span className="text-sm font-medium text-foreground">{title}</span>
                <span className="text-xs text-muted">{meta}</span>
              </div>
            </div>
          </foreignObject>
        </g>

        <path d={FRAME_PATH} className="frame-stroke" />
        <path
          ref={hoverPathRef}
          d={FRAME_PATH}
          className="frame-stroke-hover"
          style={{
            strokeDasharray: frameLength || undefined,
            strokeDashoffset: active ? 0 : frameLength || undefined,
          }}
        />
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
