interface DistanceResult {
  distance: string;
  duration: string;
  distanceValue: number; // in meters
  durationValue: number; // in seconds
}

// Simple in-memory cache for distance calculations
const distanceCache = new Map<
  string,
  { result: DistanceResult; timestamp: number }
>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

function getCacheKey(origin: string, destination: string): string {
  return `${origin.toLowerCase().trim()}|${destination.toLowerCase().trim()}`;
}

function getCachedResult(
  origin: string,
  destination: string
): DistanceResult | null {
  const key = getCacheKey(origin, destination);
  const cached = distanceCache.get(key);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(
      `💾 Using cached distance: ${cached.result.duration} • ${cached.result.distance}`
    );
    return cached.result;
  }

  return null;
}

function setCachedResult(
  origin: string,
  destination: string,
  result: DistanceResult
): void {
  const key = getCacheKey(origin, destination);
  distanceCache.set(key, {
    result,
    timestamp: Date.now(),
  });
}

export async function calculateDistanceAndTime(
  origin: string,
  destination: string
): Promise<DistanceResult | null> {
  try {
    if (!origin || !destination) {
      console.log("Missing origin or destination for distance calculation");
      return null;
    }

    // Check cache first
    const cachedResult = getCachedResult(origin, destination);
    if (cachedResult) {
      return cachedResult;
    }

    console.log(`🚗 Calculating distance: ${origin} → ${destination}`);

    // Call backend API that uses Google Distance Matrix API
    const response = await fetch("/api/distance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        origins: [origin],
        destinations: [destination],
        units: "metric",
        mode: "driving",
        avoid_highways: false,
        avoid_tolls: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Distance API error: ${response.status} - ${errorText}`);
      return null;
    }

    const data = await response.json();
    console.log("📊 Distance Matrix API response:", data);

    if (
      data.status === "OK" &&
      data.rows?.[0]?.elements?.[0]?.status === "OK"
    ) {
      const element = data.rows[0].elements[0];

      const result = {
        distance: element.distance.text,
        duration: element.duration.text,
        distanceValue: element.distance.value,
        durationValue: element.duration.value,
      };

      console.log(
        `✅ Distance calculated: ${result.duration} • ${result.distance}`
      );

      // Cache the result
      setCachedResult(origin, destination, result);

      return result;
    } else {
      // Handle specific Google API errors
      const elementStatus = data.rows?.[0]?.elements?.[0]?.status;
      console.error(`Google Distance Matrix API error:`, {
        status: data.status,
        elementStatus,
        errorMessage: data.error_message,
      });

      if (elementStatus === "NOT_FOUND") {
        console.error("One or both locations not found by Google Maps");
      } else if (elementStatus === "ZERO_RESULTS") {
        console.error("No route found between the locations");
      }

      return null;
    }
  } catch (error) {
    console.error("Error calculating distance:", error);
    return null;
  }
}

// For actual Google Maps implementation, you would use:
/*
export async function calculateDistanceAndTimeWithGoogle(
  origin: string,
  destination: string
): Promise<DistanceResult | null> {
  try {
    const response = await fetch(`/api/distance?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`);
    const data = await response.json();
    
    if (data.status === 'OK' && data.rows[0]?.elements[0]?.status === 'OK') {
      const element = data.rows[0].elements[0];
      return {
        distance: element.distance.text,
        duration: element.duration.text,
        distanceValue: element.distance.value,
        durationValue: element.duration.value
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error calculating distance with Google Maps:', error);
    return null;
  }
}
*/
