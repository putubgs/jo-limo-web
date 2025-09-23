"use client";

import { Dialog } from "@mui/material";
import Image from "next/image";

interface Props {
  open: boolean;
}

export default function ProcessingDialog({ open }: Props) {
  return (
    <Dialog open={open} onClose={() => {}} disableEscapeKeyDown>
      <div className="flex flex-col items-center space-y-6 px-24 py-12 text-center">
        <div className="relative size-20 animate-spin">
          <Image src="/images/progress-circle.png" alt="Progress" fill />
        </div>
        <h3 className="text-xl font-bold">Processing Booking</h3>
        <p className="text-xs text-[#838383]">
          Processing your booking, please wait…
        </p>
        <p className="text-sm font-medium">Please do not close this screen</p>
      </div>
    </Dialog>
  );
}
