# 구현 현황 (2026-07-09 기준)

구조·애니메이션 로직 1차 구현 완료, GitHub 연동 및 Vercel 배포 완료.
새 세션(새 대화창)에서 이어서 작업할 때는 이 문서 + `CLAUDE.md`를 먼저 읽으면
전체 맥락을 파악할 수 있다.

## 배포 정보

- GitHub: https://github.com/narin-debug/YerinPark_Portfolio (브랜치: `main`)
- Vercel: GitHub 연동, `main` 브랜치 push 시 자동 재배포
- 로컬 실행: `npm run dev` (기본 3000번 포트), 빌드 확인은 `npm run build`,
  `npm run lint`

## 파일 구조

```
app/
  layout.tsx        # 메타데이터, 폰트, 다크 테마 고정
  page.tsx           # 섹션 조립 (Hero → Gallery → Intro → Projects → Tools → Contact)
  globals.css        # 테마 변수(--background/--foreground/--muted/--accent), 텍스트 리빌/카드 프레임 CSS
  admin/
    login/            # 공개 — 비밀번호 로그인 폼 (app/admin/login/actions.ts)
    (protected)/       # /admin/* — middleware.ts가 세션 쿠키 검사 후 통과시킴
      layout.tsx        # 상단 nav(갤러리/프로젝트 관리) + 로그아웃
      gallery/           # 갤러리 목록/추가/수정/삭제
      projects/           # 프로젝트 목록/추가/수정/삭제
components/
  Placeholder.tsx     # [TODO] 자리에 쓰는 회색 대시 박스
  TextReveal.tsx      # SplitText로 줄 분리 + 라임 하이라이트 스윕 리빌 (재사용)
  sections/
    Hero.tsx          # 섹션 1 — 이름/직함 리빌 + 배경 placeholder
    StillsGallery.tsx       # 섹션 2 — 서버 컴포넌트, Supabase에서 갤러리 항목 조회
    StillsGalleryClient.tsx # 섹션 2 — 가로 스크롤 갤러리 GSAP 로직 (pin+scrub)
    Intro.tsx         # 섹션 3 — 자기소개/경력/편집 철학
    ProjectGrid.tsx    # 섹션 4 — 서버 컴포넌트, Supabase에서 프로젝트 조회 + 3열 그리드
    ProjectCard.tsx    # 섹션 4 — SVG 프레임 카드 (clipPath+foreignObject, 호버 스트로크 리빌)
    ToolsBand.tsx      # 섹션 5 — 툴 목록 + 패럴랙스
    Contact.tsx        # 섹션 6 — 이메일/SNS + 마지막 줄 리빌 + 하단좌측 숨은 관리자 링크
lib/
  content.ts          # 정적 텍스트/데이터 상수 + 갤러리·프로젝트가 비어있을 때 쓰는 placeholder 데모
  gsap.ts              # gsap/ScrollTrigger/SplitText 플러그인 등록
  supabase.ts          # service-role Supabase 클라이언트 (서버 전용, "server-only")
  auth.ts              # 비밀번호 검증, 세션 쿠키 발급/검증 (jose + bcryptjs)
  data.ts              # 갤러리/프로젝트 CRUD 쿼리 + 이미지 업로드
middleware.ts          # /admin/* 접근 시 세션 쿠키 검사, 없으면 /admin/login으로 리다이렉트
```

## 콘텐츠 갱신 방법

- **갤러리/프로젝트 그리드**: 정적 파일을 고치는 게 아니라 `/admin`에
  로그인해서 등록한다 (설정 방법: `docs/06-admin-setup.md`). 등록된 항목이
  하나도 없으면 기존 placeholder 데모가 자동으로 보이고, 하나라도 추가하면
  그 순간부터 실제 등록한 항목으로 전환된다.
- **그 외 섹션(Hero/소개/툴/컨택)**: 여전히 `lib/content.ts`를 직접 고치는
  정적 방식. 실제 이미지가 필요하면 `public/`에 넣고 해당 `Placeholder`를
  `<img>`/`<Image>`로 교체.

### 남아있는 [TODO] (04-content.md 기준)

