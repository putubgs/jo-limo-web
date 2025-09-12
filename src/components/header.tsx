"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ReservationForm from "@/components/ReservationForm";

export default function Header() {
  const pathname = usePathname();
  const showBorder = pathname !== "/";

  const [servicesOpen, setServicesOpen] = useState(false);
  const [reservationOpen, setReservationOpen] = useState(pathname === "/");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close dropdowns on scroll
  useEffect(() => {
    if (!reservationOpen && !servicesOpen && !mobileMenuOpen) return;
    const handleScroll = () => {
      setReservationOpen(false);
      setServicesOpen(false);
      setMobileMenuOpen(false);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [reservationOpen, servicesOpen, mobileMenuOpen]);

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

  // Close mobile menu on click outside
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        !target.closest(".mobile-menu") &&
        !target.closest(".mobile-menu-button")
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

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
      setMobileMenuOpen(false);
    } else if (item === "RESERVE NOW") {
      setServicesOpen(false);
      setReservationOpen((o) => !o);
      setMobileMenuOpen(false);
    } else {
      setServicesOpen(false);
      setReservationOpen(false);
      setMobileMenuOpen(false);
    }
  }

  // Mobile menu handler - close services submenu when opening mobile menu
  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    // Always close services submenu when toggling mobile menu
    setServicesOpen(false);
    setReservationOpen(false);
  };

  return (
    <header className="relative z-50">
      {/* ——— Header bar ——— */}
      <div
        className={[
          "relative flex flex-col items-center justify-center",
          "bg-[url('/images/black-line-header.png')] bg-cover bg-top",
          "w-full h-20 md:h-52", // Shorter height on mobile
          showBorder ? "border-b" : "",
        ].join(" ")}
      >
        {/* Desktop Layout */}
        <div className="relative z-20 hidden md:flex flex-col items-center gap-10">
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

        {/* Mobile Layout */}
        <div className="relative z-20 flex md:hidden items-center justify-between w-full px-6">
          <Link href={"/"}>
            <Image
              alt="Jo Limo Logo"
              src="/images/jolimo-logo.png"
              width={60}
              height={60}
            />
          </Link>

          {/* Hamburger Menu Button */}
          <button
            onClick={handleMobileMenuToggle}
            className="mobile-menu-button p-2 text-black hover:text-gray-600 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <CloseIcon className="w-8 h-8" />
            ) : (
              <MenuIcon className="w-8 h-8" />
            )}
          </button>
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

      {/* ——— Mobile Menu Backdrop ——— */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="
            md:hidden absolute top-full left-0 right-0 bg-black bg-opacity-50
            transition-opacity duration-300
            z-40
          "
          style={{
            height: "100vh",
          }}
        />
      )}

      {/* ——— Mobile Menu Dropdown ——— */}
      <div
        className={`
          mobile-menu md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t
          overflow-hidden z-50
          transition-all duration-300 ease-in-out
          ${
            mobileMenuOpen
              ? "max-h-screen opacity-100"
              : "max-h-0 opacity-0 pointer-events-none"
          }
        `}
      >
        <div className="py-4">
          {/* Mobile Navigation Items */}
          {navItems
            .filter((item) => item !== "RESERVE NOW") // Remove RESERVE NOW from mobile menu
            .map((item) => {
              if (item === "MEMBERSHIP") {
                return (
                  <Link
                    key={item}
                    href="/membership"
                    className="block px-6 py-3 text-lg font-medium text-gray-800 hover:bg-gray-50 border-b border-gray-100"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setServicesOpen(false);
                      setReservationOpen(false);
                    }}
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
                    className="block px-6 py-3 text-lg font-medium text-gray-800 hover:bg-gray-50 border-b border-gray-100"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setServicesOpen(false);
                      setReservationOpen(false);
                    }}
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
                    className="block px-6 py-3 text-lg font-medium text-gray-800 hover:bg-gray-50 border-b border-gray-100"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setServicesOpen(false);
                      setReservationOpen(false);
                    }}
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
                    className="block px-6 py-3 text-lg font-medium text-gray-800 hover:bg-gray-50 border-b border-gray-100"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setServicesOpen(false);
                      setReservationOpen(false);
                    }}
                  >
                    {item}
                  </Link>
                );
              }
              if (item === "SERVICES") {
                return (
                  <div key={item}>
                    <button
                      onClick={() => setServicesOpen(!servicesOpen)}
                      className="w-full text-left px-6 py-3 text-lg font-medium text-gray-800 hover:bg-gray-50 border-b border-gray-100 flex items-center justify-between"
                    >
                      {item}
                      <span className="text-sm">
                        {servicesOpen ? "−" : "+"}
                      </span>
                    </button>
                    {/* Mobile Services Submenu */}
                    {servicesOpen && (
                      <div className="bg-gray-50">
                        {servicesList.map(({ label, slug }) => (
                          <Link
                            key={slug}
                            href={`/services/${slug}`}
                            className="block px-8 py-2 text-base text-gray-700 hover:bg-gray-100 border-b border-gray-200"
                            onClick={() => {
                              setMobileMenuOpen(false);
                              setServicesOpen(false);
                              setReservationOpen(false);
                            }}
                          >
                            {label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return null;
            })}
        </div>
      </div>
    </header>
  );
}
