import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();

    // Get goals count
    const { data: goals } = await supabase
      .from("goals")
      .select("id")
      .eq("owner_id", user.id);

    // Get tasks count
    const { data: tasks } = await supabase
      .from("tasks")
      .select("id")
      .eq("user_id", user.id);

    // Get workspaces count
    const { data: workspaces } = await supabase
      .from("workspace_members")
      .select("workspace_id")
      .eq("user_id", user.id);

    const stats = {
      activeGoals: goals?.length || 0,
      totalTasks: tasks?.length || 0,
      workspaces: workspaces?.length || 0,
      currentStreak: 0
    };

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ 
      activeGoals: 0,
      totalTasks: 0,
      workspaces: 0,
      currentStreak: 0
    });
  }
}