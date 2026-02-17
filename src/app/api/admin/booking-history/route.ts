export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { CreateBookingRequest } from "@/types/booking";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { verifyToken } from "@/utils/jwt";

// POST - Create a new booking
export async function POST(request: NextRequest) {
  try {
    console.log("📥 Received booking creation request");

    const body: CreateBookingRequest = await request.json();
    console.log("📄 Request body:", JSON.stringify(body, null, 2));

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
      "payment_method",
      "payment_status",
      "price",
    ];

    for (const field of requiredFields) {
      const value = body[field as keyof CreateBookingRequest];
      if (!value || (typeof value === "string" && value.trim() === "")) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }

    // Validate booking_type logic
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

    // ⚠️ IMPORTANT:
    // DO NOT manually shift timezone.
    // PostgreSQL timestamptz stores in UTC automatically.
    const timestamp = new Date();

    const booking = await prisma.bookinghistory.create({
      data: {
        ...(body.company_id && {
          corporateaccount: {
            connect: { company_id: body.company_id },
          },
        }),

        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        mobile_number: body.mobile_number,
        pickup_sign: body.pickup_sign ?? null,
        flight_number: body.flight_number ?? null,
        notes_for_the_chauffeur: body.notes_for_the_chauffeur ?? null,
        reference_code: body.reference_code ?? null,
        booking_type: body.booking_type,
        pick_up_location: body.pick_up_location,
        drop_off_location: body.drop_off_location,
        duration: body.duration ?? null,
        date_and_time: body.date_and_time,
        selected_class: body.selected_class,
        payment_method: body.payment_method,
        payment_status: body.payment_status,
        price: body.price,
        created_at: timestamp,
        updated_at: timestamp,
      },
    });

    console.log("✅ Booking created successfully:", booking);

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("❌ Create booking error:", error);

    // Add this 👇
    if (error instanceof Error && "meta" in error) {
      console.error(
        "❌ Prisma error meta:",
        JSON.stringify((error as any).meta, null, 2),
      );
    }

    return NextResponse.json(
      {
        error: "Failed to create booking",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// GET - List all bookings with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const filter = searchParams.get("filter") || "all";
    const search = searchParams.get("search") || "";
    const paymentStatus = searchParams.get("payment_status") || "all";

    const offset = (page - 1) * limit;

    // Build dynamic where object
    const where: Prisma.bookinghistoryWhereInput = {};

    // Filter: general / corporate
    if (filter === "general") {
      // where.corporateaccount = undefined
      where.company_id = undefined;
    } else if (filter === "corporate") {
      where.company_id = { not: undefined };
    }

    // Payment status filter
    if (paymentStatus !== "all") {
      where.payment_status = paymentStatus;
    }

    // Search filter
    if (search) {
      const searchWords = search.trim().split(/\s+/);

      if (searchWords.length === 1) {
        const word = searchWords[0];

        where.OR = [
          { first_name: { contains: word, mode: "insensitive" } },
          { last_name: { contains: word, mode: "insensitive" } },
          { reference_code: { contains: word, mode: "insensitive" } },
        ];
      } else {
        where.AND = searchWords.map((word) => ({
          OR: [
            { first_name: { contains: word, mode: "insensitive" } },
            { last_name: { contains: word, mode: "insensitive" } },
            { reference_code: { contains: word, mode: "insensitive" } },
          ],
        }));
      }
    }

    // 🔥 Execute data + count safely in transaction
    const [bookings, total] = await prisma.$transaction([
      prisma.bookinghistory.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { created_at: "desc" },
      }),
      prisma.bookinghistory.count({
        where,
      }),
    ]);

    return NextResponse.json({
      bookings,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error("Booking history fetch error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
