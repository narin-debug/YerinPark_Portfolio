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

-- 서버(관리자 API)는 service_role 키로만 접근하므로 RLS를 켜고 별도 정책은
-- 추가하지 않는다 (= anon/authenticated 키로는 직접 읽기/쓰기 전부 차단).
alter table gallery_items enable row level security;
alter table projects enable row level security;
