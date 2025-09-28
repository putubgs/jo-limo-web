import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { verifyToken } from "@/utils/jwt";

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("corporate-auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "No authentication token found" },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);

    if (!payload || payload.role !== "corporate") {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const supabase = createClient(cookies());

    // Get the corporate account data
    const { data: account, error } = await supabase
      .from("corporateaccount")
      .select("*")
      .eq("company_id", payload.id)
      .single();

    if (error) {
      console.error("Error fetching corporate account:", error);
      return NextResponse.json(
        { error: "Corporate account not found" },
        { status: 404 }
      );
    }

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { corporate_password: _, ...accountWithoutPassword } = account;

    return NextResponse.json({
      success: true,
      account: accountWithoutPassword,
    });
  } catch (error) {
    console.error("Corporate account fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
