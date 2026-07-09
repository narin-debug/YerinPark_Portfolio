import ProjectCard from "@/components/sections/ProjectCard";
import { getProjects, type ProjectItem } from "@/lib/data";
import { normalizeUrl, projectPlaceholders } from "@/lib/content";

export default async function ProjectGrid() {
  // Supabase가 아직 설정되지 않았거나 일시적으로 오류가 나도 공개 페이지는
  // placeholder로 계속 정상 렌더링되어야 한다 (관리자 페이지는 그대로 에러를 보여줌).
  let projects: ProjectItem[] = [];
  try {
    projects = await getProjects();
  } catch {
    projects = [];
  }
  const usePlaceholders = projects.length === 0;

  return (
    <section
      id="projects"
      className="relative w-full bg-background px-6 py-24 sm:px-10 md:px-14 md:py-32"
    >
      <div className="mb-10 text-[11px] uppercase tracking-[0.2em] text-muted">
        Projects
      </div>
      {usePlaceholders && (
        <p className="mb-12 max-w-xl text-sm text-muted sm:text-base">
          항목 수·상세 정보는 [TODO] — 준비된 자료가 들어오는 만큼 카드가
          채워집니다. 클릭 시 실제 영상(유튜브/비메오)으로 연결될 예정입니다.
        </p>
      )}

      <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 md:grid-cols-3">
        {usePlaceholders
          ? projectPlaceholders.map((placeholder, i) => (
              <ProjectCard
                key={placeholder.id}
                index={i}
                title={`[TODO] 프로젝트명 ${i + 1}`}
                meta="[TODO] 연도 · 카테고리"
                baseImage={{ placeholderLabel: `[TODO] 기본 썸네일 · 프로젝트 ${i + 1}` }}
                hoverImage={{
                  placeholderLabel: `[TODO] 호버 썸네일(이미지/GIF) · 프로젝트 ${i + 1}`,
                }}
              />
            ))
          : projects.map((project, i) => (
              <ProjectCard
                key={project.id}
                index={i}
                title={project.title}
                meta={project.year_category ?? "연도 · 카테고리 미입력"}
                baseImage={{ url: project.base_thumbnail_url }}
                hoverImage={
                  project.hover_thumbnail_url
                    ? { url: project.hover_thumbnail_url }
                    : { placeholderLabel: "호버 썸네일 없음" }
                }
                videoUrl={normalizeUrl(project.video_url)}
              />
            ))}
      </div>
    </section>
  );
}
