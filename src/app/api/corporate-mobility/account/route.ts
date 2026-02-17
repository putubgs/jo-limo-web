export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/jwt";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
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
    
    const account = await prisma.corporateaccount.findUnique({
      where: {
        company_id: payload.id
      }
    })

    return NextResponse.json({
      success: true,
      account: account,
    });
  } catch (error) {
    console.error("Corporate account fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
