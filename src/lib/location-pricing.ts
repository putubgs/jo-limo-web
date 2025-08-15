import { LocationMatch } from "./location-filter";

export interface RoutePricing {
  route: string;
  executive: number;
  luxury: number;
  mpv: number;
  suv: number;
}

// Location-based pricing for one-way transfers
export const LOCATION_PRICING: RoutePricing[] = [
  // Amman to destinations
  { route: "Amman to Dead Sea", executive: 45, luxury: 90, mpv: 95, suv: 110 },
  { route: "Amman to Petra", executive: 177, luxury: 295, mpv: 305, suv: 284 },
  {
    route: "Amman to Wadi Rum",
    executive: 195,
    luxury: 340,
    mpv: 359,
    suv: 298,
  },
  { route: "Amman to Aqaba", executive: 202, luxury: 353, mpv: 372, suv: 319 },
  {
    route: "Amman to Baptism site",
    executive: 61,
    luxury: 191,
    mpv: 202,
    suv: 151,
  },
  {
    route: "Amman to Wadi Mujib",
    executive: 78,
    luxury: 198,
    mpv: 202,
    suv: 227,
  },
  { route: "Amman to Madaba", executive: 34, luxury: 106, mpv: 95, suv: 106 },
  {
    route: "Amman to Dessert Castle",
    executive: 93,
    luxury: 198,
    mpv: 202,
    suv: 267,
  },
  {
    route: "Amman to Dana Nature Reserve",
    executive: 166,
    luxury: 276,
    mpv: 287,
    suv: 202,
  },
  {
    route: "Amman to Ma'in Hot Springs",
    executive: 85,
    luxury: 184,
    mpv: 177,
    suv: 163,
  },
  { route: "Amman to Jerash", executive: 119, luxury: 221, mpv: 187, suv: 164 },
  { route: "Amman to Ajloun", executive: 131, luxury: 237, mpv: 198, suv: 191 },
  {
    route: "Amman to Al Ramtha",
    executive: 131,
    luxury: 237,
    mpv: 198,
    suv: 191,
  },
  {
    route: "Amman to Um Qais",
    executive: 149,
    luxury: 266,
    mpv: 227,
    suv: 269,
  },
  { route: "Amman to Anjara", executive: 134, luxury: 241, mpv: 202, suv: 195 },
  { route: "Amman to Irbid", executive: 126, luxury: 211, mpv: 187, suv: 217 },
  { route: "Amman to Amman", executive: 12, luxury: 28, mpv: 36, suv: 26 },
  { route: "Aqaba to Aqaba", executive: 8, luxury: 27, mpv: 34, suv: 25 },

  // Airport routes (only to their respective cities)
  {
    route: "Queen Alia International Airport to Amman",
    executive: 35,
    luxury: 85,
    mpv: 90,
    suv: 75,
  },
  {
    route: "Amman to Queen Alia International Airport",
    executive: 30,
    luxury: 70,
    mpv: 80,
    suv: 65,
  },
  {
    route: "King Hussein International Airport to Aqaba",
    executive: 15,
    luxury: 40,
    mpv: 45,
    suv: 35,
  },
  {
    route: "King Hussein International Airport to Tala Bay",
    executive: 30,
    luxury: 75,
    mpv: 85,
    suv: 70,
  },

  // Border crossing routes
  {
    route: "King Hussein Bridge to Amman",
    executive: 35,
    luxury: 85,
    mpv: 90,
    suv: 75,
  },
  {
    route: "Sheikh Hussein Bridge to Amman",
    executive: 30,
    luxury: 70,
    mpv: 80,
    suv: 65,
  },
  { route: "Wadi Araba to Aqaba", executive: 30, luxury: 70, mpv: 80, suv: 65 },
];

// Airport to city mapping for pricing equivalency
const AIRPORT_CITY_MAPPING: Record<string, string> = {
  "Queen Alia International Airport": "Amman",
  "King Hussein International Airport": "Aqaba",
};

// Helper function to create route string from pickup and dropoff locations
export function createRouteString(
  pickupLocation: LocationMatch | null,
  dropoffLocation: LocationMatch | null
): string {
  if (!pickupLocation || !dropoffLocation) {
    return "";
  }

  return `${pickupLocation.name} to ${dropoffLocation.name}`;
}

// Helper function to create reverse route string
function createReverseRouteString(
  pickupLocation: LocationMatch | null,
  dropoffLocation: LocationMatch | null
): string {
  if (!pickupLocation || !dropoffLocation) {
    return "";
  }

  return `${dropoffLocation.name} to ${pickupLocation.name}`;
}

// Helper function to check if a route should allow reverse lookup
function shouldAllowReverseLookup(routeString: string): boolean {
  const reverseRoute = routeString.split(" to ").reverse().join(" to ");

  const hasOriginal = LOCATION_PRICING.some(
    (route) => route.route === routeString
  );
  const hasReverse = LOCATION_PRICING.some(
    (route) => route.route === reverseRoute
  );

  return !(hasOriginal && hasReverse);
}

