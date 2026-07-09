import { notFound } from "next/navigation";
import { getGalleryItem } from "@/lib/data";
import { deleteGalleryItemAction, updateGalleryItemAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditGalleryItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getGalleryItem(id);
  if (!item) notFound();

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-medium">갤러리 항목 수정</h1>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.image_url}
        alt={item.caption}
        className="h-40 w-64 rounded object-cover"
      />

      <form
        action={updateGalleryItemAction.bind(null, id)}
        className="space-y-3 rounded border border-white/10 p-4"
      >
        <input
          name="caption"
          defaultValue={item.caption}
          required
          className="w-full rounded border border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-lime"
        />
        <div>
          <label className="text-xs text-muted">
            이미지를 바꾸려면 새 파일을 선택하세요 (선택 사항)
          </label>
          <input type="file" name="image" accept="image/*" className="mt-1 w-full text-sm" />
        </div>
        <button
          type="submit"
          className="rounded bg-lime px-4 py-2 text-sm font-medium text-black"
        >
          저장
        </button>
      </form>

      <form action={deleteGalleryItemAction.bind(null, id)}>
        <button type="submit" className="text-sm text-red-400 hover:text-red-300">
          이 항목 삭제
        </button>
      </form>
    </div>
  );
}
