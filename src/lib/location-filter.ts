// locationFilter.ts - Updated with bridge crossings
export interface LocationMatch {
  code: string;
  name: string;
  matchedText: string;
}

export const LOCATION_MAPPINGS = {
  Amman: ["amman"],
  Jerash: ["jerash"],
  Ajloun: ["ajloun"],
  "Al Ramtha": ["al ramtha", "ramtha"],
  "Um Qais": ["um qais", "umm qais"],
  Anjara: ["anjara"],
  "Wadi Araba": ["wadi araba"],
  // "Aqaba City": ["aqaba city"],
  "Dead Sea": ["dead sea"],
  Petra: ["petra"],
  "Tala Bay": ["tala bay"],
  "Wadi Rum": ["wadi rum"],
  Aqaba: ["aqaba"],
  "Baptism site": ["baptism site", "baptism"],
  "Wadi Mujib": ["wadi mujib"],
  Madaba: ["madaba"],
  Irbid: ["irbid"],
  "Dessert Castle": ["dessert castle", "desert castle"],
  "Dana Nature Reserve": ["dana nature reserve", "dana"],
  "Ma'in Hot Springs": ["ma'in hot springs", "main hot springs"],
  // Added bridge crossings
  "King Hussein Bridge": [
    "king hussein bridge",
    "allenby bridge",
    "khb",
    "king hussein crossing",
    "allenby crossing",
    "jordan river crossing allenby",
  ],
  "Sheikh Hussein Bridge": [
    "sheikh hussein bridge",
    "sheik hussein bridge",
    "b1r",
    "sheikh hussein crossing",
    "sheik hussein crossing",
    "jordan river crossing north",
    "northern border crossing",
  ],
} as const;

export const AIRPORT_MAPPINGS = {
  QAIA: "Queen Alia International Airport, Desert Highway, Amman, Jordan",
  AQJ: "Aqaba International Airport, Airport Street, Aqaba, Jordan",
} as const;

// Bridge specific mappings with codes
export const BRIDGE_MAPPINGS = {
  KHB: "King Hussein Bridge",
  B1R: "Sheikh Hussein Bridge",
} as const;

export function filterLocations(
  text: string,
  logPrefix: string = "LOCATION"
): LocationMatch[] {
  console.log(`\n🔍 [${logPrefix}] Filtering: "${text}"`);

  if (!text) return [];

  const matches: LocationMatch[] = [];
  const normalizedText = text.toLowerCase().trim();

  // Check airports first (exact match required)
  Object.entries(AIRPORT_MAPPINGS).forEach(([code, exactMatch]) => {
    if (text.trim() === exactMatch) {
      matches.push({
        code,
        name:
          code === "QAIA"
            ? "Queen Alia International Airport"
            : "Aqaba International Airport",
        matchedText: exactMatch,
      });
      console.log(`✅ [${logPrefix}] Airport match: ${code}`);
    }
  });

  // Check general locations if no airport match
  if (matches.length === 0) {
    Object.entries(LOCATION_MAPPINGS).forEach(([locationName, searchTerms]) => {
      searchTerms.forEach((term) => {
        if (normalizedText.includes(term.toLowerCase())) {
          const existingMatch = matches.find((m) => m.name === locationName);
          if (!existingMatch) {
            // Special handling for bridges to use their specific codes
            let locationCode = locationName.toUpperCase().replace(/\s+/g, "_");
            if (locationName === "King Hussein Bridge") {
              locationCode = "KHB";
            } else if (locationName === "Sheikh Hussein Bridge") {
              locationCode = "B1R";
            }

            matches.push({
              code: locationCode,
              name: locationName,
              matchedText: term,
            });
            console.log(
              `✅ [${logPrefix}] Location match: ${locationName} (${locationCode})`
            );
          }
        }
      });
    });
  }

  console.log(`📊 [${logPrefix}] Found ${matches.length} matches`);
  return matches;
}

export function getPrimaryLocation(text: string): LocationMatch | null {
  const matches = filterLocations(text);
  return matches.length > 0 ? matches[0] : null;
}

// Helper function to check if location is a border crossing
export function isBorderCrossing(locationMatch: LocationMatch): boolean {
  return locationMatch.code === "KHB" || locationMatch.code === "B1R";
}

// Helper function to get bridge code from name
export function getBridgeCode(bridgeName: string): string | null {
  switch (bridgeName.toLowerCase()) {
    case "king hussein bridge":
      return "KHB";
    case "sheikh hussein bridge":
      return "B1R";
    default:
      return null;
  }
}

// Get all supported bridge locations
export function getBridgeLocations(): LocationMatch[] {
  return [
    {
      code: "KHB",
      name: "King Hussein Bridge",
      matchedText: "king hussein bridge",
    },
    {
      code: "B1R",
      name: "Sheikh Hussein Bridge",
      matchedText: "sheikh hussein bridge",
    },
  ];
}
