"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import Image from "next/image";
import { useState } from "react";
import AppBanner from "@/components/app-banner";

export default function Suv() {
  const [activeTab, setActiveTab] = useState<"luggage" | "passenger">(
    "luggage"
  );
  return (
    <>
      <Header />
      {/* Hero */}
      <section className="mx-auto px-4 text-center pt-20 gap-10 flex flex-col">
        <div className="flex flex-col gap-10 items-center">
          <h1 className="text-[64px]">SUV</h1>
          <p className="mt-4 max-w-[800px] mx-auto text-[20px]">
            Experience JO’s most refined class to date, featuring the latest
            Cadillac Escalade. Enjoy a spacious cabin, generous luggage
            capacity, and premium amenities. Whether navigating the city or
            exploring the countryside, SUV Class ensures unmatched comfort for
            every journey.
          </p>
          {/* <button className="mt-6 px-10 py-5 bg-black text-white uppercase text-sm hover:bg-gray-800 w-fit text-[20px] font-bold">
            Reserve Your Journey
          </button> */}
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
            src="/images/suv-img.webp"
            alt="Executive Mercedes-E-Class"
            width={1200}
            height={700}
            className="w-full h-auto object-cover"
          />
        </div>
      </section>

      {/* Details */}
      <section className="mx-auto px-4 py-12 w-full flex flex-col mt-10 items-center justify-center">
        <div className="flex flex-col w-full items-center justify-center">
          <div className="flex flex-col w-full justify-center max-w-[850px]">
            <h2 className="text-[40px]">READY FOR ANY JOURNEY</h2>
            <p className="mt-4 text-[16px]">
              Experience luxury and space with our chauffeur-driven Cadillac
              Escalade, accommodating up to five passengers and their luggage.
              Perfect for family outings, business travel, or airport pickups,
              the Escalade seamlessly blends elegance and practicality for every
              trip.
            </p>
            <p className="pt-4">
              With its spacious boot, there’s plenty of room for extra items
              like bicycles, pushchairs, or pet carriers. Your chauffeur will
              tailor the temperature and music to your preferences, ensuring a
              comfortable ride. Thoughtful touches, including a complimentary
              bottle of water and charging facilities, let you relax and
              recharge on the go.
            </p>
          </div>
        </div>
        <div className="relative mt-8 items-center">
          <Image
            src="/images/services-img-2.webp"
            alt="Executive service detail"
            width={900}
            height={0}
            className="h-auto object-cover relative"
          />
          <p className="absolute bottom-5 left-5 text-white">
            Exquisite personal service
          </p>
        </div>
      </section>

      <section className="mx-auto px-4 py-12 px-40">
        <div className="relative mb-6">
          <div className="border-t border-gray-200" />
          <div className="max-w-[300px]">
            <div className="relative flex -mt-px">
              <button
                className="flex-1 text-center text-[20px] uppercase font-medium py-3"
                onClick={() => setActiveTab("luggage")}
              >
                LUGGAGE
              </button>
              <button
                className="flex-1 text-center text-[20px] uppercase font-medium py-3"
                onClick={() => setActiveTab("passenger")}
              >
                PASSENGER
              </button>

              <span
                className="absolute top-0 h-0.5 bg-black transition-all duration-300 ease-in-out"
                style={{
                  left: activeTab === "luggage" ? "0%" : "50%",
                  width: "50%",
                }}
              />
            </div>
          </div>
        </div>

        {activeTab === "luggage" ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="flex justify-center">
                <Image
                  src="/images/luggage-img.png"
                  alt="Luggage illustration"
                  width={531}
                  height={0}
                  className="w-full h-auto"
                />
              </div>
              <div className="text-gray-600">
                <p>
                  Business Class vehicles can comfortably seat three passengers,
                  and seat a maximum of four passengers when the armrest is
                  raised. The boot has plenty of space for all travel essentials
                  – including up to three cabin bags. Please refer to the table
                  below for further details on Business Class luggage capacity.
                </p>
                <p className="mt-4">
                  Hand-held luggage may also be placed into the front passenger
                  compartment if there is no more space in the rear of the
                  vehicle.
                </p>
                <p className="mt-4">
                  When booking your journey, kindly leave a comment for your
                  chauffeur if you have any fragile items to be specially
                  handled and stored.
                </p>
              </div>
            </div>

            {/* Sizes & Dimensions Header */}
            <div className="mt-8">
              <div className="flex justify-between items-center text-sm uppercase text-gray-400">
                <div>Size, Dimension</div>
                <div>
                  <span className="text-black">CM</span> / INCH
                </div>
              </div>
              <hr className="border-t border-gray-200 mt-1" />

              {/* Sizes & Dimensions Rows */}
              <table className="w-full border-collapse">
                <tbody>
                  {[
                    { size: "3×Cabin", dim: "55×40×25" },
                    { size: "or 2×Medium (M)", dim: "66×44×27" },
                    { size: "or 2×Large (L)", dim: "75×52×31" },
                    { size: "or 1×Extra Large (XL)", dim: "81×55×36" },
                  ].map((row, idx) => {
                    const isOr = row.size.startsWith("or ");
                    const mainText = isOr ? row.size.slice(3) : row.size;
                    return (
                      <tr
                        key={idx}
                        className="border-b last:border-b-0 border-gray-200"
                      >
                        <td className="py-3">
                          {isOr ? (
                            <>
                              <span className="text-gray-400">or&nbsp;</span>
                              <span className="text-black">{mainText}</span>
                            </>
                          ) : (
                            <span className="text-black">{mainText}</span>
                          )}
                        </td>
                        <td className="py-3 text-right text-gray-400">
                          {row.dim} cm
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="text-gray-600">
            {/* passenger content… */}
            <p>The design is coming soon...</p>
          </div>
        )}
      </section>

      <AppBanner />
      <Footer />
    </>
  );
}
