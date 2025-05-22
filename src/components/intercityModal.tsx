"use client";

import { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";

type TabKey = "executive" | "luxury" | "suv" | "mpv";
interface RouteItem {
  route: string;
  price: string;
}

const PRICING: Record<
  TabKey,
  { southern: RouteItem[]; northern: RouteItem[] }
> = {
  executive: {
    southern: [
      { route: "AMM to Dead Sea", price: "45 JOD" },
      { route: "AMM to Petra", price: "177 JOD" },
      { route: "AMM to Wadi Rum", price: "195 JOD" },
      { route: "AMM to Aqaba", price: "202 JOD" },
      { route: "AMM to Baptism site", price: "61 JOD" },
      { route: "AMM to Wadi Mujib", price: "78 JOD" },
      { route: "AMM to Madaba", price: "34 JOD" },
      { route: "AMM to Dessert Castle", price: "93 JOD" },
      { route: "AMM to Dana Nature Reserve", price: "166 JOD" },
      { route: "AMM to Ma’in Hot Springs", price: "85 JOD" },
    ],
    northern: [
      { route: "AMM to Jerash", price: "119 JOD" },
      { route: "AMM to Ajloun", price: "131 JOD" },
      { route: "AMM to Al Ramtha", price: "131 JOD" },
      { route: "AMM to Um Qais", price: "149 JOD" },
      { route: "AMM to Anjara", price: "134 JOD" },
    ],
  },
  luxury: {
    southern: [
      { route: "AMM to Dead Sea", price: "60 JOD" },
      { route: "AMM to Petra", price: "185 JOD" },
      { route: "AMM to Wadi Rum", price: "210 JOD" },
      { route: "AMM to Aqaba", price: "225 JOD" },
      { route: "AMM to Baptism site", price: "70 JOD" },
      { route: "AMM to Wadi Mujib", price: "90 JOD" },
      { route: "AMM to Madaba", price: "50 JOD" },
      { route: "AMM to Dessert Castle", price: "100 JOD" },
      { route: "AMM to Dana Nature Reserve", price: "180 JOD" },
      { route: "AMM to Ma’in Hot Springs", price: "95 JOD" },
    ],
    northern: [
      { route: "AMM to Jerash", price: "130 JOD" },
      { route: "AMM to Ajloun", price: "145 JOD" },
      { route: "AMM to Al Ramtha", price: "150 JOD" },
      { route: "AMM to Um Qais", price: "160 JOD" },
      { route: "AMM to Anjara", price: "140 JOD" },
    ],
  },
  suv: {
    southern: [
      { route: "AMM to Dead Sea", price: "35 JOD" },
      { route: "AMM to Petra", price: "120 JOD" },
      { route: "AMM to Wadi Rum", price: "140 JOD" },
      { route: "AMM to Aqaba", price: "150 JOD" },
      { route: "AMM to Baptism site", price: "50 JOD" },
      { route: "AMM to Wadi Mujib", price: "65 JOD" },
      { route: "AMM to Madaba", price: "30 JOD" },
      { route: "AMM to Dessert Castle", price: "75 JOD" },
      { route: "AMM to Dana Nature Reserve", price: "155 JOD" },
      { route: "AMM to Ma’in Hot Springs", price: "80 JOD" },
    ],
    northern: [
      { route: "AMM to Jerash", price: "110 JOD" },
      { route: "AMM to Ajloun", price: "125 JOD" },
      { route: "AMM to Al Ramtha", price: "130 JOD" },
      { route: "AMM to Um Qais", price: "140 JOD" },
      { route: "AMM to Anjara", price: "135 JOD" },
    ],
  },
  mpv: {
    southern: [
      { route: "AMM to Dead Sea", price: "50 JOD" },
      { route: "AMM to Petra", price: "160 JOD" },
      { route: "AMM to Wadi Rum", price: "180 JOD" },
      { route: "AMM to Aqaba", price: "190 JOD" },
      { route: "AMM to Baptism site", price: "60 JOD" },
      { route: "AMM to Wadi Mujib", price: "85 JOD" },
      { route: "AMM to Madaba", price: "40 JOD" },
      { route: "AMM to Dessert Castle", price: "95 JOD" },
      { route: "AMM to Dana Nature Reserve", price: "170 JOD" },
      { route: "AMM to Ma’in Hot Springs", price: "90 JOD" },
    ],
    northern: [
      { route: "AMM to Jerash", price: "135 JOD" },
      { route: "AMM to Ajloun", price: "150 JOD" },
      { route: "AMM to Al Ramtha", price: "155 JOD" },
      { route: "AMM to Um Qais", price: "165 JOD" },
      { route: "AMM to Anjara", price: "145 JOD" },
    ],
  },
};

const SEGMENTS = [
  { title: "Southern Intercity Transfer", key: "southern" },
  { title: "Northern Intercity Transfer", key: "northern" },
];

export default function IntercityModal({
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
        <p className="text-[20px] pb-[75px] text-center">INTERCITY TRANSFER</p>

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
            const routes = PRICING[activeTab][key as "southern" | "northern"];
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
