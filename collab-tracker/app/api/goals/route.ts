import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { goalSchema } from "@/lib/validators";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const user = await getCurrentUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();

  const [{ data: memberships, error: membershipError }, { data: personalGoals, error: personalError }] = await Promise.all([
    supabase
      .from("workspace_members")
      .select("workspace_id, role")
      .eq("user_id", user.id),
    supabase
      .from("goals")
      .select("id, title, description, schedule_type, schedule_days, workspace_id, owner_id, created_at")
      .eq("owner_id", user.id)
  ]);

  if (membershipError || personalError) {
    return NextResponse.json({ error: membershipError?.message ?? personalError?.message }, { status: 500 });
  }

  const workspaceIds = (memberships ?? []).map((member) => member.workspace_id);

  let workspaceGoals: any[] = [];
  if (workspaceIds.length) {
    const { data, error } = await supabase
      .from("goals")
      .select("id, title, description, schedule_type, schedule_days, workspace_id, owner_id, created_at")
      .in("workspace_id", workspaceIds);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    workspaceGoals = data ?? [];
  }

  const allGoals = [...(personalGoals ?? []), ...workspaceGoals];
  const goalIds = allGoals.map((goal) => goal.id);

  let completionsByGoal = new Map<string, { date: string }[]>();
  if (goalIds.length) {
    const { data: completions, error } = await supabase
      .from("goal_completions")
      .select("goal_id, date")
      .in("goal_id", goalIds)
      .eq("user_id", user.id)
      .order("date", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    completionsByGoal = completions?.reduce((map, completion) => {
      const arr = map.get(completion.goal_id) ?? [];
      arr.push({ date: completion.date });
      map.set(completion.goal_id, arr);
      return map;
    }, new Map<string, { date: string }[]>()) ?? new Map();
  }

  let workspaceNames = new Map<string, string>();
  if (workspaceIds.length) {
    const { data: workspaces, error } = await supabase
      .from("workspaces")
      .select("id, name")
      .in("id", workspaceIds);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    workspaceNames = new Map(workspaces?.map((w) => [w.id, w.name]) ?? []);
  }

  const membershipRoles = new Map((memberships ?? []).map((member) => [member.workspace_id, member.role]));

  const payload = allGoals
    .map((goal) => ({
      id: goal.id,
      title: goal.title,
      description: goal.description,
      scheduleType: goal.schedule_type,
      scheduleDays: goal.schedule_days ?? [],
      workspaceId: goal.workspace_id,
      ownerId: goal.owner_id,
      createdAt: goal.created_at,
      workspace: goal.workspace_id
        ? {
            id: goal.workspace_id,
            name: workspaceNames.get(goal.workspace_id) ?? null,
            role: membershipRoles.get(goal.workspace_id) ?? null
          }
        : null,
      completions: completionsByGoal.get(goal.id) ?? []
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json(payload);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json();
  const parsed = goalSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { title, description, scheduleType, scheduleDays = [], workspaceId } = parsed.data;

  if (scheduleType === "custom" && scheduleDays.length === 0) {
    return NextResponse.json({ error: "Custom goals must include schedule days" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (workspaceId) {
    const { data: membership } = await supabase
      .from("workspace_members")
      .select("role")
      .eq("workspace_id", workspaceId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!membership) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (membership.role !== "owner") {
      return NextResponse.json({ error: "Only owners can add workspace goals" }, { status: 403 });
    }
  }

  const { data, error } = await supabase
    .from("goals")
    .insert({
      title,
      description,
      schedule_type: scheduleType,
      schedule_days: scheduleDays,
      user_id: workspaceId ? null : user.id,
      workspace_id: workspaceId ?? null,
      owner_id: user.id
    })
    .select("id, title, description, schedule_type, schedule_days, workspace_id, owner_id, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const goal = {
    id: data.id,
    title: data.title,
    description: data.description,
    scheduleType: data.schedule_type,
    scheduleDays: data.schedule_days ?? [],
    workspaceId: data.workspace_id,
    ownerId: data.owner_id,
    createdAt: data.created_at
  };

  return NextResponse.json(goal, { status: 201 });
}
