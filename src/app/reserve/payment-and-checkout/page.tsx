"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";

function PaymentAndCheckoutContent() {
  const searchParams = useSearchParams();

  const bookingData = {
    pickup: searchParams.get("pickup") || "",
    dropoff: searchParams.get("dropoff") || "",
    date: searchParams.get("date") || "",
    time: searchParams.get("time") || "",
    type: searchParams.get("type") || "one-way",
    service: searchParams.get("service") || "",
  };

  useEffect(() => {
    console.log("Booking data:", bookingData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Step indicator component
  const StepIndicator = () => (
    <div className="relative w-full max-w-[550px] mx-auto py-8">
      {/* Background line - absolute positioned behind */}
      <div className="absolute top-10 left-8 right-8 h-0.5 bg-gray-300 transform -translate-y-1/2 w-[450px]"></div>

      {/* Flex container for bullets and text - in front */}
      <div className="relative flex justify-between items-center">
        {/* Step 1 - Completed */}
        <div className="flex flex-col items-center">
          <div className="w-4 h-4 rounded-full bg-gray-400 mb-2"></div>
          <span className="text-sm text-gray-500">Pick-up Info</span>
        </div>

        {/* Step 2 - Completed */}
        <div className="flex flex-col items-center">
          <div className="w-4 h-4 rounded-full bg-gray-400 mb-2"></div>
          <span className="text-sm text-gray-500">Service Class</span>
        </div>

        {/* Step 3 - Current */}
        <div className="flex flex-col items-center">
          <div className="w-4 h-4 rounded-full bg-black mb-2"></div>
          <span className="text-sm font-medium text-black">
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
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex items-center justify-center">
          <button
            className="inline-block bg-green-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
            onClick={() => alert("Booking completed! (This is just a demo)")}
          >
            Complete Booking
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function PaymentAndCheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentAndCheckoutContent />
    </Suspense>
  );
}
