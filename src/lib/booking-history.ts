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
    const inferredBookingType =
      reservationData.type === "by-hour" ||
      (!!reservationData.duration &&
        (!reservationData.dropoff || reservationData.dropoff === "")) ||
      (reservationData.distance &&
        reservationData.distance.toLowerCase().includes("hour"))
        ? "by-hour"
        : "one-way";

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
      booking_type: inferredBookingType,
      pick_up_location: reservationData.pickup || "N/A",
      drop_off_location:
        inferredBookingType === "by-hour"
          ? "Round trip from starting location"
          : reservationData.dropoff || "N/A",
      duration:
        inferredBookingType === "by-hour" ? reservationData.duration : null,
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
    console.log("✅ Booking history created successfully:", result);

    // Send invoice email after successful booking
    console.log("🔍 CHECKING IF EMAIL SHOULD BE SENT:");
    console.log("🔍 result exists?", !!result);
    console.log("🔍 result has booking_id?", !!result.booking_id);
    console.log("🔍 billingData exists?", !!billingData);
    console.log("🔍 billingData.customerEmail?", billingData?.customerEmail);

    // The result IS the booking data (not wrapped in .data)
    if (result && result.booking_id && billingData?.customerEmail) {
      try {
        console.log("✅ EMAIL WILL BE SENT!");
        console.log("📧 Attempting to send invoice email...");
        console.log("📧 Full reservation data:", reservationData);
        console.log("📧 Billing data:", billingData);
        console.log("📧 Invoice data:", {
          customerName: `${billingData.customerGivenName} ${billingData.customerSurname}`,
          customerEmail: billingData.customerEmail,
          paymentMethod,
        });

        console.log("📧 Calling /api/send-invoice with data:", {
          customerName: `${billingData.customerGivenName} ${billingData.customerSurname}`,
          customerEmail: billingData.customerEmail,
          pickupLocation: reservationData.pickup,
          dropoffLocation: reservationData.dropoff || "Round trip",
          serviceClass: reservationData.selectedClass,
          dateTime: `${reservationData.date}, ${reservationData.time}`,
          price: reservationData.selectedClassPrice,
          paymentMethod,
        });

        // Format dropoff location based on booking type
        let dropoffLocation = reservationData.dropoff || "";
        if (inferredBookingType === "by-hour") {
          dropoffLocation = `from ${reservationData.pickup} for ${reservationData.duration || reservationData.distance} trip`;
        }

        const invoiceResponse = await fetch("/api/send-invoice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName: `${billingData.customerGivenName} ${billingData.customerSurname}`,
            customerEmail: billingData.customerEmail,
            pickupLocation: reservationData.pickup,
            dropoffLocation: dropoffLocation,
            serviceClass: reservationData.selectedClass,
            dateTime: `${reservationData.date}, ${reservationData.time}`,
            price: reservationData.selectedClassPrice,
            paymentMethod,
            mobileNumber: reservationData.mobileNumber || "",
            flightNumber: reservationData.flightNumber || "",
            pickupSign: reservationData.pickupSign || "",
            specialRequirements:
              reservationData.notesForChauffeur ||
              reservationData.specialRequirements ||
              "",
            distance: reservationData.distance || "",
            distanceLabel:
              inferredBookingType === "by-hour" ? "Duration" : "Distance",
            bookingType: inferredBookingType,
          }),
        });

        console.log("📧 Invoice API response status:", invoiceResponse.status);
        console.log("📧 Invoice API response ok?:", invoiceResponse.ok);

        if (invoiceResponse.ok) {
          const invoiceResult = await invoiceResponse.json();
          console.log("✅✅✅ EMAIL SENT SUCCESSFULLY! ✅✅✅");
          console.log("✅ Invoice result:", invoiceResult);
        } else {
          const errorText = await invoiceResponse.text();
          console.error("❌❌❌ EMAIL FAILED TO SEND! ❌❌❌");
          console.error("❌ Status:", invoiceResponse.status);
          console.error("❌ Error:", errorText);
        }
      } catch (invoiceError) {
        console.error("❌❌❌ EMAIL ERROR - EXCEPTION THROWN! ❌❌❌");
        console.error("❌ Error:", invoiceError);
        console.error(
          "❌ Error message:",
          invoiceError instanceof Error
            ? invoiceError.message
            : String(invoiceError)
        );
        // Don't fail the booking if invoice sending fails
      }
    } else {
      console.log("❌❌❌ EMAIL SKIPPED - MISSING DATA! ❌❌❌");
      console.log("⚠️ Skipping invoice email - missing data:", {
        hasResult: !!result,
        hasBookingId: !!result?.booking_id,
        hasCustomerEmail: !!billingData?.customerEmail,
        result: result,
        billingData: billingData,
      });
    }

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
