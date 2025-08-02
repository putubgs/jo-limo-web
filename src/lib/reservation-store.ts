// Update your existing reservationStore.ts file
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LocationMatch, getPrimaryLocation } from "./location-filter"; // Add this import

export interface ReservationData {
  type: "one-way" | "by-hour";
  pickup: string;
  dropoff: string;
  date: string;
  time: string;
  duration: string;
  selectedClass?: string;
  price?: number;
  // Add these new fields
  pickupLocation?: LocationMatch | null;
  dropoffLocation?: LocationMatch | null;
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
  pickupLocation: null,  // Add this
  dropoffLocation: null, // Add this
};

export const useReservationStore = create<ReservationStore>()(
  persist(
    (set) => ({
      reservationData: defaultReservationData,
      
      // MODIFY this method to include location filtering
      setReservationData: (data) => {
        console.log(`\n💾 STORE UPDATE:`, data);
        
        // Auto-filter locations when pickup/dropoff changes
        const enhancedData = { ...data };
        
        if (data.pickup !== undefined) {
          console.log(`🚗 Processing pickup location...`);
          enhancedData.pickupLocation = getPrimaryLocation(data.pickup);
        }
        
        if (data.dropoff !== undefined) {
          console.log(`🏁 Processing dropoff location...`);
          enhancedData.dropoffLocation = getPrimaryLocation(data.dropoff);
        }
        
        set((state) => ({
          reservationData: { ...state.reservationData, ...enhancedData },
        }));
        
        // Show results
        if (enhancedData.pickupLocation || enhancedData.dropoffLocation) {
          console.log(`🎯 DETECTED LOCATIONS:`);
          if (enhancedData.pickupLocation) {
            console.log(`   Pickup: ${enhancedData.pickupLocation.name}`);
          }
          if (enhancedData.dropoffLocation) {
            console.log(`   Dropoff: ${enhancedData.dropoffLocation.name}`);
          }
        }
      },
      
      clearReservationData: () =>
        set({ reservationData: defaultReservationData }),
    }),
    {
      name: "reservation-storage",
      partialize: (state) => ({ reservationData: state.reservationData }),
    }
  )
);