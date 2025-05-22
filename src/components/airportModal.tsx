"use client";

import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";

type TabKey = "executive" | "luxury" | "suv" | "mpv";
interface RouteItem {
  route: string;
  price: string;
}

const PRICING: Record<
  TabKey,
  { amm: RouteItem[]; aqj: RouteItem[]; bc: RouteItem[] }
> = {
  executive: {
    amm: [
      { route: "AMM - Amman City ", price: "35 JOD" },
      { route: "Amman City - AMM", price: "30 JOD" },
    ],
    aqj: [
      { route: "AQJ - Aqaba City ", price: "15 JOD" },
      { route: "AQJ - Tala Bay", price: "30 JOD" },
    ],
    bc: [
      { route: "KHB to Amman City", price: "35 JOD" },
      { route: "B1R to Amman City", price: "30 JOD" },
      { route: "Wadi Araba to Aqaba City", price: "30 JOD" },
    ],
  },
  luxury: {
    amm: [
      { route: "AMM - Amman City ", price: "85 JOD" },
      { route: "Amman City - AMM", price: "70 JOD" },
    ],
    aqj: [
      { route: "AQJ - Aqaba City ", price: "40 JOD" },
      { route: "AQJ - Tala Bay", price: "75 JOD" },
    ],
    bc: [
      { route: "KHB to Amman City", price: "85 JOD" },
      { route: "B1R to Amman City", price: "70 JOD" },
      { route: "Wadi Araba to Aqaba City", price: "70 JOD" },
    ],
  },
  suv: {
    amm: [
      { route: "AMM - Amman City ", price: "75 JOD" },
      { route: "Amman City - AMM", price: "65 JOD" },
    ],
    aqj: [
      { route: "AQJ - Aqaba City ", price: "35 JOD" },
      { route: "AQJ - Tala Bay", price: "70 JOD" },
    ],
    bc: [
      { route: "KHB to Amman City", price: "75 JOD" },
      { route: "B1R to Amman City", price: "65 JOD" },
      { route: "Wadi Araba to Aqaba City", price: "65 JOD" },
    ],
  },
  mpv: {
    amm: [
      { route: "AMM - Amman City ", price: "90 JOD" },
      { route: "Amman City - AMM", price: "80 JOD" },
    ],
    aqj: [
      { route: "AQJ - Aqaba City ", price: "45 JOD" },
      { route: "AQJ - Tala Bay", price: "85 JOD" },
    ],
    bc: [
      { route: "KHB to Amman City", price: "90 JOD" },
      { route: "B1R to Amman City", price: "80 JOD" },
      { route: "Wadi Araba to Aqaba City", price: "80 JOD" },
    ],
  },
};

const SEGMENTS = [
  { title: "Queen Alia International Airport (AMM)", key: "amm" },
  { title: "King Hussein International Airport (AQJ)", key: "aqj" },
  { title: "Border Crossing", key: "bc" },
];

export default function AirportModal({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}) {
  const tabs: TabKey[] = ["executive", "luxury", "suv", "mpv"];
  const [activeTab, setActiveTab] = useState<TabKey>("executive");
  const [openSegments, setOpenSegments] = useState<number[]>([0]);

  const toggleSegment = (idx: number) => {
    setOpenSegments((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  if (!isModalOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
                 bg-black bg-opacity-50"
    >
      <div
        className="flex flex-col relative bg-white
                      px-[30px] py-[75px]
                      w-11/12 max-w-[750px]"
      >
        {/* Close button */}
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-4 left-4 text-black hover:text-gray-700"
        >
          <CloseIcon fontSize="small" />
        </button>

        {/* Title */}
        <p className="text-[20px] pb-[75px] text-center">AIRPORT TRANSFER</p>

        {/* Tabs container */}
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

        {/* Accordion segments */}
        <div className="border-t border-gray-200 divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
          {SEGMENTS.map(({ title, key }, sidx) => {
            const isOpen = openSegments.includes(sidx);
            const routes = PRICING[activeTab][key as "amm" | "aqj" | "bc"];
            return (
              <div key={title} className="flex flex-col">
                {/* header */}
                <button
                  onClick={() => toggleSegment(sidx)}
                  className="w-full flex justify-between items-center
                             px-4 py-4 text-[16px] text-black"
                >
                  <span>{title}</span>
                  <ArrowBackIosNewRoundedIcon
                    className={`transform transition-transform duration-300 ease-in-out
                      ${
                        isOpen
                          ? "-rotate-90 text-black"
                          : "-rotate-180 text-gray-400"
                      }`}
                    fontSize="small"
                  />
                </button>
                {/* body */}
                <div
                  className={`overflow-hidden transition-all
                              duration-500 ease-in-out
                              ${
                                isOpen
                                  ? "max-h-[800px] opacity-100"
                                  : "max-h-0 opacity-0"
                              }`}
                >
                  <div className="px-4 pl-10 pb-4 divide-y divide-gray-200">
                    {routes.map(({ route, price }) => (
                      <div
                        key={route}
                        className="flex justify-between items-center
                                   py-3 text-[14px] text-gray-700"
                      >
                        <span className="text-gray-500">{route}</span>
                        <span className="text-black">{price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
