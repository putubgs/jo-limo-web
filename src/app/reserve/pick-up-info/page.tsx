"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, Suspense, useState } from "react";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import TransferSelector from "@/components/TransferSelector";

function PickUpInfoContent() {
  const searchParams = useSearchParams();

  const initialBooking = {
    pickup: searchParams.get("pickup") || "",
    dropoff: searchParams.get("dropoff") || "",
    date: searchParams.get("date") || "",
    time: searchParams.get("time") || "",
    type: searchParams.get("type") || "one-way",
    duration: searchParams.get("duration") || "",
  } as const;

  // original locations coming from URL (Reserve Now popup)
  const urlPickup = initialBooking.pickup;
  const urlDropoff = initialBooking.dropoff;

  // Route locations chosen via selector (start empty)
  const [routePickup, setRoutePickup] = useState<string>("");
  const [routeDropoff, setRouteDropoff] = useState<string>("");
  const [selector, setSelector] = useState<null | "intercity" | "airport">(
    null
  );
  const [selectedGroup, setSelectedGroup] = useState<
    null | "intercity" | "airport"
  >(null);

  const bookingData = {
    pickup: searchParams.get("pickup") || "",
    dropoff: searchParams.get("dropoff") || "",
    date: searchParams.get("date") || "",
    time: searchParams.get("time") || "",
    type: searchParams.get("type") || "one-way",
    duration: searchParams.get("duration") || "",
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
        {/* Step 1 - Current */}
        <div className="flex flex-col items-center">
          <div className="w-4 h-4 rounded-full bg-black mb-2"></div>
          <span className="text-sm font-medium text-black">Pick-up Info</span>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col items-center">
          <div className="w-4 h-4 rounded-full border-2 border-gray-300 bg-white mb-2"></div>
          <span className="text-sm text-gray-500">Service Class</span>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col items-center">
          <div className="w-4 h-4 rounded-full border-2 border-gray-300 bg-white mb-2"></div>
          <span className="text-sm text-gray-500">Payment & Checkout</span>
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

  // Locations to show in grey summary card – use ONLY address from URL
  const locations = {
    from:
      initialBooking.type === "by-hour"
        ? urlPickup || "Please select location"
        : urlPickup || "Please select pickup location",
    to:
      initialBooking.type === "by-hour"
        ? "Round trip from starting location"
        : urlDropoff || "Please select dropoff location",
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white flex flex-col my-[50px]">
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
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Passenger Information Section */}
          <h2 className="text-2xl font-semibold text-black mb-6">
            Passenger information
          </h2>
          <div className="bg-[#F5F5F5] rounded-lg shadow-sm p-10 mb-8">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <input
                  type="text"
                  placeholder="First name :"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Last name :"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="email"
                  placeholder="Email :"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="Mobile Number :"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Starting point section – only for one-way bookings */}
          {initialBooking.type === "one-way" && (
            <>
              <h2 className="text-2xl font-semibold text-black mb-4">
                Location Services
              </h2>
              <div className="grid grid-cols-2 gap-6 mb-10">
                <button
                  disabled={
                    selectedGroup !== null && selectedGroup !== "intercity"
                  }
                  onClick={() =>
                    selectedGroup === null && setSelector("intercity")
                  }
                  className={`rounded-lg px-6 py-5 flex flex-col items-start bg-[#F5F5F5] ${
                    selectedGroup !== null && selectedGroup !== "intercity"
                      ? "opacity-40 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <span className="text-sm font-medium mb-1 text-gray-700">
                    Intercity Transfer
                  </span>
                  <span className="text-left text-gray-500">
                    {selectedGroup === "intercity" &&
                    routePickup &&
                    routeDropoff
                      ? `${routePickup} → ${routeDropoff}`
                      : "Select route"}
                  </span>
                </button>
                <button
                  disabled={
                    selectedGroup !== null && selectedGroup !== "airport"
                  }
                  onClick={() =>
                    selectedGroup === null && setSelector("airport")
                  }
                  className={`rounded-lg px-6 py-5 flex flex-col items-start bg-[#F5F5F5] ${
                    selectedGroup !== null && selectedGroup !== "airport"
                      ? "opacity-40 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <span className="text-sm font-medium mb-1 text-gray-700">
                    Airport Transfer
                  </span>
                  <span className="text-left text-gray-500">
                    {selectedGroup === "airport" && routePickup && routeDropoff
                      ? `${routePickup} → ${routeDropoff}`
                      : "Select route"}
                  </span>
                </button>
              </div>
            </>
          )}

          {/* Additional Information Section */}
          <h2 className="text-2xl font-semibold text-black mb-6">
            Additional information
          </h2>
          <div className="bg-[#F5F5F5] rounded-lg shadow-sm p-8 mb-8">
            {/* Pick up sign and Flight Number */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm mb-2">
                  Pick up sign :
                </label>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-[#A4A4A4] text-[12px] mt-2">
                  Your chauffeur will display this on their pickup sign when
                  they greet you
                </p>
              </div>
              <div>
                <label className="block text-gray-700 text-sm mb-2">
                  Flight Number :
                </label>
                <input
                  type="text"
                  placeholder="e.g. LH 202, US 2457, BA2490"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          <div className="bg-[#F5F5F5] rounded-lg shadow-sm p-8 mb-8">
            {/* Notes for chauffeur */}
            <div className="">
              <label className="block text-gray-700 text-sm mb-2">
                Notes for the chauffeur :
              </label>
              <textarea
                placeholder="Add any relevant requests (e.g., luggage, child seats). Please avoid entering confidential information."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
          <div className="bg-[#F5F5F5] rounded-lg shadow-sm p-8 mb-8">
            {/* Reference code */}
            <div>
              <label className="block text-gray-700 text-sm mb-2">
                Reference code or cost center :
              </label>
              <input
                type="text"
                placeholder="For corporate reservations, the entered details will appear on the official invoice."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Continue Button */}
          <div className="flex justify-center">
            <Link
              href={`/reserve/service-class?pickup=${encodeURIComponent(
                urlPickup
              )}&dropoff=${encodeURIComponent(
                urlDropoff
              )}&date=${encodeURIComponent(
                initialBooking.date
              )}&time=${encodeURIComponent(
                initialBooking.time
              )}&type=${encodeURIComponent(
                initialBooking.type
              )}&duration=${encodeURIComponent(initialBooking.duration)}`}
              className="w-full text-center inline-block bg-[#ABABAB] text-white font-bold text-[16px] px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Continue
            </Link>
          </div>
        </div>
      </div>
      <Footer />
      {/* Transfer selector modal */}
      {selector && (
        <TransferSelector
          groupId={selector}
          onClose={() => setSelector(null)}
          onSelect={(route) => {
            // naive parse: "A to B" or "A - B"
            let from = "";
            let to = "";
            if (route.includes(" to ")) {
              [from, to] = route.split(" to ");
            } else if (route.includes(" - ")) {
              [from, to] = route.split(" - ");
            }
            setRoutePickup(from.trim());
            setRouteDropoff(to.trim());
            setSelectedGroup(selector);
          }}
        />
      )}
    </>
  );
}

export default function PickUpInfoPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PickUpInfoContent />
    </Suspense>
  );
}
