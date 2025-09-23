"use client";

import { useEffect, Suspense, useMemo } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import SimpleHyperPayForm from "@/components/SimpleHyperPayForm";
import { useState } from "react";
import ProcessingDialog from "@/components/dialogs/ProcessingDialog";
import SuccessDialog from "@/components/dialogs/SuccessDialog";
import { useReservationStore } from "@/lib/reservation-store";
import { calculateDistanceAndTime } from "@/lib/distance-calculator";
import { useSearchParams } from "next/navigation";
import type { HyperPayResult } from "@/types/hyperpay";

function PaymentAndCheckoutContent() {
  const { reservationData } = useReservationStore();
  const searchParams = useSearchParams();

  // State declarations
  const [processingOpen, setProcessingOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [paymentResult, setPaymentResult] = useState<HyperPayResult | null>(
    null
  );
  const [hasCheckedPayment, setHasCheckedPayment] = useState(false);
  const [distanceInfo, setDistanceInfo] = useState<{
    distance: string;
    duration: string;
  } | null>(null);

  // Use data from Zustand store instead of URL params
  const bookingData = useMemo(
    () => ({
      ...reservationData,
      service: reservationData.selectedClass || "",
    }),
    [reservationData]
  );

  useEffect(() => {
    console.log("Booking data:", bookingData);
  }, [bookingData]);

  // Handle payment result when redirected back from HyperPay
  useEffect(() => {
    const resourcePath = searchParams.get("resourcePath");
    const paymentId = searchParams.get("id");

    if (resourcePath && paymentId && !hasCheckedPayment) {
      // Prevent duplicate API calls
      setHasCheckedPayment(true);

      // Show processing dialog while checking payment status
      setProcessingOpen(true);

      // Fetch payment status
      fetch(
        `/api/checkout-status?resourcePath=${encodeURIComponent(resourcePath)}`
      )
        .then((r) => r.json())
        .then((data) => {
          console.log("🔍 PAYMENT STATUS API RESULT:");
          console.log("📊 Status Code:", data.result?.code);
          console.log("📝 Description:", data.result?.description);
          console.log("💰 Amount:", data.amount);
          console.log("💳 Currency:", data.currency);
          console.log("🆔 Transaction ID:", data.id);
          console.log("📄 Full Response:", JSON.stringify(data, null, 2));

          // Check if payment was successful
          const successCodes = [
            "000.000.000",
            "000.000.100",
            "000.100.110",
            "000.100.111",
            "000.100.112",
          ];

          const isSuccess = successCodes.includes(data.result?.code);

          console.log("✅ Payment Success Check:", {
            resultCode: data.result?.code,
            isSuccess,
            successCodes,
          });

          // Hide processing dialog and show success dialog
          setProcessingOpen(false);

          if (isSuccess) {
            console.log("🎉 PAYMENT SUCCESSFUL!");
            setPaymentResult(data);
            // Show success dialog
            setSuccessOpen(true);
          } else {
            console.log("❌ PAYMENT FAILED!");
            console.error(
              "Payment failed:",
              data.result?.description || "Payment failed"
            );
          }
        })
        .catch((error) => {
          console.error("❌ Error fetching payment status:", error);
          setProcessingOpen(false);
        });
    }
  }, [searchParams, hasCheckedPayment]);

  // Calculate distance when pickup and dropoff are available
  useEffect(() => {
    if (bookingData.pickup && bookingData.dropoff) {
      calculateDistanceAndTime(bookingData.pickup, bookingData.dropoff)
        .then((result) => {
          if (result) {
            setDistanceInfo({
              distance: result.distance,
              duration: result.duration,
            });
          }
        })
        .catch((error) => {
          console.error("Failed to calculate distance:", error);
        });
    }
  }, [bookingData.pickup, bookingData.dropoff]);

  const handleCash = () => {
    setProcessingOpen(true);
    setTimeout(() => {
      setProcessingOpen(false);
      setSuccessOpen(true);
    }, 3000);
  };

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error);
  };

  // Step indicator component
  const StepIndicator = () => (
    <div className="relative w-full max-w-[550px] mx-auto py-8">
      {/* Background line - absolute positioned behind */}
      <div className="absolute top-10 left-9 right-8 h-0.5 bg-gray-300 transform -translate-y-1/2 w-[440px]"></div>

      {/* Flex container for bullets and text - in front */}
      <div className="relative flex justify-between items-center">
        {/* Step 1 - Completed */}
        <div className="flex flex-col items-center">
          <div className="w-4 h-4 rounded-full bg-gray-400 mb-2"></div>
          <span className="text-sm text-gray-500 p-1">Service Class</span>
        </div>

        {/* Step 2 - Completed */}
        <div className="flex flex-col items-center">
          <div className="w-4 h-4 rounded-full bg-gray-400 mb-2"></div>
          <span className="text-sm text-gray-500 p-1">Pick-up Info</span>
        </div>

        {/* Step 3 - Current */}
        <div className="flex flex-col items-center">
          <div className="w-4 h-4 rounded-full bg-black mb-2"></div>
          <span className="text-sm font-bold text-black bg-[#F0F0F0] rounded-full p-1 px-2">
            Payment & Checkout
          </span>
        </div>
      </div>
    </div>
  );

  const formatDisplayDate = (dateStr: string, timeStr: string) => {
    if (!dateStr || !timeStr) {
      return "Please select date and time";
    }
    return `${dateStr} at ${timeStr} (GMT +3)`;
  };

  const getDisplayLocations = () => {
    if (bookingData.type === "by-hour") {
      return {
        from: bookingData.pickup || "Please select location",
        to: "Round trip from starting location",
      };
    } else {
      return {
        from: bookingData.pickup || "Please select pickup location",
        to: bookingData.dropoff || "Please select dropoff location",
      };
    }
  };

  const locations = getDisplayLocations();

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white flex flex-col my-[50px]">
        {/* Header */}
        <StepIndicator />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-[#F0F0F0] rounded-lg shadow-sm p-6">
            <div className="flex justify-start items-center">
              <div className="text-left">
                <p className="font-bold text-black text-lg">
                  {formatDisplayDate(bookingData.date, bookingData.time)}
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-base" style={{ color: "#A4A4A4" }}>
                    {locations.from}
                  </span>
                  <span className="mx-4 text-2xl text-gray-600">→</span>
                  <span className="text-base" style={{ color: "#A4A4A4" }}>
                    {locations.to}
                  </span>
                </div>
                {distanceInfo && (
                  <div className="mt-3">
                    <p className="text-sm" style={{ color: "#A4A4A4" }}>
                      An estimated travel time of {distanceInfo.duration} to the
                      destination • {distanceInfo.distance}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col items-center justify-center max-w-4xl mx-auto gap-4 pt-8">
          <div className="flex items-center gap-4 w-full px-6">
            <button className="bg-[#B2B2B2] text-white px-4 py-3 rounded-lg w-full">
              Credit card
            </button>
            <button
              className="bg-white border border-black font-bold text-black px-4 py-3 rounded-lg w-full"
              onClick={handleCash}
            >
              Cash
            </button>
          </div>
          {!processingOpen && (
            <div className="w-full px-6">
              <SimpleHyperPayForm
                amount={reservationData.selectedClassPrice || "0"}
                onPaymentError={handlePaymentError}
              />
            </div>
          )}
        </div>

        <ProcessingDialog open={processingOpen} />
        <SuccessDialog
          open={successOpen}
          onClose={() => setSuccessOpen(false)}
          paymentResult={paymentResult}
        />
      </div>
      <Footer />
    </>
  );
}

export default function PaymentAndCheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentAndCheckoutContent />
    </Suspense>
  );
}
