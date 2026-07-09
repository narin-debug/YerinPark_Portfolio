import { notFound } from "next/navigation";
import { getProject } from "@/lib/data";
import { deleteProjectAction, updateProjectAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getProject(id);
  if (!item) notFound();

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-medium">프로젝트 항목 수정</h1>

      <div className="flex gap-4">
        <div>
          <p className="mb-1 text-xs text-muted">기본 썸네일</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.base_thumbnail_url}
            alt={item.title}
            className="h-32 w-48 rounded object-cover"
          />
        </div>
        {item.hover_thumbnail_url && (
          <div>
            <p className="mb-1 text-xs text-muted">호버 썸네일</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.hover_thumbnail_url}
              alt={`${item.title} hover`}
              className="h-32 w-48 rounded object-cover"
            />
          </div>
        )}
      </div>

      <form
        action={updateProjectAction.bind(null, id)}
        className="space-y-3 rounded border border-white/10 p-4"
      >
        <input
          name="title"
          defaultValue={item.title}
          required
          className="w-full rounded border border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <input
          name="year_category"
          defaultValue={item.year_category ?? ""}
          placeholder="연도 · 카테고리"
          className="w-full rounded border border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <input
          name="video_url"
          defaultValue={item.video_url ?? ""}
          placeholder="영상 링크 (유튜브/비메오)"
          className="w-full rounded border border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <div>
          <label className="text-xs text-muted">기본 썸네일을 바꾸려면 새 파일을 선택 (선택 사항)</label>
          <input type="file" name="base_thumbnail" accept="image/*" className="mt-1 w-full text-sm" />
        </div>
        <div>
          <label className="text-xs text-muted">호버 썸네일을 바꾸려면 새 파일을 선택 (선택 사항)</label>
          <input type="file" name="hover_thumbnail" accept="image/*" className="mt-1 w-full text-sm" />
        </div>
        <button
          type="submit"
          className="rounded bg-accent px-4 py-2 text-sm font-medium text-black"
        >
          저장
        </button>
      </form>

      <form action={deleteProjectAction.bind(null, id)}>
        <button type="submit" className="text-sm text-red-400 hover:text-red-300">
          이 항목 삭제
        </button>
      </form>
    </div>
  );
}
