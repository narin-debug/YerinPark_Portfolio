import "server-only";
import { getSupabaseAdmin, IMAGE_BUCKET } from "@/lib/supabase";
import type { SiteContentRow } from "@/lib/content";

export type GalleryItem = {
  id: string;
  caption: string;
  image_url: string;
  sort_order: number;
};

export type ProjectItem = {
  id: string;
  title: string;
  year_category: string | null;
  base_thumbnail_url: string;
  hover_thumbnail_url: string | null;
  video_url: string | null;
  sort_order: number;
};

async function uploadImage(file: File, folder: string) {
  const supabaseAdmin = getSupabaseAdmin();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabaseAdmin.storage
    .from(IMAGE_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw error;
  const { data } = supabaseAdmin.storage.from(IMAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// ---------- 갤러리 ----------

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("gallery_items")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getGalleryItem(id: string): Promise<GalleryItem | null> {
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("gallery_items")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createGalleryItem(params: { caption: string; image: File }) {
  const supabaseAdmin = getSupabaseAdmin();
  const image_url = await uploadImage(params.image, "gallery");
  const { data: rows } = await supabaseAdmin
    .from("gallery_items")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);
  const nextOrder = (rows?.[0]?.sort_order ?? -1) + 1;
  const { error } = await supabaseAdmin
    .from("gallery_items")
    .insert({ caption: params.caption, image_url, sort_order: nextOrder });
  if (error) throw error;
}

export async function updateGalleryItem(
  id: string,
  params: { caption: string; image?: File }
) {
  const supabaseAdmin = getSupabaseAdmin();
  const update: { caption: string; image_url?: string } = { caption: params.caption };
  if (params.image && params.image.size > 0) {
    update.image_url = await uploadImage(params.image, "gallery");
  }
  const { error } = await supabaseAdmin.from("gallery_items").update(update).eq("id", id);
  if (error) throw error;
}

export async function deleteGalleryItem(id: string) {
  const supabaseAdmin = getSupabaseAdmin();
  const { error } = await supabaseAdmin.from("gallery_items").delete().eq("id", id);
  if (error) throw error;
}

// ---------- 프로젝트 ----------

export async function getProjects(): Promise<ProjectItem[]> {
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getProject(id: string): Promise<ProjectItem | null> {
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createProject(params: {
  title: string;
  year_category: string;
  video_url: string;
  base_thumbnail: File;
  hover_thumbnail?: File;
}) {
  const supabaseAdmin = getSupabaseAdmin();
  const base_thumbnail_url = await uploadImage(params.base_thumbnail, "projects");
  const hover_thumbnail_url =
    params.hover_thumbnail && params.hover_thumbnail.size > 0
      ? await uploadImage(params.hover_thumbnail, "projects")
      : null;
  const { data: rows } = await supabaseAdmin
    .from("projects")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);
  const nextOrder = (rows?.[0]?.sort_order ?? -1) + 1;
  const { error } = await supabaseAdmin.from("projects").insert({
    title: params.title,
    year_category: params.year_category || null,
    video_url: params.video_url || null,
    base_thumbnail_url,
    hover_thumbnail_url,
    sort_order: nextOrder,
  });
  if (error) throw error;
}

export async function updateProject(
  id: string,
  params: {
    title: string;
    year_category: string;
    video_url: string;
    base_thumbnail?: File;
    hover_thumbnail?: File;
  }
) {
  const supabaseAdmin = getSupabaseAdmin();
  const update: {
    title: string;
    year_category: string | null;
    video_url: string | null;
    base_thumbnail_url?: string;
    hover_thumbnail_url?: string;
  } = {
    title: params.title,
    year_category: params.year_category || null,
    video_url: params.video_url || null,
  };
  if (params.base_thumbnail && params.base_thumbnail.size > 0) {
    update.base_thumbnail_url = await uploadImage(params.base_thumbnail, "projects");
  }
  if (params.hover_thumbnail && params.hover_thumbnail.size > 0) {
    update.hover_thumbnail_url = await uploadImage(params.hover_thumbnail, "projects");
  }
  const { error } = await supabaseAdmin.from("projects").update(update).eq("id", id);
  if (error) throw error;
}

export async function deleteProject(id: string) {
  const supabaseAdmin = getSupabaseAdmin();
  const { error } = await supabaseAdmin.from("projects").delete().eq("id", id);
  if (error) throw error;
}

// ---------- 사이트 정보 (히어로/소개/툴/컨택) ----------

export async function getSiteContent(): Promise<SiteContentRow | null> {
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("site_content")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateSiteContent(params: {
  name: string;
  role: string;
  field: string;
  experience_note: string;
  intro_tagline: string;
  intro_paragraphs: string;
  editing_philosophy: string;
  tools: string;
  contact_emails: string;
  contact_instagram: string;
  contact_youtube: string;
  contact_linkedin: string;
  closing_line: string;
  hero_image?: File;
}) {
  const supabaseAdmin = getSupabaseAdmin();
  const update: Record<string, string | null> = {
    name: params.name || null,
    role: params.role || null,
    field: params.field || null,
    experience_note: params.experience_note || null,
    intro_tagline: params.intro_tagline || null,
    intro_paragraphs: params.intro_paragraphs || null,
    editing_philosophy: params.editing_philosophy || null,
    tools: params.tools || null,
    contact_emails: params.contact_emails || null,
    contact_instagram: params.contact_instagram || null,
    contact_youtube: params.contact_youtube || null,
    contact_linkedin: params.contact_linkedin || null,
    closing_line: params.closing_line || null,
  };
  if (params.hero_image && params.hero_image.size > 0) {
    update.hero_image_url = await uploadImage(params.hero_image, "site");
  }
  const { error } = await supabaseAdmin.from("site_content").upsert({ id: 1, ...update });
  if (error) throw error;
}
