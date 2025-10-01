import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function PATCH(request: Request, { params }: { params: { taskId: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { completed } = await request.json();
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("tasks")
      .update({ completed })
      .eq("id", params.taskId)
      .eq("user_id", user.id)
      .select("id, title, notes, due_date, completed, created_at")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      id: data.id,
      title: data.title,
      notes: data.notes,
      dueDate: data.due_date,
      completed: data.completed,
      createdAt: data.created_at
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { taskId: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", params.taskId)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}