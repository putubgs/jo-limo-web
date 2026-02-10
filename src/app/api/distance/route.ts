import { NextRequest, NextResponse } from "next/server";

// Simple rate limiting (in production, use Redis or similar)
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 100; // requests per hour per IP
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = requestCounts.get(ip);
  
  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT) {
    return false;
  }
  
  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting

    // const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { origins, destinations } = body;

    if (
      !origins ||
      !destinations ||
      origins.length === 0 ||
      destinations.length === 0
    ) {
      return NextResponse.json(
        { error: "Origins and destinations are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      console.error("Google Maps API key not configured");
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    // Construct the Distance Matrix API URL
    const baseUrl = "https://maps.googleapis.com/maps/api/distancematrix/json";
    const params = new URLSearchParams({
      origins: origins.join("|"),
      destinations: destinations.join("|"),
      units: "metric",
      mode: "driving",
      key: apiKey,
    });

    const url = `${baseUrl}?${params.toString()}`;

    console.log(
      "Calling Distance Matrix API for:",
      origins[0],
      "→",
      destinations[0]
    );

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Google API responded with status: ${response.status}`);
    }

    const data = await response.json();

    console.log("Distance Matrix API response:", {
      status: data.status,
      hasResults: data.rows?.[0]?.elements?.[0]?.status,
      errorMessage: data.error_message,
    });

    // Check for API-level errors
    if (data.status !== "OK") {
      console.error(
        `Google Distance Matrix API error: ${data.status} - ${data.error_message}`
      );
      return NextResponse.json(
        {
          error: `Google API error: ${data.status}`,
          details: data.error_message,
        },
        { status: 400 }
      );
    }

    // Check for element-level errors
    const element = data.rows?.[0]?.elements?.[0];
    if (element?.status !== "OK") {
      console.error(`Distance calculation failed: ${element?.status}`);
      return NextResponse.json(
        {
          error: `Route calculation failed: ${element?.status}`,
          details:
            element?.status === "NOT_FOUND"
              ? "One or both locations not found"
              : element?.status === "ZERO_RESULTS"
              ? "No route found between locations"
              : "Unknown error",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Distance Matrix API error:", error);
    return NextResponse.json(
      { error: "Failed to calculate distance" },
      { status: 500 }
    );
  }
}
