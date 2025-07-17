"use client";

import { Dialog } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";


interface SuccessDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function SuccessDialog({ open, onClose }: SuccessDialogProps) {
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
        <h3 className="text-xl font-bold">Booking Successful</h3>
        <p className="text-xs text-[#838383]">
          Booking confirmation and receipt sent to your email
        </p>
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
