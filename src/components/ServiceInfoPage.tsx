"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Image from "next/image";
import AppBanner from "@/components/app-banner";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import AirportModal from "@/components/airportModal";
import IntercityModal from "@/components/intercityModal";
import HourlyModal from "@/components/hourlyModal";
import Link from "next/link";
import { ServiceInfoContent } from "@/data/serviceInfoContent";

interface ServiceInfoPageProps {
  content: ServiceInfoContent;
}

export default function ServiceInfoPage({ content }: ServiceInfoPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "";
  }, [isModalOpen]);

  const renderModal = () => {
    switch (content.modalComponent) {
      case "AirportModal":
        return (
          <AirportModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        );
      case "IntercityModal":
        return (
          <IntercityModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        );
      case "HourlyModal":
        return (
          <HourlyModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Header />
      {/* Hero */}
      {/* Hero */}
      <section className="mx-auto md:px-4 px-0 text-center pt-10 md:pt-20 gap-6 md:gap-10 flex flex-col">
        <div className="flex flex-col gap-10 items-center">
          <h1 className="text-[32px] md:text-[64px] leading-tight px-2">
            {content.title}
          </h1>
          <p className="mt-2 md:mt-4 max-w-[350px] md:max-w-[800px] mx-auto text-[16px] md:text-[20px] px-2">
            {content.description}
          </p>
          <>
            <Link
              href="/"
              className="md:hidden rounded-lg mt-4 px-6 py-3 bg-black text-white uppercase text-sm hover:bg-gray-800 w-fit text-[16px] font-bold"
            >
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
        </div>

        <div className="md:mt-8 mt-4 md:w-full w-screen md:px-20">
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
      <section className="mx-auto px-4 md:pt-12 pt-0 pb-20 w-full flex flex-col mt-10 items-center justify-center">
        <div className="flex flex-col w-full items-center justify-center">
          <div className="flex flex-col w-full justify-center max-w-[900px]">
            <p className="text-[20px] md:text-[40px]">{content.sectionTitle}</p>
            <div>
              <p className="mt-5 text-[16px]">{content.sectionDescription}</p>
            </div>

            {/* Separator + table */}
            <div className="mt-8 border-t border-b border-gray-200">
              <div className="divide-y divide-gray-200">
                {content.tableData.map((row, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-start py-4"
                  >
                    <span className="md:text-[16px] text-[14px] font-medium text-gray-500">
                      {row.category}
                    </span>
                    <div className="md:text-[18px] text-[14px] text-gray-900 text-right space-y-1">
                      {row.routes.map((route, routeIndex) => (
                        <p key={routeIndex}>{route}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* View Rates button */}
            {content.hasViewRatesButton && (
              <div className="mt-6">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center md:text-[20px] text-[14px] text-gray-900 hover:text-black"
                >
                  VIEW RATES
                  <ArrowBackIosNewRoundedIcon
                    className="ml-2 transform rotate-180"
                    fontSize="inherit"
                  />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="md:block hidden">
        <AppBanner />
      </div>
      <Footer />
      {renderModal()}
    </>
  );
}
