import { NextResponse } from "next/server";

export async function GET() {
  // Only allow this in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Not available in production" },
      { status: 403 }
    );
  }

  const envStatus = {
    PAYMENT_ENTITY_ID: process.env.PAYMENT_ENTITY_ID ? "✅ Set" : "❌ Missing",
    PAYMENT_ACCESS_TOKEN: process.env.PAYMENT_ACCESS_TOKEN
      ? "✅ Set"
      : "❌ Missing",
    NEXT_PUBLIC_PAYMENT_BASE_URL:
      process.env.NEXT_PUBLIC_PAYMENT_BASE_URL || "❌ Missing",
    NEXT_PUBLIC_SHOPPER_RESULT_URL:
      process.env.NEXT_PUBLIC_SHOPPER_RESULT_URL || "❌ Missing",
    NODE_ENV: process.env.NODE_ENV,
    baseUrl: process.env.NEXT_PUBLIC_PAYMENT_BASE_URL,
    entityIdLength: process.env.PAYMENT_ENTITY_ID?.length || 0,
    tokenLength: process.env.PAYMENT_ACCESS_TOKEN?.length || 0,
    widgetUrl: `${process.env.NEXT_PUBLIC_PAYMENT_BASE_URL}/v1/paymentWidgets.js`,
    isTestMode: process.env.NEXT_PUBLIC_PAYMENT_BASE_URL?.includes("test")
      ? "✅ Test Mode"
      : "⚠️ Live Mode",
  };

  return NextResponse.json(envStatus);
}
