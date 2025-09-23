"use client";

import { Suspense } from "react";
import PaymentStatusClient from "@/components/PaymentStatusClient";

export default function PaymentStatusPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-4 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Loading payment status...
            </h3>
          </div>
        </div>
      }
    >
      <PaymentStatusClient showUI={true} />
    </Suspense>
  );
}
