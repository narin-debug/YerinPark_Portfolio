// 04-content.md 기준 콘텐츠. [TODO] 항목은 각 컴포넌트에서 Placeholder로 대체한다.

export const profile = {
  name: "박예린",
  role: "영상 편집자",
  field: "언론/엔터 분야",
  experienceNote: "신입 · 실무 경험 1곳 (연합뉴스TV)",
};

export const introParagraphs = [
  "유튜브 예능, 다큐, 드라마, 광고 등 다양한 영상을 편집했습니다.",
  "연합뉴스TV — 쇼츠, 잠못세, 씬속, 현장의 재구성, AI 단신 제작",
  "LG 헬로비전(학교 협업) — 라이브커머스 방송 디자인",
  "송월타올(학교 협업) — 기계 사용법 영상 제작",
];

export const editingPhilosophy =
  "나는 편집에 있어서 다양한 스타일을 도전하는 걸 좋아해. 영상을 제작할 때 그 영상을 잘 보여주는 디자인 폰트와 색상, 효과 등을 선택하는 거 같아. 나의 추구미는 그 영상의 키워드를 잘 드러내되 지저분하지 않고 깔끔한 편집을 하려고 노력해. 사람들이 내 영상을 보고서는... 보기 편하네? 라는 느낌이 들었으면 좋겠어. 편집에서 제일 중요한건 bgm이라고 생각해서 이와 관련해서도 노력하고 있는데 아직 부족한 거 같아.";

// 섹션 2 — 작업 스틸컷 하이라이트 (가로 스크롤 갤러리)
// 이미지 자료는 [TODO]. 캡션은 04-content.md에 제시된 예시 문구를 참고해 채움.
export const galleryItems = [
  { caption: "다큐 예고편 편집" },
  { caption: "인터뷰 리듬 편집" },
  { caption: "쇼츠 컷편집" },
  { caption: "예능 자막/CG" },
  { caption: "현장 재구성 편집" },
  { caption: "라이브 방송 디자인" },
  { caption: "AI 단신 제작" },
  { caption: "사이드 프로젝트" },
];

// 섹션 4 — 프로젝트 그리드. 실제 항목/자료가 없어 placeholder 슬롯으로 구성.
export const projectPlaceholders = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
];

// 섹션 5 — 툴/스킬
export const tools = ["Premiere Pro", "Photoshop", "Illustrator", "After Effects"];

// 섹션 6 — 컨택
export const contact = {
  emails: ["yerin_video@naver.com", "parkyerin81@gmail.com"],
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/p.yerin.k61?igsh", todo: false },
    { label: "YouTube", href: "", todo: true },
    { label: "LinkedIn", href: "https://www.linkedin.com/feed/", todo: false },
  ],
};

// 카드 프레임 SVG path — 03-animations.md 프로토타입 예시 (407x411 viewBox)
export const FRAME_PATH =
  "M8 1h390.89a7 7 0 0 1 7 7v356.983a7 7 0 0 1-7 7H263.329a23.999 23.999 0 0 0-18.766 9.038l-16.499 20.694A21.999 21.999 0 0 1 210.862 410H8a7 7 0 0 1-7-7V8a7 7 0 0 1 7-7Z";

// Hero/소개/툴/컨택 콘텐츠는 /admin/content에서 site_content 테이블에 저장한
// 값으로 덮어쓸 수 있다. 아래 타입/함수는 그 행(row, null 가능)을 위 정적
// 기본값과 병합해 항상 완전한 콘텐츠 객체를 만든다 — row가 없거나 특정 필드가
// 비어 있으면 이 파일의 기존 정적 값을 그대로 쓴다.
export type SiteContentRow = {
  name: string | null;
  role: string | null;
  field: string | null;
  experience_note: string | null;
  hero_image_url: string | null;
  intro_tagline: string | null;
  intro_paragraphs: string | null;
  editing_philosophy: string | null;
  tools: string | null;
  contact_emails: string | null;
  contact_instagram: string | null;
  contact_youtube: string | null;
  contact_linkedin: string | null;
  closing_line: string | null;
};

const DEFAULT_CLOSING_LINE = "새로운 프로젝트와 협업을 기다리고 있습니다. 편하게 연락 주세요.";

function splitLines(value: string | null) {
  return value
    ? value
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
    : null;
}

export function resolveSiteContent(row: SiteContentRow | null) {
  const defaultInstagram = contact.socials.find((s) => s.label === "Instagram")?.href ?? null;
  const defaultLinkedin = contact.socials.find((s) => s.label === "LinkedIn")?.href ?? null;

  return {
    name: row?.name || profile.name,
    role: row?.role || profile.role,
    field: row?.field || profile.field,
    experienceNote: row?.experience_note || profile.experienceNote,
    heroImageUrl: row?.hero_image_url || null,
    introTagline: row?.intro_tagline || null,
    introParagraphs: splitLines(row?.intro_paragraphs ?? null) ?? introParagraphs,
    editingPhilosophy: row?.editing_philosophy || editingPhilosophy,
    tools: splitLines(row?.tools ?? null) ?? tools,
    contactEmails: splitLines(row?.contact_emails ?? null) ?? contact.emails,
    contactInstagram: row?.contact_instagram || defaultInstagram,
    contactYoutube: row?.contact_youtube || null,
    contactLinkedin: row?.contact_linkedin || defaultLinkedin,
    closingLine: row?.closing_line || DEFAULT_CLOSING_LINE,
  };
}

export type SiteContent = ReturnType<typeof resolveSiteContent>;
