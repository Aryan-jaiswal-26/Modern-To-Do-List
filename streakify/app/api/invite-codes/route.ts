import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { inviteSchema } from "@/lib/validators";
import { getSupabaseAdmin } from "@/lib/supabase";

function generateCode() {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json();
  const parsed = inviteSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { workspaceId, expiresAt } = parsed.data;
  const supabase = getSupabaseAdmin();

  const { data: membership } = await supabase
    .from("workspace_members")
    .select("role")
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (membership?.role !== "owner") {
    return NextResponse.json({ error: "Only owners can issue invites" }, { status: 403 });
  }

  const { data: code, error } = await supabase
    .from("invite_codes")
    .insert({
      workspace_id: workspaceId,
      code: generateCode(),
      expires_at: expiresAt ?? null
    })
    .select("id, code, workspace_id, expires_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(code, { status: 201 });
}
