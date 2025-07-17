"use server";

import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client();

export const autocomplete = async (input: string) => {
  console.log("🔍 Autocomplete called with input:", input);

  if (!input) {
    console.log("❌ No input provided");
    return { results: [], error: null, debug: "No input provided" };
  }

  if (!process.env.GOOGLE_API_KEY) {
    console.error("❌ GOOGLE_API_KEY not found in environment variables");
    return {
      results: [],
      error: "API key not configured",
      debug: "Missing GOOGLE_API_KEY",
    };
  }

  try {
    console.log("🌐 Making Google Places API request...");
    const response = await client.placeAutocomplete({
      params: {
        input,
        key: process.env.GOOGLE_API_KEY!,
        components: ["country:JO"],
      },
    });

    console.log("✅ Google API Response:", {
      status: response.status,
      predictions_count: response.data.predictions?.length || 0,
      first_prediction: response.data.predictions?.[0]?.description,
    });

    const results = response.data.predictions.map((prediction) => ({
      description: prediction.description,
      place_id: prediction.place_id,
    }));

    return {
      results,
      error: null,
      debug: `Found ${results.length} results`,
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const apiError = error as {
      response?: { data?: unknown; status?: number };
    };

    console.error("❌ Google Autocomplete Error:", {
      message: errorMessage,
      response: apiError.response?.data,
      status: apiError.response?.status,
    });
    return {
      results: [],
      error: errorMessage,
      debug: `API Error: ${apiError.response?.status || "Unknown"}`,
    };
  }
};
