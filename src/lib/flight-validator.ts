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
  flightNumber: string,
  bookingDate: string,
  bookingTime: string,
  isPickupAirport: boolean = false
): Promise<FlightValidationResult> => {
  try {
    // Clean flight number (remove spaces, convert to uppercase)
    const cleanFlightNumber = flightNumber.replace(/\s+/g, "").toUpperCase();

    if (!cleanFlightNumber) {
      return {
        isValid: false,
        flightFound: false,
        message: "Please enter a flight number",
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
        message: "Flight number not found. Please verify the flight number.",
      };
    }

    // Find flight that matches the booking date
    const bookingDateObj = new Date(bookingDate);
    const matchingFlight = data.data.find((flight) => {
      if (!flight.DATE) return false;

      const flightDate = new Date(flight.DATE);
      return flightDate.toDateString() === bookingDateObj.toDateString();
    });

    if (!matchingFlight) {
      return {
        isValid: false,
        flightFound: true,
        message: `Flight ${cleanFlightNumber} not found for ${bookingDate}. Please check the date.`,
      };
    }

    // Validate flight route (from/to countries)
    const flightFrom = matchingFlight.FROM;
    const flightTo = matchingFlight.TO;

    // Check if flight route makes sense for Jordan
    const isJordanRoute =
      flightFrom.includes("Amman") ||
      flightTo.includes("Amman") ||
      flightFrom.includes("AMM") ||
      flightTo.includes("AMM");

    if (!isJordanRoute) {
      return {
        isValid: false,
        flightFound: true,
        message: `Flight ${cleanFlightNumber} route ${flightFrom} → ${flightTo} doesn't include Jordan. Please verify the flight number.`,
      };
    }

    // Additional validation: Check if flight direction matches the booking type
    const isFlightToJordan =
      flightTo.includes("Amman") || flightTo.includes("AMM");
    const isFlightFromJordan =
      flightFrom.includes("Amman") || flightFrom.includes("AMM");

    if (isPickupAirport && !isFlightToJordan) {
      return {
        isValid: false,
        flightFound: true,
        message: `Flight ${cleanFlightNumber} route ${flightFrom} → ${flightTo} is not arriving in Jordan. For airport pickup, please enter an arrival flight.`,
      };
    }

    if (!isPickupAirport && !isFlightFromJordan) {
      return {
        isValid: false,
        flightFound: true,
        message: `Flight ${cleanFlightNumber} route ${flightFrom} → ${flightTo} is not departing from Jordan. For airport dropoff, please enter a departure flight.`,
      };
    }

    // Check if flight time is reasonable (within 2 hours of booking time)
    const bookingTimeObj = new Date(`${bookingDate}T${bookingTime}`);

    // Use arrival time for pickup airports (flight coming TO Jordan), departure time for dropoff airports (flight going FROM Jordan)
    const flightTime = isPickupAirport
      ? matchingFlight.STA // Arrival time when picking up from airport
      : matchingFlight.STD; // Departure time when dropping off to airport
    const flightTimeLabel = isPickupAirport ? "arrives" : "departs";
    const flightTimeObj = new Date(`${bookingDate}T${flightTime}`);

    const timeDifference = Math.abs(
      bookingTimeObj.getTime() - flightTimeObj.getTime()
    );
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    if (hoursDifference > 2) {
      return {
        isValid: false,
        flightFound: true,
        message: `Flight ${cleanFlightNumber} (${flightFrom} → ${flightTo}) ${flightTimeLabel} at ${flightTime}, which doesn't match your booking time. Please verify the time.`,
      };
    }

    // Flight is valid
    return {
      isValid: true,
      flightFound: true,
      message: `Flight ${cleanFlightNumber} confirmed: ${flightFrom} → ${flightTo} on ${matchingFlight.DATE} - ${flightTimeLabel} at ${flightTime}`,
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
