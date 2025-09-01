"use client";

import { useState, useEffect } from "react";

interface Booking {
  booking_id: string;
  company_id?: string; // nullable foreign key to CorporateAccount
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  additional_notes_for_pickup_location?: string;
  pickup_sign?: string;
  flight_number?: string;
  notes_for_the_chauffeur?: string;
  booking_type: "One Way" | "By The Hour";
  pick_up_location: string;
  drop_off_location: string;
  duration?: string; // null for "One Way", required for "By The Hour"
  date_and_time: string;
  selected_class: "EXECUTIVE" | "LUXURY" | "MPV" | "SUV";
  price: number;
  // UI-only fields for display
  company_name?: string;
  status?: "confirmed" | "completed" | "cancelled" | "pending";
}

export default function BookingHistory() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<"all" | "general" | "corporate">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [viewingBooking, setViewingBooking] = useState<Booking | null>(null);

  useEffect(() => {
    // Simulate fetching booking data
    const dummyBookings: Booking[] = [
      {
        booking_id: "550e8400-e29b-41d4-a716-446655442001",
        company_id: undefined, // general booking
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@email.com",
        mobile_number: "+962 79 123 4567",
        additional_notes_for_pickup_location: "Use main entrance",
        pickup_sign: "JD Airport Transfer",
        flight_number: "RJ142",
        notes_for_the_chauffeur: "Client prefers quiet ride",
        booking_type: "One Way",
        pick_up_location: "Four Seasons Hotel Amman",
        drop_off_location: "Queen Alia International Airport",
        duration: undefined, // null for One Way
        date_and_time: "2024-01-15T10:30:00",
        selected_class: "EXECUTIVE",
        price: 85.0,
        // UI-only fields
        status: "confirmed",
      },
      {
        booking_id: "550e8400-e29b-41d4-a716-446655442002",
        company_id: "550e8400-e29b-41d4-a716-446655440001", // TechCorp Inc.
        first_name: "Jane",
        last_name: "Smith",
        email: "jane.smith@techcorp.com",
        mobile_number: "+962 77 987 6543",
        additional_notes_for_pickup_location:
          "Building parking garage level B2",
        pickup_sign: "TechCorp Executive",
        flight_number: "EK903",
        booking_type: "By The Hour",
        pick_up_location: "Abdali Boulevard Business District",
        drop_off_location: "Round trip from starting location",
        duration: "3 hours",
        date_and_time: "2024-01-15T14:00:00",
        selected_class: "LUXURY",
        price: 420.0,
        // UI-only fields
        company_name: "TechCorp Inc.",
        status: "completed",
      },
      {
        booking_id: "550e8400-e29b-41d4-a716-446655442003",
        company_id: undefined, // general booking
        first_name: "Bob",
        last_name: "Johnson",
        email: "bob.johnson@gmail.com",
        mobile_number: "+962 78 456 7890",
        additional_notes_for_pickup_location: "Wait at taxi queue",
        pickup_sign: "Johnson Family",
        flight_number: "TK708",
        booking_type: "One Way",
        pick_up_location: "Amman Central Station",
        drop_off_location: "Jordan Archaeological Museum",
        duration: undefined, // null for One Way
        date_and_time: "2024-01-14T11:00:00",
        selected_class: "SUV",
        price: 65.0,
        // UI-only fields
        status: "cancelled",
      },
      {
        booking_id: "550e8400-e29b-41d4-a716-446655442004",
        company_id: "550e8400-e29b-41d4-a716-446655440002", // Global Solutions Ltd.
        first_name: "Alice",
        last_name: "Brown",
        email: "alice.brown@globalsolutions.com",
        mobile_number: "+962 79 321 0987",
        additional_notes_for_pickup_location: "Corporate entrance",
        pickup_sign: "Global Solutions VIP",
        flight_number: "QR402",
        notes_for_the_chauffeur: "Multiple stops for client meetings",
        booking_type: "By The Hour",
        pick_up_location: "Amman Chamber of Commerce",
        drop_off_location: "Round trip from starting location",
        duration: "Full Day",
        date_and_time: "2024-01-14T09:00:00",
        selected_class: "MPV",
        price: 800.0,
        // UI-only fields
        company_name: "Global Solutions Ltd.",
        status: "pending",
      },
    ];
    setBookings(dummyBookings);
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    // Determine booking type based on company_id
    const bookingType = booking.company_id ? "corporate" : "general";
    const matchesFilter = filter === "all" || bookingType === filter;
    const customerName = `${booking.first_name} ${booking.last_name}`;
    const matchesSearch =
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.booking_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.company_name &&
        booking.company_name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleSelectBooking = (bookingId: string) => {
    setSelectedBookings((prev) =>
      prev.includes(bookingId)
        ? prev.filter((id) => id !== bookingId)
        : [...prev, bookingId]
    );
  };

  const handleSelectAll = () => {
    if (selectedBookings.length === filteredBookings.length) {
      setSelectedBookings([]);
    } else {
      setSelectedBookings(
        filteredBookings.map((booking) => booking.booking_id)
      );
    }
  };

  const handleDeleteSelected = () => {
    if (selectedBookings.length === 0) return;

    if (
      confirm(
        `Are you sure you want to delete ${selectedBookings.length} booking(s)?`
      )
    ) {
      setBookings((prev) =>
        prev.filter((booking) => !selectedBookings.includes(booking.booking_id))
      );
      setSelectedBookings([]);
    }
  };

  const handleViewBooking = (bookingId: string) => {
    const booking = bookings.find((b) => b.booking_id === bookingId);
    if (booking) {
      setViewingBooking(booking);
    }
  };

  const handleStatusUpdate = (
    bookingId: string,
    newStatus: "confirmed" | "completed" | "cancelled" | "pending"
  ) => {
    setBookings(
      bookings.map((booking) =>
        booking.booking_id === bookingId
          ? { ...booking, status: newStatus }
          : booking
      )
    );
  };

  const getStatusBadge = (status: string) => {
    const baseClasses =
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case "confirmed":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "completed":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "cancelled":
        return `${baseClasses} bg-red-100 text-red-800`;
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusSelectClasses = (status: string) => {
    const baseClasses =
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border-0 cursor-pointer appearance-none text-center focus:ring-0 focus:outline-none hover:opacity-80";
    switch (status) {
      case "confirmed":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "completed":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "cancelled":
        return `${baseClasses} bg-red-100 text-red-800`;
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Booking History</h1>
        <p className="mt-2 text-gray-600">
          Manage and review all booking records
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex space-x-4">
            {/* Filter buttons */}
            <div className="flex rounded-md shadow-sm">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 text-sm font-medium border rounded-l-md ${
                  filter === "all"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("general")}
                className={`px-4 py-2 text-sm font-medium border-t border-b ${
                  filter === "general"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                General
              </button>
              <button
                onClick={() => setFilter("corporate")}
                className={`px-4 py-2 text-sm font-medium border rounded-r-md ${
                  filter === "corporate"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Corporate
              </button>
            </div>
          </div>

          <div className="flex space-x-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Delete selected button */}
            {selectedBookings.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete Selected ({selectedBookings.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Booking List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">
              Bookings ({filteredBookings.length})
            </h2>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={
                  filteredBookings.length > 0 &&
                  selectedBookings.length === filteredBookings.length
                }
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">Select all</span>
            </label>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Select
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Selected Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Flight Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route / Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => {
                const bookingType = booking.company_id
                  ? "corporate"
                  : "general";
                const formattedDateTime = new Date(
                  booking.date_and_time
                ).toLocaleString();
                return (
                  <tr key={booking.booking_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedBookings.includes(booking.booking_id)}
                        onChange={() => handleSelectBooking(booking.booking_id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        {booking.booking_type}
                      </div>
                      <div className="text-sm text-gray-500 capitalize">
                        {bookingType}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.first_name} {booking.last_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.email}
                      </div>
                      {booking.company_name && (
                        <div className="text-sm text-gray-500 font-medium">
                          {booking.company_name}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        {booking.selected_class}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {booking.flight_number ? (
                        <div className="text-sm text-gray-900">
                          {booking.flight_number}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400">-</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {booking.pick_up_location}
                      </div>
                      <div className="text-sm text-gray-500">
                        → {booking.drop_off_location}
                      </div>
                      {booking.duration && (
                        <div className="text-sm text-blue-600 font-medium">
                          Duration: {booking.duration}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formattedDateTime}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.price.toFixed(2)} JOD
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={booking.status || "pending"}
                        onChange={(e) =>
                          handleStatusUpdate(
                            booking.booking_id,
                            e.target.value as
                              | "confirmed"
                              | "completed"
                              | "cancelled"
                              | "pending"
                          )
                        }
                        className={getStatusSelectClasses(
                          booking.status || "pending"
                        )}
                        title="Click to change status"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewBooking(booking.booking_id)}
                        className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No bookings found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? "Try adjusting your search criteria."
                : "No bookings match the current filter."}
            </p>
          </div>
        )}
      </div>

      {/* Booking Detail Modal */}
      {viewingBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-60 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
            {/* Header - Fixed */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Booking Details</h3>
                  <p className="text-blue-100 text-sm mt-1">
                    ID: {viewingBooking.booking_id}
                  </p>
                </div>
                <button
                  onClick={() => setViewingBooking(null)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Scrollable Content with Visual Indicators */}
            <div className="relative flex-1 overflow-hidden">
              {/* Top gradient indicator */}
              <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none"></div>

              {/* Scrollable content */}
              <div
                className="overflow-y-auto px-6 py-6 space-y-6"
                style={{
                  maxHeight: "60vh",
                  scrollbarWidth: "thin",
                  scrollbarColor: "#93c5fd #f3f4f6",
                }}
              >
                {/* Customer Information Section */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Customer Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        First Name
                      </label>
                      <p className="text-base text-gray-900 font-medium">
                        {viewingBooking.first_name}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Last Name
                      </label>
                      <p className="text-base text-gray-900 font-medium">
                        {viewingBooking.last_name}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Email
                      </label>
                      <p className="text-base text-gray-900">
                        {viewingBooking.email}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Mobile Number
                      </label>
                      <p className="text-base text-gray-900">
                        {viewingBooking.mobile_number}
                      </p>
                    </div>
                    {viewingBooking.company_name && (
                      <div className="bg-white p-4 rounded-lg border">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Company
                        </label>
                        <p className="text-base text-gray-900 font-medium">
                          {viewingBooking.company_name}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Booking Information Section */}
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0V7a2 2 0 012-2h4a2 2 0 012 2v0M5 7h14l-1 10H6L5 7z"
                      />
                    </svg>
                    Booking Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg border">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Booking Type
                      </label>
                      <p className="text-base text-gray-900 font-medium">
                        {viewingBooking.booking_type}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Selected Class
                      </label>
                      <p className="text-base text-gray-900 font-medium">
                        {viewingBooking.selected_class}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Date & Time
                      </label>
                      <p className="text-base text-gray-900">
                        {new Date(
                          viewingBooking.date_and_time
                        ).toLocaleString()}
                      </p>
                    </div>
                    {viewingBooking.duration && (
                      <div className="bg-white p-4 rounded-lg border">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Duration
                        </label>
                        <p className="text-base text-gray-900 font-medium">
                          {viewingBooking.duration}
                        </p>
                      </div>
                    )}
                    <div className="bg-white p-4 rounded-lg border">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Price
                      </label>
                      <p className="text-xl text-green-600 font-bold">
                        {viewingBooking.price.toFixed(2)} JOD
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Status
                      </label>
                      <span
                        className={getStatusBadge(
                          viewingBooking.status || "pending"
                        )}
                      >
                        {viewingBooking.status || "pending"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Trip Details Section */}
                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Trip Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Pickup Location
                      </label>
                      <p className="text-base text-gray-900 font-medium">
                        {viewingBooking.pick_up_location}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Drop-off Location
                      </label>
                      <p className="text-base text-gray-900 font-medium">
                        {viewingBooking.drop_off_location}
                      </p>
                    </div>
                    {viewingBooking.flight_number && (
                      <div className="bg-white p-4 rounded-lg border">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Flight Number
                        </label>
                        <p className="text-base text-gray-900 font-bold text-blue-600">
                          {viewingBooking.flight_number}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Special Instructions Section */}
                <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-amber-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                    Special Instructions
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-white p-4 rounded-lg border">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Additional Notes for Pickup Location
                      </label>
                      <p className="text-base text-gray-900">
                        {viewingBooking.additional_notes_for_pickup_location ||
                          "No additional notes"}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Pickup Sign
                      </label>
                      <p className="text-base text-gray-900 font-medium">
                        {viewingBooking.pickup_sign ||
                          "No pickup sign specified"}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Notes for the Chauffeur
                      </label>
                      <p className="text-base text-gray-900">
                        {viewingBooking.notes_for_the_chauffeur ||
                          "No special notes for chauffeur"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom gradient indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none"></div>
            </div>

            {/* Footer - Fixed */}
            <div className="flex-shrink-0 bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-2xl">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Scroll to view all details
                  </span>
                </div>
                <button
                  onClick={() => setViewingBooking(null)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
