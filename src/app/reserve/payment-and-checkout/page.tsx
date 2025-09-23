/* app/reserve/payment-and-checkout/page.tsx */
"use client";

import {
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  Suspense,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import SimpleHyperPayForm from "@/components/SimpleHyperPayForm";
import ProcessingDialog from "@/components/dialogs/ProcessingDialog";
import SuccessDialog from "@/components/dialogs/SuccessDialog";
import FailureDialog from "@/components/dialogs/FailureDialog";
import { useReservationStore } from "@/lib/reservation-store";
import { calculateDistanceAndTime } from "@/lib/distance-calculator";
import type { HyperPayResult } from "@/types/hyperpay";

/* ------------------------------------------------------------------ */
/*  Dialog reducer                                                     */
/* ------------------------------------------------------------------ */

type DialogAction =
  | { type: "PROCESSING" }
  | { type: "SUCCESS"; payload: HyperPayResult }
  | { type: "FAILURE"; payload: string }
  | { type: "RESET" };

interface DialogState {
  kind: "NONE" | "PROCESSING" | "SUCCESS" | "FAILURE";
  result?: HyperPayResult;
  message?: string;
}

const reducer = (state: DialogState, action: DialogAction): DialogState => {
  switch (action.type) {
    case "PROCESSING":
      return { kind: "PROCESSING" };
    case "SUCCESS":
      return { kind: "SUCCESS", result: action.payload };
    case "FAILURE":
      return { kind: "FAILURE", message: action.payload };
    case "RESET":
      return { kind: "NONE" };
    default:
      return state;
  }
};

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

function PaymentAndCheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { reservationData } = useReservationStore();

  /* ---------------------------------------------------------------- */
  /*  Dialog state (useReducer)                                       */
  /* ---------------------------------------------------------------- */
  const [dialog, dispatch] = useReducer(reducer, { kind: "NONE" });

  /* When we’ve already shown SUCCESS or FAILURE, ignore further      */
  const hasSettledRef = useRef(false);

  /* ---------------------------------------------------------------- */
  /*  Distance info                                                   */
  /* ---------------------------------------------------------------- */
  const [distanceInfo, setDistanceInfo] = useState<{
    distance: string;
    duration: string;
  } | null>(null);

  const bookingData = useMemo(
    () => ({ ...reservationData, service: reservationData.selectedClass }),
    [reservationData]
  );

  /* ---------------------------------------------------------------- */
  /*  Payment-status check (after redirect)                           */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    const resourcePath = searchParams.get("resourcePath");
    const paymentId = searchParams.get("id");

    if (!resourcePath || !paymentId || hasSettledRef.current) return;

    dispatch({ type: "PROCESSING" });

    fetch(
      `/api/checkout-status?resourcePath=${encodeURIComponent(resourcePath)}`
    )
      .then((r) => r.json())
      .then((data: HyperPayResult) => {
        if (hasSettledRef.current) return; // already handled

        const okCodes = [
          "000.000.000",
          "000.000.100",
          "000.100.110",
          "000.100.111",
          "000.100.112",
        ];
        const success = okCodes.includes(data.result.code);

        if (success) {
          hasSettledRef.current = true;
          dispatch({ type: "SUCCESS", payload: data });
        } else {
          hasSettledRef.current = true;
          dispatch({ type: "FAILURE", payload: data.result.description });
        }
      })
      .catch(() => {
        if (hasSettledRef.current) return;
        hasSettledRef.current = true;
        dispatch({
          type: "FAILURE",
          payload: "Network error. Please try again.",
        });
      });
  }, [searchParams]);

  /* ---------------------------------------------------------------- */
  /*  Distance calculation                                            */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    if (!bookingData.pickup || !bookingData.dropoff) return;
    calculateDistanceAndTime(bookingData.pickup, bookingData.dropoff)
      .then((r) =>
        setDistanceInfo({
          distance: r?.distance || "",
          duration: r?.duration || "",
        })
      )
      .catch((err) => console.error("distance-calc", err));
  }, [bookingData.pickup, bookingData.dropoff]);

  /* ---------------------------------------------------------------- */
  /*  Handlers                                                        */
  /* ---------------------------------------------------------------- */
  const handleCash = () => {
    dispatch({ type: "PROCESSING" });
    setTimeout(() => {
      if (hasSettledRef.current) return;
      hasSettledRef.current = true;
      dispatch({
        type: "SUCCESS",
        payload: {
          id: `CASH-${Date.now()}`,
          amount: reservationData.selectedClassPrice || "0",
          currency: "SAR",
          result: { code: "000.000.000", description: "Cash accepted" },
        } as HyperPayResult,
      });
    }, 2000);
  };

  const resetAndGo = (path: string) => {
    hasSettledRef.current = false;
    dispatch({ type: "RESET" });
    router.push(path);
  };

  /* ---------------------------------------------------------------- */
  /*  JSX                                                             */
  /* ---------------------------------------------------------------- */

  const StepIndicator = () => (
    <div className="relative w-full max-w-[550px] mx-auto py-8">
      <div className="absolute top-10 left-9 right-8 h-0.5 bg-gray-300 -translate-y-1/2 w-[440px]" />
      <div className="relative flex justify-between items-center">
        {["Service Class", "Pick-up Info", "Payment & Checkout"].map(
          (label, i) => (
            <div key={label} className="flex flex-col items-center">
              <div
                className={`w-4 h-4 rounded-full mb-2 ${
                  i === 2 ? "bg-black" : "bg-gray-400"
                }`}
              />
              <span
                className={`text-sm ${
                  i === 2
                    ? "font-bold text-black bg-[#F0F0F0] rounded-full p-1 px-2"
                    : "text-gray-500 p-1"
                }`}
              >
                {label}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );

  const formatDate = (d: string, t: string) =>
    d && t ? `${d} at ${t} (GMT +3)` : "Please select date and time";

  const loc =
    bookingData.type === "by-hour"
      ? {
          from: bookingData.pickup || "Please select location",
          to: "Round trip from starting location",
        }
      : {
          from: bookingData.pickup || "Please select pickup location",
          to: bookingData.dropoff || "Please select drop-off location",
        };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-white flex flex-col my-[50px]">
        <StepIndicator />

        {/* Trip card -------------------------------------------------- */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-[#F0F0F0] rounded-lg shadow-sm p-6">
            <p className="font-bold text-lg">
              {formatDate(bookingData.date, bookingData.time)}
            </p>
            <div className="flex items-center mt-2 text-base text-[#A4A4A4]">
              <span>{loc.from}</span>
              <span className="mx-4 text-2xl text-gray-600">→</span>
              <span>{loc.to}</span>
            </div>
            {distanceInfo && (
              <p className="mt-3 text-sm text-[#A4A4A4]">
                Approximately {distanceInfo.duration} • {distanceInfo.distance}
              </p>
            )}
          </div>
        </div>

        {/* Payment options + form ------------------------------------ */}
        <div className="flex flex-col items-center max-w-4xl mx-auto gap-4 pt-8">
          <div className="flex gap-4 w-full px-6">
            <button className="bg-[#B2B2B2] text-white px-4 py-3 rounded-lg w-full">
              Credit card
            </button>
            <button
              className="bg-white border border-black font-bold px-4 py-3 rounded-lg w-full"
              onClick={handleCash}
            >
              Cash
            </button>
          </div>

          {dialog.kind === "NONE" && (
            <div className="w-full px-6">
              <SimpleHyperPayForm
                amount={reservationData.selectedClassPrice || "0"}
                onPaymentError={(e) => console.log("HyperPay error", e)}
              />
            </div>
          )}
        </div>

        {/* Dialogs ---------------------------------------------------- */}
        <ProcessingDialog open={dialog.kind === "PROCESSING"} />

        <SuccessDialog
          open={dialog.kind === "SUCCESS"}
          onClose={() => resetAndGo("/")}
          paymentResult={dialog.result}
        />

        <FailureDialog
          open={dialog.kind === "FAILURE"}
          onClose={() => resetAndGo("/reserve/pick-up-info")}
          errorMessage={dialog.message}
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