// Helper function to get equivalent city route for airport pricing
function getAirportEquivalentRoute(
  pickupLocation: LocationMatch | null,
  dropoffLocation: LocationMatch | null
): string | null {
  if (!pickupLocation || !dropoffLocation) {
    return null;
  }

  const pickupName = pickupLocation.name;
  const dropoffName = dropoffLocation.name;

  const pickupIsAirport = AIRPORT_CITY_MAPPING[pickupName];
  const dropoffIsAirport = AIRPORT_CITY_MAPPING[dropoffName];

  // Case 1: Airport to Airport
  if (pickupIsAirport && dropoffIsAirport) {
    const equivalentPickupCity = AIRPORT_CITY_MAPPING[pickupName];
    const equivalentDropoffCity = AIRPORT_CITY_MAPPING[dropoffName];
    return `${equivalentPickupCity} to ${equivalentDropoffCity}`;
  }

  // Case 2: Airport to City (but not the airport's main city)
  if (pickupIsAirport && !dropoffIsAirport) {
    const equivalentCity = AIRPORT_CITY_MAPPING[pickupName];

    // If destination is not the airport's main city, use city-to-city pricing
    if (dropoffName !== equivalentCity) {
      return `${equivalentCity} to ${dropoffName}`;
    }
  }

  // Case 3: City to Airport (but not the airport's main city)
  if (!pickupIsAirport && dropoffIsAirport) {
    const equivalentCity = AIRPORT_CITY_MAPPING[dropoffName];

    // If origin is not the airport's main city, use city-to-city pricing
    if (pickupName !== equivalentCity) {
      return `${pickupName} to ${equivalentCity}`;
    }
  }

  return null;
}

// Function to get pricing for a specific route
export function getRoutePricing(
  pickupLocation: LocationMatch | null,
  dropoffLocation: LocationMatch | null
): RoutePricing | null {
  if (!pickupLocation || !dropoffLocation) {
    return null;
  }

  const routeString = createRouteString(pickupLocation, dropoffLocation);

  // First, try to find exact match
  const exactMatch = LOCATION_PRICING.find(
    (route) => route.route === routeString
  );

  if (exactMatch) {
    console.log(`✅ Route pricing found: ${routeString}`);
    return exactMatch;
  }

  // Check for airport equivalent route (city-to-city pricing for airports)
  const airportEquivalentRoute = getAirportEquivalentRoute(
    pickupLocation,
    dropoffLocation
  );
  if (airportEquivalentRoute) {
    const airportMatch = LOCATION_PRICING.find(
      (route) => route.route === airportEquivalentRoute
    );

    if (airportMatch) {
      console.log(
        `✅ Airport equivalent pricing found: ${airportEquivalentRoute} (for ${routeString})`
      );
      return {
        ...airportMatch,
        route: routeString, // Return with the original route string
      };
    }
  }

  // If no exact match and reverse lookup is allowed, try reverse route
  if (shouldAllowReverseLookup(routeString)) {
    const reverseRouteString = createReverseRouteString(
      pickupLocation,
      dropoffLocation
    );

    const reverseMatch = LOCATION_PRICING.find(
      (route) => route.route === reverseRouteString
    );

    if (reverseMatch) {
      console.log(
        `✅ Reverse route pricing found: ${reverseRouteString} (for ${routeString})`
      );
      return {
        ...reverseMatch,
        route: routeString,
      };
    }

    // Also try reverse route for airport equivalent
    if (airportEquivalentRoute) {
      const reverseAirportEquivalent = airportEquivalentRoute
        .split(" to ")
        .reverse()
        .join(" to ");
      const reverseAirportMatch = LOCATION_PRICING.find(
        (route) => route.route === reverseAirportEquivalent
      );

      if (reverseAirportMatch) {
        console.log(
          `✅ Reverse airport equivalent pricing found: ${reverseAirportEquivalent} (for ${routeString})`
        );
        return {
          ...reverseAirportMatch,
          route: routeString,
        };
      }
    }
  }

  console.log(`❌ No pricing found for route: ${routeString}`);
  return null;
}

// Function to check if a route is supported
export function isRouteSupported(
  pickupLocation: LocationMatch | null,
  dropoffLocation: LocationMatch | null
): boolean {
  return getRoutePricing(pickupLocation, dropoffLocation) !== null;
}

// Function to get price for specific service class and route
export function getPriceForService(
  serviceType: string,
  pickupLocation: LocationMatch | null,
  dropoffLocation: LocationMatch | null
): number {
  const routePricing = getRoutePricing(pickupLocation, dropoffLocation);

  if (!routePricing) {
    return 0;
  }

  switch (serviceType.toLowerCase()) {
    case "executive":
      return routePricing.executive;
    case "luxury":
      return routePricing.luxury;
    case "mpv":
      return routePricing.mpv;
    case "suv":
      return routePricing.suv;
    default:
      return 0;
  }
}
