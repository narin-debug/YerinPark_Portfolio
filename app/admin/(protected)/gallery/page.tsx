import Link from "next/link";
import { getGalleryItems } from "@/lib/data";
import { createGalleryItemAction, deleteGalleryItemAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function GalleryAdminPage() {
  const items = await getGalleryItems();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-xl font-medium">가로 스크롤 갤러리 관리</h1>
        <p className="mt-1 text-sm text-muted">현재 {items.length}개 항목</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-sm uppercase tracking-wide text-muted">새 항목 추가</h2>
        <form
          action={createGalleryItemAction}
          className="space-y-3 rounded border border-white/10 p-4"
        >
          <input
            name="caption"
            placeholder="캡션 (예: 다큐 예고편 편집)"
            required
            className="w-full rounded border border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-lime"
          />
          <input type="file" name="image" accept="image/*" required className="w-full text-sm" />
          <button
            type="submit"
            className="rounded bg-lime px-4 py-2 text-sm font-medium text-black"
          >
            추가
          </button>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm uppercase tracking-wide text-muted">항목 목록</h2>
        {items.length === 0 && (
          <p className="text-sm text-muted">등록된 항목이 없습니다.</p>
        )}
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-4 rounded border border-white/10 p-3"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image_url}
                alt={item.caption}
                className="h-16 w-24 rounded object-cover"
              />
              <p className="flex-1 text-sm">{item.caption}</p>
              <Link
                href={`/admin/gallery/${item.id}`}
                className="text-sm text-muted hover:text-lime"
              >
                수정
              </Link>
              <form action={deleteGalleryItemAction.bind(null, item.id)}>
                <button type="submit" className="text-sm text-red-400 hover:text-red-300">
                  삭제
                </button>
              </form>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
