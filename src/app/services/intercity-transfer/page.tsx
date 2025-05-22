"use client";

import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Image from "next/image";
import AppBanner from "@/components/app-banner";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import CloseIcon from "@mui/icons-material/Close";

export default function IntercityTransfer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("executive");
  const tabs = ["executive", "luxury", "suv", "mpv"];
  return (
    <>
      <Header />
      {/* Hero */}
      <section className="mx-auto px-4 text-center pt-20 gap-10 flex flex-col">
        <div className="flex flex-col gap-10 items-center">
          <h1 className="text-[64px]">Intercity Transfer</h1>
          <p className="mt-4 max-w-[800px] mx-auto text-[20px]">
            Travel effortlessly between cities with Jo Limo. Enjoy a smooth,
            comfortable ride with professional chauffeurs ensuring you arrive
            relaxed and on time.
          </p>
          <button className="flex gap-4 items-center font-light">
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
            src="/images/intercity-transfer-img.webp"
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
            <p className="text-[40px]">YOUR LINK BETWEEN DESTINATION</p>
            <div>
              <p className="mt-5 text-[16px]">
                Travel between cities with ease and comfort using our premium
                intercity service. Whether for business or leisure, our
                professional chauffeurs ensure a smooth and seamless journey
                tailored to your needs. With spacious, well-maintained vehicles,
                we offer a stress-free experience so you can focus on what
                matters most. Our door-to-door service provides personalized
                attention, guaranteeing reliable and efficient travel. We
                prioritize your comfort and convenience, ensuring that every
                trip is an enjoyable and effortless journey, no matter the
                distance.
              </p>
              <p className="mt-4 text-[16px]">
                Our door-to-door service provides personalized attention,
                guaranteeing reliable and efficient travel. We prioritize your
                comfort and convenience, ensuring that every trip is an
                enjoyable and effortless journey, no matter the distance.
              </p>
            </div>

            {/* Separator + table */}
            <div className="mt-8 border-t border-b border-gray-200">
              <div className="divide-y divide-gray-200">
                {/* Row 1 */}
                <div className="flex justify-between items-start py-4">
                  <span className="text-[16px] font-medium text-gray-500">
                    AIRPORT TRANSFER
                  </span>
                  <div className="text-[18px] text-gray-900 text-right space-y-1">
                    <p>AMM to Amman City (40km)</p>
                    <p>AQJ to Aqaba City (10km)</p>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="flex justify-between items-start py-4">
                  <span className="text-[16px] font-medium text-gray-500">
                    BORDER CROSSING
                  </span>
                  <div className="text-[18px] text-gray-900 text-right space-y-1">
                    <p>KHB to Amman City (57km)</p>
                    <p>B1R to Amman City (90km)</p>
                  </div>
                </div>

                {/* Row 3 */}
                <div className="flex justify-between items-start py-4">
                  <span className="text-[16px] font-medium text-gray-500">
                    NORTHERN INTERCITY TRANSFER
                  </span>
                  <div className="text-[18px] text-gray-900 text-right space-y-1">
                    <p>AMM to Jerash (52km)</p>
                    <p>AMM to Ajloun (76km)</p>
                    <p>AMM to Al Ramtha (76km)</p>
                    <p>AMM to Um Qais (120km)</p>
                    <p>AMM to Anjara (77km)</p>
                  </div>
                </div>

                {/* Row 4 */}
                <div className="flex justify-between items-start py-4">
                  <span className="text-[16px] font-medium text-gray-500">
                    SOUTHERN INTERCITY TRANSFER
                  </span>
                  <div className="text-[18px] text-gray-900 text-right space-y-1">
                    <p>Wadi Araba to Aqaba City (9km)</p>
                    <p>AMM to Dead Sea (60km)</p>
                    <p>AMM to Petra (235km)</p>
                    <p>AMM to Wadi Rum (310km)</p>
                    <p>AMM to Aqaba (330km)</p>
                    <p>AMM to Baptism site (53km)</p>
                    <p>AMM to Wadi Mujib (83km)</p>
                    <p>AMM to Madaba (32km)</p>
                    <p>AMM to Dessert Castle (85km)</p>
                    <p>AMM to Dana Nature Reserve (205km)</p>
                    <p>AMM to Ma’in Hot Springs (75km)</p>
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex flex-col relative bg-white px-[30px] py-[75px] w-11/12 max-w-[750px]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 left-4 text-black hover:text-gray-700"
            >
              <CloseIcon fontSize="small" />
            </button>
            <p className="text-[20px] pb-[75px] text-center">INTERCITY TRANSFER</p>
            <div className="relative mb-6">
              <div className="border-t border-gray-200" />
              <div className="max-w-[400px]">
                <div className="flex border-t border-gray-200">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`
        relative              // so we can absolutely position the bar inside
        flex-1                // equal width tabs
        px-6 py-3             // horizontal/vertical padding
        text-center uppercase font-medium text-[16px]
        ${activeTab === tab ? "text-black" : "text-gray-500"}
      `}
                    >
                      {tab.toUpperCase()}
                      {/* only the active tab renders its little black top‐border */}
                      {activeTab === tab && (
                        <span className="absolute top-0 left-0 w-full h-0.5 bg-black" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>{" "}
          </div>
        </div>
      )}
    </>
  );
}
