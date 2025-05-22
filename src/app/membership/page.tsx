"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const membershipBenefits = [
  {
    title: "Travel Partner Concierge Assistance",
    description:
      "Receive a free expert support for travel planning, local tips, and special requests to make every trip stress-free and tailored to your needs.",
  },
  {
    title: "Your Preferred Driver",
    description:
      "Enjoy the comfort of a chauffeur who knows your preferences, ensuring reliable and personalized rides every time.",
  },
  {
    title: "Exclusive Rates",
    description:
      "Access premium services at special discounted prices, offering outstanding value and quality.",
  },
  {
    title: "Family and Friend Discount",
    description:
      "Share exclusive discounts with loved ones, making premium travel more affordable for everyone in your circle.",
  },
  {
    title: "Monthly Billing",
    description:
      "Simplify payments with a monthly billing option, consolidating all your ride expenses into one easy statement.",
  },
];

const faqItems = [
  {
    question: "How do I join Jo Limo membership?",
    answer:
      "Joining is simple! Just apply through our website or app, and we’ll review your application. Once approved, you can start enjoying the benefits immediately.",
  },
  {
    question: "Are there any fees for Jo Limo membership?",
    answer:
      "Yes, our membership has a small monthly fee depending on the tier you choose. You can view the pricing and benefits on our membership page. No payment fees, 3-month minimum at 250 JOD, charged upfront.",
  },
  {
    question: "Can I cancel my membership anytime?",
    answer:
      "Absolutely! You can cancel your membership at any time, and you’ll receive a confirmation email once the cancellation is processed.",
  },
];

export default function Membership() {
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  const toggle = (idx: number) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <>
      <Header />
      {/* Hero */}
      <section className="mx-auto px-4 text-center pt-20 gap-10 flex flex-col">
        <div className="flex flex-col gap-10 items-center">
          <h1 className="text-[64px]">Jo Limo Membership</h1>
          <p className="mt-4 max-w-[850px] mx-auto text-[20px]">
            Upgrade your travel experience with Jo Limo Membership. Unlock
            exclusive perks such as special discounts, tailored services, and
            hassle-free monthly billing. Joining is simple—apply today and enjoy
            the benefits instantly!
          </p>
          <Link
            href="/membership/application-form"
            className="mt-6 px-10 py-5 bg-black text-white uppercase text-sm hover:bg-gray-800 w-fit text-[20px] font-bold"
          >
            Become a jo limo member
          </Link>
        </div>

        {/* <div className="mt-8 w-full px-20">
          <Image
            src="/images/executive-img.webp"
            alt="Executive Mercedes-E-Class"
            width={1200}
            height={700}
            className="w-full h-auto object-cover"
          />
        </div> */}
      </section>

      {/* Details */}
      <section className="mx-auto px-4 py-12 w-full flex flex-col mt-10 items-center justify-center max-w-[850px]">
        {/* <div className="flex flex-col w-full items-center justify-center">
          <div className="flex flex-col w-full justify-center max-w-[850px]">
            <h2 className="text-[40px]">ONLY THE BEST, NOTHING LESS</h2>
            <p className="mt-4 text-[16px]">
              Indulge in the ultimate luxury with the Mercedes-Benz E-Class, a
              masterpiece of comfort and style. Expertly driven by a
              professional Jo Limo chauffeur, this vehicle offers an
              unparalleled experience for those who demand the best.
            </p>
            <p className="pt-4">
              Your chauffeur will customize the temperature and music to your
              exact preferences, creating the perfect atmosphere for your
              journey. Relax and enjoy exclusive amenities, including access to
              Wi-Fi features in the armrest, a complementary bottle of water,
              and convenient charging options. Every detail is designed to
              ensure your complete comfort and satisfaction from start to
              finish.
            </p>
          </div>
        </div> */}
        <div className="relative items-center">
          <Image
            src="/images/membership-img.webp"
            alt="Executive service detail"
            width={900}
            height={0}
            className="h-auto object-cover relative"
          />
          <p className="absolute bottom-5 left-5 text-white">
            Exquisite personal service
          </p>
        </div>

        <div className="mx-auto py-12 w-full flex justify-center">
          <div
            className="w-full max-w-5xl
                      border-t border-b border-gray-200
                      divide-y divide-gray-200"
          >
            {membershipBenefits.map(({ title, description }) => (
              <div
                key={title}
                className="flex justify-between items-start pt-4 pb-16 gap-10"
              >
                {/* Left column */}
                <div className="flex flex-col">
                  <h3 className="text-[24px] text-black">{title}</h3>
                  <span className="mt-1 text-[14px] text-[#DD8800]">
                    Members only
                  </span>
                </div>
                {/* Right column */}
                <p className="w-1/2 text-[16px] text-black">{description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto pb-12 pt-4 w-full flex flex-col items-start">
          <h2 className="text-[24px] text-black">QUESTIONS & ANSWERS</h2>

          {/* FAQ items */}
          <div className="mt-5 w-full max-w-5xl border-t border-b border-gray-200 divide-y divide-gray-200">
            {faqItems.map(({ question, answer }, idx) => {
              const isOpen = openIndices.includes(idx);
              return (
                <div key={idx} className="flex flex-col">
                  <button
                    onClick={() => toggle(idx)}
                    className="w-full flex justify-between items-center pb-6 pt-2 text-[16px] text-black"
                  >
                    <span>{question}</span>
                    {/* simple downward chevron */}
                    <svg
                      className={`w-2 h-2 transition-colors ${
                        isOpen ? "text-gray-900" : "text-gray-400"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 10 10"
                    >
                      {/* equilateral-esque downward triangle, base = full width, apex = bottom center */}
                      <polygon points="0,0 10,0 5,10" />
                    </svg>
                  </button>

                  <div
                    className={`
            overflow-hidden
            transition-all duration-500 ease-in-out
            ${
              isOpen
                ? "max-h-[200px] opacity-100 mt-0"
                : "max-h-0 opacity-0 mt-0"
            }
          `}
                  >
                    <p className="px-0 pb-6 text-[16px] text-black">{answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
