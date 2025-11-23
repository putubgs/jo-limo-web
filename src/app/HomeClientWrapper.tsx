"use client";

import { useEffect } from "react";
import { useReservationStore } from "@/lib/reservation-store";

interface HomeClientWrapperProps {
  children: React.ReactNode;
}

export default function HomeClientWrapper({
  children,
}: HomeClientWrapperProps) {
  const { resetForCorporateMobility, setHasHydrated } = useReservationStore();

  useEffect(() => {
    // Rehydrate the store from localStorage
    useReservationStore.persist.rehydrate();
    setHasHydrated(true);
    resetForCorporateMobility();
  }, [resetForCorporateMobility, setHasHydrated]);

  return <>{children}</>;
}
