"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createProject, deleteProject, updateProject } from "@/lib/data";

export async function createProjectAction(formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const year_category = String(formData.get("year_category") ?? "").trim();
  const video_url = String(formData.get("video_url") ?? "").trim();
  const base_thumbnail = formData.get("base_thumbnail");
  const hover_thumbnail = formData.get("hover_thumbnail");

  if (!title || !(base_thumbnail instanceof File) || base_thumbnail.size === 0) {
    throw new Error("프로젝트명과 기본 썸네일은 필수입니다.");
  }

  await createProject({
    title,
    year_category,
    video_url,
    base_thumbnail,
    hover_thumbnail:
      hover_thumbnail instanceof File && hover_thumbnail.size > 0 ? hover_thumbnail : undefined,
  });
  revalidatePath("/");
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function updateProjectAction(id: string, formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const year_category = String(formData.get("year_category") ?? "").trim();
  const video_url = String(formData.get("video_url") ?? "").trim();
  const base_thumbnail = formData.get("base_thumbnail");
  const hover_thumbnail = formData.get("hover_thumbnail");

  if (!title) {
    throw new Error("프로젝트명을 입력하세요.");
  }

  await updateProject(id, {
    title,
    year_category,
    video_url,
    base_thumbnail:
      base_thumbnail instanceof File && base_thumbnail.size > 0 ? base_thumbnail : undefined,
    hover_thumbnail:
      hover_thumbnail instanceof File && hover_thumbnail.size > 0 ? hover_thumbnail : undefined,
  });
  revalidatePath("/");
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function deleteProjectAction(id: string) {
  await requireAdmin();
  await deleteProject(id);
  revalidatePath("/");
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}
