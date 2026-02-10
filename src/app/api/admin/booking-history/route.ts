import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { CreateBookingRequest } from "@/types/booking";
import { cookies } from "next/headers";

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

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Store Jordan Time (UTC+3) directly in database
    const now = new Date();
    const jordanTime = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    const timestamp = jordanTime.toISOString();

    // Insert the booking into the database
    const { data, error } = await supabase
      .from("bookinghistory")
      .insert([
        {
          company_id: body.company_id,
          first_name: body.first_name,
          last_name: body.last_name,
          email: body.email,
          mobile_number: body.mobile_number,
          pickup_sign: body.pickup_sign,
          flight_number: body.flight_number,
          notes_for_the_chauffeur: body.notes_for_the_chauffeur,
          reference_code: body.reference_code,
          booking_type: body.booking_type,
          pick_up_location: body.pick_up_location,
          drop_off_location: body.drop_off_location,
          duration: body.duration,
          date_and_time: body.date_and_time,
          selected_class: body.selected_class,
          payment_method: body.payment_method,
          payment_status: body.payment_status,
          price: body.price,
          created_at: timestamp,
          updated_at: timestamp,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("❌ Database error:", error);
      console.error("❌ Error details:", JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: "Failed to create booking", details: error.message },
        { status: 500 }
      );
    }

    console.log("✅ Booking created successfully:", data);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("❌ API error:", error);
    console.error(
      "❌ Error message:",
      error instanceof Error ? error.message : String(error)
    );
    console.error(
      "❌ Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// GET - List all bookings with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const filter = searchParams.get("filter") || "all"; // all, general, corporate
    const search = searchParams.get("search") || "";
    const paymentStatus = searchParams.get("payment_status") || "all"; // all, pending, completed, cancelled
    const month = searchParams.get("month") || "";
    const year = searchParams.get("year") || "";

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    let query = supabase.from("bookinghistory").select("*", { count: "exact" });

    // Apply filters
    if (filter === "general") {
      query = query.is("company_id", null);
    } else if (filter === "corporate") {
      query = query.not("company_id", "is", null);
    }

    // Apply payment status filter
    if (paymentStatus !== "all") {
      query = query.eq("payment_status", paymentStatus);
    }

    // Apply month and year filters
    if (month || year) {
      if (month && year) {
        // Filter by specific month and year
        const startDate = `${year}-${month}-01`;
        const endDate = new Date(parseInt(year), parseInt(month), 0)
          .toISOString()
          .split("T")[0];
        query = query
          .gte("created_at", startDate)
          .lte("created_at", `${endDate}T23:59:59.999Z`);
      } else if (year) {
        // Filter by year only
        const startDate = `${year}-01-01`;
        const endDate = `${year}-12-31T23:59:59.999Z`;
        query = query.gte("created_at", startDate).lte("created_at", endDate);
      } else if (month) {
        // Filter by month only (current year)
        const currentYear = new Date().getFullYear();
        const startDate = `${currentYear}-${month}-01`;
        const endDate = new Date(currentYear, parseInt(month), 0)
          .toISOString()
          .split("T")[0];
        query = query
          .gte("created_at", startDate)
          .lte("created_at", `${endDate}T23:59:59.999Z`);
      }
    }

    // Apply search (by customer name: first_name + last_name, or reference_code)
    // Split search into words and search each word across all fields
    if (search) {
      const searchWords = search.trim().split(/\s+/); // Split by whitespace

      if (searchWords.length === 1) {
        // Single word search - use simple OR logic
        query = query.or(
          `first_name.ilike.%${searchWords[0]}%,last_name.ilike.%${searchWords[0]}%,reference_code.ilike.%${searchWords[0]}%`
        );
      } else {
        // Multiple words - each word must match at least one field
        // This allows "zaid a" to match "zaid abu samra"
        searchWords.forEach((word) => {
          if (word) {
            query = query.or(
              `first_name.ilike.%${word}%,last_name.ilike.%${word}%,reference_code.ilike.%${word}%`
            );
          }
        });
      }
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    // Sort by created_at descending (newest first)
    query = query.order("created_at", { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch bookings", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      bookings: data || [],
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
