import ProjectCard from "@/components/sections/ProjectCard";
import { projectPlaceholders } from "@/lib/content";

export default function ProjectGrid() {
  return (
    <section
      id="projects"
      className="relative w-full bg-background px-6 py-24 sm:px-10 md:px-14 md:py-32"
    >
      <div className="mb-10 text-[11px] uppercase tracking-[0.2em] text-muted">
        Projects
      </div>
      <p className="mb-12 max-w-xl text-sm text-muted sm:text-base">
        항목 수·상세 정보는 [TODO] — 준비된 자료가 들어오는 만큼 카드가
        채워집니다. 클릭 시 실제 영상(유튜브/비메오)으로 연결될 예정입니다.
      </p>

      <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 md:grid-cols-3">
        {projectPlaceholders.map((project, i) => (
          <ProjectCard key={project.id} index={i} />
        ))}
      </div>
    </section>
  );
}
