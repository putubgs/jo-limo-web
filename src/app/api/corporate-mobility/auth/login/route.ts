import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { generateToken } from "@/utils/jwt";

export async function POST(request: NextRequest) {
  try {
    const { corporate_reference, password } = await request.json();

    if (!corporate_reference || !password) {
      return NextResponse.json(
        { error: "Corporate reference and password are required" },
        { status: 400 }
      );
    }

    const supabase = createClient(cookies());

    // Check corporate account
    const { data: corporateAccount, error: accountError } = await supabase
      .from("corporateaccount")
      .select("*")
      .eq("corporate_reference", corporate_reference)
      .single();

    if (corporateAccount && !accountError) {
      const isValidPassword = await bcrypt.compare(
        password,
        corporateAccount.corporate_password
      );

      if (isValidPassword) {
        const token = await generateToken({
          id: corporateAccount.company_id,
          email: corporateAccount.company_email,
          role: "corporate",
          corporate_reference: corporateAccount.corporate_reference,
          company_name: corporateAccount.company_name,
        });

        const response = NextResponse.json({
          success: true,
          user: {
            id: corporateAccount.company_id,
            email: corporateAccount.company_email,
            role: "corporate",
            corporate_reference: corporateAccount.corporate_reference,
            company_name: corporateAccount.company_name,
          },
        });

        response.cookies.set("corporate-auth-token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 4, // 4 hours
          path: "/",
        });

        return response;
      }
    }

    return NextResponse.json(
      { error: "Invalid corporate reference or password" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Corporate login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
