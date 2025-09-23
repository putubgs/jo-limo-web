"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Script from "next/script";
import { useReservationStore, BillingData } from "@/lib/reservation-store";

function Payment3DSContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { getBillingData } = useReservationStore();

  const checkoutId = searchParams.get("checkoutId");
  const merchantTxId = searchParams.get("merchantTxId");

  const [isLoading, setIsLoading] = useState(true);
  const [billingData, setBillingData] = useState<BillingData | null>(null);

  useEffect(() => {
    if (!checkoutId) {
      router.push("/");
      return;
    }

    const billing = getBillingData();
    if (!billing) {
      router.push("/");
      return;
    }

    setBillingData(billing);
  }, [checkoutId, getBillingData, router]);

  const handleWidgetReady = () => {
    setIsLoading(false);
    console.log("3D Secure widget ready");
  };

  const handleWidgetError = (error: unknown) => {
    console.error("3D Secure widget error:", error);
    setIsLoading(false);
  };

  if (!checkoutId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Invalid Payment Session
          </h1>
          <p className="text-gray-600 mb-6">
            The payment session is invalid or has expired.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center px-4">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>

            <h1 className="text-xl font-semibold text-gray-900 mb-1">
              Bank Verification
            </h1>
            <p className="text-base text-gray-500 mb-4">
              Complete authentication
            </p>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center text-base text-orange-700">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Secure step</span>
              </div>
            </div>
          </div>

          {isLoading && (
            <div className="text-center py-8 sm:py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-sm sm:text-base text-gray-600">
                Loading secure payment form...
              </p>
            </div>
          )}

          <Script id="3ds-widget-options">
            {`
              window.wpwlOptions = {
                onReady: function() {
                  console.log('3D Secure widget ready');
                  var frm = document.querySelector('form.paymentWidgets');
                    if (frm && ${billingData ? "true" : "false"}) {
                      // CRITICAL: Do NOT change form action - let HyperPay handle 3DS redirect
                      console.log('3DS form action:', frm.action);
                    
                    // Add required fields as hidden inputs
                    var fields = {
                      testMode: "EXTERNAL",
                      merchantTransactionId: "${merchantTxId || ""}",
                      "customer.email": "${billingData?.customerEmail || ""}",
                      "customer.givenName": "${
                        billingData?.customerGivenName || ""
                      }",
                      "customer.surname": "${
                        billingData?.customerSurname || ""
                      }",
                      "billing.street1": "${billingData?.billingStreet1 || ""}",
                      "billing.city": "${billingData?.billingCity || ""}",
                      "billing.state": "${
                        billingData?.billingState?.replace(/\\s+/g, ".") || ""
                      }",
                      "billing.postcode": "${
                        billingData?.billingPostcode || ""
                      }",
                      "billing.country": "${billingData?.billingCountry || ""}"
                    };

                    Object.entries(fields).forEach(function([name, value]) {
                      if (!frm.querySelector('input[name="' + name + '"]') && value) {
                        var inp = document.createElement('input');
                        inp.type = 'hidden';
                        inp.name = name;
                        inp.value = value;
                        frm.appendChild(inp);
                      }
                    });
                  }
                  
                  ${
                    typeof window !== "undefined"
                      ? "window.handleWidgetReady && window.handleWidgetReady();"
                      : ""
                  }
                },
                onError: function(error) {
                  console.error('3D Secure widget error:', error);
                  ${
                    typeof window !== "undefined"
                      ? "window.handleWidgetError && window.handleWidgetError(error);"
                      : ""
                  }
                }
              };
              
              // Expose handlers globally
              window.handleWidgetReady = function() {
                ${handleWidgetReady.toString()}();
              };
              
              window.handleWidgetError = function(error) {
                ${handleWidgetError.toString()}(error);
              };
            `}
          </Script>

          <div className="w-full">
            <form
              className="paymentWidgets w-full"
              data-brands="VISA MASTER"
              style={{
                width: "100%",
                margin: "0 auto",
                minHeight: isLoading ? "0" : "400px",
              }}
            />
          </div>

          <Script
            src={`${process.env.NEXT_PUBLIC_PAYMENT_BASE_URL}/v1/paymentWidgets.js?checkoutId=${checkoutId}`}
            strategy="afterInteractive"
          />

          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-xs sm:text-sm text-gray-400">
              Powered by HyperPay
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Payment3DSPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading payment form...</p>
          </div>
        </div>
      }
    >
      <Payment3DSContent />
    </Suspense>
  );
}
