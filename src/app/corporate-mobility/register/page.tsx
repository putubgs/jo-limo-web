"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import { useState } from "react";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/corporate-mobility/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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
            <input
              name="phone_number"
              type="tel"
              value={formData.phone_number}
              onChange={handleChange}
              className="border border-[#CACACA] w-full p-3 rounded-sm outline-none"
              placeholder="Phone Number"
              required
            />
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
