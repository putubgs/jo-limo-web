"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Image from "next/image";
import AppBanner from "@/components/app-banner";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import HourlyModal from "@/components/hourlyModal";

export default function IntercityTransfer() {
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
          <h1 className="text-[64px]">Hourly and Full Day Hire</h1>
          <p className="mt-4 max-w-[800px] mx-auto text-[20px]">
            Choose from our flexible hourly chauffeur service or a full-day
            driver for your personal or business needs. Enjoy comfort,
            convenience, and professional service tailored to your schedule.
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
            src="/images/services-img-2.webp"
            alt="Executive Mercedes-E-Class"
            width={1200}
            height={700}
            className="w-full h-auto object-cover"
          />
        </div>
      </section>

      {/* Details */}
      <section className="mx-auto px-4 pt-12 pb-20 w-full flex flex-col items-center mt-10">
        <div className="w-full max-w-[900px]">
          {/* Title */}
          <h2 className="text-[40px] font-semibold text-black">
            YOUR JOURNEY, YOUR SCHEDULE
          </h2>

          {/* Intro text */}
          <p className="mt-5 text-[16px] text-black">
            Whether for a few hours or a full day, our flexible chauffeur
            service meets your needs. From business meetings to city
            exploration, our professional drivers ensure a seamless, comfortable
            journey. With luxury vehicles and personalized attention, you can
            enjoy a hassle-free, convenient travel experience. Let us elevate
            your journey with exceptional service.
          </p>

          {/* Rates grid header */}
          <div className="mt-8 grid grid-cols-4 gap-8 text-start">
            {/* EXECUTIVE */}
            <div>
              <p className="text-[15px] text-[#656565]">EXECUTIVE</p>
              <p className=" text-[16px] text-[#B9B9B9]">MERCEDES E-CLASS</p>
            </div>
            {/* LUXURY */}
            <div>
              <p className="text-[15px] text-[#656565]">LUXURY</p>
              <p className=" text-[16px] text-[#B9B9B9]">MERCEDES S-CLASS</p>
            </div>
            {/* MPV */}
            <div>
              <p className="text-[15px] text-[#656565]">MPV</p>
              <p className=" text-[16px] text-[#B9B9B9]">MERCEDES V-CLASS</p>
            </div>
            {/* SUV */}
            <div>
              <p className="text-[15px] text-[#656565]">SUV</p>
              <p className=" text-[16px] text-[#B9B9B9]">CARDILLAC ESCALADE</p>
            </div>
          </div>

          {/* Separator line */}
          <div className="border-t border-[#D9D9D9]" />

          {/* Rates grid body */}
          <div className="mt-2 grid grid-cols-4 gap-8 text-start">
            {/* Executive prices */}
            <div className="flex flex-col text-[16px] text-black">
              <p>25 JOD/hour (3hour*)</p>
              <p>120 JOD (Half-Day)</p>
              <p>180 JOD (Full-Day)</p>
            </div>
            {/* Luxury prices */}
            <div className="flex flex-col text-[16px] text-black">
              <p>35 JOD/hour (&lt; 3hour)</p>
              <p>150 JOD (Half-Day)</p>
              <p>260 JOD (Full-Day)</p>
            </div>
            {/* MPV prices */}
            <div className="flex flex-col text-[16px] text-black">
              <p>45 JOD/hour (&lt; 3hour)</p>
              <p>170 JOD (Half-Day)</p>
              <p>300 JOD (Full-Day)</p>
            </div>
            {/* SUV prices */}
            <div className="flex flex-col text-[16px] text-black">
              <p>30 JOD/hour (&lt; 3hour)</p>
              <p>120 JOD (Half-Day)</p>
              <p>200 JOD (Full-Day)</p>
            </div>
          </div>

          <div className="my-8 border-t border-[#D9D9D9]" />

          {/* View Detailed Rates */}
          <div className="mt-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center text-[20px] text-black hover:text-gray-700"
            >
              VIEW DETAILED RATES
              <ArrowBackIosNewRoundedIcon
                className="ml-2 transform rotate-180"
                fontSize="inherit"
              />
            </button>
          </div>
        </div>
      </section>

      <AppBanner />

      <Footer />

      <HourlyModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </>
  );
}
