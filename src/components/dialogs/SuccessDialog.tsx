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

  return (
    <Dialog open={open} onClose={() => {}} disableEscapeKeyDown>
      <div className="flex flex-col items-center space-y-6 px-24 py-12 text-center">
        <div className="relative size-20">
          <Image src="/images/check-circle.png" alt="Success" fill />
        </div>
        <h3 className="text-xl font-bold">Payment Successful</h3>
        <p className="text-xs text-[#838383]">
          Your payment has been processed successfully
        </p>

        {paymentResult && (
          <div className="bg-gray-50 rounded-lg p-4 mt-4 text-left">
            <p className="text-sm text-gray-600">Transaction ID:</p>
            <p className="font-mono text-sm font-bold break-all">
              {paymentResult.id}
            </p>
            <p className="text-sm text-gray-600 mt-2">Amount:</p>
            <p className="text-lg font-bold">
              {paymentResult.amount} {paymentResult.currency}
            </p>
            <p className="text-sm text-gray-600 mt-2">Status:</p>
            <p className="text-sm font-semibold text-green-600">
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
