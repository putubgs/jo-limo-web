"use client";

import ReservationForm from "@/components/ReservationForm";

export default function ReserveCorporateMobility() {
  return (
    <div className="md:w-3/4 w-full flex flex-col gap-4">
      <ReservationForm
        variant="page"
        continueUrl="/corporate-mobility/account/reserve/service-class"
      />
    </div>
  );
}
