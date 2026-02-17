export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/jwt";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Verify corporate authentication
    const cookieStore = await cookies();
    const token = cookieStore.get("corporate-auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "No authentication token found" },
        { status: 401 },
      );
    }

    const payload = await verifyToken(token);
    if (!payload || payload.role !== "corporate") {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 },
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
          { status: 400 },
        );
      }
    }

    // Validate booking_type and duration logic
    if (body.booking_type === "by-hour" && !body.duration) {
      return NextResponse.json(
        { error: "Duration is required for by-hour bookings" },
        { status: 400 },
      );
    }

    if (body.booking_type === "one-way" && body.duration) {
      return NextResponse.json(
        { error: "Duration should be null for one-way bookings" },
        { status: 400 },
      );
    }

    // Store Jordan Time (UTC+3) directly in database
    const now = new Date();
    const jordanTime = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    const timestamp = jordanTime.toISOString();

    // Use the corporate account's reference as the booking reference code
    const referenceCode = payload.corporate_reference;

    // Insert the booking into the database with corporate billing
    const inferredBookingType =
      body.booking_type === "by-hour" ||
      (!!body.duration &&
        (!body.drop_off_location || body.drop_off_location === "")) ||
      (body.distance && body.distance.toLowerCase().includes("hour"))
        ? "by-hour"
        : "one-way";

    const booking = await prisma.bookinghistory.create({
      data: {
        company_id: payload.id,
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        mobile_number: body.mobile_number,
        pickup_sign: body.pickup_sign || null,
        flight_number: body.flight_number || null,
        notes_for_the_chauffeur: body.notes_for_the_chauffeur || null,
        reference_code: referenceCode as string,
        booking_type: inferredBookingType,
        pick_up_location: body.pick_up_location,
        drop_off_location: body.drop_off_location,
        duration: body.duration || null,
        date_and_time: body.date_and_time,
        selected_class: body.selected_class,
        payment_method: "corporate-billing",
        payment_status: "pending",
        price: body.price,
        created_at: jordanTime,
        updated_at: jordanTime,
      },
    });

    // Send invoice email after successful booking
    if (booking && body.email) {
      try {
        console.log("📧 Preparing to send corporate invoice email");
        console.log("📧 Corporate account info:", {
          companyName: payload.company_name,
          companyEmail: payload.email,
          referenceCode: referenceCode,
        });

        let dropoffLocation = body.drop_off_location || "";
        if (inferredBookingType === "by-hour") {
          dropoffLocation = "(Round Trip)";
        }

        const invoiceResponse = await fetch(
          `${request.nextUrl.origin}/api/send-invoice`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              customerName: `${body.first_name} ${body.last_name}`,
              customerEmail: body.email,
              pickupLocation: body.pick_up_location,
              dropoffLocation: dropoffLocation,
              serviceClass: body.selected_class,
              dateTime: body.date_and_time,
              price: body.price,
              paymentMethod: "corporate",
              mobileNumber: body.mobile_number,
              flightNumber: body.flight_number,
              pickupSign: body.pickup_sign,
              specialRequirements: body.notes_for_the_chauffeur,
              distance: body.distance,
              distanceLabel:
                inferredBookingType === "by-hour" ? "Duration" : "Distance",
              bookingType: inferredBookingType,
              referenceCode: referenceCode,
              companyName: payload.company_name || "",
              companyEmail: payload.email || "",
            }),
          },
        );

        if (invoiceResponse.ok) {
          const invoiceResult = await invoiceResponse.json();
          console.log("Invoice sent successfully:", invoiceResult);
        } else {
          console.error(
            "Failed to send invoice:",
            await invoiceResponse.text(),
          );
        }
      } catch (invoiceError) {
        console.error("Error sending invoice:", invoiceError);
        // Don't fail the booking if invoice sending fails
      }
    }

    return NextResponse.json(
      {
        success: true,
        booking: booking,
        message: "Corporate booking created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
