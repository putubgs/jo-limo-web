"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { COUNTRY_DATA } from "@/data/countries";

export default function CorporateMobilityRegister() {
  const [formData, setFormData] = useState({
    company_name: "",
    company_website: "",
    company_email: "",
    phone_number: "",
    company_address: "",
    billing_address: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Phone number state
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_DATA[0]); // Default to Jordan
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isPhoneDropdownOpen, setIsPhoneDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsPhoneDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format phone number with spaces
  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{0,4})(\d{0,6})$/);
    if (match) {
      return [match[1], match[2]].filter(Boolean).join(" ");
    }
    return cleaned;
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, "");
    if (input.length <= 10) {
      setPhoneNumber(input);
    }
  };

  // Filter countries based on search
  const filteredCountries = COUNTRY_DATA.filter(
    (country) =>
      country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      country.phoneCode.includes(countrySearch)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      // Combine country code with phone number
      const fullPhoneNumber = `${selectedCountry.phoneCode}${phoneNumber}`;

      const response = await fetch("/api/corporate-mobility/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          phone_number: fullPhoneNumber,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(
          "Corporate account application submitted successfully! We will review your application and send you login credentials via email."
        );
        setFormData({
          company_name: "",
          company_website: "",
          company_email: "",
          phone_number: "",
          company_address: "",
          billing_address: "",
        });
        setPhoneNumber("");
        setSelectedCountry(COUNTRY_DATA[0]);
      } else {
        setError(data.error || "Failed to submit application");
      }
    } catch (error) {
      console.error("Application error:", error);
      setError("An error occurred while submitting your application");
    }

    setLoading(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Header />
      <section className="flex items-center justify-center py-[150px] px-4 md:px-0">
        <div className="flex flex-col items-center md:max-w-[587px] w-full gap-8">
          <p className="text-[36px] text-center">Apply For Corporate Account</p>
          <form onSubmit={handleSubmit} className="w-full gap-1 flex flex-col">
            <input
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              className="border border-[#CACACA] w-full p-3 rounded-sm outline-none"
              placeholder="Company Name"
              required
            />
            <input
              name="company_website"
              type="text"
              value={formData.company_website}
              onChange={handleChange}
              className="border border-[#CACACA] w-full p-3 rounded-sm outline-none"
              placeholder="Company Website"
              required
            />
            <input
              name="company_email"
              type="email"
              value={formData.company_email}
              onChange={handleChange}
              className="border border-[#CACACA] w-full p-3 rounded-sm outline-none"
              placeholder="Company Email"
              required
            />
            {/* Phone Number with Country Code Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <div className="flex bg-white rounded-sm overflow-hidden border border-[#CACACA]">
                {/* Country Code Dropdown */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsPhoneDropdownOpen(!isPhoneDropdownOpen);
                  }}
                  className="px-4 py-3 bg-transparent focus:outline-none text-black text-lg min-w-[90px] border-r border-[#CACACA] flex items-center justify-between hover:bg-gray-50"
                >
                  <span>{selectedCountry.phoneCode}</span>
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
                    e.preventDefault();
                    const paste = e.clipboardData.getData("text");
                    const numericPaste = paste.replace(/[^0-9]/g, "");
                    setPhoneNumber(numericPaste);
                  }}
                  className="w-full px-4 py-3 bg-transparent focus:outline-none text-black text-lg"
                  inputMode="numeric"
                  required
                />
              </div>

              {/* Dropdown Menu */}
              {isPhoneDropdownOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-[#CACACA] rounded-sm shadow-lg">
                  {/* Search Input */}
                  <div className="p-2 border-b border-[#CACACA] sticky top-0 bg-white">
                    <input
                      type="text"
                      placeholder="Search country..."
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      className="w-full px-3 py-2 border border-[#CACACA] rounded-sm outline-none focus:border-gray-400"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  {/* Country List */}
                  <div className="max-h-60 overflow-y-auto">
                    {filteredCountries.length > 0 ? (
                      filteredCountries.map((country) => (
                        <button
                          key={country.isoCode}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedCountry(country);
                            setIsPhoneDropdownOpen(false);
                            setCountrySearch("");
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 flex justify-between items-center"
                        >
                          <span className="text-black">{country.name}</span>
                          <span className="text-gray-600">
                            {country.phoneCode}
                          </span>
                        </button>
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
            <textarea
              name="company_address"
              value={formData.company_address}
              onChange={handleChange}
              className="border border-[#CACACA] w-full p-3 rounded-sm outline-none min-h-[80px] resize-y"
              placeholder="Company Address"
              required
            />
            <textarea
              name="billing_address"
              value={formData.billing_address}
              onChange={handleChange}
              className="border border-[#CACACA] w-full p-3 rounded-sm outline-none min-h-[80px] resize-y"
              placeholder="Billing Address"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-sm uppercase bg-black p-3 text-center text-white mt-3 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Send"}
            </button>
          </form>

          {message && (
            <p className="text-center px-10 text-green-600 font-medium">
              {message}
            </p>
          )}

          {error && (
            <p className="text-center px-10 text-red-600 font-medium">
              {error}
            </p>
          )}

          <p className="text-center px-10 text-[#656565]">
            Thank you for applying for a Jo Limo corporate account. We will
            review your application and send you login credentials via email
            shortly.
          </p>

          <p className="text-center text-[14px] md:text-[16px] text-[#656565]">
            Already have an account?{" "}
            <Link
              href="/corporate-mobility/login"
              className="underline text-blue-500"
            >
              Login here
            </Link>
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}
