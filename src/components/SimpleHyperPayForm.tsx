"use client";

import { useState, useEffect, useCallback } from "react";
import Script from "next/script";
import { useReservationStore, BillingData } from "@/lib/reservation-store";

interface SimpleHyperPayFormProps {
  amount: string;
  onPaymentError?: (error: string) => void;
}

export default function SimpleHyperPayForm({
  amount,
  onPaymentError,
}: SimpleHyperPayFormProps) {
  const { getBillingData } = useReservationStore();
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [merchantTxId, setMerchantTxId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [billingData, setBillingData] = useState<BillingData | null>(null);

  const handlePaymentInit = useCallback(async () => {
    if (!billingData) {
      setError("Billing information is required.");
      return;
    }

    setError(null);
    setLoading(true);

    const tx = `txn${Date.now()}`;
    console.log("Initializing payment with transaction ID:", tx);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          merchantTransactionId: tx,
          ...billingData,
        }),
      });

      console.log("Checkout API response status:", res.status);
      const data = await res.json();
      console.log("Checkout API response data:", data);

      if (data.id) {
        // Store checkout data and show widget immediately to prevent expiry
        console.log("✅ Checkout ID received:", data.id);
        setCheckoutId(data.id);
        setMerchantTxId(tx);
        console.log("✅ State updated - should show payment form");
      } else {
        let errorMessage = "Payment initialization failed";
        if (data.error) {
          try {
            const errorData = JSON.parse(data.error);
            if (errorData.result?.parameterErrors) {
              const paramErrors = errorData.result.parameterErrors
                .map(
                  (err: { name: string; message: string }) =>
                    `${err.name}: ${err.message}`
                )
                .join(", ");
              errorMessage = `Validation Error: ${paramErrors}`;
            } else if (errorData.result?.description) {
              errorMessage = errorData.result.description;
            }
          } catch {
            errorMessage = data.error;
          }
        }
        setError(errorMessage);
        onPaymentError?.(errorMessage);
      }
    } catch {
      const errorMsg = "Network error. Please try again.";
      setError(errorMsg);
      onPaymentError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [billingData, amount, onPaymentError]);

  useEffect(() => {
    const billing = getBillingData();
    if (!billing) {
      setError("Billing information is required.");
      return;
    }
    setBillingData(billing);
  }, [getBillingData]);

  // Auto-initialize payment when component mounts
  useEffect(() => {
    if (billingData && !checkoutId && !loading && !error) {
      handlePaymentInit();
    }
  }, [billingData, checkoutId, loading, error, handlePaymentInit]);

  // if (!billingData) {
  //   return (
  //     <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
  //       <h3 className="text-lg font-semibold text-red-800 mb-2">
  //         Billing Information Required
  //       </h3>
  //       <p className="text-red-600 mb-4">
  //         Please go back and fill in your billing information to proceed with
  //         payment.
  //       </p>
  //       <button
  //         onClick={() => router.back()}
  //         className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
  //       >
  //         Go Back
  //       </button>
  //     </div>
  //   );
  // }

  // Debug output
  console.log("SimpleHyperPayForm render:", {
    checkoutId,
    merchantTxId,
    hasBillingData: !!billingData,
    loading,
    error,
  });

  if (!checkoutId) {
    return (
      <div className="bg-white rounded-xl p-4 sm:p-6 md:w-[600px] w-[100%] mx-auto">
        <div className="text-center">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
            Please Wait
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <div className="flex items-start">
                <svg
                  className="w-4 h-4 text-red-500 mt-0.5 mr-2 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-red-800">Error</p>
                  <p className="text-xs text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="text-center py-6">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-gray-600 border-t-transparent"></div>
              <p className="mt-3 text-sm text-gray-600">Preparing payment...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show payment widget immediately after checkout creation to prevent expiry
  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 md:w-[600px] w-[100%]">
      <div className="text-center mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
          Add Credit / Debit Card
        </h2>
      </div>

      <Script id="wpwl-options">
        {`
          window.wpwlOptions = {
            onReady: function() {
              var frm = document.querySelector('form.paymentWidgets');
              if (!frm) return;

              console.log('HyperPay widget ready - checkout ID: ${checkoutId}');

              // Set form action to redirect back to payment page with success/error handling
              frm.action = '/reserve/payment-and-checkout?checkoutId=${checkoutId}&merchantTxId=${merchantTxId}&amount=${amount}';

              // Determine if we're in test mode based on the base URL
              var isTestMode = "${
                process.env.NEXT_PUBLIC_PAYMENT_BASE_URL
              }".includes("test.oppwa.com") || 
                               "${
                                 process.env.NEXT_PUBLIC_PAYMENT_BASE_URL
                               }".includes("eu-test.oppwa.com");

              // Add required fields as hidden inputs to prevent parameter duplication
              var fields = {
                merchantTransactionId: "${merchantTxId}",
                "customer.email": "${billingData?.customerEmail || ""}",
                "customer.givenName": "${billingData?.customerGivenName || ""}",
                "customer.surname": "${billingData?.customerSurname || ""}",
                "billing.street1": "${billingData?.billingStreet1 || ""}",
                "billing.city": "${billingData?.billingCity || ""}",
                "billing.state": "${
                  billingData?.billingState?.replace(/\\s+/g, ".") || ""
                }",
                "billing.postcode": "${billingData?.billingPostcode || ""}",
                "billing.country": "${billingData?.billingCountry || ""}"
              };

              // Only add testMode for test environment
              if (isTestMode) {
                fields.testMode = "EXTERNAL";
              }

              Object.entries(fields).forEach(function([name, value]) {
                if (!frm.querySelector('input[name="' + name + '"]') && value) {
                  var inp = document.createElement('input');
                  inp.type = 'hidden';
                  inp.name = name;
                  inp.value = value;
                  frm.appendChild(inp);
                }
              });
            },
            onError: function(error) {
              console.error('HyperPay error:', error);
              if (error && error.result && error.result.parameterErrors) {
                console.error('Parameter errors:');
                error.result.parameterErrors.forEach(function(err) {
                  console.error('- ' + err.name + ': ' + err.message);
                });
              }
            }
          };
        `}
      </Script>

      <form
        className="paymentWidgets"
        data-brands="VISA MASTER"
        style={{ width: "100%", margin: "auto" }}
      />

      <Script
        src={`${process.env.NEXT_PUBLIC_PAYMENT_BASE_URL}/v1/paymentWidgets.js?checkoutId=${checkoutId}`}
        strategy="afterInteractive"
      />

      {/* <div className="mt-4 text-center">
        <p className="text-xs text-gray-400">Powered by HyperPay</p>
      </div> */}
    </div>
  );
}
