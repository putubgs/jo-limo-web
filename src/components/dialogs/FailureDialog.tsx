"use client";

import { Dialog } from "@mui/material";
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  onClose: () => void;
  errorMessage?: string;
}

export default function FailureDialog({ open, onClose, errorMessage }: Props) {
  const router = useRouter();

  return (
    <Dialog open={open} onClose={() => {}} disableEscapeKeyDown>
      <div className="flex flex-col items-center space-y-6 px-24 py-12 text-center">
        <h3 className="text-xl font-bold text-red-600">Payment Failed</h3>
        <p className="text-xs text-[#838383]">
          Your payment could not be processed
        </p>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left max-w-md">
            <p className="text-sm text-red-600 font-medium">Error details:</p>
            <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
          </div>
        )}

        <p className="text-sm font-medium text-gray-600">
          Please try again or contact support if the problem persists
        </p>

        <button
          onClick={onClose}
          className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700"
        >
          Try again
        </button>

        <button
          onClick={() => router.push("/")}
          className="flex items-center text-xs text-[#727272] hover:text-gray-900"
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
