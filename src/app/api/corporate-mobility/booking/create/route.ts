import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/jwt";

export async function POST(request: NextRequest) {
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

    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "first_name",
      "last_name",
      "email",
      "mobile_number",
      "booking_type",
      "pick_up_location",
      "drop_off_location",
      "date_and_time",
      "selected_class",
      "price",
    ];

    for (const field of requiredFields) {
      const value = body[field];
      if (!value || (typeof value === "string" && value.trim() === "")) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate booking_type and duration logic
    if (body.booking_type === "by-hour" && !body.duration) {
      return NextResponse.json(
        { error: "Duration is required for by-hour bookings" },
        { status: 400 }
      );
    }

    if (body.booking_type === "one-way" && body.duration) {
      return NextResponse.json(
        { error: "Duration should be null for one-way bookings" },
        { status: 400 }
      );
    }

    const supabase = createClient(cookieStore);

    // Store Jordan Time (UTC+3) directly in database
    const now = new Date();
    const jordanTime = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    const timestamp = jordanTime.toISOString();

    // Use the corporate account's reference as the booking reference code
    const referenceCode = payload.corporate_reference;

    // Insert the booking into the database with corporate billing
    const bookingData = {
      company_id: payload.id, // Use the authenticated corporate user's company_id
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      mobile_number: body.mobile_number,
      pickup_sign: body.pickup_sign || null,
      flight_number: body.flight_number || null,
      notes_for_the_chauffeur: body.notes_for_the_chauffeur || null,
      reference_code: referenceCode,
      booking_type: body.booking_type,
      pick_up_location: body.pick_up_location,
      drop_off_location: body.drop_off_location,
      duration: body.duration || null,
      date_and_time: body.date_and_time,
      selected_class: body.selected_class,
      payment_method: "corporate-billing", // Always set to corporate billing
      payment_status: "pending", // Always set to pending for corporate bookings
      price: body.price,
      created_at: timestamp,
      updated_at: timestamp,
    };

    const { data, error } = await supabase
      .from("bookinghistory")
      .insert([bookingData])
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to create booking", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        booking: data,
        message: "Corporate booking created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
