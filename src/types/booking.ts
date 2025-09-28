export interface BookingHistory {
  booking_id: string; // UUID
  company_id?: string | null; // UUID, nullable foreign key to CorporateAccount
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  pickup_sign?: string | null;
  flight_number?: string | null;
  notes_for_the_chauffeur?: string | null;
  reference_code?: string | null;
  booking_type: "one-way" | "by-hour"; // Changed from "One Way" | "By The Hour" to match reservation store
  pick_up_location: string;
  drop_off_location: string;
  duration?: string | null; // null for "one-way", required for "by-hour"
  date_and_time: string; // ISO timestamp string
  selected_class: "executive" | "luxury" | "mpv" | "suv"; // Changed to lowercase to match reservation store
  payment_method: "credit/debit" | "cash" | "corporate-billing";
  payment_status: "pending" | "completed" | "cancelled";
  price: number;
  created_at: string;
  updated_at: string;
}

export interface CreateBookingRequest {
  company_id?: string | null;
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  pickup_sign?: string | null;
  flight_number?: string | null;
  notes_for_the_chauffeur?: string | null;
  reference_code?: string | null;
  booking_type: "one-way" | "by-hour";
  pick_up_location: string;
  drop_off_location: string;
  duration?: string | null;
  date_and_time: string;
  selected_class: "executive" | "luxury" | "mpv" | "suv";
  payment_method: "credit/debit" | "cash" | "corporate-billing";
  payment_status: "pending" | "completed" | "cancelled";
  price: number;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateBookingRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  mobile_number?: string;
  pickup_sign?: string | null;
  flight_number?: string | null;
  notes_for_the_chauffeur?: string | null;
  reference_code?: string | null;
  booking_type?: "one-way" | "by-hour";
  pick_up_location?: string;
  drop_off_location?: string;
  duration?: string | null;
  date_and_time?: string;
  selected_class?: "executive" | "luxury" | "mpv" | "suv";
  payment_method?: "hyperpay" | "cash" | "corporate-billing";
  payment_status?: "pending" | "completed" | "cancelled";
  price?: number;
}

export interface BookingListResponse {
  bookings: BookingHistory[];
  total: number;
  page: number;
  limit: number;
}
