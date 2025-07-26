"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { autocomplete } from "@/lib/google-autocomplete";
import { useReservationStore } from "@/lib/reservation-store";

// Calendar helper functions - moved outside component
const getJordanDate = () => {
  // Create a new date object in Jordan timezone (GMT+3)
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

// Generate time options for the entire day (every 15 minutes)
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

// Find the closest time option to current Jordan time
const getClosestTime = (currentTime: string, timeOptions: string[]) => {
  // If exact match exists, use it
  if (timeOptions.includes(currentTime)) {
    return currentTime;
  }

  // Otherwise find closest 15-minute interval
  const jordanNow = getJordanDate();
  const currentMinutes = jordanNow.getHours() * 60 + jordanNow.getMinutes();

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

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const showBorder = pathname !== "/";

  // Zustand store
  const { setReservationData } = useReservationStore();

  const [servicesOpen, setServicesOpen] = useState(false);
  const [reservationOpen, setReservationOpen] = useState(false);
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
    console.log("Jordan Date:", formatDate(jordanNow)); // Debug log
    return formatDate(jordanNow);
  });
  const [selectedTime, setSelectedTime] = useState(() => {
    const jordanNow = getJordanDate();
    const currentTime = formatTime(jordanNow);
    const timeOptions = generateTimeOptions();
    const closestTime = getClosestTime(currentTime, timeOptions);
    console.log("Jordan Time:", currentTime, "Closest:", closestTime); // Debug log
    return closestTime;
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarDate, setCalendarDate] = useState(() => getJordanDate());
  const [calendarPosition, setCalendarPosition] = useState({
    top: 0,
    left: 0,
  });

  // Close dropdown on scroll
  useEffect(() => {
    if (!servicesOpen) return;
    const handleScroll = () => setServicesOpen(false);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [servicesOpen]);

  // Close dropdowns on scroll
  useEffect(() => {
    if (!reservationOpen && !servicesOpen) return;
    const handleScroll = () => {
      setReservationOpen(false);
      setServicesOpen(false);
      setShowCalendar(false);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [reservationOpen, servicesOpen]);

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

  // Close reservation dropdown on click outside
  useEffect(() => {
    if (!reservationOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      console.log("Click detected:", target);
      console.log(
        "Is reservation dropdown?",
        target.closest(".reservation-dropdown")
      );
      console.log(
        "Is reserve now button?",
        target.closest(".reserve-now-button")
      );

      if (
        !target.closest(".reservation-dropdown") &&
        !target.closest(".reserve-now-button")
      ) {
        console.log("Closing reservation dropdown");
        setReservationOpen(false);
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [reservationOpen]);

  const getMonthData = (date: Date) => {
    // Create dates in Jordan timezone to avoid offset issues
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
    // Create date at noon to avoid timezone issues
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
    // Create a proper date in Jordan timezone to avoid offset issues
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

  // Calculate autocomplete dropdown position
  const calculateAutocompletePosition = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    return {
      top: rect.bottom + window.scrollY + 4,
      left: rect.left + window.scrollX,
      width: rect.width,
    };
  };

  // Autocomplete handlers
  const handleLocationInput = async (
    value: string,
    type: "pickup" | "dropoff" | "from",
    event?: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log(`🔤 User typing in ${type} field:`, value);

    // Calculate position for dropdown
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
        console.log(`📍 Pickup autocomplete response:`, response);
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
        console.log(`📍 Dropoff autocomplete response:`, response);
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
        console.log(`📍 From autocomplete response:`, response);
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
    // Toggle calendar - close if already open
    if (showCalendar) {
      setShowCalendar(false);
      return;
    }

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const reservationDropdown = document.querySelector(
      ".reservation-dropdown"
    ) as HTMLElement;
    const reservationRect = reservationDropdown?.getBoundingClientRect();

    // Center calendar horizontally within the reservation popup (440px width - 360px calendar = 80px / 2 = 40px offset)
    const leftPosition = reservationRect
      ? reservationRect.left + 40
      : rect.left;

    setCalendarPosition({
      top: rect.bottom + window.scrollY + 4, // Just below the date field
      left: leftPosition + window.scrollX,
    });
    setShowCalendar(true);
  };

  const servicesList = [
    { label: "EXECUTIVE CLASS", slug: "executive" },
    { label: "LUXURY CLASS", slug: "luxury" },
    { label: "SUV CLASS", slug: "suv" },
    { label: "MPV CLASS", slug: "mpv" },
    { label: "AIRPORT TRANSFER", slug: "airport-transfer" },
    { label: "BUSINESS TRANSFER", slug: "business-transfer" },
    { label: "CITY-TO-CITY TRANSFER", slug: "city-to-city-transfer" },
    { label: "EVENT CHAUFFEUR", slug: "event-chauffeur" },
    { label: "EXCURSION", slug: "excursion" },
    {
      label: "TRAVEL PARTNER CONCIERGE ASSISTANT",
      slug: "travel-partner-concierge-assistant",
    },
    { label: "HOURLY AND FULL DAY HIRE", slug: "hourly-and-full-day-hire" },
  ];

  const navItems = [
    "SERVICES",
    "MEMBERSHIP",
    "CITIES & CLASSES",
    "CORPORATE MOBILITY",
    "RESERVE NOW",
  ];

  function handleNavClick(item: string) {
    if (item === "SERVICES") {
      setServicesOpen((o) => !o);
      setReservationOpen(false);
    } else if (item === "RESERVE NOW") {
      setServicesOpen(false);
      setReservationOpen((o) => !o);
    } else {
      setServicesOpen(false);
      setReservationOpen(false);
      // …normal navigation…
    }
  }

  return (
    <header className="relative z-50">
      {/* ——— Header bar ——— */}
      <div
        className={[
          "relative flex flex-col items-center justify-center",
          "bg-[url('/images/black-line-header.png')] bg-cover bg-top",
          "w-full h-52",
          showBorder ? "border-b" : "",
        ].join(" ")}
      >
        <div className="relative z-20 flex flex-col items-center gap-10">
          <Link href={"/"}>
            <Image
              alt="Jo Limo Logo"
              src="/images/jolimo-logo.png"
              width={82}
              height={82}
            />
          </Link>
          <nav className="flex items-center gap-[50px]">
            {navItems.map((item) => {
              if (item === "MEMBERSHIP") {
                return (
                  <Link
                    key={item}
                    href="/membership"
                    className="text-base font-medium hover:text-gray-500"
                    onClick={() => setServicesOpen(false)}
                  >
                    {item}
                  </Link>
                );
              }
              if (item === "CITIES & CLASSES") {
                return (
                  <Link
                    key={item}
                    href="/cities-and-classes"
                    className="text-base font-medium hover:text-gray-500"
                    onClick={() => setServicesOpen(false)}
                  >
                    {item}
                  </Link>
                );
              }
              if (item === "RESERVE NOW") {
                return (
                  <div key={item} className="relative">
                    <button
                      onClick={() => handleNavClick(item)}
                      className={`reserve-now-button text-base transition-all duration-200 ${
                        reservationOpen
                          ? "bg-black text-white px-4 py-1 rounded-[10px] font-bold"
                          : "px-4 py-1 font-medium hover:text-gray-500"
                      }`}
                    >
                      {item}
                    </button>

                    {/* ——— Reservation Dropdown ——— */}
                    <div
                      className={`
                        reservation-dropdown absolute top-full right-0 w-[440px] bg-[#E2E2E2] shadow-lg rounded-lg
                        overflow-hidden z-[60] mt-2
                        transition-all duration-700 ease-in-out text-[13px]
                        ${
                          reservationOpen
                            ? "max-h-[500px] opacity-100"
                            : "max-h-0 opacity-0 pointer-events-none"
                        }
                      `}
                    >
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
                                        handleLocationInput(
                                          e.target.value,
                                          "pickup",
                                          e
                                        )
                                      }
                                      placeholder="Address, airport, hotel, ..."
                                      className="autocomplete-container w-full bg-transparent border-0 text-gray-700 text-sm focus:outline-none cursor-pointer p-0 placeholder-gray-500"
                                    />
                                  </div>
                                  {pickupLocation ? (
                                    // Clear button when field has text
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
                                    // Default dropdown arrow when field is empty
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
                                          <span>
                                            🏢 No locations found in Jordan
                                          </span>
                                        </div>
                                      )}
                                    {!pickupLoading &&
                                      pickupSuggestions.length > 0 &&
                                      pickupSuggestions.map((suggestion) => (
                                        <div
                                          key={suggestion.place_id}
                                          onClick={() =>
                                            handleSuggestionSelect(
                                              suggestion,
                                              "pickup"
                                            )
                                          }
                                          className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                        >
                                          <LocationOnIcon
                                            className="text-gray-400 mr-2"
                                            style={{
                                              width: "16px",
                                              height: "16px",
                                            }}
                                          />
                                          <span>{suggestion.description}</span>
                                        </div>
                                      ))}

                                    {/* Powered by Google footer */}
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
                                        handleLocationInput(
                                          e.target.value,
                                          "dropoff",
                                          e
                                        )
                                      }
                                      placeholder="Address, airport, hotel, ..."
                                      className="autocomplete-container w-full bg-transparent border-0 text-gray-700 text-sm focus:outline-none cursor-pointer p-0 placeholder-gray-500"
                                    />
                                  </div>

                                  {dropoffLocation ? (
                                    // Clear button when field has text
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
                                    // Default dropdown arrow when field is empty
                                    <svg
                                      className="absolute right-3 bottom-1 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <polygon points="0,0 10,0 5,10" />
                                    </svg>
                                  )}
                                </div>

                                {/* Dropoff Suggestions Dropdown */}
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
                                          <span>
                                            🏢 No locations found in Jordan
                                          </span>
                                        </div>
                                      )}
                                    {!dropoffLoading &&
                                      dropoffSuggestions.length > 0 &&
                                      dropoffSuggestions.map((suggestion) => (
                                        <div
                                          key={suggestion.place_id}
                                          onClick={() =>
                                            handleSuggestionSelect(
                                              suggestion,
                                              "dropoff"
                                            )
                                          }
                                          className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                        >
                                          <LocationOnIcon
                                            className="text-gray-400 mr-2"
                                            style={{
                                              width: "16px",
                                              height: "16px",
                                            }}
                                          />
                                          <span>{suggestion.description}</span>
                                        </div>
                                      ))}

                                    {/* Powered by Google footer */}
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
                                        style={{
                                          width: "15px",
                                          height: "15px",
                                        }}
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
                                      className="calendar-container fixed bg-white border-2 border-black rounded-lg shadow-xl z-[90] p-6 w-90 ml-[-10px]"
                                      style={{
                                        top: `${calendarPosition.top}px`,
                                        left: `${calendarPosition.left}px`,
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
                                          {calendarDate.toLocaleDateString(
                                            "en-US",
                                            {
                                              month: "long",
                                              year: "numeric",
                                              timeZone: "Asia/Amman",
                                            }
                                          )}
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
                                        <div className="text-center p-2 font-medium">
                                          Sun
                                        </div>
                                        <div className="text-center p-2 font-medium">
                                          Mon
                                        </div>
                                        <div className="text-center p-2 font-medium">
                                          Tue
                                        </div>
                                        <div className="text-center p-2 font-medium">
                                          Wed
                                        </div>
                                        <div className="text-center p-2 font-medium">
                                          Thu
                                        </div>
                                        <div className="text-center p-2 font-medium">
                                          Fri
                                        </div>
                                        <div className="text-center p-2 font-medium">
                                          Sat
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-7 gap-1">
                                        {getMonthData(calendarDate).days.map(
                                          (day, index) => {
                                            const isCurrentMonth =
                                              day.getMonth() ===
                                              calendarDate.getMonth();
                                            const isDisabled =
                                              isDateDisabled(day);

                                            return (
                                              <button
                                                key={index}
                                                onClick={() =>
                                                  !isDisabled &&
                                                  handleDateSelect(day)
                                                }
                                                disabled={isDisabled}
                                                className={`
                                                p-2 text-sm rounded hover:bg-blue-100 transition-colors
                                                ${
                                                  !isCurrentMonth
                                                    ? "text-gray-300"
                                                    : "text-gray-900"
                                                }
                                                ${
                                                  isDisabled
                                                    ? "cursor-not-allowed opacity-50"
                                                    : "cursor-pointer"
                                                }
                                                ${
                                                  !isDisabled && isCurrentMonth
                                                    ? "hover:bg-blue-50"
                                                    : ""
                                                }
                                              `}
                                              >
                                                {day.getDate()}
                                              </button>
                                            );
                                          }
                                        )}
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
                                        style={{
                                          width: "15px",
                                          height: "15px",
                                        }}
                                      />
                                      <select
                                        value={selectedTime}
                                        onChange={(e) =>
                                          setSelectedTime(e.target.value)
                                        }
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
                                        handleLocationInput(
                                          e.target.value,
                                          "from",
                                          e
                                        )
                                      }
                                      placeholder="Address, airport, hotel, ..."
                                      className="autocomplete-container w-full bg-transparent border-0 text-gray-700 text-sm focus:outline-none cursor-pointer p-0 placeholder-gray-500"
                                    />
                                  </div>

                                  {fromLocation ? (
                                    // Clear button when field has text
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
                                    // Default dropdown arrow when field is empty
                                    <svg
                                      className="absolute right-3 bottom-1 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <polygon points="0,0 10,0 5,10" />
                                    </svg>
                                  )}
                                </div>

                                {/* From Suggestions Dropdown */}
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
                                          <span>
                                            🏢 No locations found in Jordan
                                          </span>
                                        </div>
                                      )}
                                    {!fromLoading &&
                                      fromSuggestions.length > 0 &&
                                      fromSuggestions.map((suggestion) => (
                                        <div
                                          key={suggestion.place_id}
                                          onClick={() =>
                                            handleSuggestionSelect(
                                              suggestion,
                                              "from"
                                            )
                                          }
                                          className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                        >
                                          <LocationOnIcon
                                            className="text-gray-400 mr-2"
                                            style={{
                                              width: "16px",
                                              height: "16px",
                                            }}
                                          />
                                          <span>{suggestion.description}</span>
                                        </div>
                                      ))}

                                    {/* Powered by Google footer */}
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
                                      onChange={(e) =>
                                        setSelectedDuration(e.target.value)
                                      }
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
                                        style={{
                                          width: "15px",
                                          height: "15px",
                                        }}
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
                                      className="calendar-container fixed bg-white border-2 border-black rounded-lg shadow-xl z-[90] p-6 w-90 ml-[-10px]"
                                      style={{
                                        top: `${calendarPosition.top}px`,
                                        left: `${calendarPosition.left}px`,
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
                                          {calendarDate.toLocaleDateString(
                                            "en-US",
                                            {
                                              month: "long",
                                              year: "numeric",
                                              timeZone: "Asia/Amman",
                                            }
                                          )}
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
                                        <div className="text-center p-2 font-medium">
                                          Sun
                                        </div>
                                        <div className="text-center p-2 font-medium">
                                          Mon
                                        </div>
                                        <div className="text-center p-2 font-medium">
                                          Tue
                                        </div>
                                        <div className="text-center p-2 font-medium">
                                          Wed
                                        </div>
                                        <div className="text-center p-2 font-medium">
                                          Thu
                                        </div>
                                        <div className="text-center p-2 font-medium">
                                          Fri
                                        </div>
                                        <div className="text-center p-2 font-medium">
                                          Sat
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-7 gap-1">
                                        {getMonthData(calendarDate).days.map(
                                          (day, index) => {
                                            const isCurrentMonth =
                                              day.getMonth() ===
                                              calendarDate.getMonth();
                                            const isDisabled =
                                              isDateDisabled(day);

                                            return (
                                              <button
                                                key={index}
                                                onClick={() =>
                                                  !isDisabled &&
                                                  handleDateSelect(day)
                                                }
                                                disabled={isDisabled}
                                                className={`
                                                p-2 text-sm rounded hover:bg-blue-100 transition-colors
                                                ${
                                                  !isCurrentMonth
                                                    ? "text-gray-300"
                                                    : "text-gray-900"
                                                }
                                                ${
                                                  isDisabled
                                                    ? "cursor-not-allowed opacity-50"
                                                    : "cursor-pointer"
                                                }
                                                ${
                                                  !isDisabled && isCurrentMonth
                                                    ? "hover:bg-blue-50"
                                                    : ""
                                                }
                                              `}
                                              >
                                                {day.getDate()}
                                              </button>
                                            );
                                          }
                                        )}
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
                                        style={{
                                          width: "15px",
                                          height: "15px",
                                        }}
                                      />
                                      <select
                                        value={selectedTime}
                                        onChange={(e) =>
                                          setSelectedTime(e.target.value)
                                        }
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
                            </>
                          )}
                        </div>

                        <p className="text-[#777777] text-[11px] mt-3 text-center">
                          Free 60 minutes wait time for airport pickups, 15 min
                          for all others
                        </p>

                        {/* Continue Button */}
                        <button
                          onClick={() => {
                            // Only proceed if we have required data for one-way bookings
                            if (
                              activeBookingTab === "one-way" &&
                              (!pickupLocation || !dropoffLocation)
                            ) {
                              alert(
                                "Please fill in pickup and dropoff locations"
                              );
                              return;
                            }
                            if (
                              activeBookingTab === "by-hour" &&
                              !fromLocation
                            ) {
                              alert("Please fill in the from location");
                              return;
                            }

                            // Prepare booking data
                            const bookingData = {
                              type: activeBookingTab,
                              pickup:
                                activeBookingTab === "one-way"
                                  ? pickupLocation
                                  : fromLocation,
                              dropoff:
                                activeBookingTab === "one-way"
                                  ? dropoffLocation
                                  : "",
                              date: selectedDate,
                              time: selectedTime,
                              duration:
                                activeBookingTab === "by-hour"
                                  ? selectedDuration
                                  : "",
                            };

                            // Save data to Zustand store
                            setReservationData(bookingData);

                            // Navigate to reservation flow (no query params needed)
                            router.push("/reserve/service-class");
                            setReservationOpen(false);
                          }}
                          className="w-full mt-3 py-4 bg-[#7C7C7C] text-white font-bold text-[16px]  rounded transition-colors duration-200"
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }
              // All others still use the toggle/nav handler
              return (
                <button
                  key={item}
                  onClick={() => handleNavClick(item)}
                  className="text-base font-medium hover:text-gray-500"
                >
                  {item}
                </button>
              );
            })}
          </nav>
        </div>
        <div
          className="absolute bottom-0 left-0 w-full h-[180px]
             bg-gradient-to-t from-white to-transparent
             pointer-events-none z-10"
        />
      </div>

      {/* ——— Backdrop — only for services dropdown ——— */}
      {servicesOpen && (
        <div
          onClick={() => setServicesOpen(false)}
          className="
            fixed inset-x-0 bottom-0
            top-[13rem]
            bg-black bg-opacity-50
            transition-opacity duration-700
            z-40
          "
        />
      )}

      {/* ——— Services Dropdown ——— */}
      <div
        className={`
          absolute top-full left-0 w-full bg-white shadow-lg
          overflow-hidden z-50
          transition-all duration-700 ease-in-out pb-10
          ${
            servicesOpen
              ? "max-h-[600px] opacity-100"
              : "max-h-0 opacity-0 pointer-events-none"
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-8 py-8 flex gap-12">
          {/* Left: links */}
          <div className="flex-shrink-0 flex flex-col gap-4 text-lg text-gray-700">
            {servicesList.map(({ label, slug }) => (
              <Link
                key={slug}
                href={`/services/${slug}`}
                onClick={() => setServicesOpen(false)}
                className="cursor-pointer hover:text-black"
              >
                {label}
              </Link>
            ))}
          </div>
          {/* Right: images */}
          <div className="flex gap-8">
            <div className="flex flex-col">
              <Link
                href="/services/airport-transfer"
                className="overflow-hidden w-[271px] h-[208px]"
              >
                <Image
                  src="/images/intercity-transfer-img.webp"
                  alt="City-to-City Transfer"
                  width={271}
                  height={208}
                  className="object-cover w-[271px] h-[208px] transition-transform duration-300 hover:scale-110"
                />
              </Link>
              <p className="mt-2 text-sm text-gray-500">
                Stress-Free Airport Transfers, Every Time
              </p>
            </div>
            <div className="flex flex-col">
              <Link
                href="/services/business-transfer"
                className="overflow-hidden w-[456px] h-[350px]"
              >
                <Image
                  src="/images/executive-img.webp"
                  alt="Executive Class"
                  width={456}
                  height={350}
                  className="object-cover w-[456px] h-[350px] transition-transform duration-300 hover:scale-110"
                />
              </Link>
              <p className="mt-2 text-sm text-gray-500">
                Redefining Business Transfers with Comfort and Class
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
