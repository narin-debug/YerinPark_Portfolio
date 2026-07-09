"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createGalleryItem, deleteGalleryItem, updateGalleryItem } from "@/lib/data";

export async function createGalleryItemAction(formData: FormData) {
  await requireAdmin();
  const caption = String(formData.get("caption") ?? "").trim();
  const image = formData.get("image");
  if (!caption || !(image instanceof File) || image.size === 0) {
    throw new Error("캡션과 이미지를 모두 입력하세요.");
  }
  await createGalleryItem({ caption, image });
  revalidatePath("/");
  revalidatePath("/admin/gallery");
  redirect("/admin/gallery");
}

export async function updateGalleryItemAction(id: string, formData: FormData) {
  await requireAdmin();
  const caption = String(formData.get("caption") ?? "").trim();
  const image = formData.get("image");
  if (!caption) {
    throw new Error("캡션을 입력하세요.");
  }
  await updateGalleryItem(id, {
    caption,
    image: image instanceof File && image.size > 0 ? image : undefined,
  });
  revalidatePath("/");
  revalidatePath("/admin/gallery");
  redirect("/admin/gallery");
}

export async function deleteGalleryItemAction(id: string) {
  await requireAdmin();
  await deleteGalleryItem(id);
  revalidatePath("/");
  revalidatePath("/admin/gallery");
  redirect("/admin/gallery");
}
