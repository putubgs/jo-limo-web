import { getPriceForService } from "./location-pricing";
import { LocationMatch } from "./location-filter";

// Pricing calculation function for service classes
export const calculatePrice = (
  serviceType: string,
  bookingType: string,
  duration: string,
  pickupLocation?: LocationMatch | null,
  dropoffLocation?: LocationMatch | null
): number => {
  // If it's one-way booking, use location-based pricing
  if (bookingType === "one-way") {
    const price = getPriceForService(
      serviceType,
      pickupLocation || null,
      dropoffLocation || null
    );
    console.log(`✅ One-way pricing for ${serviceType}: ${price} JOD`);
    return price;
  }

  // Check if we have duration data
  if (!duration) {
    console.log(`❌ No duration data for ${serviceType}, returning 0`);
    return 0;
  }

  console.log(
    `🔍 PRICING DEBUG: serviceType=${serviceType}, bookingType=${bookingType}, duration="${duration}"`
  );

  // By-the-hour pricing structure
  const pricingStructure = {
    executive: {
      hourly: 25, // per hour for <= 3 hours
      halfDay: 120,
      fullDay: 180,
    },
    luxury: {
      hourly: 35, // per hour for <= 3 hours
      halfDay: 150,
      fullDay: 260,
    },
    mpv: {
      hourly: 45, // per hour for <= 3 hours
      halfDay: 170,
      fullDay: 300,
    },
    suv: {
      hourly: 30, // per hour for <= 3 hours
      halfDay: 120,
      fullDay: 200,
    },
  };

  const pricing =
    pricingStructure[serviceType as keyof typeof pricingStructure];

  if (!pricing) {
    return 0;
  }

  // Calculate based on duration
  if (duration === "Half Day") {
    console.log(`✅ ${serviceType}: Half Day = ${pricing.halfDay} JOD`);
    return pricing.halfDay;
  } else if (duration === "Full Day") {
    console.log(`✅ ${serviceType}: Full Day = ${pricing.fullDay} JOD`);
    return pricing.fullDay;
  } else if (duration.includes("hour")) {
    // Extract number of hours (1 hour, 2 hours, 3 hours)
    const hours = parseInt(duration.split(" ")[0]);
    const calculatedPrice = pricing.hourly * hours;
    console.log(
      `✅ ${serviceType}: ${hours} hours × ${pricing.hourly} = ${calculatedPrice} JOD`
    );
    return calculatedPrice;
  }

  console.log(`❌ Unknown duration pattern "${duration}" for ${serviceType}`);
  console.log(`🔍 FINAL RESULT: ${serviceType} = 0 JOD (unknown duration)`);
  return 0;
};
