-- Supabase SQL Editor에 그대로 붙여넣고 실행하세요.
-- (Project → SQL Editor → New query)

create table if not exists gallery_items (
  id uuid primary key default gen_random_uuid(),
  caption text not null,
  image_url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  year_category text,
  base_thumbnail_url text not null,
  hover_thumbnail_url text,
  video_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- 히어로/소개/툴/컨택 등 그 외 모든 텍스트 콘텐츠. 항상 id=1 하나만 존재하는
-- 싱글턴 행이다. 행이 아직 없으면 코드가 lib/content.ts의 기존 정적 값으로
-- 대체해서 보여준다 (자세한 내용은 lib/content.ts의 resolveSiteContent 참고).
create table if not exists site_content (
  id smallint primary key default 1,
  name text,
  role text,
  field text,
  experience_note text,
  hero_image_url text,
  intro_tagline text,
  intro_paragraphs text,
  editing_philosophy text,
  tools text,
  contact_emails text,
  contact_instagram text,
  contact_youtube text,
  contact_linkedin text,
  closing_line text,
  updated_at timestamptz not null default now(),
  constraint site_content_singleton check (id = 1)
);

-- 서버(관리자 API)는 service_role 키로만 접근하므로 RLS를 켜고 별도 정책은
-- 추가하지 않는다 (= anon/authenticated 키로는 직접 읽기/쓰기 전부 차단).
alter table gallery_items enable row level security;
alter table projects enable row level security;
alter table site_content enable row level security;
