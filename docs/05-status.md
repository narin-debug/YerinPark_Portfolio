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
  page.tsx           # site_content를 한 번 조회해 각 섹션에 props로 내려줌
                       # (Hero → Gallery → Intro → Projects → Tools → Contact)
  globals.css        # 테마 변수(--background/--foreground/--muted/--accent), 텍스트 리빌/카드 프레임 CSS
  admin/
    login/            # 공개 — 비밀번호 로그인 폼 (app/admin/login/actions.ts)
    (protected)/       # /admin/* — proxy.ts가 세션 쿠키 검사 후 통과시킴
      layout.tsx        # 상단 nav(사이트 정보/갤러리/프로젝트 관리) + 로그아웃
      content/           # 히어로/소개/툴/컨택 텍스트 전체를 한 폼에서 수정
      gallery/           # 갤러리 목록/추가/수정/삭제
      projects/           # 프로젝트 목록/추가/수정/삭제
components/
  Placeholder.tsx     # [TODO] 자리에 쓰는 회색 대시 박스
  TextReveal.tsx      # SplitText로 줄 분리 + 라임 하이라이트 스윕 리빌 (재사용)
  sections/
    Hero.tsx          # 섹션 1 — content prop으로 이름/직함/배경 이미지 렌더 (서버 컴포넌트)
    StillsGallery.tsx       # 섹션 2 — 서버 컴포넌트, Supabase에서 갤러리 항목 조회
    StillsGalleryClient.tsx # 섹션 2 — 가로 스크롤 갤러리 GSAP 로직 (pin+scrub)
    Intro.tsx         # 섹션 3 — content prop으로 자기소개/경력/편집 철학 렌더
    ProjectGrid.tsx    # 섹션 4 — 서버 컴포넌트, Supabase에서 프로젝트 조회 + 3열 그리드
    ProjectCard.tsx    # 섹션 4 — SVG 프레임 카드 (clipPath+foreignObject, 호버 스트로크 리빌)
    ToolsBand.tsx      # 섹션 5 — tools prop(문자열 배열)만 받는 client 컴포넌트, 패럴랙스
    Contact.tsx        # 섹션 6 — content prop으로 이메일/SNS/마지막 줄 렌더 + 하단좌측 숨은 관리자 링크
lib/
  content.ts          # 정적 기본값(profile/introParagraphs/tools/contact 등) +
                        # resolveSiteContent(row) — DB row와 기본값을 병합해 완전한 콘텐츠 객체 생성
  gsap.ts              # gsap/ScrollTrigger/SplitText 플러그인 등록
  supabase.ts          # service-role Supabase 클라이언트 (서버 전용, "server-only")
  auth.ts              # 비밀번호 검증, 세션 쿠키 발급/검증 (jose + bcryptjs)
  data.ts              # 갤러리/프로젝트/site_content CRUD 쿼리 + 이미지 업로드
