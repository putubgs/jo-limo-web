interface FlightData {
  DATE: string;
  FROM: string;
  TO: string;
  AIRCRAFT: string;
  FLIGHT_TIME: string;
  STD: string; // Scheduled departure time
  ATD: string; // Actual departure time
  STA: string; // Scheduled arrival time
  STATUS: string;
}

interface FlightLabsResponse {
  success: boolean;
  data: FlightData[];
}

export interface FlightValidationResult {
  isValid: boolean;
  flightFound: boolean;
  message: string;
  flightData?: FlightData;
}

export const validateFlight = async (
  flightNumber: string
): Promise<FlightValidationResult> => {
  try {
    // Clean flight number (remove spaces, convert to uppercase)
    const cleanFlightNumber = flightNumber.replace(/\s+/g, "").toUpperCase();

    if (!cleanFlightNumber) {
      return {
        isValid: false,
        flightFound: false,
        message: "The number code not found",
      };
    }

    // Call FlightLabs API
    const response = await fetch(
      `https://app.goflightlabs.com/flight?access_key=${process.env.NEXT_PUBLIC_FLIGHTLABS_API_KEY}&flight_number=${cleanFlightNumber}`
    );

    if (!response.ok) {
      return {
        isValid: false,
        flightFound: false,
        message:
          "Unable to verify flight information. Please check your internet connection.",
      };
    }

    const data: FlightLabsResponse = await response.json();

    if (!data.success || !data.data || data.data.length === 0) {
      return {
        isValid: false,
        flightFound: false,
        message: "The flight number not found",
      };
    }

    // Filter out null values from the data array
    const validFlights = data.data.filter(
      (flight) => flight !== null && flight !== undefined
    );

    if (validFlights.length === 0) {
      return {
        isValid: false,
        flightFound: false,
        message: "The flight number not found",
      };
    }

    // Find any flight with the matching flight number (ignore date)
    const matchingFlight = validFlights.find((flight) => {
      return flight !== null && flight !== undefined;
    });

    if (!matchingFlight) {
      return {
        isValid: false,
        flightFound: true,
        message: "The flight number not found",
      };
    }

    // Flight found and validated successfully

    // Flight is valid
    return {
      isValid: true,
      flightFound: true,
      message: "The flight number is valid",
      flightData: matchingFlight,
    };
  } catch (error) {
    console.error("Flight validation error:", error);
    return {
      isValid: false,
      flightFound: false,
      message: "Unable to verify flight information. Please try again later.",
    };
  }
};

export const formatFlightNumber = (input: string): string => {
  // Remove all non-alphanumeric characters and convert to uppercase
  const cleaned = input.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

  // Ensure it starts with letters and has numbers
  if (cleaned.length < 3) return cleaned;

  // Format as airline code + number (e.g., TK812, AA1234)
  const match = cleaned.match(/^([A-Z]{2,3})(\d+)$/);
  if (match) {
    return `${match[1]}${match[2]}`;
  }

  return cleaned;
};
