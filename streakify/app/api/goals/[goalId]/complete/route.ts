import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request, { params }: { params: { goalId: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let date = new Date().toISOString().split('T')[0];
    try {
      const body = await request.json();
      date = body.date || date;
    } catch {
      // No body sent, use default date
    }
    const supabase = getSupabaseAdmin();

    // For now, just return success without database operation
    // TODO: Create goal_completions table and implement proper tracking
    return NextResponse.json({ success: true, date }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { goalId: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let date = new Date().toISOString().split('T')[0];
    try {
      const body = await request.json();
      date = body.date || date;
    } catch {
      // No body sent, use default date
    }
    const supabase = getSupabaseAdmin();

    // For now, just return success without database operation
    // TODO: Implement proper goal completion deletion
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}