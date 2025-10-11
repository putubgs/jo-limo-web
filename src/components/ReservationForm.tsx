"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FlightIcon from "@mui/icons-material/Flight";
import { autocomplete } from "@/lib/google-autocomplete";
import { useReservationStore } from "@/lib/reservation-store";
import {
  getJordanDate,
  formatDate,
  formatTime,
  generateTimeOptions,
  getClosestTime,
  getMonthData,
  isDateDisabled,
} from "@/lib/date-time-utils";

interface ReservationFormProps {
  // Layout variants
  variant?: "popup" | "page";
  // Custom styling
  containerClassName?: string;
  // Navigation paths
  continueUrl?: string;
  // Callbacks
  onClose?: () => void;
  onContinue?: () => void;
}

export default function ReservationForm({
  variant = "page",
  containerClassName = "",
  continueUrl,
  onClose,
  onContinue,
}: ReservationFormProps) {
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
  // No external positioning needed; dropdowns are placed relative to inputs

  const [selectedDate, setSelectedDate] = useState(() => {
    const jordanNow = getJordanDate();
    console.log("Jordan Date:", formatDate(jordanNow)); // Debug log
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
  const [calendarDate, setCalendarDate] = useState(() => {
    const jordanNow = getJordanDate();
    // Set to first day of current month to avoid date issues
    return new Date(jordanNow.getFullYear(), jordanNow.getMonth(), 1);
  });
  // Calendar uses absolute positioning under the input; no external state needed

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

  // Helper function to check if a suggestion is an airport
  const isAirportLocation = (description: string): boolean => {
    const lowerDesc = description.toLowerCase();
    return (
      lowerDesc.includes("queen alia international airport") ||
      lowerDesc.includes("aqaba international airport")
    );
  };

  // Calculate autocomplete dropdown position
  // No external calculation needed for dropdown positioning; kept for previous API parity

  // Autocomplete handlers
  const handleLocationInput = async (
    value: string,
    type: "pickup" | "dropoff" | "from"
  ) => {
    console.log(`🔤 User typing in ${type} field:`, value);

    if (type === "pickup") {
      setPickupLocation(value);
      setPickupError(null);
      // Close other dropdowns
      setShowDropoffSuggestions(false);
      setShowFromSuggestions(false);
      if (value.length > 2) {
        setPickupLoading(true);
        const response = await autocomplete(value);
        console.log(`📍 Pickup autocomplete response:`, response);
        const normalized = response.results.map((r) => ({
          ...r,
          description: r.description.replace(
            /king hussein international airport/gi,
            "Aqaba International Airport"
          ),
        }));
        setPickupSuggestions(normalized);
        setPickupError(response.error);
        setPickupLoading(false);
        setShowPickupSuggestions(true);
      } else {
        setShowPickupSuggestions(false);
      }
    } else if (type === "dropoff") {
      setDropoffLocation(value);
      setDropoffError(null);
      // Close other dropdowns
      setShowPickupSuggestions(false);
      setShowFromSuggestions(false);
      if (value.length > 2) {
        setDropoffLoading(true);
        const response = await autocomplete(value);
        console.log(`📍 Dropoff autocomplete response:`, response);
        const normalized = response.results.map((r) => ({
          ...r,
          description: r.description.replace(
            /king hussein international airport/gi,
            "Aqaba International Airport"
          ),
        }));
        setDropoffSuggestions(normalized);
        setDropoffError(response.error);
        setDropoffLoading(false);
        setShowDropoffSuggestions(true);
      } else {
        setShowDropoffSuggestions(false);
      }
    } else if (type === "from") {
      setFromLocation(value);
      setFromError(null);
      // Close other dropdowns
      setShowPickupSuggestions(false);
      setShowDropoffSuggestions(false);
      if (value.length > 2) {
        setFromLoading(true);
        const response = await autocomplete(value);
        console.log(`📍 From autocomplete response:`, response);
        const normalized = response.results.map((r) => ({
          ...r,
          description: r.description.replace(
            /king hussein international airport/gi,
            "Aqaba International Airport"
          ),
        }));
        setFromSuggestions(normalized);
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

  const handleDateFieldClick = () => {
    // Toggle calendar - close if already open
    if (showCalendar) {
      setShowCalendar(false);
      return;
    }

    // Set calendar to show the month of the selected date, or current month if no date selected
    let targetDate;
    if (selectedDate && selectedDate.trim() !== "") {
      // Parse the selected date and navigate to that month
      // selectedDate format is like "Mon, Oct 28, 2024" from formatDate()
      const parsedSelectedDate = new Date(selectedDate);
      if (!isNaN(parsedSelectedDate.getTime())) {
        // Successfully parsed, navigate to that month
        targetDate = new Date(
          parsedSelectedDate.getFullYear(),
          parsedSelectedDate.getMonth(),
          1
        );
      } else {
        // Fallback to current month if parsing fails
        console.warn("Failed to parse selected date:", selectedDate);
        const currentDate = getJordanDate();
        targetDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        );
      }
    } else {
      // No date selected, use current month
      const currentDate = getJordanDate();
      targetDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
    }

    console.log("📅 Calendar opening - navigating to:", {
      selectedDate,
      targetDate,
      isSelectedDateValid:
        selectedDate && !isNaN(new Date(selectedDate).getTime()),
    });
    setCalendarDate(targetDate);

    setShowCalendar(true);
  };

  const handleContinue = () => {
    // Only proceed if we have required data for one-way bookings
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

    // Prepare booking data
    const bookingData = {
      type: activeBookingTab,
      pickup: activeBookingTab === "one-way" ? pickupLocation : fromLocation,
      dropoff: activeBookingTab === "one-way" ? dropoffLocation : "",
      date: selectedDate,
      time: selectedTime,
      duration: activeBookingTab === "by-hour" ? selectedDuration : "",
    };

    // Save data to Zustand store
    console.log("💾 RESERVATION FORM - Saving booking data:", bookingData);
    setReservationData(bookingData);
    console.log("💾 RESERVATION FORM - Data saved to store");

    // Call custom onContinue if provided, otherwise navigate
    if (onContinue) {
      onContinue();
    } else if (continueUrl) {
      router.push(continueUrl);
    } else {
      // Default navigation
      router.push("/reserve/service-class");
    }

    // Close popup if in popup variant
    if (variant === "popup" && onClose) {
      onClose();
    }
  };

  // Render autocomplete suggestions
  const renderAutocompleteDropdown = (
    type: "pickup" | "dropoff" | "from",
    suggestions: Array<{ description: string; place_id: string }>,
    loading: boolean,
    error: string | null,
    showSuggestions: boolean
  ) =>
    showSuggestions && (
      <div
        className={`autocomplete-container absolute bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto z-[120]`}
        style={{ top: "100%", left: "0", width: "100%" }}
      >
        {loading && (
          <div className="flex items-center px-3 py-2 text-sm text-gray-500">
            <span>🔍 Searching...</span>
          </div>
        )}
        {error && (
          <div className="flex items-center px-3 py-2 text-sm text-red-500">
            <span>❌ {error}</span>
          </div>
        )}
        {!loading && !error && suggestions.length === 0 && (
          <div className="flex items-center px-3 py-2 text-sm text-gray-500">
            <span>🏢 No locations found in Jordan</span>
          </div>
        )}
        {!loading &&
          suggestions.length > 0 &&
          suggestions.map((suggestion) => (
            <div
              key={suggestion.place_id}
              onClick={() => handleSuggestionSelect(suggestion, type)}
              className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {isAirportLocation(suggestion.description) ? (
                <FlightIcon
                  className="text-gray-400 mr-2"
                  style={{ width: "16px", height: "16px" }}
                />
              ) : (
                <LocationOnIcon
                  className="text-gray-400 mr-2"
                  style={{ width: "16px", height: "16px" }}
                />
              )}
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
    );

  // Render location input field
  const renderLocationField = (
    type: "pickup" | "dropoff" | "from",
    label: string,
    value: string,
    placeholder: string = "Address, airport, hotel, ...",
    onClear: () => void
  ) => (
    <div className="relative">
      <div className="relative flex flex-col bg-white rounded px-3 py-3 cursor-pointer hover:bg-gray-50 border border-transparent hover:border-[#4A4A4A] transition-all">
        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">
          {label}:
        </div>
        <div className="pl-0 pr-8 gap-1 flex items-center">
          <LocationOnIcon
            className="text-gray-400"
            style={{ width: "15px", height: "15px" }}
          />
          <input
            type="text"
            value={value}
            onChange={(e) => handleLocationInput(e.target.value, type)}
            placeholder={placeholder}
            className="autocomplete-container w-full bg-transparent border-0 text-gray-700 text-sm focus:outline-none cursor-pointer p-0 placeholder-gray-500"
          />
        </div>
        {value ? (
          // Clear button when field has text
          <button
            onClick={onClear}
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

      {/* Autocomplete dropdown positioned relative to this specific input */}
      {type === "pickup" &&
        renderAutocompleteDropdown(
          "pickup",
          pickupSuggestions,
          pickupLoading,
          pickupError,
          showPickupSuggestions
        )}
      {type === "dropoff" &&
        renderAutocompleteDropdown(
          "dropoff",
          dropoffSuggestions,
          dropoffLoading,
          dropoffError,
          showDropoffSuggestions
        )}
      {type === "from" &&
        renderAutocompleteDropdown(
          "from",
          fromSuggestions,
          fromLoading,
          fromError,
          showFromSuggestions
        )}
    </div>
  );

  const baseContainerClasses = `bg-[#E2E2E2] rounded-lg text-[13px]`;
  const containerClasses = containerClassName
    ? `${baseContainerClasses} ${containerClassName}`
    : variant === "popup"
    ? `${baseContainerClasses} w-[440px] shadow-lg overflow-visible`
    : `${baseContainerClasses} border`;

  return (
    <div className={containerClasses}>
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
              {renderLocationField(
                "pickup",
                "PICK UP LOCATION",
                pickupLocation,
                "Address, airport, hotel, ...",
                () => {
                  setPickupLocation("");
                  setShowPickupSuggestions(false);
                }
              )}

              {/* Drop off Location */}
              {renderLocationField(
                "dropoff",
                "DROP OFF LOCATION",
                dropoffLocation,
                "Address, airport, hotel, ...",
                () => {
                  setDropoffLocation("");
                  setShowDropoffSuggestions(false);
                }
              )}
            </>
          ) : (
            <>
              {/* From Location (BY THE HOUR) */}
              {renderLocationField(
                "from",
                "FROM",
                fromLocation,
                "Address, airport, hotel, ...",
                () => {
                  setFromLocation("");
                  setShowFromSuggestions(false);
                }
              )}

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
                      <option value="Half Day">Half Day (3-6 hours)</option>
                      <option value="Full Day">Full Day (6-12 hours)</option>
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
                onClick={() => handleDateFieldClick()}
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
                  className={`calendar-container absolute bg-white border-2 border-black rounded-lg shadow-xl z-[90] p-6 w-80 ${
                    variant === "page" ? "mt-1" : "ml-[-10px]"
                  }`}
                  style={{ top: "100%", left: "0" }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => {
                        setCalendarDate((prevDate) => {
                          const newDate = new Date(
                            prevDate.getFullYear(),
                            prevDate.getMonth() - 1,
                            1
                          );
                          console.log("📅 Previous month clicked:", {
                            current: prevDate,
                            new: newDate,
                          });
                          return newDate;
                        });
                      }}
                      disabled={(() => {
                        const currentMonth = getJordanDate();
                        const prevMonth = new Date(
                          calendarDate.getFullYear(),
                          calendarDate.getMonth() - 1,
                          1
                        );
                        return (
                          prevMonth <
                          new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth(),
                            1
                          )
                        );
                      })()}
                      className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ←
                    </button>
                    <h3 className="text-lg font-semibold">
                      {calendarDate.toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </h3>
                    <button
                      onClick={() => {
                        setCalendarDate((prevDate) => {
                          const newDate = new Date(
                            prevDate.getFullYear(),
                            prevDate.getMonth() + 1,
                            1
                          );
                          console.log("📅 Next month clicked:", {
                            current: prevDate,
                            new: newDate,
                          });
                          return newDate;
                        });
                      }}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      →
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 mb-2 text-sm text-gray-600">
                    <div className="text-center p-2 font-medium min-h-[32px] flex items-center justify-center">
                      Sun
                    </div>
                    <div className="text-center p-2 font-medium min-h-[32px] flex items-center justify-center">
                      Mon
                    </div>
                    <div className="text-center p-2 font-medium min-h-[32px] flex items-center justify-center">
                      Tue
                    </div>
                    <div className="text-center p-2 font-medium min-h-[32px] flex items-center justify-center">
                      Wed
                    </div>
                    <div className="text-center p-2 font-medium min-h-[32px] flex items-center justify-center">
                      Thu
                    </div>
                    <div className="text-center p-2 font-medium min-h-[32px] flex items-center justify-center">
                      Fri
                    </div>
                    <div className="text-center p-2 font-medium min-h-[32px] flex items-center justify-center">
                      Sat
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {getMonthData(calendarDate).days.map((day) => {
                      const isCurrentMonth =
                        day.getMonth() === calendarDate.getMonth();
                      const isDisabled = isDateDisabled(day);
                      const jordanToday = getJordanDate();
                      const isToday =
                        day.toDateString() === jordanToday.toDateString();

                      // Check if this day is the selected date
                      const isSelected =
                        selectedDate &&
                        selectedDate.trim() !== "" &&
                        (() => {
                          const parsedSelectedDate = new Date(selectedDate);
                          if (isNaN(parsedSelectedDate.getTime())) return false;

                          // Compare using date strings to avoid timezone issues
                          const dayStr = `${day.getFullYear()}-${(
                            day.getMonth() + 1
                          )
                            .toString()
                            .padStart(2, "0")}-${day
                            .getDate()
                            .toString()
                            .padStart(2, "0")}`;
                          const selectedStr = `${parsedSelectedDate.getFullYear()}-${(
                            parsedSelectedDate.getMonth() + 1
                          )
                            .toString()
                            .padStart(2, "0")}-${parsedSelectedDate
                            .getDate()
                            .toString()
                            .padStart(2, "0")}`;

                          return dayStr === selectedStr;
                        })();

                      return (
                        <button
                          key={`${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`}
                          onClick={() => !isDisabled && handleDateSelect(day)}
                          disabled={isDisabled}
                          className={`
                            p-2 text-sm rounded transition-colors min-h-[32px] flex items-center justify-center
                            ${
                              !isCurrentMonth
                                ? "text-gray-300"
                                : isSelected
                                ? "bg-green-500 text-white font-semibold"
                                : isToday
                                ? "bg-blue-500 text-white font-semibold"
                                : "text-gray-900"
                            }
                            ${
                              isDisabled
                                ? "cursor-not-allowed opacity-50"
                                : "cursor-pointer"
                            }
                            ${
                              !isDisabled &&
                              isCurrentMonth &&
                              !isToday &&
                              !isSelected
                                ? "hover:bg-blue-50"
                                : ""
                            }
                            ${
                              !isDisabled && !isCurrentMonth
                                ? "hover:bg-gray-100"
                                : ""
                            }
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
                    style={{
                      width: "15px",
                      height: "15px",
                    }}
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
  );
}
