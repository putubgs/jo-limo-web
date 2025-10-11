"use client";

import { useEffect, Suspense, useMemo, useRef, useCallback } from "react";
import { useState } from "react";
import { useReservationStore } from "@/lib/reservation-store";
import { calculateDistanceAndTime } from "@/lib/distance-calculator";
import Image from "next/image";
import PersonIcon from "@mui/icons-material/Person";
import LuggageIcon from "@mui/icons-material/Luggage";
import DataValidationError from "@/components/DataValidationError";

function PaymentAndCheckoutContent() {
  const { reservationData } = useReservationStore();

  // Use data from Zustand store instead of URL params
  const bookingData = useMemo(
    () => ({
      ...reservationData,
      service: reservationData.selectedClass || "",
    }),
    [reservationData]
  );

  const [distanceInfo, setDistanceInfo] = useState<{
    distance: string;
    duration: string;
  } | null>(null);

  const [bookingCreated, setBookingCreated] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);
  const hasSubmittedRef = useRef(false);

  useEffect(() => {
    console.log("Booking data:", bookingData);
    console.log("Selected service:", reservationData.selectedClass);
    console.log("Selected price:", reservationData.selectedClassPrice);
  }, [
    bookingData,
    reservationData.selectedClass,
    reservationData.selectedClassPrice,
  ]);

  // Data validation - check if required data from previous pages is present
  const hasRequiredData =
    reservationData.type === "by-hour"
      ? reservationData.pickup &&
        reservationData.pickupLocation &&
        reservationData.selectedClass &&
        reservationData.selectedClassPrice &&
        reservationData.billingData
      : reservationData.pickup &&
        reservationData.dropoff &&
        reservationData.pickupLocation &&
        reservationData.dropoffLocation &&
        reservationData.selectedClass &&
        reservationData.selectedClassPrice &&
        reservationData.billingData;

  // Create a stable callback for booking creation
  const createCorporateBooking = useCallback(async () => {
    if (
      bookingCreated ||
      isCreatingBooking ||
      bookingError ||
      hasSubmittedRef.current
    ) {
      return;
    }

    // Check if we have all required data
    if (!hasRequiredData) {
      return;
    }

    hasSubmittedRef.current = true; // Mark as submitted to prevent duplicate calls
    console.log("Creating corporate booking - preventing duplicates");
    setIsCreatingBooking(true);
    setBookingError(null);

    try {
      // Prepare booking data
      const bookingPayload = {
        first_name: reservationData.billingData?.customerGivenName || "",
        last_name: reservationData.billingData?.customerSurname || "",
        email: reservationData.billingData?.customerEmail || "",
        mobile_number: reservationData.mobileNumber || "",
        pickup_sign: reservationData.pickupSign || null,
        flight_number: reservationData.flightNumber || null,
        notes_for_the_chauffeur: reservationData.notesForChauffeur || null,
        booking_type: reservationData.type,
        pick_up_location: reservationData.pickup,
        drop_off_location:
          reservationData.type === "one-way"
            ? reservationData.dropoff
            : reservationData.pickup,
        duration:
          reservationData.type === "by-hour" ? reservationData.duration : null,
        date_and_time: new Date(
          `${reservationData.date} ${reservationData.time}`
        ).toISOString(),
        selected_class: reservationData.selectedClass,
        price: parseFloat(reservationData.selectedClassPrice || "0") || 0,
      };

      console.log("Creating corporate booking with payload:", bookingPayload);

      const response = await fetch("/api/corporate-mobility/booking/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingPayload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log("Corporate booking created successfully:", data.booking);
        setBookingCreated(true);
      } else {
        console.error("Failed to create booking:", data);
        setBookingError(
          data.error || data.details || "Failed to create booking"
        );
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      setBookingError("Failed to create booking");
    } finally {
      setIsCreatingBooking(false);
    }
  }, [
    bookingCreated,
    isCreatingBooking,
    bookingError,
    hasRequiredData,
    reservationData.billingData?.customerGivenName,
    reservationData.billingData?.customerSurname,
    reservationData.billingData?.customerEmail,
    reservationData.mobileNumber,
    reservationData.pickupSign,
    reservationData.flightNumber,
    reservationData.notesForChauffeur,
    reservationData.type,
    reservationData.pickup,
    reservationData.dropoff,
    reservationData.duration,
    reservationData.date,
    reservationData.time,
    reservationData.selectedClass,
    reservationData.selectedClassPrice,
  ]);

  // Create booking automatically when component mounts and has required data
  useEffect(() => {
    createCorporateBooking();
  }, [createCorporateBooking]);

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

  // If booking data is missing (e.g., after refresh), block the page and guide back
  if (!hasRequiredData) {
    return (
      <DataValidationError
        title="Booking Session Ended"
        message="Your booking details are no longer available. Please go back to Corporate Mobility Reserve to start again. If you've already submitted, your booking has been saved."
        showBackButton={true}
        backToHome={false}
        grayBackButton={true}
      />
    );
  }

  // Service class data mapping
  const serviceClassData = {
    executive: {
      name: "EXECUTIVE",
      description: "Mercedes E-Class or similar",
      image: "/images/mercedes_bens_img.png",
      passengers: 3,
      luggage: "2-3",
    },
    luxury: {
      name: "LUXURY",
      description: "Mercedes S-Class or similar",
      image: "/images/luxury.png",
      passengers: 3,
      luggage: "2-3",
    },
    mpv: {
      name: "MPV",
      description: "Mercedes V-Class or similar",
      image: "/images/mercedes_img.png",
      passengers: 6,
      luggage: "5-6",
    },
    suv: {
      name: "SUV",
      description: "Cadillac Escalade or similar",
      image: "/images/cadilac_img.png",
      passengers: 5,
      luggage: "4-5",
    },
  };

  // Get selected service data or fallback to default
  const selectedServiceData = reservationData.selectedClass
    ? serviceClassData[reservationData.selectedClass]
    : serviceClassData.mpv; // fallback to MPV if no selection

  // Step indicator component
  const StepIndicator = () => (
    <div className="relative w-full max-w-[550px] mx-auto md:py-8">
      {/* Background line - absolute positioned behind */}
      <div className="absolute md:top-10 top-[76px] left-10 right-8 h-0.5 bg-gray-300 transform -translate-y-1/2 md:w-[440px] w-[78vw]"></div>

      <div className="flex md:hidden pb-8 px-8 justify-between items-center">
        <p className="text-[24px] font-bold">Corporate Billing</p>
        <p>Step 3 of 3</p>
      </div>

      {/* Flex container for bullets and text - in front */}
      <div className="relative flex justify-between items-center px-8 md:px-0">
        {/* Step 1 - Completed */}
        <div className="flex flex-col items-center">
          <div className="w-4 h-4 rounded-full bg-gray-400 mb-2"></div>
          <span className="text-sm md:block hidden text-gray-500 p-1">
            Service Class
          </span>
        </div>

        {/* Step 2 - Completed */}
        <div className="flex flex-col items-center">
          <div className="w-4 h-4 rounded-full bg-gray-400 mb-2"></div>
          <span className="text-sm md:block hidden text-gray-500 p-1">
            Pick-up Info
          </span>
        </div>

        {/* Step 3 - Current */}
        <div className="flex flex-col items-center">
          <div className="w-4 h-4 rounded-full bg-black mb-2"></div>
          <span className="text-sm md:block hidden font-bold text-black bg-[#F0F0F0] rounded-full p-1 px-2">
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

  return (
    <>
      <div className=" bg-white flex flex-col my-[50px]">
        {/* Header */}
        <StepIndicator />
        <div className="max-w-[584px] mx-auto px-6 pt-8">
          <div className="bg-[#F0F0F0] rounded-t-lg shadow-sm p-6">
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

        {/* Main content - Display selected service */}
        <div className="px-6">
          <div className="max-w-[584px] md:px-6 mb-8 mx-auto">
            <div className="border border-gray-300 rounded-b-lg border-2 p-6 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6 md:space-x-12">
                  <div className="relative w-[108px] h-[64px] md:w-[147px] md:h-[75px] flex-shrink-0">
                    <Image
                      src={selectedServiceData.image}
                      alt={`${selectedServiceData.name} Vehicle`}
                      width={147}
                      height={64}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-black mb-1">
                      {selectedServiceData.name}
                    </h3>
                    <p className="mb-2 md:block hidden text-gray-600">
                      {selectedServiceData.description}
                    </p>
                    <div className="flex items-center space-x-4 text-[#B2B2B2] text-sm">
                      <div className="flex items-center space-x-1">
                        <PersonIcon fontSize="small" />
                        <span>{selectedServiceData.passengers}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <LuggageIcon fontSize="small" />
                        <span>{selectedServiceData.luggage}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right pb-[24px] md:pb-12">
                  <div className="text-[16px] font-bold text-black">
                    {reservationData.selectedClassPrice || "0"} JOD
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success message - integrated into the design */}
        {bookingCreated && (
          <div className="max-w-[584px] mx-auto px-6 text-center text-[16px]">
            <p className="font-bold">
              Your chauffeur has been successfully reserved and billed to your
              company account.
            </p>
            <p>
              For any changes or cancellations, please contact our team at
              +962-79-169-8125.
            </p>
            <p className="text-[#7C7C7C] underline pt-10">Download Invoice</p>
          </div>
        )}
      </div>
    </>
  );
}

export default function CorporateBilling() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentAndCheckoutContent />
    </Suspense>
  );
}
