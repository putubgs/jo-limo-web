import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rp = searchParams.get("resourcePath");
  if (!rp) {
    return NextResponse.json(
      { error: "Missing resourcePath" },
      { status: 400 }
    );
  }

  const endpoint =
    `${process.env.NEXT_PUBLIC_PAYMENT_BASE_URL}${rp}` +
    `?entityId=${process.env.PAYMENT_ENTITY_ID}`;

  console.log("🔍 PAYMENT STATUS CHECK:");
  console.log("🌐 Endpoint:", endpoint);
  console.log("🔑 Entity ID:", process.env.PAYMENT_ENTITY_ID);
  console.log("🔑 Entity ID Length:", process.env.PAYMENT_ENTITY_ID?.length);
  console.log("🌍 Base URL:", process.env.NEXT_PUBLIC_PAYMENT_BASE_URL);

  try {
    const resp = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${process.env.PAYMENT_ACCESS_TOKEN}` },
    });

    const json = await resp.json();
    console.log("📥 PAYMENT STATUS RESPONSE:");
    console.log("📊 Status Code:", resp.status);
    console.log("📄 Response Data:", JSON.stringify(json, null, 2));

    // Handle specific HyperPay error codes
    if (json.result && json.result.code === "200.300.404") {
      console.log("🚨 PAYMENT SESSION NOT FOUND!");
      console.log("💡 This means:");
      console.log("  - Checkout ID expired (20min timeout)");
      console.log("  - Wrong environment (test vs production)");
      console.log("  - Entity ID mismatch");
      console.log("🔍 Current Environment Check:");
      console.log("  - Base URL:", process.env.NEXT_PUBLIC_PAYMENT_BASE_URL);
      console.log("  - Entity ID:", process.env.PAYMENT_ENTITY_ID);
      console.log(
        "  - Is Test Environment:",
        process.env.NEXT_PUBLIC_PAYMENT_BASE_URL?.includes("test")
      );
      console.error("Payment session not found - expired or invalid ID");
      return NextResponse.json(
        {
          ...json,
          result: {
            ...json.result,
            description:
              "Payment session expired or not found. Please try making a new payment.",
          },
        },
        { status: resp.status }
      );
    }

    return NextResponse.json(json, { status: resp.status });
  } catch (error) {
    console.error("Error fetching payment status:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment status" },
      { status: 500 }
    );
  }
}
