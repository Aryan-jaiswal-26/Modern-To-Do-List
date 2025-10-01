import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { signUpSchema } from "@/lib/validators";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = signUpSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
    }

    const { email, password, name } = parsed.data;
    const supabase = getSupabaseAdmin();

    // Check if user already exists
    const { data: existing, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (checkError) {
      console.error("Database check error:", checkError);
      return NextResponse.json({ error: "Database connection error" }, { status: 500 });
    }

    if (existing) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 409 });
    }

    // Hash password
    const hashed = await hashPassword(password);

    // Create user
    const { error: insertError } = await supabase.from("users").insert({
      email,
      password: hashed,
      name
    });

    if (insertError) {
      console.error("User creation error:", insertError);
      return NextResponse.json({ error: "Failed to create user account" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Account created successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
