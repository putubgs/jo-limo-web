import { NextRequest, NextResponse } from "next/server";
import { sendInvoiceEmail } from "@/utils/email";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

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
        { status: 400 }
      );
    }

    console.log("✅ All required fields present");

    // Generate invoice number (format: AT + 8 random digits, max 10 characters)
    const randomDigits = Math.floor(10000000 + Math.random() * 90000000);
    const invoiceNumber = `AT${randomDigits}`;

    // Get total booking count to generate booking number
    const supabase = createClient(cookies());
    const { count, error: countError } = await supabase
      .from("bookinghistory")
      .select("*", { count: "exact", head: true });

    let bookingNumber = "00001";
    if (!countError && count !== null) {
      // Booking number is current count + 1 (padded to 5 digits)
      bookingNumber = String(count + 1).padStart(5, "0");
    }

    console.log(
      "📊 Total bookings:",
      count,
      "Next booking number:",
      bookingNumber
    );

    // Format dates
    const bookingDate = new Date().toISOString().split("T")[0];
    const invoiceDate = new Date().toISOString().split("T")[0];

    // Prices (no tax calculation, net price = total price)
    const netPrice = parseFloat(price);
    const totalPrice = netPrice;

    // Format service description
    const serviceDescription = `Transfer Ride starting at ${dateTime} from ${pickupLocation} to ${dropoffLocation} (${serviceClass})`;

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
      paymentMethod: paymentMethod as "credit/debit" | "cash" | "corporate",
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
      { status: 500 }
    );
  }
}
