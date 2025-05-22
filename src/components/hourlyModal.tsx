"use client";

import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";

type TabKey = "executive" | "luxury" | "suv" | "mpv";

interface PriceRow {
  label: string;
  price: string;
}

const HOURLY_DATA: Record<
  TabKey,
  {
    hourly: PriceRow[];
    waiting: PriceRow[];
    cancellation: PriceRow[];
    extra: PriceRow[];
  }
> = {
  executive: {
    hourly: [
      { label: "Hourly Rate (minimum 3 hours)", price: "25 JOD / Hour" },
      { label: "Half Day (3-6 hours)", price: "120 JOD" },
      { label: "Full Day (6-12 hours)", price: "180 JOD" },
    ],
    waiting: [
      { label: "First 15 min after the arrival of a car", price: "Free" },
      { label: "After the free period", price: "0.25 JOD / Minute" },
    ],
    cancellation: [
      { label: "2 hours before the pick up", price: "Free" },
      { label: "After the free period", price: "Full-payment" },
    ],
    extra: [
      { label: "Parking fee", price: "Include within price" },
      { label: "Toll road fee", price: "Include within price" },
    ],
  },
  luxury: {
    hourly: [
      { label: "Hourly Rate (minimum 3 hours)", price: "35 JOD / Hour" },
      { label: "Half Day (3-6 hours)", price: "150 JOD" },
      { label: "Full Day (6-12 hours)", price: "260 JOD" },
    ],
    waiting: [
      { label: "First 15 min after the arrival of a car", price: "Free" },
      { label: "After the free period", price: "0.25 JOD / Minute" },
    ],
    cancellation: [
      { label: "2 hours before the pick up", price: "Free" },
      { label: "After the free period", price: "Full-payment" },
    ],
    extra: [
      { label: "Parking fee", price: "Include within price" },
      { label: "Toll road fee", price: "Include within price" },
    ],
  },
  suv: {
    hourly: [
      { label: "Hourly Rate (minimum 3 hours)", price: "45 JOD / Hour" },
      { label: "Half Day (3-6 hours)", price: "170 JOD" },
      { label: "Full Day (6-12 hours)", price: "300 JOD" },
    ],
    waiting: [
      { label: "First 15 min after the arrival of a car", price: "Free" },
      { label: "After the free period", price: "0.25 JOD / Minute" },
    ],
    cancellation: [
      { label: "2 hours before the pick up", price: "Free" },
      { label: "After the free period", price: "Full-payment" },
    ],
    extra: [
      { label: "Parking fee", price: "Include within price" },
      { label: "Toll road fee", price: "Include within price" },
    ],
  },
  mpv: {
    hourly: [
      { label: "Hourly Rate (minimum 3 hours)", price: "30 JOD / Hour" },
      { label: "Half Day (3-6 hours)", price: "120 JOD" },
      { label: "Full Day (6-12 hours)", price: "200 JOD" },
    ],
    waiting: [
      { label: "First 15 min after the arrival of a car", price: "Free" },
      { label: "After the free period", price: "0.25 JOD / Minute" },
    ],
    cancellation: [
      { label: "2 hours before the pick up", price: "Free" },
      { label: "After the free period", price: "Full-payment" },
    ],
    extra: [
      { label: "Parking fee", price: "Include within price" },
      { label: "Toll road fee", price: "Include within price" },
    ],
  },
};

export default function HourlyModal({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}) {
  const tabs: TabKey[] = ["executive", "luxury", "suv", "mpv"];
  const [activeTab, setActiveTab] = useState<TabKey>("executive");

  if (!isModalOpen) return null;

  const { hourly, waiting, cancellation, extra } = HOURLY_DATA[activeTab];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
                 bg-black bg-opacity-50 px-4"
    >
      <div
        className="flex flex-col relative bg-white
                      px-[30px] py-[75px]
                      w-11/12 max-w-[750px]"
      >
        {/* Close */}
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-4 left-4 text-black hover:text-gray-700"
        >
          <CloseIcon fontSize="small" />
        </button>

        {/* Title */}
        <p className="text-[20px] pb-[75px] text-center">
          HOURLY AND FULL DAY HIRE
        </p>

        {/* Tabs */}
        <div className="relative mb-6">
          <div className="border-t border-gray-200" />
          <div className="max-w-[400px]">
            <div className="flex border-t border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    relative flex-1 px-6 py-3
                    text-center uppercase font-medium text-[16px]
                    ${
                      activeTab === tab
                        ? "text-black"
                        : "text-gray-500 hover:text-gray-700"
                    }
                  `}
                >
                  {tab.toUpperCase()}
                  {activeTab === tab && (
                    <span className="absolute top-0 left-0 w-full h-0.5 bg-black" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* All pricing visible, no dropdown */}
        <div
          className="
 border-gray-200 divide-gray-200
    max-h-[400px] overflow-y-auto
    [&>*:last-child]:border-t-0
  "
        >
          {/* Hourly & Day rates */}
          {hourly.map(({ label, price }) => (
            <div
              key={label}
              className="flex justify-between items-center px-4 py-3
                         text-[14px] text-gray-700 border-t"
            >
              <span className="text-gray-500">{label}</span>
              <span className="text-black">{price}</span>
            </div>
          ))}

          {/* Waiting Time */}
          <div className="px-4 py-4">
            <h3 className="text-[16px] text-black uppercase">Waiting Time</h3>
          </div>
          {waiting.map(({ label, price }) => (
            <div
              key={label}
              className="flex justify-between items-center px-4 py-3
                         text-[14px] text-gray-700 border-t"
            >
              <span className="text-gray-500">{label}</span>
              <span className="text-black">{price}</span>
            </div>
          ))}

          {/* Cancellation Fees */}
          <div className="px-4 py-4">
            <h3 className="text-[16px] text-black uppercase">
              Cancellation Fees
            </h3>
          </div>
          {cancellation.map(({ label, price }) => (
            <div
              key={label}
              className="flex justify-between items-center px-4 py-3
                         text-[14px] text-gray-700 border-t"
            >
              <span className="text-gray-500">{label}</span>
              <span className="text-black">{price}</span>
            </div>
          ))}

          {/* Extra Charges */}
          <div className="px-4 py-4">
            <h3 className="text-[16px] text-black uppercase">Extra Charges</h3>
          </div>
          {extra.map(({ label, price }) => (
            <div
              key={label}
              className="flex justify-between items-center px-4 py-3
                         text-[14px] text-gray-700"
            >
              <span className="text-gray-500">{label}</span>
              <span className="text-black">{price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
