import Hero from "@/components/sections/Hero";
import StillsGallery from "@/components/sections/StillsGallery";
import Intro from "@/components/sections/Intro";
import ProjectGrid from "@/components/sections/ProjectGrid";
import ToolsBand from "@/components/sections/ToolsBand";
import Contact from "@/components/sections/Contact";
import { resolveSiteContent, type SiteContentRow } from "@/lib/content";
import { getSiteContent } from "@/lib/data";

export default async function Home() {
  // Supabase가 아직 설정되지 않았거나 일시적으로 오류가 나도 공개 페이지는
  // 기존 정적 콘텐츠로 계속 정상 렌더링되어야 한다.
  let row: SiteContentRow | null = null;
  try {
    row = await getSiteContent();
  } catch {
    row = null;
  }
  const content = resolveSiteContent(row);

  return (
    <main className="relative w-full bg-background">
      <Hero content={content} />
      <StillsGallery />
      <Intro content={content} />
      <ProjectGrid />
      <ToolsBand tools={content.tools} />
      <Contact content={content} />
    </main>
  );
}
