"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { updateSiteContent } from "@/lib/data";

export async function updateSiteContentAction(formData: FormData) {
  await requireAdmin();

  const field = (name: string) => String(formData.get(name) ?? "").trim();
  const heroImage = formData.get("hero_image");

  await updateSiteContent({
    name: field("name"),
    role: field("role"),
    field: field("field"),
    experience_note: field("experience_note"),
    intro_tagline: field("intro_tagline"),
    intro_paragraphs: field("intro_paragraphs"),
    editing_philosophy: field("editing_philosophy"),
    tools: field("tools"),
    contact_emails: field("contact_emails"),
    contact_instagram: field("contact_instagram"),
    contact_youtube: field("contact_youtube"),
    contact_linkedin: field("contact_linkedin"),
    closing_line: field("closing_line"),
    hero_image: heroImage instanceof File && heroImage.size > 0 ? heroImage : undefined,
  });

  revalidatePath("/");
  revalidatePath("/admin/content");
  redirect("/admin/content");
}
