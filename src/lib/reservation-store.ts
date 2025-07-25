import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ReservationData {
  type: "one-way" | "by-hour";
  pickup: string;
  dropoff: string;
  date: string;
  time: string;
  duration: string;
  selectedClass?: string;
  price?: number;
}

interface ReservationStore {
  reservationData: ReservationData;
  setReservationData: (data: Partial<ReservationData>) => void;
  clearReservationData: () => void;
}

const defaultReservationData: ReservationData = {
  type: "one-way",
  pickup: "",
  dropoff: "",
  date: "",
  time: "",
  duration: "",
  selectedClass: "",
  price: 0,
};

export const useReservationStore = create<ReservationStore>()(
  persist(
    (set) => ({
      reservationData: defaultReservationData,
      setReservationData: (data) =>
        set((state) => ({
          reservationData: { ...state.reservationData, ...data },
        })),
      clearReservationData: () =>
        set({ reservationData: defaultReservationData }),
    }),
    {
      name: "reservation-storage", // unique name for localStorage
      // Only persist essential data, not sensitive information
      partialize: (state) => ({ reservationData: state.reservationData }),
    }
  )
);
