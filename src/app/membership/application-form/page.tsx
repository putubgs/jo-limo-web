"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { useState } from "react";

export default function MembershipApplication() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
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
      const response = await fetch("/api/membership/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Membership application submitted successfully!");
        setFormData({ firstname: "", lastname: "", email: "", phone: "" });
      } else {
        setError(data.error || "Failed to submit application");
      }
    } catch (error) {
      console.error("Application error:", error);
      setError("An error occurred while submitting your application");
    }

    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Header />
      <section className="flex items-center justify-center py-[150px]">
        <div className="flex flex-col items-center max-w-[587px] w-full gap-8">
          <p className="text-[36px]">Apply For Membership</p>
          <form onSubmit={handleSubmit} className="w-full gap-1 flex flex-col">
            <input
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className="border border-[#CACACA] w-full p-3 rounded-sm outline-none"
              placeholder="First Name"
              required
            />
            <input
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className="border border-[#CACACA] w-full p-3 rounded-sm outline-none"
              placeholder="Last Name"
              required
            />
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="border border-[#CACACA] w-full p-3 rounded-sm outline-none"
              placeholder="E-mail"
              required
            />
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="border border-[#CACACA] w-full p-3 rounded-sm outline-none"
              placeholder="Phone Number"
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
            Thank you for applying for Jo Limo membership. We will review your
            application and respond to you via email shortly.
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}
