import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { UpdateBookingRequest } from "@/types/booking";
import { cookies } from "next/headers";

// GET - Get a specific booking by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("bookinghistory")
      .select("*")
      .eq("booking_id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Booking not found" },
          { status: 404 }
        );
      }
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch booking", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update a specific booking
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: UpdateBookingRequest = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    // Validate booking_type and duration logic if provided
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

    // Check if booking exists
    const { error: fetchError } = await supabase
      .from("bookinghistory")
      .select("booking_id")
      .eq("booking_id", id)
      .single();

    if (fetchError) {
      if (fetchError.code === "PGRST116") {
        return NextResponse.json(
          { error: "Booking not found" },
          { status: 404 }
        );
      }
      console.error("Database error:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch booking", details: fetchError.message },
        { status: 500 }
      );
    }

    // Store Jordan Time (UTC+3) directly in database
    const now = new Date();
    const jordanTime = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    const timestamp = jordanTime.toISOString();

    // Update the booking with updated_at timestamp
    const { data, error } = await supabase
      .from("bookinghistory")
      .update({
        ...body,
        updated_at: timestamp,
      })
      .eq("booking_id", id)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to update booking", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a specific booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Check if booking exists
    const { error: fetchError } = await supabase
      .from("bookinghistory")
      .select("booking_id")
      .eq("booking_id", id)
      .single();

    if (fetchError) {
      if (fetchError.code === "PGRST116") {
        return NextResponse.json(
          { error: "Booking not found" },
          { status: 404 }
        );
      }
      console.error("Database error:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch booking", details: fetchError.message },
        { status: 500 }
      );
    }

    // Delete the booking
    const { error } = await supabase
      .from("bookinghistory")
      .delete()
      .eq("booking_id", id);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to delete booking", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
