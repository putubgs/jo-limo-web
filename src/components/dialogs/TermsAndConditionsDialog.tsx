"use client";

import Link from "next/link";

interface TermsAndConditionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsAndConditionsDialog({
  isOpen,
  onClose,
}: TermsAndConditionsDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-black">
            Jo Limo Terms & Conditions
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6 text-gray-700 text-sm">
            <section className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
              <p className="text-xs font-semibold text-gray-800">
                <strong>Please note:</strong> The English translation is
                provided for convenience. Only the original Jordanian-language
                version is legally binding. Jo Limo operates in Jordan
                exclusively through our privately owned vehicles and chauffeurs
                in compliance with LTRC regulations.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-black mb-3">
                Key Terms Summary
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Service:</strong> Jo Limo arranges transportation
                  through independent Transportation Service Providers (TSPs)
                </li>
                <li>
                  <strong>Booking:</strong> Confirmed via email after ride
                  request submission
                </li>
                <li>
                  <strong>Cancellation:</strong> Free if more than 1 hour before
                  pickup (transfers) or 24 hours (hourly bookings)
                </li>
                <li>
                  <strong>No-Shows:</strong> Full payment required for missed
                  pickups
                </li>
                <li>
                  <strong>Payment:</strong> Due immediately via credit card or
                  as specified in invoice
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-black mb-3">
                Important Policies
              </h3>

              <h4 className="font-semibold text-black mb-2 mt-3">
                Cancellation Policy
              </h4>
              <div className="bg-blue-50 p-3 rounded mb-3">
                <p className="mb-2">
                  <strong>Transfer Services:</strong> Free cancellation if more
                  than 1 hour before pickup. Full charge if within 1 hour.
                </p>
                <p>
                  <strong>Hourly Bookings:</strong> Free cancellation if more
                  than 24 hours before pickup. Full charge if within 24 hours.
                </p>
              </div>

              <h4 className="font-semibold text-black mb-2 mt-3">
                Waiting Times
              </h4>
              <ul className="list-disc pl-6 space-y-1 mb-3">
                <li>Airport/Train Station: 60 minutes grace period</li>
                <li>Other Locations: 15 minutes grace period</li>
                <li>Additional waiting time charged per minute</li>
              </ul>

              <h4 className="font-semibold text-black mb-2 mt-3">
                Vehicle Standards
              </h4>
              <ul className="list-disc pl-6 space-y-1 mb-3">
                <li>
                  No smoking in vehicles - cleaning fees and downtime charges
                  apply
                </li>
                <li>Food consumption discouraged; alcohol only with consent</li>
                <li>All passengers must wear seatbelts</li>
                <li>Follow chauffeur instructions for safety</li>
              </ul>

              <h4 className="font-semibold text-black mb-2 mt-3">
                Luggage & Special Requests
              </h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  Specify luggage count and any special items when booking
                </li>
                <li>Request child safety seats in advance with ages</li>
                <li>Animals must be in closed, suitable transport boxes</li>
                <li>TSP may refuse unreported items</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-black mb-3">
                Legal Information
              </h3>
              <p className="mb-2">
                <strong>Governing Law:</strong> Hashemite Kingdom of Jordan
              </p>
              <p className="mb-2">
                <strong>Jurisdiction:</strong> Courts of Amman, Jordan
              </p>
              <p className="mb-2">
                <strong>Company:</strong> Jordan Limousine Services LLC (No.
                200155494)
              </p>
              <p>
                <strong>Address:</strong> Airport Road, 11104 Amman, Jordan
              </p>
            </section>

            <div className="mt-8 bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 mb-2">
                <strong>For Complete Terms & Conditions:</strong>
              </p>
              <p className="text-sm text-gray-700">
                Please visit{" "}
                <Link
                  href="/legal-terms"
                  target="_blank"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  our full Terms & Conditions page
                </Link>{" "}
                for detailed information about all policies, including service
                arrangements, liability, payment terms, and user
                responsibilities.
              </p>
              <p className="text-sm text-gray-700 mt-2">
                For our Privacy Policy, please visit{" "}
                <Link
                  href="/privacy-policy"
                  target="_blank"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  our Privacy Policy page
                </Link>
                .
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <button
            onClick={onClose}
            className="w-full bg-black text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
