"use client";

import { useEffect, Suspense, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PersonIcon from "@mui/icons-material/Person";
import LuggageIcon from "@mui/icons-material/Luggage";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";
import { useReservationStore, ServiceClass } from "@/lib/reservation-store";
import { calculateDistanceAndTime } from "@/lib/distance-calculator";
import { calculatePrice } from "@/lib/pricing-calculator";
import { isRouteSupported } from "@/lib/location-pricing";
import DataValidationError from "@/components/DataValidationError";
import TermsAndConditionsDialog from "@/components/dialogs/TermsAndConditionsDialog";

// Helper function to get current Jordan time + 1 hour
const getMinimumBookingTime = () => {
  // Get current time in Jordan timezone using Intl API
  const jordanTime = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Amman" })
  );

  // Add 2 hours buffer instead of 1 hour
  jordanTime.setHours(jordanTime.getHours() + 2);

  return jordanTime;
};

// Helper function to validate booking date and time
const validateBookingDateTime = (dateStr: string, timeStr: string): boolean => {
  if (!dateStr || !timeStr) {
    return false;
  }

  try {
    // Parse the booking date and time
    const bookingDateTime = new Date(`${dateStr} ${timeStr}`);

    // Check if the date is valid
    if (isNaN(bookingDateTime.getTime())) {
      console.error("Invalid date format:", dateStr, timeStr);
      return false;
    }

    // Get minimum allowed booking time (Jordan time + 1 hour)
    const minimumTime = getMinimumBookingTime();

    console.log("🕐 Date validation (Jordan timezone):", {
      bookingDateTime: bookingDateTime.toString(),
      minimumTime: minimumTime.toString(),
      isValid: bookingDateTime >= minimumTime,
    });

    return bookingDateTime >= minimumTime;
  } catch (error) {
    console.error("Error validating date/time:", error);
    return false;
  }
};

