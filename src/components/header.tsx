"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export default function Header() {
  const pathname = usePathname();
  const showBorder = pathname !== "/";
  const [servicesOpen, setServicesOpen] = useState(false);
  const [reservationOpen, setReservationOpen] = useState(false);
  const [activeBookingTab, setActiveBookingTab] = useState<
    "one-way" | "by-hour"
  >("one-way");
  const [pickupLocation, setPickupLocation] = useState(
    "Queen Alia International Airport"
  );
  const [dropoffLocation, setDropoffLocation] = useState(
    "DAMAC Tower, Al-Istethmar Street, Amman, Jordan"
  );
  const [selectedDate, setSelectedDate] = useState("Wed, Aug 7, 2024");
  const [selectedTime, setSelectedTime] = useState("10:45 AM");
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());
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

  // Calendar helper functions
  const getJordanDate = () => {
    return new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Amman" })
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "Asia/Amman",
    });
  };

  const getMonthData = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
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
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate < today;
  };

  const handleDateSelect = (date: Date) => {
    const formattedDate = formatDate(date);
    setSelectedDate(formattedDate);
    setShowCalendar(false);
  };

  const handleDateFieldClick = (event: React.MouseEvent) => {
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
    { label: "INTERCITY TRANSFER", slug: "intercity-transfer" },
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
                      className="text-base font-medium hover:text-gray-500"
                    >
                      {item}
                    </button>

                    {/* ——— Reservation Dropdown ——— */}
                    <div
                      className={`
                        reservation-dropdown absolute top-full right-0 w-[440px] bg-white shadow-lg rounded-lg
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
                      <div className="flex bg-white rounded-lg">
                        <button
                          onClick={() => setActiveBookingTab("one-way")}
                          className={`flex-1 py-5 px-6 text-center text-base rounded-tl-md rounded-br-md transition-all ${
                            activeBookingTab === "one-way"
                              ? "bg-transparent text-gray-600 hover:text-gray-800 font-bold"
                              : "bg-gray-200 text-black"
                          }`}
                        >
                          ONE WAY
                        </button>
                        <button
                          onClick={() => setActiveBookingTab("by-hour")}
                          className={`flex-1 py-5 px-6 text-center text-base rounded-bl-md rounded-tr-md transition-all ${
                            activeBookingTab === "by-hour"
                              ? "bg-transparent text-gray-600 hover:text-gray-800 font-bold"
                              : "bg-gray-200 text-black"
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
                                <div className="relative flex flex-col bg-gray-200 rounded px-3 py-3 cursor-pointer hover:bg-gray-100 transition-colors">
                                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">
                                    PICK UP LOCATION:
                                  </div>
                                  <div className="pl-0 pr-8 gap-1 flex items-center">
                                    <LocationOnIcon
                                      className="text-gray-400"
                                      style={{ width: "15px", height: "15px" }}
                                    />
                                    <select
                                      value={pickupLocation}
                                      onChange={(e) =>
                                        setPickupLocation(e.target.value)
                                      }
                                      className="w-full bg-transparent border-0 text-gray-700 text-sm appearance-none focus:outline-none cursor-pointer p-0"
                                    >
                                      <option value="Queen Alia International Airport">
                                        Queen Alia International Airport
                                      </option>
                                      <option value="Amman City Center">
                                        Amman City Center
                                      </option>
                                      <option value="Dead Sea">Dead Sea</option>
                                      <option value="Petra">Petra</option>
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

                              {/* Drop off Location */}
                              <div className="relative">
                                <div className="relative flex flex-col bg-gray-200 rounded px-3 py-3 cursor-pointer hover:bg-gray-100 transition-colors">
                                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">
                                    DROP OFF LOCATION:
                                  </div>
                                  <div className="pl-0 pr-8 gap-1 flex items-center">
                                    <LocationOnIcon
                                      className="text-gray-400"
                                      style={{ width: "15px", height: "15px" }}
                                    />
                                    <select
                                      value={dropoffLocation}
                                      onChange={(e) =>
                                        setDropoffLocation(e.target.value)
                                      }
                                      className="w-full bg-transparent border-0 text-gray-700 text-sm appearance-none focus:outline-none cursor-pointer p-0"
                                    >
                                      <option value="Queen Alia International Airport">
                                        Queen Alia International Airport
                                      </option>
                                      <option value="Amman City Center">
                                        Amman City Center
                                      </option>
                                      <option value="Dead Sea">Dead Sea</option>
                                      <option value="Petra">Petra</option>
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
                                    className="calendar-container relative flex flex-col bg-gray-200 rounded px-3 py-3 cursor-pointer hover:bg-gray-100 transition-colors"
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
                                  </div>

                                  {/* Calendar Dropdown */}
                                  {showCalendar && (
                                    <div
                                      className="calendar-container fixed bg-white border-2 border-black rounded-lg shadow-xl z-[90] p-6 w-90 mt-[-50px] ml-[-10px]"
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
                                  <div className="relative flex flex-col bg-gray-200 rounded px-3 py-3 cursor-pointer hover:bg-gray-100 transition-colors">
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
                                        <option value="10:45 AM">
                                          10:45 AM
                                        </option>
                                        <option value="11:00 AM">
                                          11:00 AM
                                        </option>
                                        <option value="11:15 AM">
                                          11:15 AM
                                        </option>
                                        <option value="11:30 AM">
                                          11:30 AM
                                        </option>
                                        <option value="12:00 PM">
                                          12:00 PM
                                        </option>
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
                                <div className="relative flex flex-col bg-gray-200 rounded px-3 py-3 cursor-pointer hover:bg-gray-100 transition-colors">
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
                                      placeholder="Address, airport, hotel, ..."
                                      className="w-full bg-transparent border-0 text-gray-700 text-sm focus:outline-none cursor-pointer p-0 placeholder-gray-500"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Duration */}
                              <div className="relative">
                                <div className="relative flex flex-col bg-gray-200 rounded px-3 py-3 cursor-pointer hover:bg-gray-100 transition-colors">
                                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">
                                    DURATION:
                                  </div>
                                  <div className="pl-0 pr-8 gap-1 flex items-center">
                                    <AccessTimeIcon
                                      className="text-gray-400"
                                      style={{ width: "15px", height: "15px" }}
                                    />
                                    <select
                                      defaultValue="2 hours"
                                      className="w-full bg-transparent border-0 text-gray-700 text-sm appearance-none focus:outline-none cursor-pointer p-0"
                                    >
                                      <option value="1 hour">1 hour</option>
                                      <option value="2 hours">2 hours</option>
                                      <option value="3 hours">3 hours</option>
                                      <option value="4 hours">4 hours</option>
                                      <option value="6 hours">6 hours</option>
                                      <option value="8 hours">8 hours</option>
                                      <option value="Full day">Full day</option>
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

                              {/* Date */}
                              <div className="relative">
                                <div
                                  className="calendar-container relative flex flex-col bg-gray-200 rounded px-3 py-3 cursor-pointer hover:bg-gray-100 transition-colors"
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
                                </div>

                                {/* Calendar Dropdown */}
                                {showCalendar && (
                                  <div
                                    className="calendar-container fixed bg-white border-2 border-black rounded-lg shadow-xl z-[90] p-6 w-80"
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
                              <div className="relative">
                                <div className="relative flex flex-col bg-gray-200 rounded px-3 py-3 cursor-pointer hover:bg-gray-100 transition-colors">
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
                                      <option value="10:45 AM">10:45 AM</option>
                                      <option value="11:00 AM">11:00 AM</option>
                                      <option value="11:15 AM">11:15 AM</option>
                                      <option value="11:30 AM">11:30 AM</option>
                                      <option value="12:00 PM">12:00 PM</option>
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
                        </div>

                        {/* Continue Button */}
                        <button
                          onClick={() => {
                            console.log("Continuing with booking:", {
                              type: activeBookingTab,
                              pickup: pickupLocation,
                              dropoff: dropoffLocation,
                              date: selectedDate,
                              time: selectedTime,
                            });
                            setReservationOpen(false);
                          }}
                          className="w-full mt-8 py-4 bg-gray-400 hover:bg-gray-500 text-white font-bold text-[16px]  rounded transition-colors duration-200"
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
                  alt="Intercity Transfer"
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
