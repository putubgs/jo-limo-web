// Update your existing reservationStore.ts file
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LocationMatch, getPrimaryLocation } from "./location-filter";

// Add this type for service classes
export type ServiceClass = "executive" | "luxury" | "mpv" | "suv";

export interface BillingData {
  customerEmail: string;
  customerGivenName: string;
  customerSurname: string;
  billingStreet1: string;
  billingCity: string;
  billingState: string;
  billingCountry: string;
  billingPostcode: string;
}

export interface ReservationData {
  type: "one-way" | "by-hour";
  pickup: string;
  dropoff: string;
  date: string;
  time: string;
  duration: string;
  selectedClass?: ServiceClass;
  selectedClassPrice?: string; // Keep as string to match calculatePrice return type
  // Add these new fields
  pickupLocation?: LocationMatch | null;
  dropoffLocation?: LocationMatch | null;
  // Billing information for payment
  billingData?: BillingData;
}

interface ReservationStore {
  reservationData: ReservationData;
  setReservationData: (data: Partial<ReservationData>) => void;
  clearReservationData: () => void;
  // Fix the parameter type here - price should be string
  setSelectedServiceClass: (serviceClass: ServiceClass, price: string) => void;
  getSelectedServiceClass: () => ServiceClass | undefined;
  getSelectedServicePrice: () => string | undefined;
  setBillingData: (billingData: BillingData) => void;
  getBillingData: () => BillingData | undefined;
}

const defaultReservationData: ReservationData = {
  type: "one-way",
  pickup: "",
  dropoff: "",
  date: "",
  time: "",
  duration: "",
  selectedClass: undefined,
  selectedClassPrice: undefined,
  pickupLocation: null,
  dropoffLocation: null,
  billingData: undefined,
};

export const useReservationStore = create<ReservationStore>()(
  persist(
    (set, get) => ({
      reservationData: defaultReservationData,

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

      // Updated method - price parameter is now string
      setSelectedServiceClass: (serviceClass: ServiceClass, price: string) => {
        console.log(`🚙 SERVICE CLASS SELECTED:`, { serviceClass, price });
        set((state) => ({
          reservationData: {
            ...state.reservationData,
            selectedClass: serviceClass,
            selectedClassPrice: price,
          },
        }));
      },

      // Updated getter methods
      getSelectedServiceClass: () => {
        return get().reservationData.selectedClass;
      },

      getSelectedServicePrice: () => {
        return get().reservationData.selectedClassPrice;
      },

      setBillingData: (billingData: BillingData) => {
        console.log(`💳 BILLING DATA SET:`, billingData);
        set((state) => ({
          reservationData: {
            ...state.reservationData,
            billingData,
          },
        }));
      },

      getBillingData: () => {
        return get().reservationData.billingData;
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
