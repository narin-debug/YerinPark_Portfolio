# 관리자 페이지 설정 가이드

로그인해서 직접 콘텐츠를 관리할 수 있는 관리자 기능(`/admin`)이 있다.
가로 스크롤 갤러리·프로젝트 그리드(추가/수정/삭제)뿐 아니라, 히어로·소개·
툴·컨택 섹션의 텍스트도 `/admin/content`에서 한 번에 수정할 수 있다. 이
기능은 Supabase(DB + 이미지 저장소)를 사용하므로, 배포 전에 아래 설정을
한 번 해줘야 한다.

## 1. Supabase 프로젝트 만들기

1. https://supabase.com 에서 무료 계정 생성 후 새 프로젝트(Project) 생성
2. 프로젝트 대시보드 → **SQL Editor** → New query에서 이 저장소의
   `supabase/schema.sql` 내용을 그대로 붙여넣고 실행 (테이블 3개 생성:
   `gallery_items`, `projects`, `site_content`. `create table if not
   exists`라서 몇 번을 다시 실행해도 안전하다 — 스키마 파일이 갱신되면
   이 파일을 다시 붙여넣기만 하면 된다)
3. 프로젝트 대시보드 → **Storage** → New bucket
   - 이름: `portfolio-images`
   - **Public bucket** 체크 (업로드한 이미지가 사이트에 바로 보여야 하므로)
4. 프로젝트 대시보드 → **Settings → API**에서 아래 두 값을 확인
   - `Project URL` → `SUPABASE_URL`
   - `service_role` 비밀 키(secret) → `SUPABASE_SERVICE_ROLE_KEY`
     (⚠️ 이 키는 DB 전체에 접근 가능한 매우 민감한 키. 절대 공개 저장소나
     `NEXT_PUBLIC_`로 시작하는 환경변수로 넣지 않는다 — 이미 서버 전용으로만
     쓰도록 코드가 구성되어 있음)

## 2. 관리자 비밀번호 만들기

평문 비밀번호는 절대 환경변수/코드에 저장하지 않고, 해시된 값만 저장한다.

```bash
node scripts/hash-password.mjs "원하는 비밀번호"
```

출력된 문자열을 `ADMIN_PASSWORD_HASH`에 넣는다. (이 스크립트는 bcrypt 해시를
base64로 한 번 더 감싸서 출력한다 — bcrypt 해시에 든 `$` 문자를 Next.js가
`.env` 파일을 읽을 때 변수 치환으로 잘못 해석해 값이 깨지는 문제가 있어서다.
그래서 직접 만든 bcrypt 해시를 그대로 붙여넣으면 안 되고, 반드시 이 스크립트
출력값을 써야 한다.)

## 3. 세션 시크릿 만들기

로그인 세션 쿠키 서명에 쓰는 임의의 긴 문자열이다. 아래처럼 생성해서
`SESSION_SECRET`에 넣는다.

```bash
node -e "console.log(crypto.randomUUID()+crypto.randomUUID())"
```

## 4. 환경변수 설정

`.env.local.example`을 복사해 `.env.local`을 만들고 위에서 얻은 4개 값을
채운다 (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD_HASH`,
`SESSION_SECRET`). `.env.local`은 `.gitignore`에 포함되어 있어 git에는
올라가지 않는다.

**Vercel 배포본에도 같은 4개 값을 추가해야 한다**: Vercel 프로젝트 →
Settings → Environment Variables 에서 동일하게 등록 후 재배포.

⚠️ 환경변수는 **추가한 시점 이후에 새로 시작되는 배포에만** 적용된다.
"Deployments" 탭에서 예전 배포를 찾아 Redeploy하면 그때 그 커밋 그대로
다시 빌드될 뿐 최신 코드/환경변수가 반영되지 않는다 — 항상 **가장 최근
커밋의 배포**를 Redeploy하거나, 새 커밋을 push해서 자동 배포를 새로
트리거해야 한다.

⚠️ Vercel Settings → **Deployment Protection**에 "Vercel Authentication"이
켜져 있으면, 로그인 여부와 상관없이 Vercel 계정으로 로그인하지 않은
방문자는 사이트 자체를 못 본다(우리 앱 로그인 화면보다 먼저 막힘). 포트폴리오
사이트는 누구나 봐야 하므로 이건 꺼둔다.

## 5. 로컬 확인

```bash
npm run dev
```

`http://localhost:3000/admin` 접속 → 비밀번호 입력 → 로그인되면
`/admin/content`(히어로/소개/툴/컨택 텍스트), `/admin/gallery`,
`/admin/projects`에서 내용을 추가/수정/삭제할 수 있다. 메인 페이지 하단
좌측(저작권 표시 옆의 작은 점 `·`)에 숨겨진 관리자 링크가 있다.

## 참고

- 갤러리/프로젝트에 등록된 항목이 하나도 없으면 기존 placeholder(회색
  박스) 데모가 그대로 보인다. 관리자에서 항목을 하나라도 추가하면 그
  순간부터 placeholder 대신 실제 등록한 항목들이 보인다. `/admin/content`
  쪽도 마찬가지로, 필드를 비워두면 기존 기본 문구가 계속 보인다.
- 이미지는 Supabase Storage의 `portfolio-images` 버킷에 업로드되고,
  퍼블릭 URL이 DB에 저장된다.
- 항목 삭제 시 DB 레코드만 삭제되고 Storage의 이미지 파일 자체는 남는다
  (필요하면 Supabase Storage 화면에서 수동 정리).
