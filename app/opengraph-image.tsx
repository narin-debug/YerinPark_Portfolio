import { ImageResponse } from "next/og";
import { resolveSiteContent, type SiteContentRow } from "@/lib/content";
import { getSiteContent } from "@/lib/data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

// next/og(Satori)는 한글 글리프가 없는 기본 폰트를 쓰기 때문에, 실제로 쓰일
// 텍스트만 골라 Google Fonts에서 필요한 글리프만 담긴 폰트를 받아온다.
async function loadKoreanFont(text: string, weight: 400 | 700) {
  const cssUrl = `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@${weight}&text=${encodeURIComponent(
    text
  )}`;
  const css = await fetch(cssUrl).then((res) => res.text());
  const match = css.match(/src: url\(([^)]+)\) format\('(?:opentype|truetype)'\)/);
  if (!match) throw new Error("Noto Sans KR 폰트 URL을 찾지 못함");
  const fontRes = await fetch(match[1]);
  return fontRes.arrayBuffer();
}

export default async function OgImage() {
  let row: SiteContentRow | null = null;
  try {
    row = await getSiteContent();
  } catch {
    row = null;
  }
  const content = resolveSiteContent(row);
  const eyebrow = `${content.role} · ${content.field}`;

  const [bold, regular] = await Promise.all([
    loadKoreanFont(content.name, 700),
    loadKoreanFont(eyebrow, 400),
  ]).catch(() => [null, null]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          backgroundColor: "#2c2c2c",
          padding: "80px",
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: "#f88379",
            textTransform: "uppercase",
            letterSpacing: 4,
            marginBottom: 24,
            fontFamily: regular ? "Noto Sans KR" : "sans-serif",
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            fontSize: 104,
            color: "#e0e0e0",
            fontWeight: 700,
            lineHeight: 1,
            fontFamily: bold ? "Noto Sans KR" : "sans-serif",
          }}
        >
          {content.name}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        ...(bold ? [{ name: "Noto Sans KR", data: bold, weight: 700 as const, style: "normal" as const }] : []),
        ...(regular ? [{ name: "Noto Sans KR", data: regular, weight: 400 as const, style: "normal" as const }] : []),
      ],
    }
  );
}
