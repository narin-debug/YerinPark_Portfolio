import StillsGalleryClient from "@/components/sections/StillsGalleryClient";
import { getGalleryItems, type GalleryItem } from "@/lib/data";
import { galleryItems as placeholderGalleryItems } from "@/lib/content";

export default async function StillsGallery() {
  // Supabase가 아직 설정되지 않았거나 일시적으로 오류가 나도 공개 페이지는
  // placeholder로 계속 정상 렌더링되어야 한다 (관리자 페이지는 그대로 에러를 보여줌).
  let items: GalleryItem[] = [];
  try {
    items = await getGalleryItems();
  } catch {
    items = [];
  }

  const figureItems =
    items.length === 0
      ? placeholderGalleryItems.map((item, i) => ({
          caption: item.caption,
          image: { placeholderLabel: `[TODO] 작업 스틸컷 이미지 ${i + 1}` },
        }))
      : items.map((item) => ({
          caption: item.caption,
          image: { url: item.image_url },
        }));

  return <StillsGalleryClient items={figureItems} />;
}