| 항목 | 위치 |
|---|---|
| 히어로 배경 이미지/영상 | `components/sections/Hero.tsx` |
| 자기소개 문구 | `components/sections/Intro.tsx` (상단 placeholder 박스) |
| 작업 스틸컷 이미지 6~10장 + 캡션 | `/admin/gallery`에서 등록 (Supabase 설정 전까지는 `lib/content.ts`의 `galleryItems` 캡션으로 placeholder 표시) |
| 프로젝트 항목(수/썸네일 2종/연도·카테고리/영상 링크) | `/admin/projects`에서 등록 (설정 전까지는 `lib/content.ts`의 `projectPlaceholders` 6개 슬롯으로 placeholder 표시) |
| 유튜브 링크 | `lib/content.ts`의 `contact.socials` |

### 임의로 채워둔 항목 (확인/수정 필요)

- 툴 목록 중 "일러스트레이션" → 실제 프로그램명인 "Illustrator"로 표기함
- 컨택 섹션 마지막 줄("새로운 프로젝트와 협업을 기다리고 있습니다...")은
  문서에 문구가 없어 임의로 작성한 카피 — `components/sections/Contact.tsx`

## 알아두면 좋은 구현 디테일 / 주의사항

- **가로 스크롤 갤러리**: `StillsGallery.tsx`에서 `min-width: 768px`일 때만
  GSAP pin/scrub 활성화. 그 이하는 CSS `overflow-x: auto` + `snap`으로
  네이티브 스와이프 스크롤 (모바일에서 스크롤 하이재킹 방지).
- **텍스트 라인 리빌**: `TextReveal.tsx`가 SplitText로 줄을 나눈 뒤 각 줄을
  `.tr-line-mask`로 감싸고 `.tr-line-bar`(라임 바)를 GSAP로 움직인다.
  `.tr-line-bar`에는 **정적 CSS `transform`을 절대 주지 말 것** — GSAP가
  런타임에 설정하는 transform과 겹치면 두 개의 `translate()`가 합성되어
  애니메이션이 중간에 멈춘 것처럼 보이는 버그가 생긴다(실제로 겪고 고친 이슈).
- **프로젝트 카드 호버**: `ProjectCard.tsx`가 SVG `<clipPath>` + `<foreignObject>`로
  방패형 카드를 만들고, 호버 시 `stroke-dashoffset`을 0으로 만드는 CSS
  transition으로 라임 테두리가 그려진다(GSAP 미사용, 스펙대로 CSS로 구현).
  `getTotalLength()`로 정확한 path 길이를 계산해 `useLayoutEffect`에서
  인라인으로 `strokeDasharray`/`strokeDashoffset`을 설정한다.
- **TypeScript 캐스팅**: `TextReveal.tsx`의 `Tag = as as any`와
  `ProjectCard.tsx`의 `{...{xmlns: ...}}`는 React/TS 타입 한계를 피하기 위한
  의도적인 캐스팅(eslint-disable 주석 있음). 정상 동작이니 "타입 에러 수정"
  하려다 지우지 않도록 주의.
- **Turbopack dev 서버 CSS 캐시**: 드물게 `app/globals.css`를 고쳐도 브라우저에
  반영이 안 되는 경우가 있었음(코드 자체는 정상, 캐시 문제로 추정). 안 바뀌면
  dev 서버를 완전히 재시작.
- **관리자 로그인 (`/admin`)**: Supabase 기반 CRUD(`docs/06-admin-setup.md`
  참고)로 갤러리/프로젝트 콘텐츠를 등록한다. 비밀번호는 `bcryptjs`로 해시,
  세션은 `jose`로 서명한 JWT를 httpOnly 쿠키(`admin_session`)에 저장하고
  `proxy.ts`(Next 16에서 middleware.ts의 새 이름 — export 함수명도 `proxy`로
  바꿔야 함)가 `/admin/*` 접근을 검사한다.
  - `ADMIN_PASSWORD_HASH`는 bcrypt 해시를 **base64로 한 번 더 감싼 값**이다
    (`lib/auth.ts`에서 디코딩). bcrypt 해시에 든 `$` 문자를 Next.js가 `.env`
    파일 읽을 때 변수 치환으로 오인해 값이 깨지는 문제 때문 — 반드시
    `scripts/hash-password.mjs`로 생성한 값을 써야 하고, 생성한 bcrypt 해시를
    그대로 붙여넣으면 안 된다.
  - 공개 페이지(`StillsGallery.tsx`, `ProjectGrid.tsx`)는 Supabase 조회를
    try/catch로 감싸 실패 시 placeholder로 fallback한다. 관리자 페이지
    (`/admin/gallery`, `/admin/projects`)는 감싸지 않아 Supabase 미설정 시
    에러가 그대로 보인다 — 의도된 동작이니 "왜 에러가 나지" 하고 감싸지
    않도록.
