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
import { useReservationStore, BillingData } from "@/lib/reservation-store";
import { calculateDistanceAndTime } from "@/lib/distance-calculator";
import { createBookingHistory } from "@/lib/booking-history";
import { COUNTRY_CODES } from "@/data/countries";
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
  const {
    reservationData,
    getBillingData,
    setBillingData,
    setReservationData,
    _hasHydrated,
  } = useReservationStore();

  // Billing form state - initialize with defaults, will be populated after hydration
  const [billingForm, setBillingForm] = useState<BillingData>({
    customerEmail: "",
    customerGivenName: "",
    customerSurname: "",
    billingStreet1: "",
    billingCity: "",
    billingState: "",
    billingCountry: "JO", // Default to Jordan
    billingPostcode: "",
  });

  // Track which payment method is selected - default to credit card
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "credit" | "cash" | null
  >("credit");

  // Billing form filled flag (only for billing address, not personal info)
  const [isBillingAddressFilled, setIsBillingAddressFilled] = useState(false);

  // Hydrate billing form from store after component mounts
  useEffect(() => {
    if (_hasHydrated) {
      const existingBilling = getBillingData();
      if (existingBilling) {
        setBillingForm(existingBilling);
        setIsBillingAddressFilled(
          !!(
            existingBilling.billingStreet1 &&
            existingBilling.billingCity &&
            existingBilling.billingState &&
            existingBilling.billingCountry &&
            existingBilling.billingPostcode
          ),
        );
      } else if (reservationData.billingData) {
        // Pre-fill with data from pick-up info if no billing data exists
        setBillingForm({
          customerEmail: reservationData.billingData.customerEmail || "",
          customerGivenName:
            reservationData.billingData.customerGivenName || "",
          customerSurname: reservationData.billingData.customerSurname || "",
          billingStreet1: "",
          billingCity: "",
          billingState: "",
          billingCountry: "JO",
          billingPostcode: "",
        });
      }
    }
  }, [_hasHydrated, getBillingData, reservationData.billingData]);

  // Billing country dropdown states
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [selectedBillingCountry, setSelectedBillingCountry] = useState({
    code: "JO",
    name: "Jordan",
  });
  const [countrySearchTerm, setCountrySearchTerm] = useState("");
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  // Track when data restoration is complete
  const [isDataRestored, setIsDataRestored] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCountryDropdownOpen(false);
        setCountrySearchTerm("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter billing countries based on search term
  const filteredBillingCountries = COUNTRY_CODES.filter(
    (country) =>
      country.name.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
      country.code.toLowerCase().includes(countrySearchTerm.toLowerCase()),
  );

  const handleBillingCountrySelect = (country: {
    code: string;
    name: string;
  }) => {
    setSelectedBillingCountry(country);
    setIsCountryDropdownOpen(false);
    setCountrySearchTerm("");
    // Update billing form
    setBillingForm((prev) => ({ ...prev, billingCountry: country.code }));
  };

  const handleBillingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setBillingForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBillingSubmit = () => {
    // Validate only billing address fields (personal info already collected)
    if (!billingForm.billingStreet1.trim()) {
      alert("⚠️ Street Address is required. Please fill in this field.");
      return;
    }

    if (!billingForm.billingCity.trim()) {
      alert("⚠️ City is required. Please fill in this field.");
      return;
    }

    if (!billingForm.billingState.trim()) {
      alert("⚠️ State/Province is required. Please fill in this field.");
      return;
    }

    if (!billingForm.billingCountry) {
      alert("⚠️ Country is required. Please select a country.");
      return;
    }

    if (!billingForm.billingPostcode.trim()) {
      alert("⚠️ Postal Code is required. Please fill in this field.");
      return;
    }

    // All validations passed, save billing data to store
    setBillingData(billingForm);
    setIsBillingAddressFilled(true);
  };

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
      JSON.stringify(reservationData, null, 2),
    );

    // Check if we have real data, if not, try to restore from localStorage
    if (
      !reservationData.date &&
      !reservationData.time &&
      !reservationData.pickup
    ) {
      console.log(
        "❌ No real data found, checking localStorage for restoration",
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
        "❌ No data found anywhere - user needs to complete booking flow",
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
        "❌ Missing reservation data - checking localStorage for backup",
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
              storedReservationData,
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
                "✅ Stored data looks valid, but Zustand store is empty",
              );
              console.log("Attempting to restore data from localStorage...");

              // Try to restore the data
              console.log("🔄 Attempting to restore data...");
              setReservationData(storedReservationData);
              console.log("🔄 Data restoration attempted");

              // Force a re-render by updating state
              setTimeout(() => {
                console.log(
                  "🔄 Checking if data was restored after timeout...",
                );
                console.log(
                  "🔄 Current reservation data should be updated on next render",
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

  /* When we've already shown SUCCESS or FAILURE, ignore further      */
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
    [reservationData],
  );

  // Create booking function - defined early to avoid conditional hook calls
  const createBooking = useCallback(
    async (
      paymentMethod: "credit/debit" | "cash",
      paymentResult?: HyperPayResult,
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
            "This usually means the user accessed the payment page without completing the booking flow",
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

        console.log("📧 About to call createBookingHistory with data:", {
          hasReservationData: !!reservationData,
          hasBillingData: !!billingData,
          customerEmail: billingData?.customerEmail,
          paymentMethod,
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
        console.log(
          "📧 Email should have been sent to:",
          billingData?.customerEmail,
        );
      } catch (error) {
        console.error(
          "❌ CRITICAL ERROR: Failed to create booking history:",
          error,
        );
        console.error(
          "❌ Error details:",
          error instanceof Error ? error.message : String(error),
        );
        console.error("❌ Full error object:", JSON.stringify(error, null, 2));
        // Re-throw the error so we know booking failed even if payment succeeded
        throw new Error(
          `Booking creation failed: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      }
    },
    [reservationData, getBillingData],
  );

  /* ---------------------------------------------------------------- */
  /*  Payment-status check (after redirect)                           */
  /* ---------------------------------------------------------------- */
  const resourcePath = searchParams.get("resourcePath");
  const paymentId = searchParams.get("id");
  useEffect(() => {
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
      `/api/checkout-status?resourcePath=${encodeURIComponent(resourcePath)}`,
    )
      .then((r) => r.json())
      .then(async (data: HyperPayResult) => {
        console.log(
          "💳 PAYMENT STATUS RESPONSE:",
          JSON.stringify(data, null, 2),
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
          data.result.code,
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
              bookingError,
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
        }),
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
        reservationData.selectedClassPrice
      : reservationData.pickup &&
        reservationData.dropoff &&
        reservationData.pickupLocation &&
        reservationData.dropoffLocation &&
        reservationData.selectedClass &&
        reservationData.selectedClassPrice;

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
      storedHasRequiredData,
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
      !hasSettledRef.current,
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
    console.log("🔵 CASH PAYMENT CLICKED");
    console.log("🔵 Current reservation data:", reservationData);
    console.log(
      "🔵 Current billing data from store:",
      reservationData.billingData,
    );

    // For cash payment, save minimal billing data (from pick-up info)
    const minimalBillingData = {
      customerEmail: reservationData.billingData?.customerEmail || "",
      customerGivenName: reservationData.billingData?.customerGivenName || "",
      customerSurname: reservationData.billingData?.customerSurname || "",
      billingStreet1: "N/A",
      billingCity: "N/A",
      billingState: "N/A",
      billingCountry: "JO",
      billingPostcode: "N/A",
    };

    console.log("🔵 Minimal billing data created:", minimalBillingData);
    setBillingData(minimalBillingData);

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

      console.log("🔵 About to create booking with cash payment");
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

        {/* Payment Method Selection */}
        <div className="flex flex-col items-center max-w-[584px] mx-auto gap-4 pt-8 px-6">
          <div className="flex gap-4 w-full">
            <button
              onClick={() => setSelectedPaymentMethod("credit")}
              className={`px-4 py-3 rounded-lg w-full font-bold ${
                selectedPaymentMethod === "credit"
                  ? "bg-[#B2B2B2] text-white"
                  : "bg-white text-black border border-black"
              }`}
            >
              Credit card
            </button>
            <button
              onClick={handleCash}
              className={`px-4 py-3 rounded-lg w-full font-bold ${
                selectedPaymentMethod === "cash"
                  ? "bg-[#B2B2B2] text-white"
                  : "bg-white text-black border border-black"
              }`}
            >
              Pay Later (Cash/Card) on Drop-off
            </button>
          </div>
        </div>

        {/* Billing Address Form (only shown when credit card is selected and not yet filled) */}
        {selectedPaymentMethod === "credit" && !isBillingAddressFilled && (
          <div className="max-w-[584px] mx-auto px-6 py-8">
            <h2 className="text-2xl font-semibold text-black mb-6">
              Billing Address
            </h2>
            <div className="bg-[#F5F5F5] rounded-lg shadow-sm p-6 md:p-10 mb-8">
              {/* Street Address - Full Width */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm mb-2">
                  Street Address <span className="text-red-500">*</span> :
                </label>
                <input
                  type="text"
                  name="billingStreet1"
                  value={billingForm.billingStreet1}
                  onChange={handleBillingChange}
                  placeholder="123 Main Street"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* City, State, Country, Postal Code - 2 Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 text-sm mb-2">
                    City <span className="text-red-500">*</span> :
                  </label>
                  <input
                    type="text"
                    name="billingCity"
                    value={billingForm.billingCity}
                    onChange={handleBillingChange}
                    placeholder="Amman"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-2">
                    State/Province <span className="text-red-500">*</span> :
                  </label>
                  <input
                    type="text"
                    name="billingState"
                    value={billingForm.billingState}
                    onChange={handleBillingChange}
                    placeholder="Amman Governorate"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-2">
                    Country <span className="text-red-500">*</span> :
                  </label>
                  <div className="relative" ref={countryDropdownRef}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsCountryDropdownOpen(!isCountryDropdownOpen);
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-left flex items-center justify-between hover:bg-gray-50"
                    >
                      <span className="text-black">
                        {selectedBillingCountry.code} -{" "}
                        {selectedBillingCountry.name}
                      </span>
                      <svg
                        className={`w-4 h-4 ml-2 transition-transform ${
                          isCountryDropdownOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {isCountryDropdownOpen && (
                      <div
                        className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-xl z-[9999] mt-1"
                        style={{ zIndex: 9999 }}
                      >
                        {/* Search Input */}
                        <div className="p-3 border-b border-gray-200">
                          <input
                            type="text"
                            placeholder="Search country"
                            value={countrySearchTerm}
                            onChange={(e) =>
                              setCountrySearchTerm(e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            autoFocus
                          />
                        </div>

                        {/* Country List */}
                        <div className="max-h-60 overflow-y-auto">
                          {filteredBillingCountries.length > 0 ? (
                            filteredBillingCountries.map((country, index) => (
                              <div
                                key={`${country.code}-${country.name}-${index}`}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleBillingCountrySelect(country);
                                }}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between border-b border-gray-100 last:border-b-0 cursor-pointer"
                              >
                                <span className="text-black">
                                  {country.code} - {country.name}
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-gray-500 text-center">
                              No countries found
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm mb-2">
                    Postal Code <span className="text-red-500">*</span> :
                  </label>
                  <input
                    type="text"
                    name="billingPostcode"
                    value={billingForm.billingPostcode}
                    onChange={handleBillingChange}
                    placeholder="11118"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Continue Button */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleBillingSubmit}
                  className="w-full text-center bg-[#ABABAB] text-white font-bold text-[16px] px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* HyperPay Form (only shown when credit card is selected and billing address is filled) */}
        {selectedPaymentMethod === "credit" &&
          isBillingAddressFilled &&
          dialog.kind === "NONE" && (
            <div className="flex flex-col items-center max-w-[584px] mx-auto gap-4 pt-8">
              <div className="w-full">
                <SimpleHyperPayForm
                  amount={reservationData.selectedClassPrice || "0"}
                  onPaymentError={(e) => console.log("HyperPay error", e)}
                />
              </div>
            </div>
          )}

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
