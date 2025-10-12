"use server";

import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client();

// Predefined airports that should be the only options when airport-related terms are typed
const PREFERRED_AIRPORTS = [
  {
    description: "Queen Alia International Airport, Airport Road, Jordan",
    place_id: "ChIJX8WhXHJcGRUR1zfK1VUboqg", // Queen Alia International Airport
  },
  {
    description: "Aqaba International Airport, Airport Street, Aqaba, Jordan",
    place_id: "ChIJ1234567890abcdefgh", // Aqaba International Airport (formerly King Hussein)
  },
];

// Keywords that indicate user is looking for an airport
const AIRPORT_KEYWORDS = [
  "airport",
  "international airport",
  "queen alia",
  "queen alia airport",
  "alia",
  "international",
  "air port", // handle typos
  "airport road", // catch road references
  "airport street", // catch street references
];

function isAirportSearch(input: string): boolean {
  const lowerInput = input.toLowerCase().trim();

  // Check for exact keyword matches
  const hasKeyword = AIRPORT_KEYWORDS.some((keyword) =>
    lowerInput.includes(keyword.toLowerCase())
  );

  // More specific airport detection logic
  const hasSpecificAirportTerms =
    lowerInput.includes("airport") ||
    (lowerInput.includes("queen") && lowerInput.includes("alia")) ||
    lowerInput.includes("alia");

  console.log(`🔍 Airport search check for "${input}":`, {
    hasKeyword,
    hasSpecificAirportTerms,
    input: lowerInput,
  });

  return hasKeyword || hasSpecificAirportTerms;
}

function filterAirportResults(input: string) {
  const lowerInput = input.toLowerCase().trim();

  console.log(`🎯 Filtering airports for input: "${input}"`);

  return PREFERRED_AIRPORTS.filter((airport) => {
    const lowerDesc = airport.description.toLowerCase();

    // For Queen Alia searches, only return the actual airport, not roads
    if (
      (lowerInput.includes("queen") && lowerInput.includes("alia")) ||
      lowerInput.includes("alia")
    ) {
      const isQueenAliaAirport = lowerDesc.includes(
        "queen alia international airport"
      );
      console.log(
        `  Queen Alia check: "${airport.description}" -> ${isQueenAliaAirport}`
      );
      return isQueenAliaAirport;
    }

    // For general airport searches, return both
    if (lowerInput.includes("airport")) {
      console.log(`  General airport search: "${airport.description}" -> true`);
      return true;
    }

    // For city-specific searches
    if (lowerInput.includes("amman")) {
      const isAmmanAirport = lowerDesc.includes("amman");
      console.log(
        `  Amman check: "${airport.description}" -> ${isAmmanAirport}`
      );
      return isAmmanAirport;
    }

    if (lowerInput.includes("aqaba")) {
      const isAqabaAirport = lowerDesc.includes("aqaba");
      console.log(
        `  Aqaba check: "${airport.description}" -> ${isAqabaAirport}`
      );
      return isAqabaAirport;
    }

    // Default: check if input is contained in description
    const matches = lowerDesc.includes(lowerInput);
    console.log(`  Default check: "${airport.description}" -> ${matches}`);
    return matches;
  });
}

export const autocomplete = async (input: string) => {
  console.log("🔍 Autocomplete called with input:", input);

  if (!input) {
    console.log("❌ No input provided");
    return { results: [], error: null, debug: "No input provided" };
  }

  // Check if this is an airport search
  if (isAirportSearch(input)) {
    console.log("✈️ Airport search detected, using predefined airports");
    const airportResults = filterAirportResults(input);
    console.log(
      `✅ Filtered to ${airportResults.length} airport(s):`,
      airportResults
    );

    return {
      results: airportResults,
      error: null,
      debug: `Airport search: Found ${airportResults.length} matching airports`,
    };
  } else {
    console.log("🏢 Regular location search, using Google Places API");
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
    console.log("🌐 Making Google Places API request for regular location...");
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

    // Normalize certain airport names from Google to our canonical naming
    const normalizeDescription = (desc: string) => {
      const lower = desc.toLowerCase();
      if (lower.includes("queen alia international airport")) {
        return "Queen Alia International Airport, Airport Road, Jordan";
      }
      if (lower.includes("king hussein international airport")) {
        return "Aqaba International Airport, Airport Street, Aqaba, Jordan";
      }
      return desc;
    };

    const results = response.data.predictions.map((prediction) => ({
      description: normalizeDescription(prediction.description),
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
