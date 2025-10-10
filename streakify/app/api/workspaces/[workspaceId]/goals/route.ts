import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request, { params }: { params: { workspaceId: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();
    
    // Check if user is member of workspace
    const { data: membership } = await supabase
      .from("workspace_members")
      .select("role")
      .eq("workspace_id", params.workspaceId)
      .eq("user_id", user.id)
      .single();

    if (!membership) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get workspace goals
    const { data: goals, error } = await supabase
      .from("goals")
      .select("id, title, description, schedule_type, schedule_days, workspace_id, owner_id, created_at")
      .eq("workspace_id", params.workspaceId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const payload = (goals || []).map((goal) => ({
      id: goal.id,
      title: goal.title,
      description: goal.description,
      scheduleType: goal.schedule_type,
      scheduleDays: goal.schedule_days || [],
      workspaceId: goal.workspace_id,
      ownerId: goal.owner_id,
      createdAt: goal.created_at
    }));

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}