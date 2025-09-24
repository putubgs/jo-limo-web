"use client";

import { useEffect } from "react";
import { useReservationStore } from "@/lib/reservation-store";

interface HomeClientWrapperProps {
  children: React.ReactNode;
}

export default function HomeClientWrapper({
  children,
}: HomeClientWrapperProps) {
  const { resetForCorporateMobility } = useReservationStore();

  useEffect(() => {
    resetForCorporateMobility();
  }, [resetForCorporateMobility]);

  return <>{children}</>;
}
