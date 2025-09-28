import { CreateBookingRequest } from "@/types/booking";
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
      date_and_time: (() => {
        try {
          // Handle human-readable date format like "Sun, Sep 28, 2025T5:30 AM"
          const dateStr = `${reservationData.date}T${reservationData.time}`;
          console.log("🔍 Raw date string:", dateStr);

          // Try parsing the date directly first
          let date = new Date(dateStr);

          // If that fails, try to clean up the format
          if (isNaN(date.getTime())) {
            console.log("🔧 First attempt failed, trying to clean format...");

            // Remove day name and clean up the format
            // "Sun, Sep 28, 2025T5:30 AM" -> "Sep 28, 2025T5:30 AM"
            const cleanedDateStr = dateStr.replace(/^[A-Za-z]+, /, "");
            console.log("🔧 Cleaned date string:", cleanedDateStr);

            date = new Date(cleanedDateStr);

            // If still fails, try another approach
            if (isNaN(date.getTime())) {
              console.log(
                "🔧 Second attempt failed, trying alternative parsing..."
              );

              // Extract components manually
              const match = dateStr.match(
                /(\w+), (\w+) (\d+), (\d+)T(\d+):(\d+) (AM|PM)/
              );
              if (match) {
                const [, , month, day, year, hour, minute, ampm] = match;
                const monthMap: { [key: string]: number } = {
                  Jan: 0,
                  Feb: 1,
                  Mar: 2,
                  Apr: 3,
                  May: 4,
                  Jun: 5,
                  Jul: 6,
                  Aug: 7,
                  Sep: 8,
                  Oct: 9,
                  Nov: 10,
                  Dec: 11,
                };

                let hour24 = parseInt(hour);
                if (ampm === "PM" && hour24 !== 12) hour24 += 12;
                if (ampm === "AM" && hour24 === 12) hour24 = 0;

                date = new Date(
                  parseInt(year),
                  monthMap[month],
                  parseInt(day),
                  hour24,
                  parseInt(minute)
                );
                console.log("🔧 Manual parsing result:", date);
              }
            }
          }

          if (isNaN(date.getTime())) {
            console.error("❌ All date parsing attempts failed:", dateStr);
            return new Date().toISOString(); // fallback to current time
          }

          console.log("✅ Successfully parsed date:", date.toISOString());
          return date.toISOString();
        } catch (error) {
          console.error("Date parsing error:", error);
          return new Date().toISOString(); // fallback to current time
        }
      })(),
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
