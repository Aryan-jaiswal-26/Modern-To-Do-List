import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    
    // Test database connection by trying to select from users table
    const { data, error } = await supabase
      .from("users")
      .select("id")
      .limit(1);

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        details: "Database connection failed"
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Database connection successful",
      userCount: data?.length || 0
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error",
      details: "Failed to connect to database"
    }, { status: 500 });
  }
}