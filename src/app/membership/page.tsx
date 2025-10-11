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
  {
    title: (
      <>
        Exclusive Meet & Assist <br /> with Fast-Track Airport Services
      </>
    ),
    description:
      "Meet with personalized signage at aircraft gate or terminal, enjoy fast-track passport control, escorted customs, and dedicated porter assistance with luggage to your vehicle.",
  },
  {
    title: "Employee Travel Management",
    description:
      "We provide comprehensive ground transportation solutions tailored to meet the needs of corporate clients. Our professional chauffeur services ensure timely, secure, and efficient travel for your employees, supported by:",
    details: [
      {
        title: "Duty of Care",
        description:
          "Ensuring employee safety and real-time travel monitoring throughout their journeys.",
      },
      {
        title: "Expense Management",
        description:
          "Simplifying cost tracking and transparent billing for all transportation services.",
      },
      {
        title: "Approval Workflows",
        description:
          "Streamlined processes for travel requests and authorizations to maintain compliance with company policies.",
      },
      {
        title: "Reporting & Analytics",
        description:
          "Detailed insights and reports on travel usage, costs, and efficiency to support informed decision-making.",
      },
    ],
  },
];

const faqItems = [
  {
    question: "How do I join Jo Limo membership?",
    answer:
      "Joining is simple! Just apply through our website or app, and we’ll review your application. Once approved, you can start enjoying the benefits immediately.",
  },
  {
    question: "Can I cancel my membership anytime?",
    answer:
      "Absolutely! You can cancel your membership at any time, and you’ll receive a confirmation email once the cancellation is processed.",
  },
];

export default function Membership() {
  const [openIndices, setOpenIndices] = useState<number[]>([0]);
  const [employeeTravelExpanded, setEmployeeTravelExpanded] = useState(false);

  const toggle = (idx: number) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const toggleEmployeeTravel = () => {
    setEmployeeTravelExpanded(!employeeTravelExpanded);
  };

  return (
    <>
      <Header />
      {/* Hero */}
      <section className="mx-auto px-4 text-center md:pt-20 pt-10 gap-10 flex flex-col">
        <div className="flex flex-col md:gap-10 gap-5 items-center">
          <h1 className="md:text-[64px] text-[36px]">Jo Limo Membership</h1>
          <p className="md:mt-4 max-w-[850px] mx-auto md:text-[20px] text-[16px]">
            Upgrade your travel experience with Jo Limo Membership. Unlock
            exclusive perks such as special discounts, tailored services, and
            hassle-free monthly billing. Joining is simple—apply today and enjoy
            the benefits instantly!
          </p>
          <Link
            href="/membership/application-form"
            className="mt-6 md:px-10 px-6 md:py-5 py-3 md:rounded-none rounded-lg bg-black text-white uppercase text-sm hover:bg-gray-800 w-fit text-[20px] font-bold"
          >
            Become a jo limo member
          </Link>
        </div>
      </section>

      {/* Details */}
      <section className="mx-auto px-4 py-12 w-full flex flex-col mt-10 items-center justify-center max-w-[850px]">
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
            {membershipBenefits.map((benefit, index) => {
              const { title, description, details } = benefit;
              const isEmployeeTravel = title === "Employee Travel Management";

              return (
                <div
                  key={typeof title === "string" ? title : `benefit-${index}`}
                  className="flex flex-col md:flex-row justify-between items-start md:pt-4 pt-2 md:pb-16 pb-8 md:gap-10 gap-4"
                >
                  {/* Left column */}
                  <div className="flex flex-col">
                    <h3 className="text-[24px] text-black">{title}</h3>
                    <span className="mt-1 text-[14px] text-[#DD8800]">
                      Members only
                    </span>
                  </div>
                  {/* Right column */}
                  <div className="w-full md:w-1/2">
                    <p className="text-[16px] text-black">{description}</p>

                    {isEmployeeTravel && (
                      <>
                        <div
                          className={`
                            overflow-hidden transition-all duration-500 ease-in-out
                            ${
                              employeeTravelExpanded
                                ? "max-h-[500px] opacity-100 mt-4"
                                : "max-h-0 opacity-0"
                            }
                          `}
                        >
                          <div className="space-y-4">
                            {details?.map((detail, detailIndex) => (
                              <div key={detailIndex}>
                                <h4 className="font-bold text-[16px] text-black mb-1">
                                  {detail.title}:
                                </h4>
                                <p className="text-[16px] text-black">
                                  {detail.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={toggleEmployeeTravel}
                          className="flex items-center gap-2 mt-4 text-gray-500 hover:text-gray-700 text-[14px]"
                        >
                          {employeeTravelExpanded
                            ? "Less detail"
                            : "More detail"}
                          <svg
                            className={`w-2 h-2 transition-transform duration-300 ${
                              employeeTravelExpanded ? "rotate-180" : ""
                            }`}
                            fill="currentColor"
                            viewBox="0 0 10 10"
                          >
                            <polygon points="0,0 10,0 5,10" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
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
