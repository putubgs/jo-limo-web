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
  const [showPassword, setShowPassword] = useState(false);
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
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="border rounded-lg border-[#CACACA] w-full p-3 pr-10 outline-none"
                  placeholder="Password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
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
              <Link
                href={"/corporate-mobility/register"}
                className="underline text-blue-500"
              >
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
