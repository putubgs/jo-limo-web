export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

interface CheckoutRequestBody {
  amount: string;
  merchantTransactionId: string;
  customerEmail: string;
  billingStreet1: string;
  billingCity: string;
  billingState: string;
  billingCountry: string;
  billingPostcode: string;
  customerGivenName: string;
  customerSurname: string;
}

export async function POST(request: Request) {
  let body: CheckoutRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Check required environment variables
  if (!process.env.PAYMENT_ENTITY_ID) {
    console.error("Missing PAYMENT_ENTITY_ID environment variable");
    return NextResponse.json(
      { error: "Payment configuration error" },
      { status: 500 }
    );
  }

  if (!process.env.PAYMENT_ACCESS_TOKEN) {
    console.error("Missing PAYMENT_ACCESS_TOKEN environment variable");
    return NextResponse.json(
      { error: "Payment configuration error" },
      { status: 500 }
    );
  }

  if (!process.env.NEXT_PUBLIC_PAYMENT_BASE_URL) {
    console.error("Missing NEXT_PUBLIC_PAYMENT_BASE_URL environment variable");
    return NextResponse.json(
      { error: "Payment configuration error" },
      { status: 500 }
    );
  }

  const {
    amount,
    merchantTransactionId,
    customerEmail,
    billingStreet1,
    billingCity,
    billingState,
    billingCountry,
    billingPostcode,
    customerGivenName,
    customerSurname,
  } = body;

  console.log("🔍 HYPERPAY CHECKOUT REQUEST:");
  console.log("📊 Environment Info:", {
    entityId: process.env.PAYMENT_ENTITY_ID,
    entityIdLength: process.env.PAYMENT_ENTITY_ID?.length,
    baseUrl: process.env.NEXT_PUBLIC_PAYMENT_BASE_URL,
    isTestMode: process.env.NEXT_PUBLIC_PAYMENT_BASE_URL?.includes("test")
      ? "TEST"
      : "PRODUCTION",
    entityType:
      process.env.PAYMENT_ENTITY_ID?.length === 32 ? "TEST" : "PRODUCTION",
  });

  console.log("👤 Customer Info:", {
    customerEmail,
    customerGivenName,
    customerSurname,
  });

  console.log("🏠 Billing Info:", {
    billingStreet1,
    billingCity,
    billingState,
    billingCountry,
    billingPostcode,
  });

  // Determine if we're in test mode based on the base URL
  const isTestMode =
    process.env.NEXT_PUBLIC_PAYMENT_BASE_URL?.includes("test.oppwa.com") ||
    process.env.NEXT_PUBLIC_PAYMENT_BASE_URL?.includes("eu-test.oppwa.com");

  console.log("💰 Payment Details:", {
    amount,
    currency: "JOD",
    paymentType: "DB",
    testMode: isTestMode ? "EXTERNAL" : "NOT_SET",
    merchantTransactionId,
  });

  const params = new URLSearchParams({
    entityId: process.env.PAYMENT_ENTITY_ID!,
    amount: Number(amount).toFixed(2),
    currency: "JOD",
    paymentType: "DB",
    ...(isTestMode && { testMode: "EXTERNAL" }), // Only add testMode for test environment
    merchantTransactionId,
    "customer.email": customerEmail,
    "billing.street1": billingStreet1,
    "billing.city": billingCity,
    "billing.state": billingState,
    "billing.country": billingCountry,
    "billing.postcode": billingPostcode,
    "customer.givenName": customerGivenName,
    "customer.surname": customerSurname,
    shopperResultUrl: `${
      process.env.NEXT_PUBLIC_SHOPPER_RESULT_URL
    }`,
    "customParameters[3DS2_enrolled]": "true",
  });

  console.log("📤 FINAL PARAMETERS SENT TO HYPERPAY:");
  console.log(
    "🌐 Request URL:",
    `${process.env.NEXT_PUBLIC_PAYMENT_BASE_URL}/v1/checkouts`
  );
  console.log("📋 All Parameters:");
  Array.from(params.entries()).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });
  console.log("📝 Raw POST Body:", params.toString());

  try {
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_PAYMENT_BASE_URL}/v1/checkouts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${process.env.PAYMENT_ACCESS_TOKEN}`,
        },
        body: params.toString(),
      }
    );

    const text = await resp.text();
    console.log("📥 HYPERPAY RESPONSE:");
    console.log("📊 Status Code:", resp.status);
    console.log(
      "📄 Response Headers:",
      Object.fromEntries(resp.headers.entries())
    );
    console.log("📝 Raw Response Body:", text);

    if (resp.ok) {
      try {
        const jsonResponse = JSON.parse(text);
        console.log(
          "✅ Parsed JSON Response:",
          JSON.stringify(jsonResponse, null, 2)
        );
        if (jsonResponse.id) {
          console.log("🎉 CHECKOUT ID RECEIVED:", jsonResponse.id);
        }
      } catch {
        console.log("⚠️ Response is not JSON:", text);
      }
    } else {
      console.log("❌ HYPERPAY ERROR RESPONSE:");
      try {
        const errorResponse = JSON.parse(text);
        console.log(
          "🔍 Error Details:",
          JSON.stringify(errorResponse, null, 2)
        );
        if (errorResponse.result?.code === "200.300.404") {
          console.log("🚨 ENVIRONMENT MISMATCH DETECTED!");
          console.log(
            "💡 This usually means wrong base URL or entity ID mismatch"
          );
        }
      } catch {
        console.log("⚠️ Error response is not JSON:", text);
      }
    }

    if (!resp.ok) {
      console.error("HyperPay checkout error:", {
        status: resp.status,
        response: text,
        entityId: process.env.PAYMENT_ENTITY_ID,
        baseUrl: process.env.NEXT_PUBLIC_PAYMENT_BASE_URL,
      });
      return NextResponse.json({ error: text }, { status: resp.status });
    }

    // parse JSON only if the response is JSON
    let data;
    try {
      data = JSON.parse(text);
      console.log("Parsed HyperPay data:", data);
    } catch {
      console.error("Failed to parse HyperPay response as JSON:", text);
      data = { raw: text };
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Network error during checkout:", error);
    return NextResponse.json(
      { error: "Network error. Please try again." },
      { status: 500 }
    );
  }
}
