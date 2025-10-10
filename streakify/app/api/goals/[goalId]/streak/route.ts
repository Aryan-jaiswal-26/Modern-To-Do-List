import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { calculateStreaks } from "@/lib/streaks";
import { getSupabaseAdmin } from "@/lib/supabase";

type Params = {
  params: { goalId: string };
};

export async function GET(request: Request, { params }: Params) {
  const { searchParams } = new URL(request.url);
  const queryUserId = searchParams.get("userId") ?? undefined;

  const sessionUser = await getCurrentUser();
  const targetUserId = queryUserId ?? sessionUser?.id;

  if (!targetUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const { data: goal, error: goalError } = await supabase
    .from("goals")
    .select("id, schedule_type, schedule_days, workspace_id, owner_id")
    .eq("id", params.goalId)
    .maybeSingle();

  if (goalError) {
    return NextResponse.json({ error: goalError.message }, { status: 500 });
  }

  if (!goal) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isOwner = goal.owner_id === sessionUser?.id;

  if (goal.workspace_id) {
    const { data: membership } = await supabase
      .from("workspace_members")
      .select("role")
      .eq("workspace_id", goal.workspace_id)
      .eq("user_id", sessionUser?.id ?? "")
      .maybeSingle();

    if (!membership && !isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  } else if (!isOwner) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!isOwner && targetUserId !== sessionUser?.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: completions, error: completionError } = await supabase
    .from("goal_completions")
    .select("date")
    .eq("goal_id", goal.id)
    .eq("user_id", targetUserId)
    .order("date", { ascending: false });

  if (completionError) {
    return NextResponse.json({ error: completionError.message }, { status: 500 });
  }

  const streak = calculateStreaks(
    { scheduleType: goal.schedule_type, scheduleDays: goal.schedule_days ?? [] },
    completions ?? []
  );
  return NextResponse.json(streak);
}
