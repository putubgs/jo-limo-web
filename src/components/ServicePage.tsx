"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import Image from "next/image";
import { useState } from "react";
import AppBanner from "@/components/app-banner";
import OtherVehicleClasses from "@/components/other-vehicle-classes";
import { ServiceContent } from "@/data/serviceContent";
import Link from "next/link";

interface ServicePageProps {
  content: ServiceContent;
}

export default function ServicePage({ content }: ServicePageProps) {
  const [activeTab, setActiveTab] = useState<"luggage" | "passenger">(
    "luggage"
  );

  return (
    <>
      <Header />
      {/* Hero */}
      <section className="mx-auto md:px-4 px-0 text-center pt-10 md:pt-20 gap-6 md:gap-10 flex flex-col">
        <div className="flex flex-col gap-6 md:gap-10 items-center">
          <h1 className="text-[32px] md:text-[64px] leading-tight px-2">
            {content.title}
          </h1>
          <p className="mt-2 md:mt-4 max-w-[350px] md:max-w-[800px] mx-auto text-[16px] md:text-[20px] px-2">
            {content.description}
          </p>
          {content.hasReserveButton ? (
            <Link href="/" className="md:rounded-none rounded-lg mt-4 md:mt-6 px-6 md:px-10 py-3 md:py-5 bg-black text-white uppercase text-sm hover:bg-gray-800 w-fit text-[16px] md:text-[20px] font-bold">
              Reserve Your Journey
            </Link>
          ) : (
            <>
              <Link href="/" className="md:hidden rounded-lg mt-4 px-6 py-3 bg-black text-white uppercase text-sm hover:bg-gray-800 w-fit text-[16px] font-bold">
                Reserve Your Journey
              </Link>
              <button className="hidden md:flex gap-2 md:gap-4 items-center font-regular mt-6 md:mt-12">
                <p className="text-[14px] md:text-[16px]">AVAILABLE IN THE APP</p>
                <Image
                  src="/images/jolimo-app-logo.png"
                  alt="Jo Limo App Logo"
                  width={24}
                  height={24}
                  className="md:w-[29px] md:h-[29px]"
                />
              </button>
            </>
          )}
        </div>

        <div className="mt-4 md:mt-8 md:w-full px-0 md:px-20">
          <Image
            src={content.heroImage}
            alt={content.heroImageAlt}
            width={1200}
            height={700}
            className="w-full h-auto object-cover"
          />
        </div>
      </section>

      {/* Details */}
      <section className="mx-auto px-4 py-8 md:py-12 w-full flex flex-col mt-6 md:mt-10 items-center justify-center">
        <div className="flex flex-col w-full items-center justify-center">
          <div className="flex flex-col w-full justify-center max-w-[350px] md:max-w-[850px]">
            <h2 className="text-[20px] md:text-[40px] leading-tight">
              {content.sectionTitle}
            </h2>
            <p className="mt-3 md:mt-4 text-[14px] md:text-[16px]">
              {content.sectionDescription}
            </p>
            <p className="pt-3 md:pt-4 text-[14px] md:text-[16px]">
              {content.title === "Executive" && (
                <>
                  Enjoy a quiet, stress-free ride where every detail is taken
                  care of, from personalized climate control and your preferred
                  music selection to in-car essentials like a complimentary
                  bottle of water and charging ports for your devices. Whether
                  you&apos;re heading to a meeting or the airport, the E-Class
                  delivers a seamless balance of luxury and efficiency. Perfect
                  for your daily business needs.
                </>
              )}
              {content.title === "Luxury" && (
                <>
                  Your chauffeur will customize the temperature and music to
                  your exact preferences, creating the perfect atmosphere for
                  your journey. Relax and enjoy exclusive amenities, including
                  access to Wi-Fi features in the armrest, a complementary
                  bottle of water, and convenient charging options. Every detail
                  is designed to ensure your complete comfort and satisfaction
                  from start to finish.
                </>
              )}
              {content.title === "MPV" && (
                <>
                  Ideal for family trips and airport transfers, these vehicles
                  provide ample space for passengers and their belongings. The
                  spacious boot easily fits bicycles, pushchairs, and pet
                  carriers, making it perfect for every journey.
                </>
              )}
              {content.title === "SUV" && (
                <>
                  With its spacious boot, there&apos;s plenty of room for extra
                  items like bicycles, pushchairs, or pet carriers. Your
                  chauffeur will tailor the temperature and music to your
                  preferences, ensuring a comfortable ride. Thoughtful touches,
                  including a complimentary bottle of water and charging
                  facilities, let you relax and recharge on the go.
                </>
              )}
            </p>
            {content.title === "MPV" && (
              <p className="pt-3 md:pt-4 text-[14px] md:text-[16px]">
                Enjoy a personalized experience as your chauffeur adjusts the
                temperature and music to your liking. Thoughtful amenities
                include a complimentary bottle of water and convenient charging
                options, ensuring you stay refreshed and recharged throughout
                your trip.
              </p>
            )}
          </div>
        </div>
        <div className="md:relative hidden mt-6 md:mt-8 items-center px-2">
          <Image
            src={content.sectionImage}
            alt={content.sectionImageAlt}
            width={900}
            height={0}
            className="h-auto object-cover relative w-full"
          />
          <p className="absolute bottom-3 md:bottom-5 left-3 md:left-5 text-white text-[12px] md:text-[16px]">
            Exquisite personal service
          </p>
        </div>
      </section>

      <section className="mx-auto px-4 md:px-40 py-8 md:py-12">
        <div className="relative mb-4 md:mb-6">
          <div className="border-t border-gray-200" />
          <div className="max-w-full md:max-w-[300px]">
            <div className="relative flex -mt-px">
              <button
                className="flex-1 text-center text-[16px] md:text-[20px] uppercase font-medium py-2 md:py-3"
                onClick={() => setActiveTab("luggage")}
              >
                LUGGAGE
              </button>
              <button
                className="flex-1 text-center text-[16px] md:text-[20px] uppercase font-medium py-2 md:py-3"
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
            <div className="md:grid hidden grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
              <div className="flex justify-center order-2 md:order-1">
                <Image
                  src="/images/luggage-img.png"
                  alt="Luggage illustration"
                  width={531}
                  height={0}
                  className="w-full h-auto max-w-[400px] md:max-w-none"
                />
              </div>
              <div className="text-gray-600 text-[14px] md:text-[16px] order-1 md:order-2">
                <p>{content.luggageCapacity.description}</p>
                <p className="mt-3 md:mt-4">
                  Hand-held luggage may also be placed into the front passenger
                  compartment if there is no more space in the rear of the
                  vehicle.
                </p>
                <p className="mt-3 md:mt-4">
                  When booking your journey, kindly leave a comment for your
                  chauffeur if you have any fragile items to be specially
                  handled and stored.
                </p>
              </div>
            </div>

            {/* Sizes & Dimensions Header */}
            <div className="mt-6 md:mt-8">
              <div className="flex justify-between items-center text-[12px] md:text-sm uppercase text-gray-400">
                <div>Size, Dimension</div>
                <div>
                  <span className="text-black">CM</span> / INCH
                </div>
              </div>
              <hr className="border-t border-gray-200 mt-1" />

              {/* Sizes & Dimensions Rows */}
              <table className="w-full border-collapse">
                <tbody>
                  {content.luggageCapacity.sizes.map((row, idx) => {
                    const isOr = row.size.startsWith("or ");
                    const mainText = isOr ? row.size.slice(3) : row.size;
                    return (
                      <tr
                        key={idx}
                        className="border-b last:border-b-0 border-gray-200"
                      >
                        <td className="py-2 md:py-3 text-[14px] md:text-[16px]">
                          {isOr ? (
                            <>
                              <span className="text-gray-400">or&nbsp;</span>
                              <span className="text-black">{mainText}</span>
                            </>
                          ) : (
                            <span className="text-black">{mainText}</span>
                          )}
                        </td>
                        <td className="py-2 md:py-3 text-right text-gray-400 text-[14px] md:text-[16px]">
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
          <>
            <div className="md:grid hidden grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
              <div className="flex justify-center order-2 md:order-1">
                <Image
                  src="/images/passenger-img.png"
                  alt="Passenger illustration"
                  width={531}
                  height={0}
                  className="w-full h-auto max-w-[400px] md:max-w-none"
                />
              </div>
              <div className="text-gray-600 text-[14px] md:text-[16px] order-1 md:order-2">
                <p>{content.passengerCapacity.description}</p>
                <p className="mt-3 md:mt-4">
                  Hand-held luggage may also be placed into the front passenger
                  compartment if there is no more space in the rear of the
                  vehicle.
                </p>
                <p className="mt-3 md:mt-4">
                  When booking your journey, kindly leave a comment for your
                  chauffeur if you have any fragile items to be specially
                  handled and stored.
                </p>
              </div>
            </div>

            {/* Sizes & Dimensions Header */}
            <div className="mt-6 md:mt-8">
              <div className="flex items-center text-[12px] md:text-sm uppercase text-gray-400">
                <div>Seating Capacity</div>
              </div>
              <hr className="border-t border-gray-200 mt-1" />

              {/* Sizes & Dimensions Rows */}
              <table className="w-full border-collapse">
                <tbody>
                  {[{ size: content.passengerCapacity.capacity }].map(
                    (row, idx) => {
                      const isOr = row.size.startsWith("or ");
                      const mainText = isOr ? row.size.slice(3) : row.size;
                      return (
                        <tr
                          key={idx}
                          className="border-b last:border-b-0 border-gray-200"
                        >
                          <td className="py-2 md:py-3 text-[14px] md:text-[16px]">
                            {isOr ? (
                              <>
                                <span className="text-gray-400">or&nbsp;</span>
                                <span className="text-black">{mainText}</span>
                              </>
                            ) : (
                              <span className="text-black">{mainText}</span>
                            )}
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
      <div className="md:block hidden">
        <OtherVehicleClasses />
        <AppBanner />
      </div>

      <Footer />
    </>
  );
}
