import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { getSupabaseAdmin } from "@/lib/supabase";

function generateCode() {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user?.id) {
    return NextResponse.json([], { status: 200 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("workspace_members")
    .select("role, workspace:workspaces(id, name)")
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    (data ?? []).map((membership) => ({
      id: membership.workspace?.id,
      name: membership.workspace?.name,
      role: membership.role
    }))
  );
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await request.json();
  if (!name) {
    return NextResponse.json({ error: "Workspace name required" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const { data: workspace, error: workspaceError } = await supabase
    .from("workspaces")
    .insert({
      name,
      owner_id: user.id
    })
    .select("id, name, created_at")
    .single();

  if (workspaceError) {
    return NextResponse.json({ error: workspaceError.message }, { status: 500 });
  }

  const [{ error: memberError }, { data: invite, error: inviteError }] = await Promise.all([
    supabase.from("workspace_members").insert({
      workspace_id: workspace.id,
      user_id: user.id,
      role: "owner"
    }),
    supabase
      .from("invite_codes")
      .insert({
        workspace_id: workspace.id,
        code: generateCode(),
        expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString()
      })
      .select("id, code, expires_at")
      .single()
  ]);

  if (memberError || inviteError) {
    return NextResponse.json({ error: memberError?.message ?? inviteError?.message }, { status: 500 });
  }

  return NextResponse.json(
    {
      ...workspace,
      inviteCodes: invite ? [invite] : []
    },
    { status: 201 }
  );
}
