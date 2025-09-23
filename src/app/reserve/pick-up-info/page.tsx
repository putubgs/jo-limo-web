"use client";

import { useRouter } from "next/navigation";
import { useEffect, Suspense, useState, useRef } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useReservationStore, BillingData } from "@/lib/reservation-store";
import { calculateDistanceAndTime } from "@/lib/distance-calculator";
import { COUNTRY_CODES, PHONE_COUNTRY_CODES } from "@/data/countries";

function PickUpInfoContent() {
  const router = useRouter();
  const {
    reservationData,
    setReservationData,
    setBillingData,
    getBillingData,
  } = useReservationStore();

  // Use data from Zustand store instead of URL params
  const initialBooking = reservationData;

  // original locations coming from store (Reserve Now popup)
  const urlPickup = initialBooking.pickup;
  const urlDropoff = initialBooking.dropoff;

  // Helper function to check if a location is an airport
  const isAirportLocation = (location: string): boolean => {
    const lowerLocation = location.toLowerCase();
    return (
      lowerLocation.includes("queen alia international airport") ||
      lowerLocation.includes("king hussein international airport")
    );
  };

  // Check if either pickup or dropoff is an airport
  const isPickupAirport = isAirportLocation(urlPickup || "");
  const isDropoffAirport = isAirportLocation(urlDropoff || "");
  const hasAirportLocation = isPickupAirport || isDropoffAirport;

  // Show pickup sign only when pickup location is an airport
  const showPickupSign = isPickupAirport;

  const [distanceInfo, setDistanceInfo] = useState<{
    distance: string;
    duration: string;
  } | null>(null);

  // Mobile phone dropdown states
  const [isPhoneDropdownOpen, setIsPhoneDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({
    code: "+962",
    name: "Jordan",
  });
  const [phoneSearchTerm, setPhoneSearchTerm] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Billing country dropdown states
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [selectedBillingCountry, setSelectedBillingCountry] = useState({
    code: "JO",
    name: "Jordan",
  });
  const [countrySearchTerm, setCountrySearchTerm] = useState("");
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  // Billing form state
  const [billingForm, setBillingForm] = useState<BillingData>(() => {
    const existingBilling = getBillingData();
    return (
      existingBilling || {
        customerEmail: "",
        customerGivenName: "",
        customerSurname: "",
        billingStreet1: "",
        billingCity: "",
        billingState: "",
        billingCountry: "JO", // Default to Jordan
        billingPostcode: "",
      }
    );
  });

  const handleBillingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBillingForm((prev) => ({ ...prev, [name]: value }));
  };

  // Filter countries based on search term
  const filteredCountries = PHONE_COUNTRY_CODES.filter(
    (country) =>
      country.name.toLowerCase().includes(phoneSearchTerm.toLowerCase()) ||
      country.code.includes(phoneSearchTerm)
  );

  // Filter billing countries based on search term
  const filteredBillingCountries = COUNTRY_CODES.filter(
    (country) =>
      country.name.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
      country.code.toLowerCase().includes(countrySearchTerm.toLowerCase())
  );

  // Use the same booking data from store
  const bookingData = reservationData;

  // Handle phone number input - only allow numbers
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove all non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, "");
    setPhoneNumber(numericValue);
  };

  // Format phone number for display (add spaces for readability)
  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, "");

    // Add spaces every 3-4 digits for better readability
    if (numericValue.length <= 3) {
      return numericValue;
    } else if (numericValue.length <= 7) {
      return `${numericValue.slice(0, 3)} ${numericValue.slice(3)}`;
    } else {
      return `${numericValue.slice(0, 3)} ${numericValue.slice(
        3,
        6
      )} ${numericValue.slice(6)}`;
    }
  };

  useEffect(() => {
    console.log("Booking data:", bookingData);
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

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsPhoneDropdownOpen(false);
        setPhoneSearchTerm("");
      }
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCountryDropdownOpen(false);
        setCountrySearchTerm("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCountrySelect = (country: { code: string; name: string }) => {
    console.log("Country selected:", country);
    setSelectedCountry(country);
    setIsPhoneDropdownOpen(false);
    setPhoneSearchTerm("");
  };

  const handleBillingCountrySelect = (country: {
    code: string;
    name: string;
  }) => {
    setSelectedBillingCountry(country);
    setIsCountryDropdownOpen(false);
    setCountrySearchTerm("");
    // Update billing form
    setBillingForm((prev) => ({ ...prev, billingCountry: country.code }));
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
          <div className="w-4 h-4 rounded-full bg-gray-400 mb-2"></div>
          <span className="text-sm text-gray-500 p-1">Service Class</span>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col items-center">
          <div className="w-4 h-4 rounded-full bg-black mb-2"></div>
          <span className="text-sm font-bold text-black bg-[#F0F0F0] rounded-full p-1 px-2">
            Pick-up Info
          </span>
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

        <div className="max-w-[584px] mx-auto px-6 py-8">
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
        <div className="max-w-[584px] mx-auto px-6 py-8">
          {/* Passenger & Billing Information Section */}
          <h2 className="text-2xl font-semibold text-black mb-6">
            Passenger & Billing Information
          </h2>
          <div className="bg-[#F5F5F5] rounded-lg shadow-sm p-10 mb-8">
            {/* Personal Information */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div>
                <label className="block text-gray-700 text-sm mb-2">
                  First Name :
                </label>
                <input
                  type="text"
                  name="customerGivenName"
                  value={billingForm.customerGivenName}
                  onChange={handleBillingChange}
                  placeholder="First name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm mb-2">
                  Last Name :
                </label>
                <input
                  type="text"
                  name="customerSurname"
                  value={billingForm.customerSurname}
                  onChange={handleBillingChange}
                  placeholder="Last name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div>
                <label className="block text-gray-700 text-sm mb-2">
                  Email :
                </label>
                <input
                  type="email"
                  name="customerEmail"
                  value={billingForm.customerEmail}
                  onChange={handleBillingChange}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm mb-2">
                  Mobile Number :
                </label>
                <div className="relative" ref={dropdownRef}>
                  <div className="flex bg-white rounded-lg overflow-hidden border border-gray-300">
                    {/* Country Code Dropdown */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log("Dropdown button clicked");
                        setIsPhoneDropdownOpen(!isPhoneDropdownOpen);
                      }}
                      className="px-4 py-3 bg-transparent focus:outline-none text-black text-lg min-w-[90px] border-r border-gray-300 flex items-center justify-between hover:bg-gray-50"
                    >
                      <span>{selectedCountry.code}</span>
                      <svg
                        className={`w-4 h-4 ml-2 transition-transform ${
                          isPhoneDropdownOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* Phone Number Input */}
                    <input
                      type="tel"
                      placeholder="---- ------"
                      value={formatPhoneNumber(phoneNumber)}
                      onChange={handlePhoneNumberChange}
                      onKeyPress={(e) => {
                        // Prevent non-numeric characters from being typed
                        if (
                          !/[0-9]/.test(e.key) &&
                          e.key !== "Backspace" &&
                          e.key !== "Delete" &&
                          e.key !== "Tab" &&
                          e.key !== "Enter"
                        ) {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e) => {
                        // Handle paste events - only allow numeric content
                        e.preventDefault();
                        const paste = e.clipboardData.getData("text");
                        const numericPaste = paste.replace(/[^0-9]/g, "");
                        setPhoneNumber(numericPaste);
                      }}
                      className="w-full px-4 py-3 bg-transparent focus:outline-none text-black text-lg"
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                  </div>

                  {/* Dropdown Menu */}
                  {isPhoneDropdownOpen && (
                    <div
                      className="absolute top-full left-0 w-80 bg-white border border-gray-300 rounded-lg shadow-xl z-[9999] mt-1"
                      style={{ zIndex: 9999 }}
                    >
                      {/* Search Input */}
                      <div className="p-3 border-b border-gray-200">
                        <input
                          type="text"
                          placeholder="Search"
                          value={phoneSearchTerm}
                          onChange={(e) => setPhoneSearchTerm(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          autoFocus
                        />
                      </div>

                      {/* Country List */}
                      <div className="max-h-60 overflow-y-auto">
                        {filteredCountries.length > 0 ? (
                          filteredCountries.map((country, index) => (
                            <div
                              key={`${country.code}-${country.name}-${index}`}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleCountrySelect(country);
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between border-b border-gray-100 last:border-b-0 cursor-pointer"
                            >
                              <span className="text-black">{country.name}</span>
                              <div className="flex items-center">
                                <span className="text-gray-500 mr-2">
                                  {country.code}
                                </span>
                                {selectedCountry.code === country.code &&
                                  selectedCountry.name === country.name && (
                                    <div className="w-2 h-2 bg-black rounded-full"></div>
                                  )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-gray-500 text-center">
                            No countries found
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Billing Address */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-black mb-4">
                Billing Address
              </h3>

              {/* Street Address - Full Width */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm mb-2">
                  Street Address :
                </label>
                <input
                  type="text"
                  name="billingStreet1"
                  value={billingForm.billingStreet1}
                  onChange={handleBillingChange}
                  placeholder="123 Main Street"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* City, State, Country, Postal Code - 2 Column Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 text-sm mb-2">
                    City :
                  </label>
                  <input
                    type="text"
                    name="billingCity"
                    value={billingForm.billingCity}
                    onChange={handleBillingChange}
                    placeholder="Amman"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-2">
                    State/Province :
                  </label>
                  <input
                    type="text"
                    name="billingState"
                    value={billingForm.billingState}
                    onChange={handleBillingChange}
                    placeholder="Amman Governorate"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-2">
                    Country :
                  </label>
                  <div className="relative" ref={countryDropdownRef}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsCountryDropdownOpen(!isCountryDropdownOpen);
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-left flex items-center justify-between hover:bg-gray-50"
                    >
                      <span className="text-black">
                        {selectedBillingCountry.code} -{" "}
                        {selectedBillingCountry.name}
                      </span>
                      <svg
                        className={`w-4 h-4 ml-2 transition-transform ${
                          isCountryDropdownOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {isCountryDropdownOpen && (
                      <div
                        className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-xl z-[9999] mt-1"
                        style={{ zIndex: 9999 }}
                      >
                        {/* Search Input */}
                        <div className="p-3 border-b border-gray-200">
                          <input
                            type="text"
                            placeholder="Search country"
                            value={countrySearchTerm}
                            onChange={(e) =>
                              setCountrySearchTerm(e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            autoFocus
                          />
                        </div>

                        {/* Country List */}
                        <div className="max-h-60 overflow-y-auto">
                          {filteredBillingCountries.length > 0 ? (
                            filteredBillingCountries.map((country, index) => (
                              <div
                                key={`${country.code}-${country.name}-${index}`}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleBillingCountrySelect(country);
                                }}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between border-b border-gray-100 last:border-b-0 cursor-pointer"
                              >
                                <span className="text-black">
                                  {country.code} - {country.name}
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-gray-500 text-center">
                              No countries found
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-2">
                    Postal Code :
                  </label>
                  <input
                    type="text"
                    name="billingPostcode"
                    value={billingForm.billingPostcode}
                    onChange={handleBillingChange}
                    placeholder="11118"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <h2 className="text-2xl font-semibold text-black mb-6">
            Additional information
          </h2>
          <div className="bg-[#F5F5F5] rounded-lg shadow-sm p-8 mb-8">
            {/* Notes for chauffeur */}
            <div className="">
              <label className="block text-gray-700 text-sm mb-2">
                Notes for chauffeur :
              </label>
              <textarea
                placeholder="Add special requests, e.g. booking itinerary, number of bags, child seats, Include landmarks, gate numbers, or entrances to help the chauffeur find you."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          {(hasAirportLocation || showPickupSign) && (
            <div className="bg-[#F5F5F5] rounded-lg shadow-sm p-8 mb-8">
              {/* Pick up sign and Flight Number */}
              <div
                className={`grid ${
                  showPickupSign && hasAirportLocation
                    ? "grid-cols-2"
                    : "grid-cols-1"
                } gap-6`}
              >
                {showPickupSign && (
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
                )}
                {hasAirportLocation && (
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
                )}
              </div>
            </div>
          )}
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
            <button
              onClick={() => {
                // Save billing data to store
                setBillingData(billingForm);

                // Update store with any changes made in this step
                setReservationData({
                  pickup: urlPickup,
                  dropoff: urlDropoff,
                  date: initialBooking.date,
                  time: initialBooking.time,
                  type: initialBooking.type,
                  duration: initialBooking.duration,
                });
                // Navigate to payment-and-checkout (next step in the flow)
                router.push("/reserve/payment-and-checkout");
              }}
              className="w-full text-center bg-[#ABABAB] text-white font-bold text-[16px] px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
      <Footer />
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
