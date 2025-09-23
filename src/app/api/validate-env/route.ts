import { NextResponse } from "next/server";

export async function GET() {
  const entityId = process.env.PAYMENT_ENTITY_ID;
  const accessToken = process.env.PAYMENT_ACCESS_TOKEN;
  const baseUrl = process.env.NEXT_PUBLIC_PAYMENT_BASE_URL;

  // Check for missing environment variables
  const missingVars = [];
  if (!entityId) missingVars.push("PAYMENT_ENTITY_ID");
  if (!accessToken) missingVars.push("PAYMENT_ACCESS_TOKEN");
  if (!baseUrl) missingVars.push("NEXT_PUBLIC_PAYMENT_BASE_URL");

  if (missingVars.length > 0) {
    return NextResponse.json(
      {
        status: "error",
        message: `Missing environment variables: ${missingVars.join(", ")}`,
        missingVars,
      },
      { status: 500 }
    );
  }

  // Validate environment consistency
  const isTestBaseUrl = baseUrl?.includes("test.oppwa.com") ?? false;
  const isTestEntityId = entityId?.length === 32; // Test entity IDs are typically 32 characters

  const issues = [];

  // Check for common misconfigurations
  if (baseUrl?.includes("eu-test.oppwa.com")) {
    issues.push({
      type: "error",
      message:
        "Wrong base URL: Use 'https://test.oppwa.com' not 'https://eu-test.oppwa.com'",
      fix: "Change NEXT_PUBLIC_PAYMENT_BASE_URL to https://test.oppwa.com",
    });
  }

  if (isTestBaseUrl && !isTestEntityId) {
    issues.push({
      type: "warning",
      message:
        "Test base URL with production entity ID - this will cause 200.300.404 errors",
      fix: "Use test entity ID (32 characters) with test base URL",
    });
  }

  if (!isTestBaseUrl && isTestEntityId) {
    issues.push({
      type: "warning",
      message:
        "Production base URL with test entity ID - this will cause 200.300.404 errors",
      fix: "Use production entity ID with production base URL",
    });
  }

  // Test connectivity to HyperPay
  let connectivityTest = null;
  if (baseUrl) {
    try {
      const testUrl = `${baseUrl}/v1/checkouts`;
      const testResponse = await fetch(testUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${accessToken || ""}`,
        },
        body: new URLSearchParams({
          entityId: entityId || "",
          amount: "1.00",
          currency: "JOD",
          paymentType: "DB",
          testMode: "EXTERNAL",
        }).toString(),
      });

      connectivityTest = {
        status: testResponse.status,
        ok: testResponse.ok,
        message: testResponse.ok
          ? "Connection successful"
          : "Connection failed",
      };

      if (!testResponse.ok) {
        const errorText = await testResponse.text();
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.result?.code === "200.300.404") {
            issues.push({
              type: "error",
              message:
                "Environment mismatch confirmed - test entity ID with wrong environment",
              fix: "Ensure entity ID and base URL are from the same environment (both test or both production)",
            });
          }
        } catch {
          // Error parsing response
        }
      }
    } catch (error) {
      connectivityTest = {
        status: 0,
        ok: false,
        message: `Network error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  return NextResponse.json({
    status: issues.some((i) => i.type === "error")
      ? "error"
      : issues.some((i) => i.type === "warning")
      ? "warning"
      : "ok",
    environment: {
      entityId: entityId
        ? entityId.substring(0, 8) +
          "..." +
          entityId.substring(entityId.length - 4)
        : "Not set",
      entityIdLength: entityId?.length || 0,
      baseUrl,
      isTestEnvironment: isTestBaseUrl,
      accessTokenLength: accessToken?.length || 0,
    },
    issues,
    connectivityTest,
    recommendations: [
      "For test environment: use https://test.oppwa.com with 32-character entity ID",
      "Ensure entity ID and access token are from the same environment",
      "Checkout IDs expire after 20 minutes - complete payments quickly",
      "Use test card: 4200000000000000, exp: 12/25, cvv: 123",
    ],
  });
}
