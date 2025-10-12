import { CreateBookingRequest } from "@/types/booking";
import { toJordanOffsetISO } from "./date-time-utils";
import { ReservationData, BillingData } from "./reservation-store";

export interface BookingHistoryData {
  reservationData: ReservationData;
  billingData?: BillingData;
  paymentMethod: "credit/debit" | "cash" | "corporate-billing";
  paymentStatus: "pending" | "completed" | "cancelled";
  paymentResult?: unknown; // HyperPay result or cash payment data
}

export async function createBookingHistory(
  bookingData: BookingHistoryData
): Promise<unknown> {
  try {
    const { reservationData, billingData, paymentMethod, paymentStatus } =
      bookingData;

    // Validate required data
    if (!reservationData.date || !reservationData.time) {
      console.error("Missing date or time in reservation data:", {
        date: reservationData.date,
        time: reservationData.time,
        fullData: reservationData,
      });
      throw new Error("Missing date or time in reservation data");
    }

    // Prepare the booking data for the API
    const bookingRequest: CreateBookingRequest = {
      company_id: null, // General booking (no corporate account)
      first_name: billingData?.customerGivenName || "N/A",
      last_name: billingData?.customerSurname || "N/A",
      email: billingData?.customerEmail || "N/A",
      mobile_number: reservationData.mobileNumber || "N/A",
      pickup_sign: reservationData.pickupSign || null,
      flight_number: reservationData.flightNumber || null,
      notes_for_the_chauffeur: reservationData.notesForChauffeur || null,
      reference_code: reservationData.referenceCode || null,
      booking_type: reservationData.type,
      pick_up_location: reservationData.pickup || "N/A",
      drop_off_location:
        reservationData.type === "by-hour"
          ? "Round trip from starting location"
          : reservationData.dropoff || "N/A",
      duration:
        reservationData.type === "by-hour" ? reservationData.duration : null,
      date_and_time: toJordanOffsetISO(
        reservationData.date as string,
        reservationData.time as string
      ),
      selected_class: reservationData.selectedClass || "executive",
      payment_method: paymentMethod,
      payment_status: paymentStatus,
      price: parseFloat(reservationData.selectedClassPrice || "0"),
    };

    console.log("Creating booking history with data:", bookingRequest);
    console.log("Raw reservation data:", reservationData);
    console.log("Date values:", {
      date: reservationData.date,
      time: reservationData.time,
      combined: `${reservationData.date}T${reservationData.time}`,
    });

    const response = await fetch("/api/admin/booking-history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingRequest),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to create booking: ${errorData.error || "Unknown error"}`
      );
    }

    const result = await response.json();
    console.log("Booking history created successfully:", result);

    return result;
  } catch (error) {
    console.error("Error creating booking history:", error);
    throw error;
  }
}

export function formatBookingType(type: string): "one-way" | "by-hour" {
  return type === "by-hour" ? "by-hour" : "one-way";
}

export function formatServiceClass(
  serviceClass: string
): "executive" | "luxury" | "mpv" | "suv" {
  switch (serviceClass.toLowerCase()) {
    case "luxury":
      return "luxury";
    case "mpv":
      return "mpv";
    case "suv":
      return "suv";
    default:
      return "executive";
  }
}
