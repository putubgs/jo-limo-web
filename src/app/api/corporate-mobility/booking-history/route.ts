import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/jwt";

export async function GET(request: NextRequest) {
  try {
    // Verify corporate authentication
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

    const supabase = createClient(cookieStore);

    // Get query parameters for pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    // Fetch bookings for the authenticated corporate account
    const { data: bookings, error } = await supabase
      .from("bookinghistory")
      .select("*")
      .eq("company_id", payload.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch booking history", details: error.message },
        { status: 500 }
      );
    }

    // Get total count for pagination
    const { count, error: countError } = await supabase
      .from("bookinghistory")
      .select("*", { count: "exact", head: true })
      .eq("company_id", payload.id);

    if (countError) {
      console.error("Count error:", countError);
      return NextResponse.json(
        { error: "Failed to get booking count", details: countError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      bookings: bookings || [],
      total: count || 0,
      page,
      limit,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
