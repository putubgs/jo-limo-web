"use client";

import { Dialog } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { HyperPayResult } from "@/types/hyperpay";

interface SuccessDialogProps {
  open: boolean;
  onClose: () => void;
  paymentResult?: HyperPayResult | null;
}

export default function SuccessDialog({
  open,
  onClose,
  paymentResult,
}: SuccessDialogProps) {
  const router = useRouter();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{ "& .MuiDialog-paper": { borderRadius: 0 } }}
    >
      <div className="flex flex-col items-center space-y-6 px-24 py-5 pb-14 pt-12 text-center">
        <div className="relative size-20">
          <Image src="/images/check-circle.png" alt="Check Circle" fill />
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
        <div className="flex flex-col items-center space-y-[14px]">
          <button
            onClick={() => router.push("/")}
            className="flex items-center text-xs text-[#727272]"
          >
            {/* simple left arrow icon */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="mr-1 -translate-y-[1px]"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
            <span>Back to homepage</span>
          </button>
        </div>
      </div>
    </Dialog>
  );
}
