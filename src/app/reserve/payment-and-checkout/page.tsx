/* app/reserve/payment-and-checkout/page.tsx */
"use client";

import {
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  Suspense,
  useCallback,
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
import { createBookingHistory } from "@/lib/booking-history";
import type { HyperPayResult } from "@/types/hyperpay";
import DataValidationError from "@/components/DataValidationError";

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
  const { reservationData, getBillingData, setReservationData } =
    useReservationStore();

  // Track when data restoration is complete
  const [isDataRestored, setIsDataRestored] = useState(false);

  // Debug reservation data on component mount and redirect if missing
  useEffect(() => {
    console.log("🔍 PAYMENT PAGE - Reservation Data Check:", {
      reservationData,
      hasDate: !!reservationData.date,
      hasTime: !!reservationData.time,
      hasPickup: !!reservationData.pickup,
      hasDropoff: !!reservationData.dropoff,
      hasSelectedClass: !!reservationData.selectedClass,
      hasBillingData: !!getBillingData(),
    });

    // TRACE REAL DATA: Let's see what's actually in the store
    console.log(
      "🔍 FULL RESERVATION DATA OBJECT:",
      JSON.stringify(reservationData, null, 2)
    );

    // Check if we have real data, if not, try to restore from localStorage
    if (
      !reservationData.date &&
      !reservationData.time &&
      !reservationData.pickup
    ) {
      console.log(
        "❌ No real data found, checking localStorage for restoration"
      );

      // Check localStorage directly
      const rawStorage = localStorage.getItem("reservation-storage");
      console.log("🔍 RAW localStorage:", rawStorage);

      if (rawStorage) {
        try {
          const parsed = JSON.parse(rawStorage);
          console.log("🔍 PARSED localStorage:", parsed);

          if (parsed.state?.reservationData) {
            console.log("🔄 FOUND DATA IN localStorage, restoring...");
            setReservationData(parsed.state.reservationData);
            return;
          }
        } catch (e) {
          console.error("❌ Failed to parse localStorage:", e);
        }
      }

      console.log(
        "❌ No data found anywhere - user needs to complete booking flow"
      );
    } else {
      console.log("✅ REAL DATA FOUND:", {
        date: reservationData.date,
        time: reservationData.time,
        pickup: reservationData.pickup,
        dropoff: reservationData.dropoff,
        type: reservationData.type,
        selectedClass: reservationData.selectedClass,
        selectedClassPrice: reservationData.selectedClassPrice,
      });
    }

    // Check if we have minimal required data for payment
    const hasMinimalData =
      reservationData.date &&
      reservationData.time &&
      (reservationData.pickup ||
        (reservationData.type === "by-hour" && reservationData.pickup));

    if (!hasMinimalData && !searchParams.get("resourcePath")) {
      console.log(
        "❌ Missing reservation data - checking localStorage for backup"
      );

      // Try to restore from localStorage
      const storedData = localStorage.getItem("reservation-storage");
      console.log("🔍 Raw localStorage data:", storedData);

      if (storedData) {
        try {
          const parsed = JSON.parse(storedData);
          console.log("📦 Found stored reservation data:", parsed);

          if (parsed.state && parsed.state.reservationData) {
            const storedReservationData = parsed.state.reservationData;
            console.log(
              "🔍 Stored reservation data details:",
              storedReservationData
            );
            console.log("🔍 RAW stored data values:", {
              date: storedReservationData.date,
              time: storedReservationData.time,
              pickup: storedReservationData.pickup,
              dropoff: storedReservationData.dropoff,
              type: storedReservationData.type,
              duration: storedReservationData.duration,
              selectedClass: storedReservationData.selectedClass,
              selectedClassPrice: storedReservationData.selectedClassPrice,
            });

            if (
              storedReservationData.date &&
              storedReservationData.time &&
              storedReservationData.pickup
            ) {
              console.log(
                "✅ Stored data looks valid, but Zustand store is empty"
              );
              console.log("Attempting to restore data from localStorage...");

              // Try to restore the data
              console.log("🔄 Attempting to restore data...");
              setReservationData(storedReservationData);
              console.log("🔄 Data restoration attempted");

              // Force a re-render by updating state
              setTimeout(() => {
                console.log(
                  "🔄 Checking if data was restored after timeout..."
                );
                console.log(
                  "🔄 Current reservation data should be updated on next render"
                );
              }, 100);

              return; // Don't redirect, let the component re-render with restored data
            } else {
              console.log("❌ Stored data is also incomplete:", {
                hasDate: !!storedReservationData.date,
                hasTime: !!storedReservationData.time,
                hasPickup: !!storedReservationData.pickup,
                storedData: storedReservationData,
              });
            }
          }
        } catch (e) {
          console.error("Failed to parse stored reservation data:", e);
        }
      }

      console.log("❌ Redirecting to home due to missing data");
      router.push("/");
      return;
    }

    // Mark data restoration as complete
    console.log("✅ Data restoration check complete");
    setIsDataRestored(true);
  }, [
    reservationData,
    router,
    searchParams,
    getBillingData,
    setReservationData,
  ]);

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

  // Create booking function - defined early to avoid conditional hook calls
  const createBooking = useCallback(
    async (
      paymentMethod: "credit/debit" | "cash",
      paymentResult?: HyperPayResult
    ) => {
      try {
        const billingData = getBillingData();
        if (!billingData) {
          console.error("No billing data available for booking creation");
          return;
        }

        // Check if we have the minimum required data for booking
        if (
          !reservationData.date ||
          !reservationData.time ||
          !reservationData.pickup
        ) {
          console.error("Insufficient reservation data for booking creation:", {
            date: reservationData.date,
            time: reservationData.time,
            pickup: reservationData.pickup,
            fullData: reservationData,
          });
          console.error(
            "This usually means the user accessed the payment page without completing the booking flow"
          );

          console.log("❌ Cannot create booking - insufficient data");
          return;
        }

        console.log("🚀 CREATING BOOKING WITH REAL DATA:", {
          reservationData: JSON.stringify(reservationData, null, 2),
          billingData: JSON.stringify(billingData, null, 2),
          paymentMethod,
          paymentStatus:
            paymentMethod === "credit/debit" ? "completed" : "pending",
        });

        const result = await createBookingHistory({
          reservationData,
          billingData,
          paymentMethod,
          paymentStatus:
            paymentMethod === "credit/debit" ? "completed" : "pending",
          paymentResult,
        });

        console.log("✅ Booking history created successfully with REAL DATA!");
        console.log("✅ Booking result:", result);
      } catch (error) {
        console.error(
          "❌ CRITICAL ERROR: Failed to create booking history:",
          error
        );
        console.error(
          "❌ Error details:",
          error instanceof Error ? error.message : String(error)
        );
        console.error("❌ Full error object:", JSON.stringify(error, null, 2));
        // Re-throw the error so we know booking failed even if payment succeeded
        throw new Error(
          `Booking creation failed: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    },
    [reservationData, getBillingData]
  );

  /* ---------------------------------------------------------------- */
  /*  Payment-status check (after redirect)                           */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    const resourcePath = searchParams.get("resourcePath");
    const paymentId = searchParams.get("id");

    // Wait for data restoration to complete before processing payment
    if (
      !resourcePath ||
      !paymentId ||
      hasSettledRef.current ||
      !isDataRestored
    ) {
      console.log("⏳ Payment status check waiting for data restoration:", {
        hasResourcePath: !!resourcePath,
        hasPaymentId: !!paymentId,
        hasSettled: hasSettledRef.current,
        isDataRestored,
      });
      return;
    }

    console.log("🚀 Payment status check proceeding with restored data");

    dispatch({ type: "PROCESSING" });

    fetch(
      `/api/checkout-status?resourcePath=${encodeURIComponent(resourcePath)}`
    )
      .then((r) => r.json())
      .then(async (data: HyperPayResult) => {
        console.log(
          "💳 PAYMENT STATUS RESPONSE:",
          JSON.stringify(data, null, 2)
        );
        console.log("💳 Result code:", data.result?.code);
        console.log("💳 Result description:", data.result?.description);

        if (hasSettledRef.current) return; // already handled

        const okCodes = [
          "000.000.000",
          "000.000.100",
          "000.100.110",
          "000.100.111",
          "000.100.112",
        ];
        const success = okCodes.includes(data.result.code);
        console.log(
          "💳 Payment success:",
          success,
          "| Code:",
          data.result.code
        );

        if (success) {
          console.log("✅ Payment was successful, creating booking...");
          hasSettledRef.current = true;

          // Create booking history for successful HyperPay payment
          try {
            console.log("📝 Calling createBooking...");
            await createBooking("credit/debit", data);
            console.log("✅ createBooking completed successfully");
            dispatch({ type: "SUCCESS", payload: data });
          } catch (bookingError) {
            console.error(
              "❌ Payment succeeded but booking creation failed:",
              bookingError
            );
            console.error("❌ Booking error type:", typeof bookingError);
            console.error("❌ Booking error details:", {
              message:
                bookingError instanceof Error
                  ? bookingError.message
                  : String(bookingError),
              stack:
                bookingError instanceof Error ? bookingError.stack : "No stack",
            });
            dispatch({
              type: "FAILURE",
              payload: `Payment processed but booking creation failed. Please contact support with your payment details. Error: ${
                bookingError instanceof Error
                  ? bookingError.message
                  : String(bookingError)
              }`,
            });
          }
        } else {
          console.log("❌ Payment was NOT successful");
          console.log("❌ Payment result code:", data.result.code);
          console.log("❌ Payment description:", data.result.description);
          hasSettledRef.current = true;
          dispatch({ type: "FAILURE", payload: data.result.description });
        }
      })
      .catch((fetchError) => {
        console.error("❌ FETCH ERROR checking payment status:", fetchError);
        console.error("❌ Fetch error details:", {
          message:
            fetchError instanceof Error
              ? fetchError.message
              : String(fetchError),
          stack: fetchError instanceof Error ? fetchError.stack : "No stack",
        });
        if (hasSettledRef.current) return;
        hasSettledRef.current = true;
        dispatch({
          type: "FAILURE",
          payload: "Network error. Please try again.",
        });
      });
  }, [searchParams, createBooking, isDataRestored]);

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
  /*  Data validation                                                  */
  /* ---------------------------------------------------------------- */
  const hasRequiredData =
    reservationData.type === "by-hour"
      ? reservationData.pickup &&
        reservationData.pickupLocation &&
        reservationData.selectedClass &&
        reservationData.selectedClassPrice &&
        reservationData.billingData
      : reservationData.pickup &&
        reservationData.dropoff &&
        reservationData.pickupLocation &&
        reservationData.dropoffLocation &&
        reservationData.selectedClass &&
        reservationData.selectedClassPrice &&
        reservationData.billingData;

  // Check localStorage for hasRequiredData to persist across page refreshes
  const [localHasRequiredData, setLocalHasRequiredData] = useState<
    boolean | null
  >(null);
  const [isCheckingData, setIsCheckingData] = useState(true);

  useEffect(() => {
    console.log("=== PAYMENT PAGE DEBUG ===");
    console.log("hasRequiredData:", hasRequiredData);
    console.log("reservationData:", reservationData);

    // Clear localStorage to force fresh calculation
    localStorage.removeItem("hasRequiredData");

    // Check localStorage on component mount
    const storedHasRequiredData = localStorage.getItem("hasRequiredData");
    console.log(
      "storedHasRequiredData from localStorage:",
      storedHasRequiredData
    );

    if (storedHasRequiredData !== null) {
      const parsedValue = storedHasRequiredData === "true";
      console.log("Using stored value:", parsedValue);
      setLocalHasRequiredData(parsedValue);
    } else {
      // If not in localStorage, calculate and store it
      const calculated = Boolean(hasRequiredData);
      console.log("Calculated value:", calculated);
      setLocalHasRequiredData(calculated);
      localStorage.setItem("hasRequiredData", calculated.toString());
    }
    setIsCheckingData(false);
  }, [hasRequiredData, reservationData]);

  // Show loading while checking data
  if (isCheckingData) {
    return <div>Loading...</div>;
  }

  // Show error if required data is missing (but not during payment processing)
  console.log("=== VALIDATION CHECK ===");
  console.log("localHasRequiredData:", localHasRequiredData);
  console.log("dialog.kind:", dialog.kind);
  console.log("hasSettledRef.current:", hasSettledRef.current);
  console.log(
    "Will show error:",
    localHasRequiredData === false &&
      dialog.kind === "NONE" &&
      !hasSettledRef.current
  );

  if (
    localHasRequiredData === false &&
    dialog.kind === "NONE" &&
    !hasSettledRef.current
  ) {
    console.log("SHOWING PAGE ERROR!");
    return (
      <DataValidationError
        title="Page Error!"
        message="Please try again"
        backToHome={true}
      />
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Handlers                                                        */
  /* ---------------------------------------------------------------- */

  const handleCash = () => {
    dispatch({ type: "PROCESSING" });
    setTimeout(async () => {
      if (hasSettledRef.current) return;
      hasSettledRef.current = true;

      const cashPaymentResult = {
        id: `CASH-${Date.now()}`,
        amount: reservationData.selectedClassPrice || "0",
        currency: "JOD",
        result: { code: "000.000.000", description: "Cash accepted" },
      } as HyperPayResult;

      // Create booking history for cash payment
      await createBooking("cash", cashPaymentResult);

      dispatch({
        type: "SUCCESS",
        payload: cashPaymentResult,
      });
    }, 2000);
  };

  const resetAndGo = (path: string) => {
    hasSettledRef.current = false;
    dispatch({ type: "RESET" });
    // Clear localStorage when navigating away
    localStorage.removeItem("hasRequiredData");
    router.push(path);
  };

  /* ---------------------------------------------------------------- */
  /*  JSX                                                             */
  /* ---------------------------------------------------------------- */

  const StepIndicator = () => (
    <div className="relative w-full max-w-[550px] mx-auto md:py-8">
      {/* Background line - absolute positioned behind */}
      <div className="absolute md:top-10 top-[76px] left-12 right-8 h-0.5 bg-black md:bg-gray-300 transform -translate-y-1/2 md:w-[430px] w-[78vw]"></div>

      <div className="flex md:hidden pb-8 px-8 justify-between items-center">
        <p className="text-[24px] font-bold">Payment & Checkout</p>
        <p>Step 3 of 3</p>
      </div>

      {/* Flex container for bullets and text - in front */}
      <div className="relative flex justify-between items-center px-8 md:px-0">
        {/* Step 1 - Current */}
        <div className="flex flex-col items-center">
          <div className="w-4 h-4 rounded-full md:bg-gray-400 bg-black mb-2"></div>
          <span className="text-sm md:block hidden text-gray-500 p-1">
            Service Class
          </span>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col items-center">
          <div className="w-4 h-4 rounded-full md:bg-gray-400 bg-black mb-2"></div>
          <span className="text-sm md:block hidden text-gray-500 p-1">
            Pick-up Info
          </span>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col items-center">
          <div className="w-4 h-4 rounded-full bg-black mb-2"></div>
          <span className="text-sm md:block hidden font-bold text-black bg-[#F0F0F0] rounded-full p-1 px-2">
            Payment & Checkout
          </span>
        </div>
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
        <div className="max-w-[584px] mx-auto px-6 py-8">
          <div className="bg-[#F0F0F0] rounded-lg shadow-sm p-6">
            <p className="font-bold md:text-lg text-[15px]">
              {formatDate(bookingData.date, bookingData.time)}
            </p>
            <div className="flex items-center mt-2 md:text-base text-[15px] text-[#A4A4A4]">
              <span>{loc.from}</span>
              <span className="mx-4 text-2xl text-gray-600">→</span>
              <span>{loc.to}</span>
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

        {/* Payment options + form ------------------------------------ */}
        <div className="flex flex-col items-center max-w-[584px] mx-auto gap-4 pt-8">
          <div className="flex gap-4 w-full px-6">
            <button className="bg-[#B2B2B2] text-white px-4 py-3 rounded-lg w-full">
              Credit card
            </button>
            <button
              className="bg-white text-center border border-black font-bold px-4 py-3 rounded-lg w-full"
              onClick={handleCash}
            >
              Pay Later (Cash/Card) on Drop-off
            </button>
          </div>

          {dialog.kind === "NONE" && (
            <div className="w-full">
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