proxy.ts               # /admin/* 접근 시 세션 쿠키 검사, 없으면 /admin/login으로 리다이렉트
```

## 콘텐츠 갱신 방법

**모든 텍스트/이미지가 이제 `/admin`에서 관리된다** (설정 방법:
`docs/06-admin-setup.md`). `lib/content.ts`를 직접 고치는 옛 방식은 더 이상
쓰지 않는다 — 그 파일의 상수들은 이제 "DB에 값이 없을 때 보여줄 기본값"
역할만 한다.

- **히어로/소개/툴/컨택**: `/admin/content` 한 페이지에서 전부 수정. 필드를
  비워두면 `lib/content.ts`의 기본값이 계속 보인다.
- **갤러리/프로젝트 그리드**: `/admin/gallery`, `/admin/projects`에서
  추가/수정/삭제. 등록된 항목이 하나도 없으면 placeholder 데모가 보이고,
  하나라도 추가하면 그 순간부터 실제 등록한 항목으로 전환된다.

### 남아있는 [TODO] (아직 아무도 admin에 입력하지 않은 것들)

`docs/04-content.md`에 있던 TODO 항목들은 이제 코드가 아니라 **admin에서
입력해야 할 항목**이 됐다. 현재(2026-07-09) Supabase에는 아직 비어 있어
전부 placeholder/기본값으로 보인다.

| 항목 | 입력 위치 |
|---|---|
| 히어로 배경 이미지/영상 | `/admin/content` → 히어로 배경 이미지 |
| 자기소개 문구 | `/admin/content` → 자기소개 문구 |
| 작업 스틸컷 이미지 6~10장 + 캡션 | `/admin/gallery` |
| 프로젝트 항목(수/썸네일 2종/연도·카테고리/영상 링크) | `/admin/projects` |
| 유튜브 링크 | `/admin/content` → 유튜브 링크 |

### 임의로 채워둔 항목 (확인/수정 필요)

- 툴 목록 중 "일러스트레이션" → 실제 프로그램명인 "Illustrator"로 표기함
  (기본값, `lib/content.ts`의 `tools`)
- 컨택 섹션 마지막 줄("새로운 프로젝트와 협업을 기다리고 있습니다...")은
  문서에 문구가 없어 임의로 작성한 카피 — 기본값은 `lib/content.ts`의
  `DEFAULT_CLOSING_LINE`, `/admin/content`에서 원하는 문구로 바로 바꿀 수
  있음

## 알아두면 좋은 구현 디테일 / 주의사항

- **가로 스크롤 갤러리**: `StillsGalleryClient.tsx`에서 `min-width: 768px`일 때만
  GSAP pin/scrub 활성화. 그 이하는 CSS `overflow-x: auto` + `snap`으로
  네이티브 스와이프 스크롤 (모바일에서 스크롤 하이재킹 방지).
  ⚠️ 트랙(`w-max`)은 **반드시 `md:w-max`로 데스크톱에만** 줘야 한다 —
  모바일까지 `w-max`를 주면 트랙 자체가 콘텐츠 전체 너비만큼 늘어나버려서
  `overflow-x-auto`가 걸릴 "경계"가 없어져 스와이프가 전혀 안 먹는 버그가
  생긴다(실제로 겪고 고친 이슈).
- **텍스트 라인 리빌**: `TextReveal.tsx`가 SplitText로 줄을 나눈 뒤 각 줄을
  `.tr-line-mask`로 감싸고 `.tr-line-bar`(라임 바)를 GSAP로 움직인다.
  `.tr-line-bar`에는 **정적 CSS `transform`을 절대 주지 말 것** — GSAP가
  런타임에 설정하는 transform과 겹치면 두 개의 `translate()`가 합성되어
  애니메이션이 중간에 멈춘 것처럼 보이는 버그가 생긴다(실제로 겪고 고친 이슈).
- **프로젝트 카드 호버**: `ProjectCard.tsx`가 SVG `<clipPath>` + `<foreignObject>`로
  방패형 카드를 만든다. 호버 상태는 CSS `:hover`가 아니라 React state
  (`active`, `onMouseEnter`/`onMouseLeave` + `onTouchStart`)로 관리한다 —
  모바일은 hover 개념이 없어서 터치로도 같은 효과가 나야 하기 때문. 이
  `active` 값으로 썸네일 크로스페이드(`opacity`)와 프레임
  `stroke-dashoffset`을 전부 인라인 `style`로 직접 제어한다.
  `getTotalLength()`로 정확한 path 길이를 계산해 `useLayoutEffect`에서
  state에 저장해두고 인라인 스타일에 쓴다.
  - ⚠️ **`foreignObject` 안의 요소에는 opacity를 Tailwind 클래스(`opacity-0`
    / `opacity-100`)로 토글하지 말 것.** 클래스는 정상적으로 바뀌는데
    `getComputedStyle`상 값이 반대로 나오는 걸 실제로 겪었다(테스트 환경
    한정일 수도 있지만 재현됨). 인라인 `style={{opacity: ...}}`로 바꾸니
    바로 해결됐다 — `foreignObject` 안에서는 항상 인라인 style로 동적
    스타일을 제어한다.
  - ⚠️ 모바일 사파리(iPhone)에서 스케일된 SVG의 `foreignObject` 콘텐츠가
    카드 크기에 맞춰 제대로 클리핑되지 않아 카드끼리 겹쳐 보이는 버그가
    있었다. `<svg>`에 `overflow-hidden` 클래스와
    `preserveAspectRatio="xMidYMid slice"`를 추가하고, 그리드 아이템(카드
    최상위 요소, `videoUrl`이 있으면 `<a>` 태그)에 `min-w-0`을 줘서 고쳤다
    (SVG의 고유 크기가 grid 트랙 너비를 밀어내는 걸 방지).
- **TypeScript 캐스팅**: `TextReveal.tsx`의 `Tag = as as any`와
  `ProjectCard.tsx`의 `{...{xmlns: ...}}`는 React/TS 타입 한계를 피하기 위한
  의도적인 캐스팅(eslint-disable 주석 있음). 정상 동작이니 "타입 에러 수정"
  하려다 지우지 않도록 주의.
- **Turbopack dev 서버 CSS 캐시**: 드물게 `app/globals.css`를 고쳐도 브라우저에
  반영이 안 되는 경우가 있었음(코드 자체는 정상, 캐시 문제로 추정). 안 바뀌면
  dev 서버를 완전히 재시작.
- **SEO/공유 미리보기**: `app/page.tsx`의 `generateMetadata()`가 site_content
  기반으로 title/description/OpenGraph/Twitter 메타를 만든다.
  `app/opengraph-image.tsx`가 1200x630 미리보기 이미지를 자동 생성한다
  (next/og). 기본 폰트엔 한글 글리프가 없어서 요청 시점에 Google
  Fonts에서 Noto Sans KR 한글 서브셋을 받아온다 — 실패하면 sans-serif로
  조용히 폴백. `layout.tsx`의 `metadataBase`는 Vercel이 자동으로 주는
  `VERCEL_PROJECT_PRODUCTION_URL`을 쓴다(커스텀 도메인 쓰면
  `NEXT_PUBLIC_SITE_URL` 환경변수로 덮어쓸 수 있음).
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
  - 공개 페이지(`app/page.tsx`, `StillsGallery.tsx`, `ProjectGrid.tsx`)는
    Supabase 조회를 try/catch로 감싸 실패 시 placeholder/기본값으로
    fallback한다. 관리자 페이지(`/admin/content`, `/admin/gallery`,
    `/admin/projects`)는 감싸지 않아 Supabase 미설정(또는 테이블 없음) 시
    에러가 그대로 보인다 — 의도된 동작이니 "왜 에러가 나지" 하고 감싸지
    않도록.
- **site_content 테이블**: 히어로/소개/툴/컨택 텍스트를 저장하는 싱글턴
  행(항상 `id=1`)이다. 행이 아예 없어도 정상이며(아직 admin에서 저장한
  적이 없다는 뜻), `lib/content.ts`의 `resolveSiteContent(row)`가 없는
  필드마다 기존 정적 기본값으로 채워 완전한 콘텐츠 객체를 만든다.
  `intro_paragraphs`/`tools`/`contact_emails`는 텍스트 컬럼에 줄바꿈으로
  구분해 저장하고 배열로 풀어 쓴다 (`/admin/content` textarea 한 줄 = 항목
  하나).
- **2026-07-09 실사용 Supabase로 전체 플로우 실검증**: 로그인, 갤러리/
  프로젝트 항목 생성(실제 이미지 업로드 포함)·수정·삭제, 공개 페이지
  반영까지 curl로 실제 서버 액션을 호출해 확인함(테스트 데이터는 검증 후
  삭제해 DB/Storage를 원상복구). 이 과정에서 curl 명령행에 한글을 직접
  넣으면 인코딩이 깨지는 걸 발견했는데, 이건 curl/셸 쪽 문제일 뿐 실제
  브라우저로 입력하면 문제없다(파일로 값을 넘겨 재현 확인함) — 즉 앱 자체
  버그는 아님.
