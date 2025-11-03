"use server";

interface PlaceResult {
  description: string;
  place_id: string;
}

interface AutocompleteResponse {
  results: PlaceResult[];
  error: string | null;
  debug: string;
}

interface PlacePrediction {
  placeId: string;
  text: { text: string };
}

interface AutocompleteData {
  suggestions?: { placePrediction?: PlacePrediction }[];
}

const PREFERRED_AIRPORTS: PlaceResult[] = [
  {
    description: "Queen Alia International Airport, Airport Road, Jordan",
    place_id: "ChIJX8WhXHJcGRUR1zfK1VUboqg",
  },
  {
    description: "Aqaba International Airport, Airport Street, Aqaba, Jordan",
    place_id: "ChIJ1234567890abcdefgh",
  },
];

const AIRPORT_KEYWORDS = [
  "airport",
  "international airport",
  "queen alia",
  "queen alia airport",
  "alia",
  "international",
  "air port",
  "airport road",
  "airport street",
];

function isAirportSearch(input: string): boolean {
  const lower = input.toLowerCase();
  return (
    AIRPORT_KEYWORDS.some((k) => lower.includes(k)) ||
    lower.includes("queen alia")
  );
}

function filterAirportResults(input: string): PlaceResult[] {
  const lower = input.toLowerCase();
  return PREFERRED_AIRPORTS.filter((airport) => {
    const desc = airport.description.toLowerCase();
    if (lower.includes("queen alia")) {
      return desc.includes("queen alia");
    }
    if (lower.includes("amman")) return desc.includes("amman");
    if (lower.includes("aqaba")) return desc.includes("aqaba");
    if (lower.includes("airport")) return true;
    return desc.includes(lower);
  });
}

export async function autocomplete(
  input: string
): Promise<AutocompleteResponse> {
  console.log("🔍 Autocomplete called with input:", input);

  if (!input) {
    return { results: [], error: null, debug: "No input provided" };
  }

  if (isAirportSearch(input)) {
    const airportResults = filterAirportResults(input);
    return {
      results: airportResults,
      error: null,
      debug: `Airport search: Found ${airportResults.length} matching airports`,
    };
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return {
      results: [],
      error: "Missing GOOGLE_API_KEY",
      debug: "API key not configured",
    };
  }

  try {
    const response = await fetch(
      "https://places.googleapis.com/v1/places:autocomplete",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          // ✅ this field mask matches the new autocomplete schema
          "X-Goog-FieldMask":
            "suggestions.placePrediction.placeId,suggestions.placePrediction.text",
        },
        body: JSON.stringify({
          input,
          locationBias: {
            circle: {
              center: { latitude: 31.9539, longitude: 35.9106 },
              radius: 50000,
            },
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ Google Places API Error:", errText);
      throw new Error(`Places API responded with status ${response.status}`);
    }

    const data: AutocompleteData = await response.json();

    const results: PlaceResult[] =
      data.suggestions
        ?.filter((s) => !!s.placePrediction)
        .map((s) => ({
          description: s.placePrediction!.text.text,
          place_id: s.placePrediction!.placeId,
        })) ?? [];

    return {
      results,
      error: null,
      debug: `Found ${results.length} result(s) (new API schema)`,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("❌ Autocomplete failed:", message);
    return {
      results: [],
      error: message,
      debug: "Autocomplete API call failed",
    };
  }
}
