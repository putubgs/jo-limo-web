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
  { southern: RouteItem[]; northern: RouteItem[] }
> = {
  executive: {
    southern: [
      { route: "Amman to Dead Sea", price: "45 JOD" },
      { route: "Amman to Petra", price: "177 JOD" },
      { route: "Amman to Wadi Rum", price: "195 JOD" },
      { route: "Amman to Aqaba", price: "202 JOD" },
      { route: "Amman to Baptism site", price: "61 JOD" },
      { route: "Amman to Wadi Mujib", price: "78 JOD" },
      { route: "Amman to Madaba", price: "34 JOD" },
      { route: "Amman to Dessert Castle", price: "93 JOD" },
      { route: "Amman to Dana Nature Reserve", price: "166 JOD" },
      { route: "Amman to Ma’in Hot Springs", price: "85 JOD" },
    ],
    northern: [
      { route: "Amman to Jerash", price: "119 JOD" },
      { route: "Amman to Ajloun", price: "131 JOD" },
      { route: "Amman to Al Ramtha", price: "131 JOD" },
      { route: "Amman to Um Qais", price: "149 JOD" },
      { route: "Amman to Anjara", price: "134 JOD" },
      { route: "Amman to Irbid", price: "126 JOD" },
    ],
  },
  luxury: {
    southern: [
      { route: "Amman to Dead Sea", price: "90 JOD" },
      { route: "Amman to Petra", price: "295 JOD" },
      { route: "Amman to Wadi Rum", price: "340 JOD" },
      { route: "Amman to Aqaba", price: "353 JOD" },
      { route: "Amman to Baptism site", price: "191 JOD" },
      { route: "Amman to Wadi Mujib", price: "198 JOD" },
      { route: "Amman to Madaba", price: "106 JOD" },
      { route: "Amman to Dessert Castle", price: "198 JOD" },
      { route: "Amman to Dana Nature Reserve", price: "276 JOD" },
      { route: "Amman to Ma’in Hot Springs", price: "184 JOD" },
    ],
    northern: [
      { route: "Amman to Jerash", price: "221 JOD" },
      { route: "Amman to Ajloun", price: "237 JOD" },
      { route: "Amman to Al Ramtha", price: "237 JOD" },
      { route: "Amman to Um Qais", price: "266 JOD" },
      { route: "Amman to Anjara", price: "241 JOD" },
      { route: "Amman to Irbid", price: "211 JOD" },
    ],
  },
  suv: {
    southern: [
      { route: "Amman to Dead Sea", price: "110 JOD" },
      { route: "Amman to Petra", price: "284 JOD" },
      { route: "Amman to Wadi Rum", price: "298 JOD" },
      { route: "Amman to Aqaba", price: "319 JOD" },
      { route: "Amman to Baptism site", price: "151 JOD" },
      { route: "Amman to Wadi Mujib", price: "227 JOD" },
      { route: "Amman to Madaba", price: "106 JOD" },
      { route: "Amman to Dessert Castle", price: "287 JOD" },
      { route: "Amman to Dana Nature Reserve", price: "202 JOD" },
      { route: "Amman to Ma’in Hot Springs", price: "163 JOD" },
    ],
    northern: [
      { route: "Amman to Jerash", price: "164 JOD" },
      { route: "Amman to Ajloun", price: "191 JOD" },
      { route: "Amman to Al Ramtha", price: "191 JOD" },
      { route: "Amman to Um Qais", price: "269 JOD" },
      { route: "Amman to Anjara", price: "195 JOD" },
      { route: "Amman to Irbid", price: "217 JOD" },
    ],
  },
  mpv: {
    southern: [
      { route: "Amman to Dead Sea", price: "95 JOD" },
      { route: "Amman to Petra", price: "305 JOD" },
      { route: "Amman to Wadi Rum", price: "358 JOD" },
      { route: "Amman to Aqaba", price: "372 JOD" },
      { route: "Amman to Baptism site", price: "202 JOD" },
      { route: "Amman to Wadi Mujib", price: "202 JOD" },
      { route: "Amman to Madaba", price: "92 JOD" },
      { route: "Amman to Dessert Castle", price: "202 JOD" },
      { route: "Amman to Dana Nature Reserve", price: "287 JOD" },
      { route: "Amman to Ma’in Hot Springs", price: "177 JOD" },
    ],
    northern: [
      { route: "Amman to Jerash", price: "187 JOD" },
      { route: "Amman to Ajloun", price: "198 JOD" },
      { route: "Amman to Al Ramtha", price: "198 JOD" },
      { route: "Amman to Um Qais", price: "227 JOD" },
      { route: "Amman to Anjara", price: "202 JOD" },
      { route: "Amman to Irbid", price: "137 JOD" },
    ],
  },
};

const SEGMENTS = [
  { title: "Southern City-to-City Transfer", key: "southern" },
  { title: "Northern City-to-City Transfer", key: "northern" },
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
        <p className="text-[20px] pb-[75px] text-center">CITY-TO-CITY TRANSFER</p>

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
