import { resolveSiteContent } from "@/lib/content";
import { getSiteContent } from "@/lib/data";
import { updateSiteContentAction } from "./actions";

export const dynamic = "force-dynamic";

const inputClass =
  "w-full rounded border border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-accent";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs text-muted">{label}</span>
      {children}
    </label>
  );
}

export default async function SiteContentAdminPage() {
  const row = await getSiteContent();
  const content = resolveSiteContent(row);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-medium">사이트 정보</h1>
        <p className="mt-1 text-sm text-muted">
          히어로 · 소개 · 툴 · 컨택 섹션 내용을 한 곳에서 수정합니다. 비워두면
          기존 기본값이 계속 표시됩니다.
        </p>
      </div>

      <form
        action={updateSiteContentAction}
        className="space-y-5 rounded border border-white/10 p-4"
      >
        <Field label="이름">
          <input name="name" defaultValue={content.name} className={inputClass} />
        </Field>
        <Field label="직함">
          <input name="role" defaultValue={content.role} className={inputClass} />
        </Field>
        <Field label="분야">
          <input name="field" defaultValue={content.field} className={inputClass} />
        </Field>
        <Field label="경력 문구">
          <input
            name="experience_note"
            defaultValue={content.experienceNote}
            className={inputClass}
          />
        </Field>

        <Field label="히어로 배경 이미지 (선택 — 새 파일을 올리면 교체됨)">
          {content.heroImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={content.heroImageUrl}
              alt=""
              className="mb-2 h-32 w-56 rounded object-cover"
            />
          )}
          <input type="file" name="hero_image" accept="image/*" className="w-full text-sm" />
        </Field>

        <Field label="자기소개 문구">
          <textarea
            name="intro_tagline"
            defaultValue={content.introTagline ?? ""}
            rows={2}
            className={inputClass}
          />
        </Field>
        <Field label="실무 경력 상세 (한 줄에 한 항목)">
          <textarea
            name="intro_paragraphs"
            defaultValue={content.introParagraphs.join("\n")}
            rows={4}
            className={inputClass}
          />
        </Field>
        <Field label="편집 철학 / 지향하는 스타일">
          <textarea
            name="editing_philosophy"
            defaultValue={content.editingPhilosophy}
            rows={4}
            className={inputClass}
          />
        </Field>
        <Field label="툴 목록 (한 줄에 하나)">
          <textarea
            name="tools"
            defaultValue={content.tools.join("\n")}
            rows={4}
            className={inputClass}
          />
        </Field>
        <Field label="이메일 (한 줄에 하나)">
          <textarea
            name="contact_emails"
            defaultValue={content.contactEmails.join("\n")}
            rows={2}
            className={inputClass}
          />
        </Field>
        <Field label="인스타그램 링크">
          <input
            name="contact_instagram"
            defaultValue={content.contactInstagram ?? ""}
            className={inputClass}
          />
        </Field>
        <Field label="유튜브 링크">
          <input
            name="contact_youtube"
            defaultValue={content.contactYoutube ?? ""}
            className={inputClass}
          />
        </Field>
        <Field label="링크드인 링크">
          <input
            name="contact_linkedin"
            defaultValue={content.contactLinkedin ?? ""}
            className={inputClass}
          />
        </Field>
        <Field label="마지막 인사말 (컨택 섹션 맨 아래 문구)">
          <textarea
            name="closing_line"
            defaultValue={content.closingLine}
            rows={2}
            className={inputClass}
          />
        </Field>

        <button
          type="submit"
          className="rounded bg-accent px-4 py-2 text-sm font-medium text-black"
        >
          저장
        </button>
      </form>
    </div>
  );
}
