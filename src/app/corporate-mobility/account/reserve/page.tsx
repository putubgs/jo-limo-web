"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { autocomplete } from "@/lib/google-autocomplete";
import { useReservationStore } from "@/lib/reservation-store";

// Calendar helper functions
const getJordanDate = () => {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const jordanOffset = 3; // GMT+3
  return new Date(utc + jordanOffset * 3600000);
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const generateTimeOptions = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const date = new Date();
      date.setHours(hour, minute, 0, 0);
      const timeString = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      times.push(timeString);
    }
  }
  return times;
};

const getClosestTime = (currentTime: string, timeOptions: string[]) => {
  // If exact match exists, use it
  if (timeOptions.includes(currentTime)) {
    return currentTime;
  }

  // Parse the currentTime parameter to get minutes
  const [time, period] = currentTime.split(" ");
  const [hours, minutes] = time.split(":").map(Number);
  let currentMinutes = hours * 60 + minutes;

  // Convert to 24-hour format
  if (period === "PM" && hours !== 12) {
    currentMinutes += 12 * 60;
  } else if (period === "AM" && hours === 12) {
    currentMinutes -= 12 * 60;
  }

  let closestTime = timeOptions[0];
  let closestDiff = Infinity;

  timeOptions.forEach((timeOption) => {
    // Parse time option to get hours and minutes
    const [time, period] = timeOption.split(" ");
    const [hours, minutes] = time.split(":").map(Number);
    let timeMinutes = hours * 60 + minutes;

    // Convert to 24-hour format
    if (period === "PM" && hours !== 12) {
      timeMinutes += 12 * 60;
    } else if (period === "AM" && hours === 12) {
      timeMinutes -= 12 * 60;
    }

    const diff = Math.abs(currentMinutes - timeMinutes);
    if (diff < closestDiff) {
      closestDiff = diff;
      closestTime = timeOption;
    }
  });

  return closestTime;
};

