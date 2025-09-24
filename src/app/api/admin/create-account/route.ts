import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    const supabase = createClient(cookies());

    // Check if admin already exists
    const { data: existingAdmin, error: checkError } = await supabase
      .from("admin")
      .select("admin_id")
      .eq("email", email)
      .single();

    if (existingAdmin && !checkError) {
      return NextResponse.json(
        { error: "Admin with this email already exists" },
        { status: 409 }
      );
    }

    // Create new admin
    const { data: newAdmin, error: createError } = await supabase
      .from("admin")
      .insert({
        email,
        password: hashedPassword,
      })
      .select("*")
      .single();

    if (createError) {
      console.error("Error creating admin:", createError);
      return NextResponse.json(
        { error: "Failed to create admin account" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Admin account created successfully",
      admin: {
        id: newAdmin.admin_id,
        email: newAdmin.email,
      },
    });
  } catch (error) {
    console.error("Create admin error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
