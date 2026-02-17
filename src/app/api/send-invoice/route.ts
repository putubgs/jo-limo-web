import { NextRequest, NextResponse } from "next/server";
import { sendInvoiceEmail } from "@/utils/email";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    console.log("📧 Invoice API called");
    const body = await request.json();
    console.log("📧 Request body:", JSON.stringify(body, null, 2));

    const {
      customerName,
      customerEmail,
      pickupLocation,
      dropoffLocation,
      serviceClass,
      dateTime,
      price,
      paymentMethod,
      mobileNumber,
      flightNumber,
      pickupSign,
      specialRequirements,
      distance,
      distanceLabel,
      bookingType,
      referenceCode,
      companyName,
      companyEmail,
    } = body;

    // Validate required fields (bookingId no longer required - auto-generated)
    if (!customerEmail || !customerName || !price) {
      console.error("❌ Missing required fields:", {
        customerEmail,
        customerName,
        price,
      });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    console.log("✅ All required fields present");

    // Generate invoice number (format: AT + 8 random digits, max 10 characters)
    const randomDigits = Math.floor(10000000 + Math.random() * 90000000);
    const invoiceNumber = `AT${randomDigits}`;

    let bookingNumber = "00001";
    try {
      const count = await prisma.bookinghistory.count();
1
      bookingNumber = String(count + 1).padStart(5, "0");
    } catch (error) {
      console.error("Failed to count bookings:", error);
    }

    // Format dates
    const bookingDate = new Date().toISOString().split("T")[0];
    const invoiceDate = new Date().toISOString().split("T")[0];

    // Prices (no tax calculation, net price = total price)
    const netPrice = parseFloat(price);
    const totalPrice = netPrice;

    const formatDisplayDateTime = (value?: string) => {
      if (!value) return "";

      try {
        const isoLike = /\d{4}-\d{2}-\d{2}T/.test(value);
        if (isoLike) {
          const parsed = new Date(value);
          if (!isNaN(parsed.getTime())) {
            return parsed.toLocaleString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
              timeZone: "Asia/Amman",
              timeZoneName: "short",
            });
          }
        }
      } catch (error) {
        console.error("Failed to format dateTime value:", value, error);
      }

      return value;
    };

    const displayDateTime = formatDisplayDateTime(dateTime);

    const normalizedLabel = distanceLabel?.toLowerCase() ?? "";
    const isByHourBooking =
      bookingType === "by-hour" ||
      normalizedLabel === "duration" ||
      (distance && distance.toLowerCase().includes("hour"));

    const durationDescription =
      distance && distance.trim() !== ""
        ? distance
        : "the selected hourly duration";

    // Format service description
    const serviceDescription = isByHourBooking
      ? `Hourly Ride starting at ${displayDateTime} from ${pickupLocation} for ${durationDescription} (${serviceClass})`
      : `Transfer Ride starting at ${displayDateTime} from ${pickupLocation} to ${dropoffLocation} (${serviceClass})`;

    // Normalize payment method (corporate-billing -> corporate)
    let normalizedPaymentMethod: "credit/debit" | "cash" | "corporate" = "cash";
    if (
      paymentMethod === "corporate" ||
      paymentMethod === "corporate-billing"
    ) {
      normalizedPaymentMethod = "corporate";
    } else if (paymentMethod === "credit/debit") {
      normalizedPaymentMethod = "credit/debit";
    } else if (paymentMethod === "cash") {
      normalizedPaymentMethod = "cash";
    }

    // Prepare invoice data
    const invoiceData = {
      customerName,
      customerEmail,
      invoiceNumber,
      bookingNumber,
      bookingDate,
      invoiceDate,
      customerNumber: "", // Not needed anymore
      serviceDescription,
      netPrice: netPrice.toFixed(2),
      taxAmount: "0.00", // Not used anymore
      totalPrice: totalPrice.toFixed(2),
      currency: "JOD",
      paymentMethod: normalizedPaymentMethod,
      pickupLocation,
      dropoffLocation,
      dateTime: displayDateTime,
      originalDateTime: dateTime,
      mobileNumber,
      flightNumber,
      pickupSign,
      specialRequirements,
      distance,
      distanceLabel,
      serviceClass,
      bookingType,
      referenceCode,
      companyName,
      companyEmail,
      displayDateTime,
    };

    console.log("📧 Sending invoice email to:", customerEmail);
    console.log("📧 Invoice data:", invoiceData);

    // Send invoice email
    const result = await sendInvoiceEmail(invoiceData);

    console.log("✅ Invoice email sent successfully:", result);

    return NextResponse.json({
      success: true,
      invoiceNumber,
      messageId: result.messageId,
    });
  } catch (error) {
    console.error("❌ Error in send-invoice API:", error);
    if (error instanceof Error) {
      console.error("❌ Error message:", error.message);
      console.error("❌ Error stack:", error.stack);
    }
    return NextResponse.json(
      {
        error: "Failed to send invoice",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
