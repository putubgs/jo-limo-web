import { NextResponse } from "next/server";
import { cookies } from "next/headers";
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

    return NextResponse.json({
      success: true,
      user: {
        id: payload.id,
        email: payload.email,
        role: payload.role,
        corporate_reference: payload.corporate_reference,
        company_name: payload.company_name,
      },
    });
  } catch (error) {
    console.error("Corporate auth verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
