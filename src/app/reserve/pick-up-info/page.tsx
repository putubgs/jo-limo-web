"use client";

import { useRouter } from "next/navigation";
import { useEffect, Suspense, useState, useRef } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useReservationStore } from "@/lib/reservation-store";
import { calculateDistanceAndTime } from "@/lib/distance-calculator";

function PickUpInfoContent() {
  const router = useRouter();
  const { reservationData, setReservationData } = useReservationStore();

  // Use data from Zustand store instead of URL params
  const initialBooking = reservationData;

  // original locations coming from store (Reserve Now popup)
  const urlPickup = initialBooking.pickup;
  const urlDropoff = initialBooking.dropoff;

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

  // Complete country codes data
  const countryCodes = [
    { code: "+44", name: "United Kingdom" },
    { code: "+33", name: "France" },
    { code: "+971", name: "United Arab Emirates" },
    { code: "+358", name: "Åland Islands" },
    { code: "+355", name: "Albania" },
    { code: "+213", name: "Algeria" },
    { code: "+1", name: "American Samoa" },
    { code: "+376", name: "Andorra" },
    { code: "+1", name: "Anguilla" },
    { code: "+93", name: "Afghanistan" },
    { code: "+244", name: "Angola" },
    { code: "+1", name: "Antigua and Barbuda" },
    { code: "+54", name: "Argentina" },
    { code: "+374", name: "Armenia" },
    { code: "+61", name: "Australia" },
    { code: "+43", name: "Austria" },
    { code: "+994", name: "Azerbaijan" },
    { code: "+1", name: "Bahamas" },
    { code: "+973", name: "Bahrain" },
    { code: "+880", name: "Bangladesh" },
    { code: "+1", name: "Barbados" },
    { code: "+375", name: "Belarus" },
    { code: "+32", name: "Belgium" },
    { code: "+501", name: "Belize" },
    { code: "+229", name: "Benin" },
    { code: "+975", name: "Bhutan" },
    { code: "+591", name: "Bolivia" },
    { code: "+387", name: "Bosnia and Herzegovina" },
    { code: "+267", name: "Botswana" },
    { code: "+55", name: "Brazil" },
    { code: "+673", name: "Brunei" },
    { code: "+359", name: "Bulgaria" },
    { code: "+226", name: "Burkina Faso" },
    { code: "+257", name: "Burundi" },
    { code: "+855", name: "Cambodia" },
    { code: "+237", name: "Cameroon" },
    { code: "+1", name: "Canada" },
    { code: "+238", name: "Cape Verde" },
    { code: "+236", name: "Central African Republic" },
    { code: "+235", name: "Chad" },
    { code: "+56", name: "Chile" },
    { code: "+86", name: "China" },
    { code: "+57", name: "Colombia" },
    { code: "+269", name: "Comoros" },
    { code: "+242", name: "Congo" },
    { code: "+506", name: "Costa Rica" },
    { code: "+385", name: "Croatia" },
    { code: "+53", name: "Cuba" },
    { code: "+357", name: "Cyprus" },
    { code: "+420", name: "Czech Republic" },
    { code: "+45", name: "Denmark" },
    { code: "+253", name: "Djibouti" },
    { code: "+1", name: "Dominica" },
    { code: "+1", name: "Dominican Republic" },
    { code: "+670", name: "East Timor" },
    { code: "+593", name: "Ecuador" },
    { code: "+20", name: "Egypt" },
    { code: "+503", name: "El Salvador" },
    { code: "+240", name: "Equatorial Guinea" },
    { code: "+291", name: "Eritrea" },
    { code: "+372", name: "Estonia" },
    { code: "+251", name: "Ethiopia" },
    { code: "+679", name: "Fiji" },
    { code: "+358", name: "Finland" },
    { code: "+241", name: "Gabon" },
    { code: "+220", name: "Gambia" },
    { code: "+995", name: "Georgia" },
    { code: "+49", name: "Germany" },
    { code: "+233", name: "Ghana" },
    { code: "+30", name: "Greece" },
    { code: "+1", name: "Grenada" },
    { code: "+502", name: "Guatemala" },
    { code: "+224", name: "Guinea" },
    { code: "+245", name: "Guinea-Bissau" },
    { code: "+592", name: "Guyana" },
    { code: "+509", name: "Haiti" },
    { code: "+504", name: "Honduras" },
    { code: "+852", name: "Hong Kong" },
    { code: "+36", name: "Hungary" },
    { code: "+354", name: "Iceland" },
    { code: "+91", name: "India" },
    { code: "+62", name: "Indonesia" },
    { code: "+98", name: "Iran" },
    { code: "+964", name: "Iraq" },
    { code: "+353", name: "Ireland" },
    { code: "+972", name: "Israel" },
    { code: "+39", name: "Italy" },
    { code: "+1", name: "Jamaica" },
    { code: "+81", name: "Japan" },
    { code: "+962", name: "Jordan" },
    { code: "+7", name: "Kazakhstan" },
    { code: "+254", name: "Kenya" },
    { code: "+686", name: "Kiribati" },
    { code: "+82", name: "Korea, South" },
    { code: "+965", name: "Kuwait" },
    { code: "+996", name: "Kyrgyzstan" },
    { code: "+856", name: "Laos" },
    { code: "+371", name: "Latvia" },
    { code: "+961", name: "Lebanon" },
    { code: "+266", name: "Lesotho" },
    { code: "+231", name: "Liberia" },
    { code: "+218", name: "Libya" },
    { code: "+423", name: "Liechtenstein" },
    { code: "+370", name: "Lithuania" },
    { code: "+352", name: "Luxembourg" },
    { code: "+853", name: "Macau" },
    { code: "+389", name: "Macedonia" },
    { code: "+261", name: "Madagascar" },
    { code: "+265", name: "Malawi" },
    { code: "+60", name: "Malaysia" },
    { code: "+960", name: "Maldives" },
    { code: "+223", name: "Mali" },
    { code: "+356", name: "Malta" },
    { code: "+692", name: "Marshall Islands" },
    { code: "+222", name: "Mauritania" },
    { code: "+230", name: "Mauritius" },
    { code: "+52", name: "Mexico" },
    { code: "+691", name: "Micronesia" },
    { code: "+373", name: "Moldova" },
    { code: "+377", name: "Monaco" },
    { code: "+976", name: "Mongolia" },
    { code: "+382", name: "Montenegro" },
    { code: "+212", name: "Morocco" },
    { code: "+258", name: "Mozambique" },
    { code: "+95", name: "Myanmar" },
    { code: "+264", name: "Namibia" },
    { code: "+674", name: "Nauru" },
    { code: "+977", name: "Nepal" },
    { code: "+31", name: "Netherlands" },
    { code: "+64", name: "New Zealand" },
    { code: "+505", name: "Nicaragua" },
    { code: "+227", name: "Niger" },
    { code: "+234", name: "Nigeria" },
    { code: "+47", name: "Norway" },
    { code: "+968", name: "Oman" },
    { code: "+92", name: "Pakistan" },
    { code: "+680", name: "Palau" },
    { code: "+970", name: "Palestine" },
    { code: "+507", name: "Panama" },
    { code: "+675", name: "Papua New Guinea" },
    { code: "+595", name: "Paraguay" },
    { code: "+51", name: "Peru" },
    { code: "+63", name: "Philippines" },
    { code: "+48", name: "Poland" },
    { code: "+351", name: "Portugal" },
    { code: "+974", name: "Qatar" },
    { code: "+40", name: "Romania" },
    { code: "+7", name: "Russia" },
    { code: "+250", name: "Rwanda" },
    { code: "+966", name: "Saudi Arabia" },
    { code: "+221", name: "Senegal" },
    { code: "+381", name: "Serbia" },
    { code: "+248", name: "Seychelles" },
    { code: "+232", name: "Sierra Leone" },
    { code: "+65", name: "Singapore" },
    { code: "+421", name: "Slovakia" },
    { code: "+386", name: "Slovenia" },
    { code: "+677", name: "Solomon Islands" },
    { code: "+252", name: "Somalia" },
    { code: "+27", name: "South Africa" },
    { code: "+34", name: "Spain" },
    { code: "+94", name: "Sri Lanka" },
    { code: "+249", name: "Sudan" },
    { code: "+597", name: "Suriname" },
    { code: "+268", name: "Swaziland" },
    { code: "+46", name: "Sweden" },
    { code: "+41", name: "Switzerland" },
    { code: "+963", name: "Syria" },
    { code: "+886", name: "Taiwan" },
    { code: "+992", name: "Tajikistan" },
    { code: "+255", name: "Tanzania" },
    { code: "+66", name: "Thailand" },
    { code: "+228", name: "Togo" },
    { code: "+676", name: "Tonga" },
    { code: "+1", name: "Trinidad and Tobago" },
    { code: "+216", name: "Tunisia" },
    { code: "+90", name: "Turkey" },
    { code: "+993", name: "Turkmenistan" },
    { code: "+256", name: "Uganda" },
    { code: "+380", name: "Ukraine" },
    { code: "+1", name: "United States" },
    { code: "+598", name: "Uruguay" },
    { code: "+998", name: "Uzbekistan" },
    { code: "+678", name: "Vanuatu" },
    { code: "+58", name: "Venezuela" },
    { code: "+84", name: "Vietnam" },
    { code: "+967", name: "Yemen" },
    { code: "+260", name: "Zambia" },
    { code: "+263", name: "Zimbabwe" },
  ];

  // Filter countries based on search term
  const filteredCountries = countryCodes.filter(
    (country) =>
      country.name.toLowerCase().includes(phoneSearchTerm.toLowerCase()) ||
      country.code.includes(phoneSearchTerm)
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
          {/* Passenger Information Section */}
          <h2 className="text-2xl font-semibold text-black mb-6">
            Passenger information
          </h2>
          <div className="bg-[#F5F5F5] rounded-lg shadow-sm p-10 mb-8">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-gray-700 text-sm mb-2">
                  First Name :
                </label>
                <input
                  type="text"
                  placeholder="First name :"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm mb-2">
                  Last Name :
                </label>
                <input
                  type="text"
                  placeholder="Last name :"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 text-sm mb-2">
                  Email :
                </label>
                <input
                  type="email"
                  placeholder="Email :"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          </div>

          {/* Additional Information Section */}
          <h2 className="text-2xl font-semibold text-black mb-6">
            Additional information
          </h2>
          <div className="bg-[#F5F5F5] rounded-lg shadow-sm p-8 mb-8">
            {/* Notes for chauffeur */}
            <div className="">
              <label className="block text-gray-700 text-sm mb-2">
                Additional notes for the pickup location :
              </label>
              <textarea
                placeholder="Include landmarks, gate numbers, or entrances to help the chauffeur find you. Avoid personal or sensitive info."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
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
            <button
              onClick={() => {
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
