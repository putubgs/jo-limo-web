import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { generateToken } from "@/utils/jwt";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const supabase = createClient(cookies());

    // Check admin only
    const { data: admin, error: adminError } = await supabase
      .from("admin")
      .select("*")
      .eq("email", email)
      .single();

    if (admin && !adminError) {
      const isValidPassword = await bcrypt.compare(password, admin.password);

      if (isValidPassword) {
        const token = await generateToken({
          id: admin.admin_id,
          email: admin.email,
          role: "admin",
        });

        const response = NextResponse.json({
          success: true,
          user: {
            id: admin.admin_id,
            email: admin.email,
            role: "admin",
          },
        });

        response.cookies.set("auth-token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 60,
          path: "/",
        });

        return response;
      }
    }

    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
