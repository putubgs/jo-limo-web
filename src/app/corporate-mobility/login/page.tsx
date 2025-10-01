"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginCorporateMobility() {
  const [formData, setFormData] = useState({
    corporate_reference: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/corporate-mobility/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful, redirect to account
        router.push("/corporate-mobility/account");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <Header />
      <section className="flex items-center justify-center md:py-[150px] py-[50px]">
        <div className="flex flex-col items-center md:max-w-[700px] px-5 md:px-0 w-full gap-2 text-center">
          <p className="text-[36px] w-full leading-tight">
            Login to Your Corporate Mobility Account
          </p>
          <div className="flex flex-col items-center max-w-[587px] w-full gap-8 text-center">
            <p className="md:text-[16px] text-[14px]">
              View and track your bookings and billing information with ease.
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg w-full">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="w-full gap-1 flex flex-col"
            >
              <input
                type="text"
                name="corporate_reference"
                value={formData.corporate_reference}
                onChange={handleChange}
                className="border rounded-lg border-[#CACACA] w-full p-3 outline-none"
                placeholder="Corporate Reference"
                required
                disabled={loading}
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="border rounded-lg border-[#CACACA] w-full p-3 outline-none"
                placeholder="Password"
                required
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg font-bold uppercase bg-black p-3 text-center text-white mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing In..." : "Continue"}
              </button>
            </form>
            <p className="text-center text-[14px] md:text-[16px] text-black px-10 text-[#656565]">
              Not a Jo Limo partner yet? Partner with us and elevate your
              business mobility.{" "}
              <Link href={"/corporate-mobility/register"} className="underline text-blue-500">
                Apply Now
              </Link>
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
