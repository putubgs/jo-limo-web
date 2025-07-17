"use client";

import { Dialog } from "@mui/material";
import Image from "next/image";

interface ProcessingDialogProps {
  open: boolean;
}

export default function ProcessingDialog({ open }: ProcessingDialogProps) {
  return (
    <Dialog open={open} sx={{ "& .MuiDialog-paper": { borderRadius: 0 } }}>
      <div className="flex flex-col items-center space-y-6 px-24 py-5 pb-14 pt-12 text-center">
        <div className="relative size-20 animate-spin">
          <Image src="/images/progress-circle.png" alt="Progress Circle" fill />
        </div>
        <h3 className="text-xl font-bold">Processing Booking</h3>
        <p className="text-xs text-[#838383]">
          Processing your booking, please wait...
        </p>
        <p className="text-sm font-medium">
          Please wait do not close the screen
        </p>
      </div>
    </Dialog>
  );
}
