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
  globals.css        # 테마 변수(--lime 등), 텍스트 리빌/카드 프레임 CSS
components/
  Placeholder.tsx     # [TODO] 자리에 쓰는 회색 대시 박스
  TextReveal.tsx      # SplitText로 줄 분리 + 라임 하이라이트 스윕 리빌 (재사용)
  sections/
    Hero.tsx          # 섹션 1 — 이름/직함 리빌 + 배경 placeholder
    StillsGallery.tsx # 섹션 2 — 가로 스크롤 갤러리 (pin+scrub, 모바일은 네이티브 스와이프)
    Intro.tsx         # 섹션 3 — 자기소개/경력/편집 철학
    ProjectGrid.tsx    # 섹션 4 — 3열 그리드 컨테이너
    ProjectCard.tsx    # 섹션 4 — SVG 프레임 카드 (clipPath+foreignObject, 호버 스트로크 리빌)
    ToolsBand.tsx      # 섹션 5 — 툴 목록 + 패럴랙스
    Contact.tsx        # 섹션 6 — 이메일/SNS + 마지막 줄 리빌
lib/
  content.ts          # 모든 텍스트/데이터 상수 (콘텐츠 갱신은 여기서)
  gsap.ts              # gsap/ScrollTrigger/SplitText 플러그인 등록
```

## 콘텐츠 갱신 방법

텍스트·이미지 자료가 준비되면 `lib/content.ts`만 고치면 된다. 실제 이미지 파일은
`public/` 아래 넣고 `Placeholder` 컴포넌트를 `<Image>`(next/image)로 교체.

### 남아있는 [TODO] (04-content.md 기준)

| 항목 | 위치 |
|---|---|
| 히어로 배경 이미지/영상 | `components/sections/Hero.tsx` |
| 자기소개 문구 | `components/sections/Intro.tsx` (상단 placeholder 박스) |
| 작업 스틸컷 이미지 6~10장 (캡션은 예시로 기입해둠) | `lib/content.ts`의 `galleryItems`, 이미지는 `StillsGallery.tsx` |
| 프로젝트 항목(수/썸네일 2종/연도·카테고리/영상 링크) | `lib/content.ts`의 `projectPlaceholders`(현재 6개 슬롯), `ProjectCard.tsx` |
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
