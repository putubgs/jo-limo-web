"use client";

import { useState } from "react";
import { transferPricing } from "@/data/transferPricing";

interface TransferSelectorProps {
  groupId: "intercity" | "airport";
  onClose: () => void;
  /** route string like "AMM to Dead Sea" */
  onSelect: (route: string) => void;
}

export default function TransferSelector({
  groupId,
  onClose,
  onSelect,
}: TransferSelectorProps) {
  const group = transferPricing.find((g) => g.id === groupId);
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  if (!group) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50">
      {/* Modal */}
      <div className="relative bg-white max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg shadow-lg">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white px-6 py-4 border-b flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-2xl font-bold leading-none text-gray-700 hover:text-black"
          >
            ×
          </button>
          <h2 className="text-center flex-1 text-lg font-semibold uppercase">
            {group.title}
          </h2>
          {/* spacer to balance the close button */}
          <div className="w-5" />
        </div>

        {/* (Removed tabs – user chooses only locations) */}

        {/* Categories */}
        <div className="px-6 py-4">
          {group.categories.map((cat) => {
            const isOpen = openCategory === cat.name;
            return (
              <div key={cat.name} className="mb-4 first:mt-0">
                {/* Category header */}
                <button
                  onClick={() => setOpenCategory(isOpen ? null : cat.name)}
                  className="w-full flex items-center justify-between py-3 text-sm font-semibold text-gray-800"
                >
                  {cat.name}
                  <span
                    className={`transform transition-transform ${
                      isOpen ? "rotate-90" : "rotate-0"
                    }`}
                  >
                    ▸
                  </span>
                </button>

                {/* Routes list */}
                {isOpen && (
                  <div className="border-t border-gray-200 divide-y divide-gray-200">
                    {cat.routes.map((r) => (
                      <button
                        key={r.route}
                        onClick={() => {
                          onSelect(r.route);
                          onClose();
                        }}
                        className="w-full flex items-center justify-between py-3 text-left text-sm hover:bg-gray-50"
                      >
                        <span className="truncate">{r.route}</span>
                        {/* price removed */}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
