import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { joinWorkspaceSchema } from "@/lib/validators";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json();
  const parsed = joinWorkspaceSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const now = new Date().toISOString();
  const { data: invite, error } = await supabase
    .from("invite_codes")
    .select("id, workspace_id, expires_at")
    .eq("code", parsed.data.code)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!invite) {
    return NextResponse.json({ error: "Invalid invite" }, { status: 404 });
  }

  if (invite.expires_at && invite.expires_at <= now) {
    return NextResponse.json({ error: "Invite expired" }, { status: 400 });
  }

  const { error: upsertError } = await supabase
    .from("workspace_members")
    .upsert(
      {
        user_id: user.id,
        workspace_id: invite.workspace_id,
        role: "member"
      },
      { onConflict: "user_id,workspace_id" }
    );

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, workspaceId: invite.workspace_id });
}
