"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Image from "next/image";
import AppBanner from "@/components/app-banner";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import AirportModal from "@/components/airportModal";

export default function AirportTransfer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "";
  }, [isModalOpen]);
  return (
    <>
      <Header />
      {/* Hero */}
      <section className="mx-auto px-4 text-center pt-20 gap-10 flex flex-col">
        <div className="flex flex-col gap-10 items-center">
          <h1 className="text-[64px]">Airport Transfer</h1>
          <p className="mt-4 max-w-[800px] mx-auto text-[20px]">
            Arrive stress-free with Jo Limo’s premium airport transfer service
            from Queen Alia Airport to Aqaba. Our professional drivers track
            your flight, manage delays, and ensure a smooth, comfortable ride
            straight to your destination. Relax and enjoy the journey with Jo
            Limo.
          </p>
          <button className="flex gap-4 items-center font-regular">
            <p>AVAILABLE IN THE APP</p>
            <Image
              src="/images/jolimo-app-logo.png"
              alt="Jo Limo App Logo"
              width={29}
              height={29}
            />
          </button>
        </div>

        <div className="mt-8 w-full px-20">
          <Image
            src="/images/airport-transfer-img.webp"
            alt="Executive Mercedes-E-Class"
            width={1200}
            height={700}
            className="w-full h-auto object-cover"
          />
        </div>
      </section>

      {/* Details */}
      <section className="mx-auto px-4 pt-12 pb-20 w-full flex flex-col mt-10 items-center justify-center">
        <div className="flex flex-col w-full items-center justify-center">
          <div className="flex flex-col w-full justify-center max-w-[900px]">
            <p className="text-[40px]">SEAMLESS AIRPORT TRAVEL</p>
            <div>
              <p className="mt-5 text-[16px]">
                Enjoy a seamless airport transfer with our premium service. Our
                professional chauffeurs ensure timely, comfortable, and
                stress-free rides in well-maintained vehicles. We prioritize
                your convenience, making your airport journey effortless and
                enjoyable.
              </p>
            </div>

            {/* Separator + table */}
            <div className="mt-8 border-t border-b border-gray-200">
              <div className="divide-y divide-gray-200">
                {/* Row 1 */}
                <div className="flex justify-between items-start py-4">
                  <span className="text-[16px] font-medium text-gray-500">
                    Queen Alia International Airport (AMM)
                  </span>
                  <div className="text-[18px] text-gray-900 text-right space-y-1">
                    <p>AMM - Amman City</p>
                    <p>Amman City - AMM</p>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="flex justify-between items-start py-4">
                  <span className="text-[16px] font-medium text-gray-500">
                    King Hussein International Airport (AQJ)
                  </span>
                  <div className="text-[18px] text-gray-900 text-right space-y-1">
                    <p>AQJ - Aqaba City</p>
                    <p>AQJ - Tala Bay</p>
                  </div>
                </div>

                {/* Row 3 */}
                <div className="flex justify-between items-start py-4">
                  <span className="text-[16px] font-medium text-gray-500">
                    Border Crossing
                  </span>
                  <div className="text-[18px] text-gray-900 text-right space-y-1">
                    <p>KHB to Amman City</p>
                    <p>B1R to Amman City</p>
                    <p>Wadi Araba to Aqaba City</p>
                  </div>
                </div>
              </div>
            </div>

            {/* View Rates button */}
            <div className="mt-6">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center text-[20px] text-gray-900 hover:text-black"
              >
                VIEW RATES
                <ArrowBackIosNewRoundedIcon
                  className="ml-2 transform rotate-180"
                  fontSize="inherit"
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      <AppBanner />

      <Footer />

      <AirportModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </>
  );
}