function ServiceClassContent() {
  const router = useRouter();
  const {
    reservationData,
    setSelectedServiceClass,
    getSelectedServiceClass,
    setReservationData,
    _hasHydrated,
  } = useReservationStore();

  // Initialize selectedService - will be set from store after hydration
  const [selectedService, setSelectedService] = useState<ServiceClass | "">("");
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [distanceInfo, setDistanceInfo] = useState<{
    distance: string;
    duration: string;
  } | null>(null);

  // Use data from Zustand store instead of URL params
  const bookingData = reservationData;

  // Hydrate selectedService from store after component mounts
  useEffect(() => {
    if (_hasHydrated) {
      const storedClass = getSelectedServiceClass();
      if (storedClass) {
        setSelectedService(storedClass);
      }
    }
  }, [_hasHydrated, getSelectedServiceClass]);

  // Simple validation - just check if we have the basic required data
  const hasLocationData = bookingData.pickup || bookingData.pickupLocation;
  const hasNoData = !bookingData.pickup && !bookingData.pickupLocation;

  // Date/time validation state
  const [isValidDateTime, setIsValidDateTime] = useState(true);
  const [isCheckingDateTime, setIsCheckingDateTime] = useState(false);

  // Check if all prices are 0 (location not served)
  const [, setPricingData] = useState<{
    [key: string]: { price: number; currency: string };
  }>({});
  const [locationNotServed, setLocationNotServed] = useState(false);
  // Initialize to true for one-way when text locations exist (prevents UI flash)
  const [isCheckingLocation, setIsCheckingLocation] = useState(
    bookingData.type === "one-way" &&
      !!bookingData.pickup &&
      !!bookingData.dropoff
  );

  // Debug logging
  console.log("=== CORPORATE SERVICE CLASS VALIDATION DEBUG ===");
  console.log("bookingData:", bookingData);
  console.log("hasLocationData:", hasLocationData);
  console.log("hasNoData:", hasNoData);
  console.log("locationNotServed:", locationNotServed);
  console.log("isCheckingLocation:", isCheckingLocation);

  // Validate date and time
  useEffect(() => {
    if (bookingData.date && bookingData.time) {
      setIsCheckingDateTime(true);

      // Add small delay to show loading state
      const timer = setTimeout(() => {
        const isValid = validateBookingDateTime(
          bookingData.date,
          bookingData.time
        );
        setIsValidDateTime(isValid);
        setIsCheckingDateTime(false);
      }, 500);

      return () => clearTimeout(timer);
    } else if (bookingData.date || bookingData.time) {
      // If only one is provided, it's invalid
      setIsValidDateTime(false);
      setIsCheckingDateTime(false);
    }
  }, [bookingData.date, bookingData.time]);

  // Fast pre-check: determine support synchronously to avoid flashing UI with 0 prices
  useEffect(() => {
    if (
      bookingData.type === "one-way" &&
      bookingData.pickup &&
      bookingData.dropoff
    ) {
      if (!bookingData.pickupLocation || !bookingData.dropoffLocation) {
        setLocationNotServed(true);
        setIsCheckingLocation(false);
        return;
      }
      const supported = isRouteSupported(
        bookingData.pickupLocation,
        bookingData.dropoffLocation
      );
      if (!supported) {
        setLocationNotServed(true);
        setIsCheckingLocation(false);
      }
    }
  }, [
    bookingData.pickupLocation,
    bookingData.dropoffLocation,
    bookingData.pickup,
    bookingData.dropoff,
    bookingData.type,
  ]);

  // Calculate pricing and check if location is served
  useEffect(() => {
    if (
      hasLocationData &&
      bookingData.pickupLocation &&
      bookingData.dropoffLocation
    ) {
      setIsCheckingLocation(true);

      calculateDistanceAndTime(
        bookingData.pickupLocation.name,
        bookingData.dropoffLocation.name
      )
        .then(() => {
          // Calculate pricing for each service class
          const serviceClasses = ["executive", "luxury", "mpv", "suv"];
          const pricing: {
            [key: string]: { price: number; currency: string };
          } = {};

          serviceClasses.forEach((serviceType) => {
            console.log(`🔍 Calculating price for ${serviceType}:`, {
              serviceType,
              bookingType: bookingData.type,
              duration: bookingData.duration,
              pickupLocation: bookingData.pickupLocation,
              dropoffLocation: bookingData.dropoffLocation,
            });

            const price = calculatePrice(
              serviceType,
              bookingData.type,
              bookingData.duration || "", // Use actual duration for hourly reservations
              bookingData.pickupLocation,
              bookingData.dropoffLocation
            );

            console.log(`💰 Price calculated for ${serviceType}: ${price} JOD`);
            pricing[serviceType] = { price, currency: "JOD" };
          });

          setPricingData(pricing);

          // Check if all prices are 0
          const allPricesZero = Object.values(pricing).every(
            (p) => p.price === 0
          );
          setLocationNotServed(allPricesZero);
          setIsCheckingLocation(false);
        })
        .catch((error) => {
          console.error("Error calculating pricing:", error);
          setLocationNotServed(true);
          setIsCheckingLocation(false);
        });
    }
  }, [
    hasLocationData,
    bookingData.pickupLocation,
    bookingData.dropoffLocation,
    bookingData.type,
    bookingData.duration,
  ]);

  useEffect(() => {
    console.log("=== SERVICE CLASS DEBUG ===");
    console.log("Booking data from store:", bookingData);
    console.log("Selected service from store:", getSelectedServiceClass());
    console.log("Booking data received:", {
      type: bookingData.type,
      duration: bookingData.duration,
    });
  }, [bookingData, getSelectedServiceClass]);

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
  }, [bookingData.pickup, bookingData.dropoff, bookingData.duration]);

  // Conditional rendering - show errors if needed
  // Show error if no data at all
  if (hasNoData) {
    return (
      <DataValidationError
        title="Page Error!"
        message="Please try again"
        backToHome={true}
      />
    );
  }

  // Show error if date/time is invalid (must be checked before location validation)
  if (!isValidDateTime && !isCheckingDateTime) {
    const minimumTime = getMinimumBookingTime();

    const formattedMinTime = `${
      minimumTime.getMonth() + 1
    }/${minimumTime.getDate()}/${minimumTime.getFullYear()}, ${minimumTime
      .getHours()
      .toString()
      .padStart(2, "0")}:${minimumTime
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    return (
      <DataValidationError
        title="Invalid Date/Time"
        message={`Please select a date and time that is at least 1 hour from now (Jordan time). Current minimum time: ${formattedMinTime}`}
        showBackButton={true}
        backToHome={false}
        grayBackButton={true}
      />
    );
  }

  // Show error if location not served
  if (locationNotServed) {
    return (
      <DataValidationError
        title="Location Not Served"
        message="We do not serve this location yet, please try different location"
        showBackButton={true}
        backToHome={false}
        grayBackButton={true}
      />
    );
  }

  // Show loading while checking location
  if (isCheckingLocation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking location availability...</p>
        </div>
      </div>
    );
  }

  // Step indicator component
  const StepIndicator = () => (
    <div className="relative w-full max-w-[550px] mx-auto md:py-8">
      {/* Background line - absolute positioned behind */}
      <div className="absolute md:top-10 top-[76px] left-12 right-8 h-0.5 transform -translate-y-1/2 md:w-[440px] w-[78vw]">
        <div className="md:hidden flex h-full">
          <div className="w-1/2 h-full bg-gray-300"></div>
          <div className="w-1/2 h-full bg-gray-300"></div>
        </div>
        <div className="hidden md:block w-full h-full bg-gray-300"></div>
      </div>

      <div className="flex md:hidden pb-8 px-8 justify-between items-center">
        <p className="text-[24px] font-bold">Service Class</p>
        <p>Step 1 of 3</p>
      </div>

      {/* Flex container for bullets and text - in front */}
      <div className="relative flex justify-between items-center px-8 md:px-0">
        {/* Step 1 - Current */}
        <div className="flex flex-col items-center">
          <div className="w-4 h-4 rounded-full bg-black mb-2"></div>
          <span className="text-sm md:block hidden font-bold text-black bg-[#F0F0F0] rounded-full p-1 px-2">
            Service Class
          </span>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col items-center">
          <div className="w-4 h-4 rounded-full border-2 border-gray-300 bg-white mb-2"></div>
          <span className="text-sm md:block hidden text-gray-500 p-1">
            Pick-up Info
          </span>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col items-center">
          <div className="w-4 h-4 rounded-full border-2 border-gray-300 bg-white mb-2"></div>
          <span className="text-sm md:block hidden text-gray-500 p-1">
            Corporate Billing
          </span>
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

  // Service class data with pricing
  const serviceClasses = [
    {
      id: "executive" as ServiceClass,
      name: "EXECUTIVE",
      description: "Mercedes E-Class or similar",
      image: "/images/mercedes_bens_img.png",
      passengers: 3,
      luggage: "2-3",
    },
    {
      id: "luxury" as ServiceClass,
      name: "LUXURY",
      description: "Mercedes S-Class or similar",
      image: "/images/luxury.png",
      passengers: 3,
      luggage: "2-3",
    },
    {
      id: "mpv" as ServiceClass,
      name: "MPV",
      description: "Mercedes V-Class or similar",
      image: "/images/mercedes_img.png",
      passengers: 6,
      luggage: "5-6",
    },
    {
      id: "suv" as ServiceClass,
      name: "SUV",
      description: "Cadillac Escalade or similar",
      image: "/images/cadilac_img.png",
      passengers: 5,
      luggage: "4-5",
    },
  ];

  const handleServiceSelection = (serviceId: ServiceClass) => {
    console.log("🚙 Service selected:", serviceId);
    setSelectedService(serviceId);
  };

  const handleContinue = () => {
    if (selectedService) {
      // Calculate the price for the selected service - returns number
      const priceNumber = calculatePrice(
        selectedService,
        bookingData.type,
        bookingData.duration,
        bookingData.pickupLocation,
        bookingData.dropoffLocation
      );

      // Convert number to string for storage
      const priceString = priceNumber.toString();

      console.log("💰 Calculated price (number):", priceNumber);
      console.log("💰 Calculated price (string):", priceString);

      // Save distance or duration based on booking type
      const distanceOrDuration =
        bookingData.type === "one-way"
          ? distanceInfo?.distance // For one-way, save distance
          : bookingData.duration; // For by-hour, save duration

      console.log("📏 Corporate - Saving distance/duration:", {
        type: bookingData.type,
        value: distanceOrDuration,
        distanceInfo,
      });

      // Pass the string to the store method
      setSelectedServiceClass(selectedService, priceString);

      // Save distance to the store
      setReservationData({
        ...bookingData,
        selectedClass: selectedService,
        selectedClassPrice: priceString,
        distance: distanceOrDuration,
      });

      // Navigate to pick-up info
      router.push("/corporate-mobility/account/reserve/pick-up-info");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-white flex flex-col my-[50px]">
        {/* Header */}
        <StepIndicator />
        <div className="max-w-[584px] mx-auto px-6 py-8">
          <div className="bg-[#F0F0F0] rounded-lg shadow-sm p-6 md:p-6 p-4">
            <div className="flex justify-start items-center">
              <div className="text-left">
                <p className="font-bold text-black md:text-lg text-[15px]">
                  {formatDisplayDate(bookingData.date, bookingData.time)}
                </p>
                <div className="flex items-center mt-2">
                  <span
                    className="md:text-base text-[15px]"
                    style={{ color: "#A4A4A4" }}
                  >
                    {locations.from}
                  </span>
                  <span className="mx-4 text-2xl text-gray-600">→</span>
                  <span
                    className="md:text-base text-[15px]"
                    style={{ color: "#A4A4A4" }}
                  >
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
          <div className="max-w-[584px] md:px-6 mb-8 mx-auto">
            <p className="md:hidden block text-[20px] font-bold">
              Select a Vehicle
            </p>
            <p className="text-gray-500 text-sm mb-3">
              All price included VAT, fees, and tolls
            </p>

            <div className="">
              {serviceClasses.map((service, index) => (
                <div
                  key={service.id}
                  className={`border p-6 md:p-6 p-4 transition-colors cursor-pointer ${
                    index === 0
                      ? "rounded-t-lg"
                      : index === serviceClasses.length - 1
                        ? "rounded-b-lg"
                        : ""
                  } ${
                    selectedService === service.id
                      ? "border-black border-2"
                      : "border-gray-300 hover:border-black"
                  }`}
                  onClick={() => handleServiceSelection(service.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6 md:space-x-12">
                      <div className="relative w-[108px] h-[64px] md:w-[147px] md:h-[75px] flex-shrink-0">
                        <Image
                          src={service.image}
                          alt={`${service.name} Vehicle`}
                          fill
                          className={
                            service.image === "/images/mercedes_bens_img.png"
                              ? "object-contain"
                              : "object-cover"
                          }
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-black mb-1">
                          {service.name}
                        </h3>
                        <p
                          className={`mb-2 md:block hidden ${
                            selectedService === service.id
                              ? "text-black"
                              : "text-gray-600"
                          }`}
                        >
                          {service.description}
                        </p>
                        <div className="flex items-center space-x-4 text-[#B2B2B2] text-sm">
                          <div className="flex items-center space-x-1">
                            <PersonIcon fontSize="small" />
                            <span>{service.passengers}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <LuggageIcon fontSize="small" />
                            <span>{service.luggage}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right pb-12 md:pb-12 pb-6">
                      <div className="text-[16px] font-bold text-black">
                        {calculatePrice(
                          service.id,
                          bookingData.type,
                          bookingData.duration,
                          bookingData.pickupLocation,
                          bookingData.dropoffLocation
                        )}{" "}
                        JOD
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* All Classes Include */}
          <div className="max-w-[584px] md:px-6 mx-auto">
            <div className="border border-gray-300 rounded-t-lg p-6 md:p-6 p-4">
              <h3 className="text-[14px] md:text-[14px] text-[12px] text-[#ACACAC] mb-4 text-start">
                All Classes include :
              </h3>
              <div className="space-y-3 md:space-y-3 space-y-2 text-start">
                <div className="flex items-start">
                  <CheckCircleIcon
                    className="text-gray-700 mr-3 mt-0.5"
                    fontSize="small"
                  />
                  <span className="text-[16px] md:text-[16px] text-[14px] text-gray-600">
                    Free 60 minutes wait time for airport pickups, 15 mins for
                    all others
                  </span>
                </div>
                <div className="flex items-start">
                  <CheckCircleIcon
                    className="text-gray-700 mr-3 mt-0.5"
                    fontSize="small"
                  />
                  <span className="text-[16px] md:text-[16px] text-[14px] text-gray-600">
                    Include meet and greet
                  </span>
                </div>
                <div className="flex items-start">
                  <CheckCircleIcon
                    className="text-gray-700 mr-3 mt-0.5"
                    fontSize="small"
                  />
                  <span className="text-[16px] md:text-[16px] text-[14px] text-gray-600">
                    Free cancellation up until 1 hour before pickup
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Please Note */}
          <div className="max-w-[584px] md:px-6 mb-8 mx-auto">
            <div className="border border-gray-300 rounded-b-lg p-6 md:p-6 p-4">
              <h3 className="text-[14px] md:text-[14px] text-[12px] text-[#ACACAC] mb-4 text-start">
                Please note :
              </h3>
              <div className="space-y-3 md:space-y-3 space-y-2 text-start">
                <div className="flex items-start">
                  <InfoIcon
                    className="text-gray-700 mr-3 mt-0.5"
                    fontSize="small"
                  />
                  <span className="text-[16px] md:text-[16px] text-[14px] text-gray-600">
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
                  <span className="text-[16px] md:text-[16px] text-[14px] text-gray-600">
                    The vehicle images above are examples. You may get a
                    different vehicle of similar quality.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Terms & Continue Button */}
          <div className="flex flex-col md:flex-row items-center justify-center md:space-x-12 space-y-6 md:space-y-0">
            <button
              onClick={() => setShowTermsPopup(true)}
              className="text-[16px] text-[#7C7C7C] underline hover:text-gray-600 transition-colors"
            >
              View terms & condition
            </button>

            <button
              onClick={handleContinue}
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

          {/* Terms & Conditions Dialog */}
          <TermsAndConditionsDialog
            isOpen={showTermsPopup}
            onClose={() => setShowTermsPopup(false)}
          />
        </div>
      </div>
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
