"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { useReservationStore, BillingData } from "@/lib/reservation-store";
import { useRouter } from "next/navigation";
import type { HyperPayResult } from "../types/hyperpay";

interface HyperPayFormProps {
  amount: string;
  onPaymentSuccess?: (result: HyperPayResult) => void;
  onPaymentError?: (error: string) => void;
}

export default function HyperPayForm({
  amount,
  onPaymentSuccess,
  onPaymentError,
}: HyperPayFormProps) {
  const { getBillingData } = useReservationStore();
  const router = useRouter();
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [merchantTxId, setMerchantTxId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [billingData, setBillingData] = useState<BillingData | null>(null);

  useEffect(() => {
    const billing = getBillingData();
    if (!billing) {
      setError(
        "Billing information is required. Please go back and fill in billing details."
      );
      return;
    }
    setBillingData(billing);
  }, [getBillingData]);

  const handlePaymentInit = async () => {
    if (!billingData) {
      setError("Billing information is required.");
      return;
    }

    setError(null);
    setLoading(true);

    const tx = `txn${Date.now()}`;
    setMerchantTxId(tx);

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

      const data = await res.json();

      if (data.id) {
        setCheckoutId(data.id);
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
  };

  // Listen for payment completion
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === "PAYMENT_COMPLETE") {
        const result = event.data.result as HyperPayResult;
        console.log("Payment completed:", result);

        // Check if payment was successful
        const successCodes = [
          "000.000.000",
          "000.000.100",
          "000.100.110",
          "000.100.111",
          "000.100.112",
        ];
        if (successCodes.includes(result.result.code)) {
          onPaymentSuccess?.(result);
        } else {
          onPaymentError?.(result.result.description);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onPaymentSuccess, onPaymentError]);

  if (!billingData) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          Billing Information Required
        </h3>
        <p className="text-red-600 mb-4">
          Please go back and fill in your billing information to proceed with
          payment.
        </p>
        <button
          onClick={() => router.back()}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!checkoutId) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Payment Details
        </h2>

        <div className="mb-6 bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Amount:</span>
            <span className="text-2xl font-bold text-gray-900">
              {amount} JOD
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="text-red-400">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Payment Error
                </h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handlePaymentInit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Initializing Payment..." : "Pay Now"}
        </button>

        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Secure payment powered by HyperPay</p>
          <div className="flex justify-center mt-2 space-x-2">
            <span className="bg-gray-100 px-2 py-1 rounded text-xs">VISA</span>
            <span className="bg-gray-100 px-2 py-1 rounded text-xs">
              MASTER
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h2>Enter Your Card Details</h2>

      <style jsx global>{`
        /* Override any default HyperPay input styling - More aggressive approach */
        .paymentWidgets input,
        .paymentWidgets input[type="text"],
        .paymentWidgets input[type="tel"],
        .paymentWidgets input[type="number"],
        .wpwl-form input,
        .wpwl-form input[type="text"],
        .wpwl-form input[type="tel"],
        .wpwl-form input[type="number"],
        .wpwl-wrapper input,
        .wpwl-wrapper input[type="text"],
        .wpwl-wrapper input[type="tel"],
        .wpwl-wrapper input[type="number"],
        .wpwl-control input,
        .wpwl-control input[type="text"],
        .wpwl-control input[type="tel"],
        .wpwl-control input[type="number"],
        form.paymentWidgets input,
        form.paymentWidgets input[type="text"],
        form.paymentWidgets input[type="tel"],
        form.paymentWidgets input[type="number"] {
          color: #1f2937 !important;
          -webkit-text-fill-color: #1f2937 !important;
        }

        /* Custom styling for HyperPay input fields */
        .wpwl-form {
          background: #ffffff;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #e1e5e9;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          max-width: 500px;
          margin: 0 auto;
        }

        .wpwl-form .wpwl-label {
          color: #374151;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
          display: block;
        }

        .wpwl-form .wpwl-input {
          background: #ffffff;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          padding: 12px 16px;
          font-size: 16px;
          color: #1f2937 !important;
          width: 100%;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .wpwl-form .wpwl-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          outline: none;
        }

        .wpwl-form .wpwl-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 16px 24px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          margin-top: 16px;
        }

        .wpwl-form .wpwl-button:hover {
          background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        /* FINAL OVERRIDE - Most aggressive styling to force dark text */
        input[type="text"],
        input[type="tel"],
        input[type="number"] {
          color: #1f2937 !important;
          -webkit-text-fill-color: #1f2937 !important;
        }
      `}</style>

      <Script id="wpwl-options">
        {`
          window.wpwlOptions = {
            paymentTarget: "_top",
            style: "card",
            locale: "en",
            // Color customization
            wpwlOptions: {
              // Input field styling
              wpwlForm: {
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                padding: "20px",
                border: "1px solid #e0e0e0",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
              },
              // Input fields
              wpwlInput: {
                backgroundColor: "#ffffff",
                border: "2px solid #e0e0e0",
                borderRadius: "6px",
                padding: "12px 16px",
                fontSize: "16px",
                color: "#333333",
                transition: "border-color 0.3s ease"
              },
              // Input focus state
              wpwlInputFocus: {
                borderColor: "#007bff",
                boxShadow: "0 0 0 3px rgba(0,123,255,0.1)"
              },
              // Button styling
              wpwlButton: {
                backgroundColor: "#007bff",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                padding: "14px 24px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background-color 0.3s ease"
              },
              // Button hover state
              wpwlButtonHover: {
                backgroundColor: "#0056b3"
              },
              // Label styling
              wpwlLabel: {
                color: "#555555",
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "8px"
              },
              // Error message styling
              wpwlError: {
                color: "#dc3545",
                fontSize: "14px",
                marginTop: "8px"
              },
              // Brand icons styling
              wpwlBrandIcon: {
                width: "40px",
                height: "25px",
                marginRight: "10px"
              }
            },
            // Custom placeholders and input configuration
            placeholders: {
              cardNumber: "1234 5678 9012 3456",
              expiryMonth: "MM",
              expiryYear: "YY",
              cvv: "123",
              holder: "John Doe"
            },
            // Custom input values (for testing - leave empty for production)
            defaultValues: {
              cardNumber: "",
              expiryMonth: "",
              expiryYear: "",
              cvv: "",
              holder: ""
            },
            // Input field styling and behavior
            inputStyle: {
              cardNumber: {
                placeholder: "Enter your card number",
                fontSize: "16px",
                color: "#1f2937",
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                letterSpacing: "1px"
              },
              expiryMonth: {
                placeholder: "MM",
                fontSize: "16px",
                color: "#1f2937",
                textAlign: "center"
              },
              expiryYear: {
                placeholder: "YY", 
                fontSize: "16px",
                color: "#1f2937",
                textAlign: "center"
              },
              cvv: {
                placeholder: "CVV",
                fontSize: "16px",
                color: "#1f2937",
                textAlign: "center",
                letterSpacing: "2px"
              },
              holder: {
                placeholder: "Cardholder Name",
                fontSize: "16px",
                color: "#1f2937",
                textTransform: "uppercase"
              }
            },
            // Custom labels
            labels: {
              cardNumber: "Card Number",
              expiryMonth: "Month",
              expiryYear: "Year", 
              cvv: "Security Code",
              holder: "Cardholder Name"
            },
            // Additional input configuration
            inputConfiguration: {
              cardNumber: {
                placeholder: "1234 5678 9012 3456",
                maxLength: 19,
                pattern: "[0-9\\s]*"
              },
              expiryMonth: {
                placeholder: "MM",
                maxLength: 2,
                pattern: "[0-9]*"
              },
              expiryYear: {
                placeholder: "YY",
                maxLength: 2,
                pattern: "[0-9]*"
              },
              cvv: {
                placeholder: "123",
                maxLength: 4,
                pattern: "[0-9]*"
              },
              holder: {
                placeholder: "John Doe",
                maxLength: 50
              }
            },
            onReady: function() {
              var frm = document.querySelector('form.paymentWidgets');
              if (!frm) return;

              // Set custom placeholders and styling after form loads
              setTimeout(function() {
                var cardNumberInput = frm.querySelector('input[name="cardNumber"]');
                var expiryMonthInput = frm.querySelector('input[name="expiryMonth"]');
                var expiryYearInput = frm.querySelector('input[name="expiryYear"]');
                var cvvInput = frm.querySelector('input[name="cvv"]');
                var holderInput = frm.querySelector('input[name="holder"]');

                // Card Number field
                if (cardNumberInput) {
                  cardNumberInput.placeholder = "1234 5678 9012 3456";
                  cardNumberInput.setAttribute('data-placeholder', 'Enter your card number');
                  cardNumberInput.style.letterSpacing = "1px";
                  cardNumberInput.style.fontFamily = "Courier New, monospace";
                }
                
                // Expiry Month field
                if (expiryMonthInput) {
                  expiryMonthInput.placeholder = "MM";
                  expiryMonthInput.style.textAlign = "center";
                  expiryMonthInput.style.fontWeight = "600";
                }
                
                // Expiry Year field
                if (expiryYearInput) {
                  expiryYearInput.placeholder = "YY";
                  expiryYearInput.style.textAlign = "center";
                  expiryYearInput.style.fontWeight = "600";
                }
                
                // CVV field
                if (cvvInput) {
                  cvvInput.placeholder = "123";
                  cvvInput.style.textAlign = "center";
                  cvvInput.style.fontWeight = "600";
                  cvvInput.style.letterSpacing = "2px";
                }
                
                // Holder name field
                if (holderInput) {
                  holderInput.placeholder = "John Doe";
                  holderInput.style.textTransform = "uppercase";
                }
                
                // Function to apply styling to inputs
                function applyInputStyling(input) {
                  input.style.fontSize = "16px";
                  input.style.color = "#1f2937";
                  input.style.borderRadius = "8px";
                  input.style.border = "2px solid #e1e5e9";
                  input.style.padding = "12px 16px";
                  input.style.transition = "border-color 0.2s ease";
                  input.style.backgroundColor = "#ffffff";
                  input.setAttribute('style', input.getAttribute('style') + '; color: #1f2937 !important; -webkit-text-fill-color: #1f2937 !important;');
                  
                  // Special handling for card number and CVV fields
                  var fieldName = input.name ? input.name.toLowerCase() : '';
                  var isCardNumber = fieldName.includes('cardnumber') || fieldName.includes('card_number');
                  var isCVV = fieldName.includes('cvv') || fieldName.includes('cvc') || fieldName.includes('securitycode') || fieldName.includes('security_code');
                  
                  if (isCardNumber) {
                    input.style.fontFamily = "Courier New, monospace";
                    input.style.letterSpacing = "1px";
                  }
                  
                  if (isCVV) {
                    input.style.textAlign = "center";
                    input.style.letterSpacing = "2px";
                    input.style.fontWeight = "600";
                  }
                  
                  // Force dark text color on input and change events
                  function forceDarkText(element) {
                    element.style.color = "#1f2937";
                    element.style.setProperty('color', '#1f2937', 'important');
                    element.style.setProperty('-webkit-text-fill-color', '#1f2937', 'important');
                    element.style.setProperty('text-fill-color', '#1f2937', 'important');
                  }
                  
                  input.addEventListener('input', function() {
                    forceDarkText(this);
                  });
                  
                  input.addEventListener('focus', function() {
                    forceDarkText(this);
                  });
                  
                  input.addEventListener('blur', function() {
                    forceDarkText(this);
                  });
                  
                  input.addEventListener('keyup', function() {
                    forceDarkText(this);
                  });
                  
                  input.addEventListener('keydown', function() {
                    forceDarkText(this);
                  });
                  
                  input.addEventListener('change', function() {
                    forceDarkText(this);
                  });
                  
                  // Force initial styling
                  forceDarkText(input);
                }
                
                // Apply styling to existing inputs
                var allInputs = frm.querySelectorAll('input[type="text"], input[type="tel"], input[type="number"]');
                allInputs.forEach(applyInputStyling);
                
                // Use MutationObserver to catch dynamically created inputs
                var observer = new MutationObserver(function(mutations) {
                  mutations.forEach(function(mutation) {
                    mutation.addedNodes.forEach(function(node) {
                      if (node.nodeType === 1) { // Element node
                        var inputs = node.querySelectorAll ? node.querySelectorAll('input[type="text"], input[type="tel"], input[type="number"]') : [];
                        inputs.forEach(applyInputStyling);
                        
                        if (node.tagName === 'INPUT' && (node.type === 'text' || node.type === 'tel' || node.type === 'number')) {
                          applyInputStyling(node);
                        }
                      }
                    });
                  });
                });
                
                observer.observe(frm, { childList: true, subtree: true });
                
                // Inject CSS directly into the document head for maximum override
                var styleId = 'hyperpay-input-override-' + Date.now();
                var style = document.createElement('style');
                style.id = styleId;
                style.innerHTML = \`
                  /* Ultra-aggressive input text color override */
                  input[type="text"], input[type="tel"], input[type="number"] {
                    color: #1f2937 !important;
                    -webkit-text-fill-color: #1f2937 !important;
                    text-fill-color: #1f2937 !important;
                  }
                  
                  /* Target all possible input selectors */
                  * input[type="text"],
                  * input[type="tel"], 
                  * input[type="number"] {
                    color: #1f2937 !important;
                    -webkit-text-fill-color: #1f2937 !important;
                    text-fill-color: #1f2937 !important;
                  }
                  
                  /* Override any existing styles */
                  input[style*="color"] {
                    color: #1f2937 !important;
                    -webkit-text-fill-color: #1f2937 !important;
                    text-fill-color: #1f2937 !important;
                  }
                  
                  /* Force override on focus */
                  input:focus {
                    color: #1f2937 !important;
                    -webkit-text-fill-color: #1f2937 !important;
                    text-fill-color: #1f2937 !important;
                  }
                \`;
                document.head.appendChild(style);
                
                // Additional aggressive approach - continuous monitoring
                var forceStylingInterval = setInterval(function() {
                  var allInputs = frm.querySelectorAll('input[type="text"], input[type="tel"], input[type="number"]');
                  allInputs.forEach(function(input) {
                    var fieldName = input.name ? input.name.toLowerCase() : '';
                    var isCardNumber = fieldName.includes('cardnumber') || fieldName.includes('card_number');
                    var isCVV = fieldName.includes('cvv') || fieldName.includes('cvc') || fieldName.includes('securitycode') || fieldName.includes('security_code');
                    
                    // Force dark text color with multiple methods
                    input.style.setProperty('color', '#1f2937', 'important');
                    input.style.setProperty('-webkit-text-fill-color', '#1f2937', 'important');
                    input.style.setProperty('text-fill-color', '#1f2937', 'important');
                    
                    // Additional methods to override
                    input.setAttribute('style', input.getAttribute('style') + '; color: #1f2937 !important; -webkit-text-fill-color: #1f2937 !important; text-fill-color: #1f2937 !important;');
                    
                    // Force remove any gray color
                    if (input.style.color && input.style.color.includes('gray')) {
                      input.style.removeProperty('color');
                      input.style.setProperty('color', '#1f2937', 'important');
                    }
                    
                    if (isCardNumber) {
                      input.style.setProperty('font-family', 'Courier New, monospace', 'important');
                      input.style.setProperty('letter-spacing', '1px', 'important');
                    }
                    
                    if (isCVV) {
                      input.style.setProperty('text-align', 'center', 'important');
                      input.style.setProperty('letter-spacing', '2px', 'important');
                      input.style.setProperty('font-weight', '600', 'important');
                    }
                  });
                }, 50); // Check every 50ms for more aggressive monitoring
                
                // Clear interval after 30 seconds to avoid performance issues
                setTimeout(function() {
                  clearInterval(forceStylingInterval);
                }, 30000);
                
                // Nuclear option - try to override HyperPay's internal CSS
                setTimeout(function() {
                  var hyperpayStyleSheets = document.querySelectorAll('style, link[rel="stylesheet"]');
                  hyperpayStyleSheets.forEach(function(sheet) {
                    if (sheet.innerHTML && sheet.innerHTML.includes('color') && sheet.innerHTML.includes('gray')) {
                      var newContent = sheet.innerHTML.replace(/color:\\s*[^;]*gray[^;]*;/gi, 'color: #1f2937 !important;');
                      newContent = newContent.replace(/color:\\s*[^;]*#[0-9a-fA-F]{3,6}[^;]*;/gi, function(match) {
                        if (!match.includes('#1f2937')) {
                          return 'color: #1f2937 !important;';
                        }
                        return match;
                      });
                      if (sheet.tagName === 'STYLE') {
                        sheet.innerHTML = newContent;
                      }
                    }
                  });
                }, 1000);
                
              }, 200); // Increased timeout to ensure form is fully loaded

              // Clear any existing hidden inputs to prevent duplicates
              var existingHiddenInputs = frm.querySelectorAll('input[type="hidden"]');
              existingHiddenInputs.forEach(function(input) {
                if (input.name.startsWith('testMode') || 
                    input.name.startsWith('merchantTransactionId') ||
                    input.name.startsWith('customer.') ||
                    input.name.startsWith('billing.')) {
                  input.remove();
                }
              });

              var fields = {
                testMode: "EXTERNAL",
                merchantTransactionId: "${merchantTxId}",
                "customer.email": "${billingData.customerEmail}",
                "customer.givenName": "${billingData.customerGivenName}",
                "customer.surname": "${billingData.customerSurname}",
                "billing.street1": "${billingData.billingStreet1}",
                "billing.city": "${billingData.billingCity}",
                "billing.state": "${billingData.billingState.replace(
                  /\s+/g,
                  "."
                )}",
                "billing.postcode": "${billingData.billingPostcode}",
                "billing.country": "${billingData.billingCountry}"
              };

              // Only add fields that don't already exist
              Object.entries(fields).forEach(function([name, value]) {
                // Check if field already exists
                var existingInput = frm.querySelector('input[name="' + name + '"]');
                if (!existingInput) {
                  var inp = document.createElement('input');
                  inp.type = 'hidden';
                  inp.name = name;
                  inp.value = value;
                  frm.appendChild(inp);
                }
              });
            },
            onError: function(error) {
              console.error('HyperPay widget error:', error);
              
              // Handle specific iframe errors
              if (error && error.name === 'PciIframeSubmitError') {
                console.error('PCI iframe submission error - payment form issue');
                console.error('Error details:', JSON.stringify(error, null, 2));
                
                // Check for parameter errors in the error object
                if (error.result && error.result.parameterErrors) {
                  console.error('Parameter errors found:');
                  error.result.parameterErrors.forEach(function(paramError) {
                    console.error('- Parameter:', paramError.name, 'Value:', paramError.value, 'Message:', paramError.message);
                  });
                }
              }
            },
            onBeforeSubmitCard: function() {
              console.log('Form being submitted to:', document.querySelector('form.paymentWidgets').action);
              return true;
            },
            onAfterSubmitCard: function(error) {
              if (error) {
                console.error('Card submission error:', error);
              } else {
                console.log('Card submitted successfully');
              }
            }
          };
        `}
      </Script>

      <form
        className="paymentWidgets"
        data-brands="VISA MASTER"
        style={{ maxWidth: 400, margin: "auto" }}
      />

      <Script
        src={`${process.env.NEXT_PUBLIC_PAYMENT_BASE_URL}/v1/paymentWidgets.js?checkoutId=${checkoutId}`}
        strategy="afterInteractive"
      />
    </div>
  );
}
