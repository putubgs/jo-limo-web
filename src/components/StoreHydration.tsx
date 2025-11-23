"use client";

import { useEffect } from "react";
import { useReservationStore } from "@/lib/reservation-store";

/**
 * Component to handle Zustand store hydration on client side.
 * This prevents hydration mismatch errors by ensuring localStorage
 * is only accessed after the component mounts on the client.
 */
export default function StoreHydration() {
  const setHasHydrated = useReservationStore((state) => state.setHasHydrated);

  useEffect(() => {
    // Manually trigger hydration from localStorage
    useReservationStore.persist.rehydrate();
    setHasHydrated(true);
  }, [setHasHydrated]);

  return null;
}
