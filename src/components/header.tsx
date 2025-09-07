"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import ReservationForm from "@/components/ReservationForm";

export default function Header() {
  const pathname = usePathname();
  const showBorder = pathname !== "/";

  const [servicesOpen, setServicesOpen] = useState(false);
  const [reservationOpen, setReservationOpen] = useState(pathname === "/");

  // Close dropdowns on scroll
  useEffect(() => {
    if (!reservationOpen && !servicesOpen) return;
    const handleScroll = () => {
      setReservationOpen(false);
      setServicesOpen(false);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [reservationOpen, servicesOpen]);

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
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [reservationOpen]);

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
    { label: "FLAT RATE CITY TRANSFER", slug: "flat-rate-city-transfer" },
  ];

  const navItems = [
    "SERVICES",
    "MEMBERSHIP",
    "CITIES & CLASSES",
    "CORPORATE MOBILITY",
    "THE GLOBAL LIMO",
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
              if (item === "CORPORATE MOBILITY") {
                return (
                  <Link
                    key={item}
                    href="/corporate-mobility/login"
                    className="text-base font-medium hover:text-gray-500"
                    onClick={() => setServicesOpen(false)}
                  >
                    {item}
                  </Link>
                );
              }
              if (item === "THE GLOBAL LIMO") {
                return (
                  <Link
                    key={item}
                    href="/the-global-limo"
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
                      className="reserve-now-button text-base transition-all duration-200  bg-black text-white px-4 py-1 rounded-[10px] font-bold"
                    >
                      {item}
                    </button>

                    {/* ——— Reservation Dropdown ——— */}
                    <div
                      className={`
                        reservation-dropdown absolute top-full right-0 mt-2 z-[60]
                        transition-all duration-700 ease-in-out
                        ${
                          reservationOpen
                            ? "max-h-[500px] opacity-100"
                            : "max-h-0 opacity-0 pointer-events-none"
                        }
                      `}
                    >
                      <ReservationForm
                        variant="popup"
                        continueUrl="/reserve/service-class"
                        onClose={() => setReservationOpen(false)}
                        calendarPositionOffset={{ x: 40, y: 0 }}
                      />
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