export default function ReserveCorporateMobility() {
  const router = useRouter();
  const { setReservationData } = useReservationStore();

  const [activeBookingTab, setActiveBookingTab] = useState<
    "one-way" | "by-hour"
  >("one-way");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [fromLocation, setFromLocation] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("2 hours");

  // Autocomplete states
  const [pickupSuggestions, setPickupSuggestions] = useState<
    Array<{ description: string; place_id: string }>
  >([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState<
    Array<{ description: string; place_id: string }>
  >([]);
  const [fromSuggestions, setFromSuggestions] = useState<
    Array<{ description: string; place_id: string }>
  >([]);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [pickupLoading, setPickupLoading] = useState(false);
  const [dropoffLoading, setDropoffLoading] = useState(false);
  const [fromLoading, setFromLoading] = useState(false);
  const [pickupError, setPickupError] = useState<string | null>(null);
  const [dropoffError, setDropoffError] = useState<string | null>(null);
  const [fromError, setFromError] = useState<string | null>(null);
  const [autocompletePosition, setAutocompletePosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const [selectedDate, setSelectedDate] = useState(() => {
    const jordanNow = getJordanDate();
    return formatDate(jordanNow);
  });
  const [selectedTime, setSelectedTime] = useState(() => {
    const jordanNow = getJordanDate();
    const twoHoursLater = new Date(jordanNow.getTime() + 2 * 60 * 60 * 1000);
    const currentTime = formatTime(twoHoursLater);
    const timeOptions = generateTimeOptions();
    const closestTime = getClosestTime(currentTime, timeOptions);
    console.log(
      "Jordan Time:",
      formatTime(jordanNow),
      "Target:",
      currentTime,
      "Closest:",
      closestTime
    );
    return closestTime;
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarDate, setCalendarDate] = useState(() => getJordanDate());
  const [, setCalendarPosition] = useState({
    top: 0,
    left: 0,
  });

  // Close autocomplete dropdowns on click outside
  useEffect(() => {
    if (
      !showPickupSuggestions &&
      !showDropoffSuggestions &&
      !showFromSuggestions
    )
      return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".autocomplete-container")) {
        setShowPickupSuggestions(false);
        setShowDropoffSuggestions(false);
        setShowFromSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPickupSuggestions, showDropoffSuggestions, showFromSuggestions]);

  // Close calendar on click outside
  useEffect(() => {
    if (!showCalendar) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".calendar-container")) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCalendar]);

  const getMonthData = (date: Date) => {
    const jordanDate = new Date(
      date.toLocaleString("en-US", { timeZone: "Asia/Amman" })
    );
    const year = jordanDate.getFullYear();
    const month = jordanDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return { days };
  };

  const isDateDisabled = (date: Date) => {
    const today = getJordanDate();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      12,
      0,
      0
    );
    return compareDate < today;
  };

  const handleDateSelect = (date: Date) => {
    const jordanDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      12,
      0,
      0
    );
    const formattedDate = formatDate(jordanDate);
    setSelectedDate(formattedDate);
    setShowCalendar(false);
  };

  const calculateAutocompletePosition = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    return {
      top: rect.bottom + window.scrollY + 4,
      left: rect.left + window.scrollX,
      width: rect.width,
    };
  };

  const handleLocationInput = async (
    value: string,
    type: "pickup" | "dropoff" | "from",
    event?: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event?.target) {
      const position = calculateAutocompletePosition(
        event.target as HTMLElement
      );
      setAutocompletePosition(position);
    }

    if (type === "pickup") {
      setPickupLocation(value);
      setPickupError(null);
      if (value.length > 2) {
        setPickupLoading(true);
        const response = await autocomplete(value);
        setPickupSuggestions(response.results);
        setPickupError(response.error);
        setPickupLoading(false);
        setShowPickupSuggestions(true);
      } else {
        setShowPickupSuggestions(false);
      }
    } else if (type === "dropoff") {
      setDropoffLocation(value);
      setDropoffError(null);
      if (value.length > 2) {
        setDropoffLoading(true);
        const response = await autocomplete(value);
        setDropoffSuggestions(response.results);
        setDropoffError(response.error);
        setDropoffLoading(false);
        setShowDropoffSuggestions(true);
      } else {
        setShowDropoffSuggestions(false);
      }
    } else if (type === "from") {
      setFromLocation(value);
      setFromError(null);
      if (value.length > 2) {
        setFromLoading(true);
        const response = await autocomplete(value);
        setFromSuggestions(response.results);
        setFromError(response.error);
        setFromLoading(false);
        setShowFromSuggestions(true);
      } else {
        setShowFromSuggestions(false);
      }
    }
  };

  const handleSuggestionSelect = (
    suggestion: { description: string; place_id: string },
    type: "pickup" | "dropoff" | "from"
  ) => {
    if (type === "pickup") {
      setPickupLocation(suggestion.description);
      setShowPickupSuggestions(false);
    } else if (type === "dropoff") {
      setDropoffLocation(suggestion.description);
      setShowDropoffSuggestions(false);
    } else if (type === "from") {
      setFromLocation(suggestion.description);
      setShowFromSuggestions(false);
    }
  };

  const handleDateFieldClick = (event: React.MouseEvent) => {
    if (showCalendar) {
      setShowCalendar(false);
      return;
    }

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    setCalendarPosition({
      top: rect.bottom + window.scrollY + 4,
      left: rect.left + window.scrollX,
    });
    setShowCalendar(true);
  };

  const handleContinue = () => {
    if (
      activeBookingTab === "one-way" &&
      (!pickupLocation || !dropoffLocation)
    ) {
      alert("Please fill in pickup and dropoff locations");
      return;
    }
    if (activeBookingTab === "by-hour" && !fromLocation) {
      alert("Please fill in the from location");
      return;
    }

    const bookingData = {
      type: activeBookingTab,
      pickup: activeBookingTab === "one-way" ? pickupLocation : fromLocation,
      dropoff: activeBookingTab === "one-way" ? dropoffLocation : "",
      date: selectedDate,
      time: selectedTime,
      duration: activeBookingTab === "by-hour" ? selectedDuration : "",
    };

    setReservationData(bookingData);
    router.push("/reserve/service-class");
  };

  return (
    <div className="w-3/4 flex flex-col gap-4">
      <div className="bg-[#E2E2E2] rounded-lg border  text-[13px]">
        {/* Tab Navigation */}
        <div className="flex bg-[#E2E2E2] rounded-lg">
          <button
            onClick={() => setActiveBookingTab("one-way")}
            className={`flex-1 py-5 px-6 text-center text-base rounded-tl-md rounded-br-md transition-all ${
              activeBookingTab === "one-way"
                ? "bg-transparent text-gray-600 hover:text-gray-800 font-bold"
                : "bg-white text-black"
            }`}
          >
            ONE WAY
          </button>
          <button
            onClick={() => setActiveBookingTab("by-hour")}
            className={`flex-1 py-5 px-6 text-center text-base rounded-bl-md rounded-tr-md transition-all ${
              activeBookingTab === "by-hour"
                ? "bg-transparent text-gray-600 hover:text-gray-800 font-bold"
                : "bg-white text-black"
            }`}
          >
            BY THE HOUR
          </button>
        </div>

        <div className="px-8 py-8">
          {/* Form Fields */}
          <div className="space-y-4">
            {activeBookingTab === "one-way" ? (
              <>
                {/* Pickup Location */}
                <div className="relative">
                  <div className="relative flex flex-col bg-white rounded px-3 py-3 cursor-pointer hover:bg-gray-50 border border-transparent hover:border-[#4A4A4A] transition-all">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">
                      PICK UP LOCATION:
                    </div>
                    <div className="pl-0 pr-8 gap-1 flex items-center">
                      <LocationOnIcon
                        className="text-gray-400"
                        style={{ width: "15px", height: "15px" }}
                      />
                      <input
                        type="text"
                        value={pickupLocation}
                        onChange={(e) =>
                          handleLocationInput(e.target.value, "pickup", e)
                        }
                        placeholder="Address, airport, hotel, ..."
                        className="autocomplete-container w-full bg-transparent border-0 text-gray-700 text-sm focus:outline-none cursor-pointer p-0 placeholder-gray-500"
                      />
                    </div>
                    {pickupLocation ? (
                      <button
                        onClick={() => {
                          setPickupLocation("");
                          setShowPickupSuggestions(false);
                        }}
                        className="absolute right-3 bottom-1 transform -translate-y-1/2 w-5 h-5 bg-gray-400 hover:bg-gray-500 rounded-full flex items-center justify-center transition-all"
                      >
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    ) : (
                      <svg
                        className="absolute right-3 bottom-1 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <polygon points="0,0 10,0 5,10" />
                      </svg>
                    )}
                  </div>

                  {/* Pickup Suggestions Dropdown */}
                  {showPickupSuggestions && (
                    <div
                      className="autocomplete-container fixed bg-white border border-gray-300 rounded-md shadow-lg z-[120] max-h-60 overflow-y-auto"
                      style={{
                        top: `${autocompletePosition.top}px`,
                        left: `${autocompletePosition.left}px`,
                        width: `${autocompletePosition.width}px`,
                      }}
                    >
                      {pickupLoading && (
                        <div className="flex items-center px-3 py-2 text-sm text-gray-500">
                          <span>🔍 Searching...</span>
                        </div>
                      )}
                      {pickupError && (
                        <div className="flex items-center px-3 py-2 text-sm text-red-500">
                          <span>❌ {pickupError}</span>
                        </div>
                      )}
                      {!pickupLoading &&
                        !pickupError &&
                        pickupSuggestions.length === 0 && (
                          <div className="flex items-center px-3 py-2 text-sm text-gray-500">
                            <span>🏢 No locations found in Jordan</span>
                          </div>
                        )}
                      {!pickupLoading &&
                        pickupSuggestions.length > 0 &&
                        pickupSuggestions.map((suggestion) => (
                          <div
                            key={suggestion.place_id}
                            onClick={() =>
                              handleSuggestionSelect(suggestion, "pickup")
                            }
                            className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          >
                            <LocationOnIcon
                              className="text-gray-400 mr-2"
                              style={{ width: "16px", height: "16px" }}
                            />
                            <span>{suggestion.description}</span>
                          </div>
                        ))}

                      <div className="border-t border-gray-200 px-3 py-2 bg-gray-50 text-xs text-gray-600 flex items-start justify-start">
                        <span>powered by </span>
                        <Image
                          src="/images/google_logo.png"
                          alt="Google"
                          width={48}
                          height={16}
                          className="ml-1"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Drop off Location */}
                <div className="relative">
                  <div className="relative flex flex-col bg-white rounded px-3 py-3 cursor-pointer hover:bg-gray-50 border border-transparent hover:border-[#4A4A4A] transition-all">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">
                      DROP OFF LOCATION:
                    </div>
                    <div className="pl-0 pr-8 gap-1 flex items-center">
                      <LocationOnIcon
                        className="text-gray-400"
                        style={{ width: "15px", height: "15px" }}
                      />
                      <input
                        type="text"
                        value={dropoffLocation}
                        onChange={(e) =>
                          handleLocationInput(e.target.value, "dropoff", e)
                        }
                        placeholder="Address, airport, hotel, ..."
                        className="autocomplete-container w-full bg-transparent border-0 text-gray-700 text-sm focus:outline-none cursor-pointer p-0 placeholder-gray-500"
                      />
                    </div>
                    {dropoffLocation ? (
                      <button
                        onClick={() => {
                          setDropoffLocation("");
                          setShowDropoffSuggestions(false);
                        }}
                        className="absolute right-3 bottom-1 transform -translate-y-1/2 w-5 h-5 bg-gray-400 hover:bg-gray-500 rounded-full flex items-center justify-center transition-all"
                      >
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    ) : (
                      <svg
                        className="absolute right-3 bottom-1 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <polygon points="0,0 10,0 5,10" />
                      </svg>
                    )}
                  </div>

                  {/* Dropoff Suggestions */}
                  {showDropoffSuggestions && (
                    <div
                      className="autocomplete-container fixed bg-white border border-gray-300 rounded-md shadow-lg z-[120] max-h-60 overflow-y-auto"
                      style={{
                        top: `${autocompletePosition.top}px`,
                        left: `${autocompletePosition.left}px`,
                        width: `${autocompletePosition.width}px`,
                      }}
                    >
                      {dropoffLoading && (
                        <div className="flex items-center px-3 py-2 text-sm text-gray-500">
                          <span>🔍 Searching...</span>
                        </div>
                      )}
                      {dropoffError && (
                        <div className="flex items-center px-3 py-2 text-sm text-red-500">
                          <span>❌ {dropoffError}</span>
                        </div>
                      )}
                      {!dropoffLoading &&
                        !dropoffError &&
                        dropoffSuggestions.length === 0 && (
                          <div className="flex items-center px-3 py-2 text-sm text-gray-500">
                            <span>🏢 No locations found in Jordan</span>
                          </div>
                        )}
                      {!dropoffLoading &&
                        dropoffSuggestions.length > 0 &&
                        dropoffSuggestions.map((suggestion) => (
                          <div
                            key={suggestion.place_id}
                            onClick={() =>
                              handleSuggestionSelect(suggestion, "dropoff")
                            }
                            className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          >
                            <LocationOnIcon
                              className="text-gray-400 mr-2"
                              style={{ width: "16px", height: "16px" }}
                            />
                            <span>{suggestion.description}</span>
                          </div>
                        ))}

                      <div className="border-t border-gray-200 px-3 py-2 bg-gray-50 text-xs text-gray-600 flex items-start justify-start">
                        <span>powered by </span>
                        <Image
                          src="/images/google_logo.png"
                          alt="Google"
                          width={48}
                          height={16}
                          className="ml-1"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* From Location (BY THE HOUR) */}
                <div className="relative">
                  <div className="relative flex flex-col bg-white rounded px-3 py-3 cursor-pointer hover:bg-gray-50 border border-transparent hover:border-[#4A4A4A] transition-all">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">
                      FROM:
                    </div>
                    <div className="pl-0 pr-8 gap-1 flex items-center">
                      <LocationOnIcon
                        className="text-gray-400"
                        style={{ width: "15px", height: "15px" }}
                      />
                      <input
                        type="text"
                        value={fromLocation}
                        onChange={(e) =>
                          handleLocationInput(e.target.value, "from", e)
                        }
                        placeholder="Address, airport, hotel, ..."
                        className="autocomplete-container w-full bg-transparent border-0 text-gray-700 text-sm focus:outline-none cursor-pointer p-0 placeholder-gray-500"
                      />
                    </div>
                    {fromLocation ? (
                      <button
                        onClick={() => {
                          setFromLocation("");
                          setShowFromSuggestions(false);
                        }}
                        className="absolute right-3 bottom-1 transform -translate-y-1/2 w-5 h-5 bg-gray-400 hover:bg-gray-500 rounded-full flex items-center justify-center transition-all"
                      >
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    ) : (
                      <svg
                        className="absolute right-3 bottom-1 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <polygon points="0,0 10,0 5,10" />
                      </svg>
                    )}
                  </div>

                  {/* From Suggestions */}
                  {showFromSuggestions && (
                    <div
                      className="autocomplete-container fixed bg-white border border-gray-300 rounded-md shadow-lg z-[120] max-h-60 overflow-y-auto"
                      style={{
                        top: `${autocompletePosition.top}px`,
                        left: `${autocompletePosition.left}px`,
                        width: `${autocompletePosition.width}px`,
                      }}
                    >
                      {fromLoading && (
                        <div className="flex items-center px-3 py-2 text-sm text-gray-500">
                          <span>🔍 Searching...</span>
                        </div>
                      )}
                      {fromError && (
                        <div className="flex items-center px-3 py-2 text-sm text-red-500">
                          <span>❌ {fromError}</span>
                        </div>
                      )}
                      {!fromLoading &&
                        !fromError &&
                        fromSuggestions.length === 0 && (
                          <div className="flex items-center px-3 py-2 text-sm text-gray-500">
                            <span>🏢 No locations found in Jordan</span>
                          </div>
                        )}
                      {!fromLoading &&
                        fromSuggestions.length > 0 &&
                        fromSuggestions.map((suggestion) => (
                          <div
                            key={suggestion.place_id}
                            onClick={() =>
                              handleSuggestionSelect(suggestion, "from")
                            }
                            className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          >
                            <LocationOnIcon
                              className="text-gray-400 mr-2"
                              style={{ width: "16px", height: "16px" }}
                            />
                            <span>{suggestion.description}</span>
                          </div>
                        ))}

                      <div className="border-t border-gray-200 px-3 py-2 bg-gray-50 text-xs text-gray-600 flex items-start justify-start">
                        <span>powered by </span>
                        <Image
                          src="/images/google_logo.png"
                          alt="Google"
                          width={48}
                          height={16}
                          className="ml-1"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Duration */}
                <div className="relative">
                  <div className="relative flex flex-col bg-white rounded px-3 py-3 cursor-pointer hover:bg-gray-50 border border-transparent hover:border-[#4A4A4A] transition-all">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">
                      DURATION:
                    </div>
                    <div className="pl-0 pr-8 gap-1 flex items-center">
                      <AccessTimeIcon
                        className="text-gray-400"
                        style={{ width: "15px", height: "15px" }}
                      />
                      <select
                        value={selectedDuration}
                        onChange={(e) => setSelectedDuration(e.target.value)}
                        className="w-full bg-transparent border-0 text-gray-700 text-sm appearance-none focus:outline-none cursor-pointer p-0"
                      >
                        <option value="1 hour">1 hour</option>
                        <option value="2 hours">2 hours</option>
                        <option value="3 hours">3 hours</option>
                        <option value="Half Day">Half Day</option>
                        <option value="Full Day">Full Day</option>
                      </select>
                    </div>
                    <svg
                      className="absolute right-3 bottom-1 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <polygon points="0,0 10,0 5,10" />
                    </svg>
                  </div>
                </div>
              </>
            )}

            {/* Date and Time Row */}
            <div className="flex gap-4">
              {/* Date */}
              <div className="relative flex-[3]">
                <div
                  className="calendar-container relative flex flex-col bg-white rounded px-3 py-3 cursor-pointer hover:bg-gray-50 border border-transparent hover:border-[#4A4A4A] transition-all"
                  onClick={(e) => handleDateFieldClick(e)}
                >
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">
                    DATE:
                  </div>
                  <div className="pl-0 pr-8 gap-1 flex items-center">
                    <CalendarTodayIcon
                      className="text-gray-400"
                      style={{ width: "15px", height: "15px" }}
                    />
                    <div className="w-full text-gray-700 text-sm">
                      {selectedDate}
                    </div>
                  </div>
                  <svg
                    className="absolute right-3 bottom-1 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <polygon points="0,0 10,0 5,10" />
                  </svg>
                </div>

                {/* Calendar Dropdown */}
                {showCalendar && (
                  <div
                    className="calendar-container absolute bg-white border-2 border-black rounded-lg shadow-xl z-[1000] p-6 w-90 mt-1"
                    style={{
                      top: "100%",
                      left: "0",
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={() =>
                          setCalendarDate(
                            new Date(
                              calendarDate.getFullYear(),
                              calendarDate.getMonth() - 1
                            )
                          )
                        }
                        className="p-2 hover:bg-gray-100 rounded"
                      >
                        ←
                      </button>
                      <h3 className="text-lg font-semibold">
                        {calendarDate.toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                          timeZone: "Asia/Amman",
                        })}
                      </h3>
                      <button
                        onClick={() =>
                          setCalendarDate(
                            new Date(
                              calendarDate.getFullYear(),
                              calendarDate.getMonth() + 1
                            )
                          )
                        }
                        className="p-2 hover:bg-gray-100 rounded"
                      >
                        →
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-2 text-sm text-gray-600">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                        (day) => (
                          <div
                            key={day}
                            className="text-center p-2 font-medium"
                          >
                            {day}
                          </div>
                        )
                      )}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {getMonthData(calendarDate).days.map((day, index) => {
                        const isCurrentMonth =
                          day.getMonth() === calendarDate.getMonth();
                        const isDisabled = isDateDisabled(day);

                        return (
                          <button
                            key={index}
                            onClick={() => !isDisabled && handleDateSelect(day)}
                            disabled={isDisabled}
                            className={`
              p-2 text-sm rounded hover:bg-blue-100 transition-colors
              ${!isCurrentMonth ? "text-gray-300" : "text-gray-900"}
              ${isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
              ${!isDisabled && isCurrentMonth ? "hover:bg-blue-50" : ""}
            `}
                          >
                            {day.getDate()}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Time */}
              <div className="relative flex-[2]">
                <div className="relative flex flex-col bg-white rounded px-3 py-3 cursor-pointer hover:bg-gray-50 border border-transparent hover:border-[#4A4A4A] transition-all">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">
                    TIME:
                  </div>
                  <div className="pl-0 pr-8 gap-1 flex items-center">
                    <AccessTimeIcon
                      className="text-gray-400"
                      style={{ width: "15px", height: "15px" }}
                    />
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full bg-transparent border-0 text-gray-700 text-sm appearance-none focus:outline-none cursor-pointer p-0"
                    >
                      {generateTimeOptions().map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                  <svg
                    className="absolute right-3 bottom-1 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <polygon points="0,0 10,0 5,10" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[#777777] text-[11px] mt-3 text-center">
            Free 60 minutes wait time for airport pickups, 15 min for all others
          </p>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            className="w-full mt-3 py-4 bg-[#7C7C7C] text-white font-bold text-[16px] rounded transition-colors duration-200 hover:bg-[#6C6C6C]"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
