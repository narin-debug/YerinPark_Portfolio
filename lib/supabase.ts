import "server-only";
import { createClient } from "@supabase/supabase-js";

export const IMAGE_BUCKET = "portfolio-images";

// 지연 생성: 모듈을 import하는 시점이 아니라 실제로 호출하는 시점에 환경변수를
// 확인한다. 그래야 Supabase가 아직 설정되지 않은 상태에서도 공개 페이지가
// (placeholder로 fallback하며) 죽지 않고, 관리자 페이지에서만 명확한 에러가 뜬다.
export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars. See docs/06-admin-setup.md."
    );
  }
  return createClient(url, serviceRoleKey, { auth: { persistSession: false } });
}
