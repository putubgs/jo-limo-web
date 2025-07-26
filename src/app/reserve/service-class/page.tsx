"use client";

import { useEffect, Suspense, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PersonIcon from "@mui/icons-material/Person";
import LuggageIcon from "@mui/icons-material/Luggage";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useReservationStore } from "@/lib/reservation-store";
import { calculateDistanceAndTime } from "@/lib/distance-calculator";

function ServiceClassContent() {
  const router = useRouter();
  const { reservationData, setReservationData } = useReservationStore();
  const [selectedService, setSelectedService] = useState<string>("");
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [distanceInfo, setDistanceInfo] = useState<{
    distance: string;
    duration: string;
  } | null>(null);

  // Use data from Zustand store instead of URL params
  const bookingData = reservationData;

  useEffect(() => {
    console.log("=== SERVICE CLASS DEBUG ===");
    console.log("Booking data from store:", bookingData);
    console.log("Booking data received:", {
      type: bookingData.type,
      duration: bookingData.duration,
    });
  }, [bookingData]);

  // Calculate distance when pickup and dropoff are available
  useEffect(() => {
    if (bookingData.pickup && bookingData.dropoff) {
      calculateDistanceAndTime(bookingData.pickup, bookingData.dropoff)
        .then((result) => {
          if (result) {
            setDistanceInfo({
              distance: result.distance,
              duration: result.duration,
            });
          }
        })
        .catch((error) => {
          console.error("Failed to calculate distance:", error);
        });
    }
  }, [bookingData.pickup, bookingData.dropoff]);

  // Pricing calculation function
  const calculatePrice = (serviceType: string) => {
    // If it's one-way booking, return 0 for now
    if (bookingData.type === "one-way") {
      return 0;
    }

    // Check if we have duration data
    if (!bookingData.duration) {
      console.log(`❌ No duration data for ${serviceType}, returning 0`);
      return 0;
    }

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

    const duration = bookingData.duration;

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
    return 0;
  };

  // Step indicator component
  const StepIndicator = () => (
    <div className="relative w-full max-w-[550px] mx-auto py-8">
      {/* Background line - absolute positioned behind */}
      <div className="absolute top-10 left-12 right-8 h-0.5 bg-gray-300 transform -translate-y-1/2 w-[440px]"></div>

      {/* Flex container for bullets and text - in front */}
      <div className="relative flex justify-between items-center">
        {/* Step 1 - Current */}
        <div className="flex flex-col items-center">
          <div className="w-4 h-4 rounded-full bg-black mb-2"></div>
          <span className="text-sm font-bold text-black bg-[#F0F0F0] rounded-full p-1 px-2">
            Service Class
          </span>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col items-center">
          <div className="w-4 h-4 rounded-full border-2 border-gray-300 bg-white mb-2"></div>
          <span className="text-sm text-gray-500 p-1">Pick-up Info</span>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col items-center">
          <div className="w-4 h-4 rounded-full border-2 border-gray-300 bg-white mb-2"></div>
          <span className="text-sm text-gray-500 p-1">Payment & Checkout</span>
        </div>
      </div>
    </div>
  );

  const formatDisplayDate = (dateStr: string, timeStr: string) => {
    if (!dateStr || !timeStr) {
      return "Please select date and time";
    }
    return `${dateStr} at ${timeStr} (GMT +3)`;
  };

  const getDisplayLocations = () => {
    if (bookingData.type === "by-hour") {
      return {
        from: bookingData.pickup || "Please select location",
        to: "Round trip from starting location",
      };
    } else {
      return {
        from: bookingData.pickup || "Please select pickup location",
        to: bookingData.dropoff || "Please select dropoff location",
      };
    }
  };

  const locations = getDisplayLocations();

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white flex flex-col my-[50px]">
        {/* Header */}
        <StepIndicator />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-[#F0F0F0] rounded-lg shadow-sm p-6">
            <div className="flex justify-start items-center">
              <div className="text-left">
                <p className="font-bold text-black text-lg">
                  {formatDisplayDate(bookingData.date, bookingData.time)}
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-base" style={{ color: "#A4A4A4" }}>
                    {locations.from}
                  </span>
                  <span className="mx-4 text-2xl text-gray-600">→</span>
                  <span className="text-base" style={{ color: "#A4A4A4" }}>
                    {locations.to}
                  </span>
                </div>
                {distanceInfo && (
                  <div className="mt-3">
                    <p className="text-sm" style={{ color: "#A4A4A4" }}>
                      An estimated travel time of {distanceInfo.duration} to the
                      destination • {distanceInfo.distance}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="px-6">
          {/* Service Class Selection */}
          <div className="max-w-4xl px-6 mb-8 mx-auto">
            <p className="text-gray-500 text-sm mb-3">
              All price included VAT, fees, and tolls
            </p>

            <div className="">
              {/* EXECUTIVE */}
              <div
                className={`border rounded-t-lg p-6 transition-colors cursor-pointer ${
                  selectedService === "executive"
                    ? "border-black border-2"
                    : "border-gray-300 hover:border-black"
                }`}
                onClick={() => setSelectedService("executive")}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-12">
                    <Image
                      src="/images/mercedes_bens_img.png"
                      alt="Executive Vehicle"
                      width={147}
                      height={64}
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-black mb-1">
                        EXECUTIVE
                      </h3>
                      <p
                        className={`mb-2 ${
                          selectedService === "executive"
                            ? "text-black"
                            : "text-gray-600"
                        }`}
                      >
                        Mercedes E-Class or similar
                      </p>
                      <div className="flex items-center space-x-4 text-[#B2B2B2] text-sm">
                        <div className="flex items-center space-x-1">
                          <PersonIcon fontSize="small" />
                          <span>3</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <LuggageIcon fontSize="small" />
                          <span>2-3</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right pb-12">
                    <div className="text-[16px] font-bold text-black">
                      {calculatePrice("executive")} JOD
                    </div>
                  </div>
                </div>
              </div>

              {/* LUXURY */}
              <div
                className={`border p-6 transition-colors cursor-pointer ${
                  selectedService === "luxury"
                    ? "border-black border-2"
                    : "border-gray-300 hover:border-black"
                }`}
                onClick={() => setSelectedService("luxury")}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-12">
                    <Image
                      src="/images/luxury.png"
                      alt="Luxury Vehicle"
                      width={147}
                      height={64}
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-black mb-1">
                        LUXURY
                      </h3>
                      <p
                        className={`mb-2 ${
                          selectedService === "luxury"
                            ? "text-black"
                            : "text-gray-600"
                        }`}
                      >
                        Mercedes S-Class or similar
                      </p>
                      <div className="flex items-center space-x-4 text-[#B2B2B2] text-sm">
                        <div className="flex items-center space-x-1">
                          <PersonIcon fontSize="small" />
                          <span>3</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <LuggageIcon fontSize="small" />
                          <span>2-3</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right pb-12">
                    <div className="text-[16px] font-bold text-black">
                      {calculatePrice("luxury")} JOD
                    </div>
                  </div>
                </div>
              </div>

              {/* MPV */}
              <div
                className={`border p-6 transition-colors cursor-pointer ${
                  selectedService === "mpv"
                    ? "border-black border-2"
                    : "border-gray-300 hover:border-black"
                }`}
                onClick={() => setSelectedService("mpv")}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-12">
                    <Image
                      src="/images/mercedes_img.png"
                      alt="MPV Vehicle"
                      width={147}
                      height={64}
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-black mb-1">
                        MPV
                      </h3>
                      <p
                        className={`mb-2 ${
                          selectedService === "mpv"
                            ? "text-black"
                            : "text-gray-600"
                        }`}
                      >
                        Mercedes V-Class or similar
                      </p>
                      <div className="flex items-center space-x-4 text-[#B2B2B2] text-sm">
                        <div className="flex items-center space-x-1">
                          <PersonIcon fontSize="small" />
                          <span>6</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <LuggageIcon fontSize="small" />
                          <span>5-6</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right pb-12">
                    <div className="text-[16px] font-bold text-black">
                      {calculatePrice("mpv")} JOD
                    </div>
                  </div>
                </div>
              </div>

              {/* SUV */}
              <div
                className={`border rounded-b-lg p-6 transition-colors cursor-pointer ${
                  selectedService === "suv"
                    ? "border-black border-2"
                    : "border-gray-300 hover:border-black"
                }`}
                onClick={() => setSelectedService("suv")}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-12">
                    <Image
                      src="/images/cadilac_img.png"
                      alt="SUV Vehicle"
                      width={147}
                      height={64}
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-black mb-1">
                        SUV
                      </h3>
                      <p
                        className={`mb-2 ${
                          selectedService === "suv"
                            ? "text-black"
                            : "text-gray-600"
                        }`}
                      >
                        Cadillac Escalade or similar
                      </p>
                      <div className="flex items-center space-x-4 text-[#B2B2B2] text-sm">
                        <div className="flex items-center space-x-1">
                          <PersonIcon fontSize="small" />
                          <span>5</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <LuggageIcon fontSize="small" />
                          <span>4-5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right pb-12">
                    <div className="text-[16px] font-bold text-black">
                      {calculatePrice("suv")} JOD
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* All Classes Include */}
          <div className="max-w-4xl px-6 mx-auto">
            <div className="border border-gray-300 rounded-t-lg p-6">
              <h3 className="text-[14px] text-[#ACACAC] mb-4 text-start">
                All Classes include :
              </h3>
              <div className="space-y-3 text-start">
                <div className="flex items-start">
                  <CheckCircleIcon
                    className="text-gray-700 mr-3 mt-0.5"
                    fontSize="small"
                  />
                  <span className="text-[16px] text-gray-600">
                    Free 60 minutes wait time for airport pickups, 15 mins for
                    all others
                  </span>
                </div>
                <div className="flex items-start">
                  <CheckCircleIcon
                    className="text-gray-700 mr-3 mt-0.5"
                    fontSize="small"
                  />
                  <span className="text-[16px] text-gray-600">
                    Include meet and greet
                  </span>
                </div>
                <div className="flex items-start">
                  <CheckCircleIcon
                    className="text-gray-700 mr-3 mt-0.5"
                    fontSize="small"
                  />
                  <span className="text-[16px] text-gray-600">
                    Free cancellation up until 1 hour before pickup
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Please Note */}
          <div className="max-w-4xl px-6 mb-8 mx-auto">
            <div className="border border-gray-300 rounded-b-lg p-6">
              <h3 className="text-[14px] text-[#ACACAC] mb-4 text-start">
                Please note :
              </h3>
              <div className="space-y-3 text-start">
                <div className="flex items-start">
                  <InfoIcon
                    className="text-gray-700 mr-3 mt-0.5"
                    fontSize="small"
                  />
                  <span className="text-[16px] text-gray-600">
                    Guest/luggage capacities must be abided by for safety
                    reasons. If you are unsure, select a larger class as
                    chauffeurs may turn down service when they are exceeded.
                  </span>
                </div>
                <div className="flex items-start">
                  <InfoIcon
                    className="text-gray-700 mr-3 mt-0.5"
                    fontSize="small"
                  />
                  <span className="text-[16px] text-gray-600">
                    The vehicle images above are examples. You may get a
                    different vehicle of similar quality.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Terms & Continue Button */}
          <div className="flex items-center justify-center space-x-12">
            <button
              onClick={() => setShowTermsPopup(true)}
              className="text-[16px] text-[#7C7C7C] underline hover:text-gray-600 transition-colors"
            >
              View terms & condition
            </button>

            <button
              onClick={() => {
                if (selectedService) {
                  // Save selected service to store
                  setReservationData({ selectedClass: selectedService });
                  // Navigate to pick-up info (next step in the flow)
                  router.push("/reserve/pick-up-info");
                }
              }}
              disabled={!selectedService}
              className={`text-white text-center w-[275px] py-4 rounded-lg font-medium transition-colors ${
                selectedService
                  ? "bg-[#ABABAB] hover:bg-gray-800"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </div>

          {/* Terms & Conditions Popup */}
          {showTermsPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-black mb-4">
                    Terms & Conditions
                  </h3>
                  <p className="text-gray-600 mb-6">Content is coming soon</p>
                  <button
                    onClick={() => setShowTermsPopup(false)}
                    className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function ServiceClassPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ServiceClassContent />
    </Suspense>
  );
}
