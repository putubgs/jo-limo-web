"use client";

import { useEffect, Suspense, useState } from "react";
import Image from "next/image";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useRouter } from "next/navigation";
import PersonIcon from "@mui/icons-material/Person";
import LuggageIcon from "@mui/icons-material/Luggage";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";
import { useReservationStore, ServiceClass } from "@/lib/reservation-store";
import { calculateDistanceAndTime } from "@/lib/distance-calculator";
import { calculatePrice } from "@/lib/pricing-calculator";
import DataValidationError from "@/components/DataValidationError";

function ServiceClassContent() {
  const router = useRouter();
  const {
    reservationData,
    setSelectedServiceClass,
    getSelectedServiceClass,
    setReservationData,
  } = useReservationStore();

  // Initialize selectedService from store
  const [selectedService, setSelectedService] = useState<ServiceClass | "">(
    getSelectedServiceClass() || ""
  );
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [distanceInfo, setDistanceInfo] = useState<{
    distance: string;
    duration: string;
  } | null>(null);

  // Use data from Zustand store instead of URL params
  const bookingData = reservationData;

  // Debug the booking data
  useEffect(() => {
    console.log("🔍 SERVICE CLASS PAGE - Booking Data:", {
      bookingData,
      hasDate: !!bookingData.date,
      hasTime: !!bookingData.time,
      hasPickup: !!bookingData.pickup,
      hasDropoff: !!bookingData.dropoff,
      hasType: !!bookingData.type,
      hasDuration: !!bookingData.duration,
    });
  }, [bookingData]);

  // Simple validation - just check if we have the basic required data
  const hasLocationData = bookingData.pickup || bookingData.pickupLocation;
  const hasNoData = !bookingData.pickup && !bookingData.pickupLocation;

  // Check if all prices are 0 (location not served)
  const [, setPricingData] = useState<{
    [key: string]: { price: number; currency: string };
  }>({});
  const [locationNotServed, setLocationNotServed] = useState(false);
  const [isCheckingLocation, setIsCheckingLocation] = useState(false);

  // Debug logging
  console.log("=== SERVICE CLASS VALIDATION DEBUG ===");
  console.log("bookingData:", bookingData);
  console.log("hasLocationData:", hasLocationData);
  console.log("hasNoData:", hasNoData);
  console.log("locationNotServed:", locationNotServed);
  console.log("isCheckingLocation:", isCheckingLocation);

  // Check which error condition is being triggered
  if (hasNoData) {
    console.log("❌ ERROR: hasNoData is true - showing Page Error!");
  }
  if (locationNotServed) {
    console.log(
      "❌ ERROR: locationNotServed is true - showing Location Not Served!"
    );
  }
  if (isCheckingLocation) {
    console.log(
      "⏳ LOADING: isCheckingLocation is true - showing loading state"
    );
  }

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
      <div className="absolute md:top-10 top-[76px] left-12 right-8 h-0.5 bg-gray-300 transform -translate-y-1/2 md:w-[23vw] w-[78vw]"></div>

      <div className="flex md:hidden pb-8 px-8 justify-between items-center">
        <p className="text-[24px] font-bold">Service Class</p>
        <p>Step 2 of 3</p>
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
            Payment & Checkout
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
      console.log(
        "🔍 SERVICE CLASS - About to save service class, current booking data:",
        bookingData
      );

      // Pass the string to the store method
      setSelectedServiceClass(selectedService, priceString);

      // IMPORTANT: Also ensure all existing booking data is preserved
      console.log(
        "🔍 SERVICE CLASS - Preserving existing booking data:",
        bookingData
      );
      setReservationData({
        ...bookingData, // Preserve all existing data
        selectedClass: selectedService,
        selectedClassPrice: priceString,
      });

      console.log(
        "🔍 SERVICE CLASS - Service class saved and data preserved, navigating to pick-up info"
      );
      // Navigate to pick-up info
      router.push("/reserve/pick-up-info");
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white flex flex-col my-[50px]">
        {/* Header */}
        <StepIndicator />
        <div className="max-w-[584px] mx-auto px-6 py-8">
          <div className="bg-[#F0F0F0] rounded-lg shadow-sm p-6">
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
                    <p
                      className="text-sm"
                      style={{ color: "#A4A4A4" }}
                    >
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
                  className={`border p-6 transition-colors cursor-pointer ${
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
                          className={service.image === "/images/mercedes_bens_img.png" ? "object-contain" : "object-cover"}
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
                    <div className="text-right pb-[24px] md:pb-12">
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
          <div className="max-w-[584px] md:px-6 mb-8 mx-auto">
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
