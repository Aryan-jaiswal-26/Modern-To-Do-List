import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { taskSchema } from "@/lib/validators";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const user = await getCurrentUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("tasks")
    .select("id, title, notes, due_date, completed, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const tasks = (data ?? []).map((task) => ({
    id: task.id,
    title: task.title,
    notes: task.notes,
    dueDate: task.due_date,
    completed: task.completed,
    createdAt: task.created_at
  }));

  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json();
  const parsed = taskSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { title, notes, dueDate } = parsed.data;
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      title,
      notes,
      due_date: dueDate ?? null,
      user_id: user.id
    })
    .select("id, title, notes, due_date, completed, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const task = {
    id: data.id,
    title: data.title,
    notes: data.notes,
    dueDate: data.due_date,
    completed: data.completed,
    createdAt: data.created_at
  };

  return NextResponse.json(task, { status: 201 });
}
