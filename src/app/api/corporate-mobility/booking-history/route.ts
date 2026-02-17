export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/jwt";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    // 🔥 EXACT SAME STRUCTURE AS BOOKING API
    const [bookings, total] = await prisma.$transaction([
      prisma.bookinghistory.findMany({
        where: {
          company_id: payload.id,
        },
        skip: offset,
        take: limit,
        orderBy: { created_at: "desc" },
      }),
      prisma.bookinghistory.count({
        where: {
          company_id: payload.id,
        },
      }),
    ]);

    // 🔥 NORMALIZE LIKE YOUR WORKING API SHOULD
    const normalizedBookings = bookings.map((b) => ({
      ...b,
      price: Number(b.price),
      date_and_time: b.date_and_time.toISOString(),
      created_at: b.created_at.toISOString(),
      updated_at: b.updated_at.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      bookings: normalizedBookings,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error("Corporate booking history error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
