"use client";

import { Dialog } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { HyperPayResult } from "@/types/hyperpay";

interface Props {
  open: boolean;
  onClose: () => void;
  paymentResult?: HyperPayResult | null;
}

export default function SuccessDialog({ open, onClose, paymentResult }: Props) {
  const router = useRouter();

  // Check if this is a cash payment
  const isCashPayment = paymentResult?.id?.startsWith("CASH-");

  return (
    <Dialog open={open} onClose={() => {}} disableEscapeKeyDown>
      <div className="flex flex-col items-center space-y-4 md:space-y-6 px-6 md:px-24 py-8 md:py-12 text-center">
        <div className="relative size-16 md:size-20">
          <Image src="/images/check-circle.png" alt="Success" fill />
        </div>
        <h3 className="text-lg md:text-xl font-bold">
          {isCashPayment ? "Order Confirmed" : "Payment Successful"}
        </h3>
        <p className="text-xs text-[#838383]">
          {isCashPayment
            ? "Your order has been processed successfully"
            : "Your payment has been processed successfully"}
        </p>

        {paymentResult && (
          <div className="bg-gray-50 rounded-lg p-3 md:p-4 mt-4 text-left w-full max-w-sm">
            <p className="text-xs md:text-sm text-gray-600">Transaction ID:</p>
            <p className="font-mono text-xs md:text-sm font-bold break-all">
              {paymentResult.id}
            </p>
            <p className="text-xs md:text-sm text-gray-600 mt-2">Amount:</p>
            <p className="text-base md:text-lg font-bold">
              {paymentResult.amount} {paymentResult.currency}
            </p>
            <p className="text-xs md:text-sm text-gray-600 mt-2">Status:</p>
            <p className="text-xs md:text-sm font-semibold text-green-600">
              {paymentResult.result.description}
            </p>
          </div>
        )}

        <button
          onClick={() => {
            onClose();
            router.push("/");
          }}
          className="flex items-center text-xs text-[#727272]"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mr-1 -translate-y-[1px]"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back to homepage
        </button>
      </div>
    </Dialog>
  );
}
