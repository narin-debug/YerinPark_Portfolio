import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function describe(name: string) {
  const value = process.env[name];
  if (!value) return `${name}: (없음)`;
  return `${name}: 있음, 길이 ${value.length}자, 시작 "${value.slice(0, 8)}..."`;
}

export default async function DebugPage() {
  let connectionResult = "";
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin.from("gallery_items").select("id").limit(1);
    connectionResult = error ? `연결 실패: ${error.message}` : "연결 성공";
  } catch (e) {
    connectionResult = `getSupabaseAdmin() 자체가 실패: ${e instanceof Error ? e.message : String(e)}`;
  }

  return (
    <pre className="whitespace-pre-wrap break-all text-xs text-foreground">
      {[
        describe("SUPABASE_URL"),
        describe("SUPABASE_SERVICE_ROLE_KEY"),
        describe("ADMIN_PASSWORD_HASH"),
        describe("SESSION_SECRET"),
        "",
        connectionResult,
      ].join("\n")}
    </pre>
  );
}
