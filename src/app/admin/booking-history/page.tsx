"use client";

import { useState, useEffect, useCallback } from "react";

interface Booking {
  booking_id: string;
  company_id?: string | null; // nullable foreign key to CorporateAccount
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
  duration?: string | null; // null for "one-way", required for "by-hour"
  date_and_time: string;
  selected_class: "executive" | "luxury" | "mpv" | "suv";
  payment_method: "credit/debit" | "cash" | "corporate-billing";
  payment_status: "pending" | "completed" | "cancelled";
  price: number;
  created_at: string;
  updated_at: string;
  // UI-only fields for display
  company_name?: string;
}

export default function BookingHistory() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<"all" | "general" | "corporate">("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<
    "all" | "pending" | "completed" | "cancelled"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [monthFilter, setMonthFilter] = useState<string>("");
  const [yearFilter, setYearFilter] = useState<string>("");
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [viewingBooking, setViewingBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [totalAmount, setTotalAmount] = useState(0);

  // Function to fetch bookings from API
  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        filter: filter,
        payment_status: paymentStatusFilter,
      });

      if (searchTerm) {
        params.append("search", searchTerm);
      }
      if (monthFilter) {
        params.append("month", monthFilter);
      }
      if (yearFilter) {
        params.append("year", yearFilter);
      }

      const response = await fetch(`/api/admin/booking-history?${params}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch bookings: ${response.statusText}`);
      }

      const data = await response.json();
      setBookings(data.bookings || []);
      setPagination((prev) => ({
        ...prev,
        total: data.total || 0,
      }));

      // Calculate total amount from displayed bookings
      const total = (data.bookings || []).reduce(
        (sum: number, booking: Booking) => sum + booking.price,
        0
      );
      setTotalAmount(total);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [
    pagination.page,
    pagination.limit,
    filter,
    searchTerm,
    paymentStatusFilter,
    monthFilter,
    yearFilter,
  ]);

  useEffect(() => {
    fetchBookings();
  }, [
    pagination.page,
    filter,
    paymentStatusFilter,
    monthFilter,
    yearFilter,
    fetchBookings,
  ]);

  // Handle search input change (no auto-search)
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  // Handle Enter key press in search input
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page when searching
      fetchBookings();
    }
  };

  // Handle filter change
  const handleFilterChange = (newFilter: "all" | "general" | "corporate") => {
    setFilter(newFilter);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page when filtering
  };

  // Handle payment status filter change
  const handlePaymentStatusFilterChange = (
    newPaymentStatusFilter: "all" | "pending" | "completed" | "cancelled"
  ) => {
    setPaymentStatusFilter(newPaymentStatusFilter);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page when filtering
  };

  // Handle month filter change
  const handleMonthFilterChange = (newMonth: string) => {
    setMonthFilter(newMonth);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page when filtering
  };

  // Handle year filter change
  const handleYearFilterChange = (newYear: string) => {
    setYearFilter(newYear);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page when filtering
  };

  // Handle status update
  const handleStatusUpdate = async (
    bookingId: string,
    newStatus: "pending" | "completed" | "cancelled"
  ) => {
    try {
      const response = await fetch(`/api/admin/booking-history/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payment_status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to update booking status: ${response.statusText}`
        );
      }

      // Refresh the bookings list
      await fetchBookings();
    } catch (error) {
      console.error("Error updating booking status:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update booking status"
      );
    }
  };

  const handleSelectBooking = (bookingId: string) => {
    setSelectedBookings((prev) =>
      prev.includes(bookingId)
        ? prev.filter((id) => id !== bookingId)
        : [...prev, bookingId]
    );
  };

  const handleSelectAll = () => {
    if (selectedBookings.length === bookings.length) {
      setSelectedBookings([]);
    } else {
      setSelectedBookings(bookings.map((booking) => booking.booking_id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedBookings.length === 0) return;

    if (
      confirm(
        `Are you sure you want to delete ${selectedBookings.length} booking(s)?`
      )
    ) {
      try {
        setDeleting(true);
        setError(null);

        // Delete each selected booking from the database
        const deletePromises = selectedBookings.map(async (bookingId) => {
          const response = await fetch(
            `/api/admin/booking-history/${bookingId}`,
            {
              method: "DELETE",
            }
          );

          if (!response.ok) {
            throw new Error(`Failed to delete booking ${bookingId}`);
          }

          return bookingId;
        });

        await Promise.all(deletePromises);

        // Remove deleted bookings from local state
        setBookings((prev) =>
          prev.filter(
            (booking) => !selectedBookings.includes(booking.booking_id)
          )
        );
        setSelectedBookings([]);

        // Refresh the bookings list to ensure consistency
        await fetchBookings();
      } catch (error) {
        console.error("Error deleting bookings:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to delete selected bookings"
        );
      } finally {
        setDeleting(false);
      }
    }
  };

  const handleViewBooking = (bookingId: string) => {
    const booking = bookings.find((b) => b.booking_id === bookingId);
    if (booking) {
      setViewingBooking(booking);
    }
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
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "completed":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "cancelled":
        return `${baseClasses} bg-red-100 text-red-800`;
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
        {!loading && bookings.length > 0 && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-green-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
              <span className="text-sm font-medium text-green-800">
                Total Amount for Current View:{" "}
                <span className="font-bold text-lg">
                  {totalAmount.toFixed(2)} JOD
                </span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Filters and Search */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Filter buttons */}
            <div className="flex rounded-md shadow-sm">
              <button
                onClick={() => handleFilterChange("all")}
                className={`px-4 py-2 text-sm font-medium border rounded-l-md ${
                  filter === "all"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleFilterChange("general")}
                className={`px-4 py-2 text-sm font-medium border-t border-b ${
                  filter === "general"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                General
              </button>
              <button
                onClick={() => handleFilterChange("corporate")}
                className={`px-4 py-2 text-sm font-medium border rounded-r-md ${
                  filter === "corporate"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Corporate
              </button>
            </div>

            {/* Payment Status Filter */}
            <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-md">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Payment Status:
              </label>
              <select
                value={paymentStatusFilter}
                onChange={(e) =>
                  handlePaymentStatusFilterChange(
                    e.target.value as
                      | "all"
                      | "pending"
                      | "completed"
                      | "cancelled"
                  )
                }
                className="block w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Month Filter */}
            <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-md">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Month:
              </label>
              <select
                value={monthFilter}
                onChange={(e) => handleMonthFilterChange(e.target.value)}
                className="block w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
              >
                <option value="">All Months</option>
                <option value="01">January</option>
                <option value="02">February</option>
                <option value="03">March</option>
                <option value="04">April</option>
                <option value="05">May</option>
                <option value="06">June</option>
                <option value="07">July</option>
                <option value="08">August</option>
                <option value="09">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>

            {/* Year Filter */}
            <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-md">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Year:
              </label>
              <select
                value={yearFilter}
                onChange={(e) => handleYearFilterChange(e.target.value)}
                className="block w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
              >
                <option value="">All Years</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by customer name... (Press Enter to search)"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyPress={handleSearchKeyPress}
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
                disabled={deleting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  `Delete Selected (${selectedBookings.length})`
                )}
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
              Bookings ({bookings.length})
            </h2>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={
                  bookings.length > 0 &&
                  selectedBookings.length === bookings.length
                }
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">Select all</span>
            </label>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading bookings...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mx-6 my-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error loading bookings
                </h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
                <button
                  onClick={fetchBookings}
                  className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && (
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
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => {
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
                          checked={selectedBookings.includes(
                            booking.booking_id
                          )}
                          onChange={() =>
                            handleSelectBooking(booking.booking_id)
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">
                          {booking.booking_type === "one-way"
                            ? "One Way"
                            : "By The Hour"}
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
                          {booking.selected_class.toUpperCase()}
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
                        <div className="text-sm text-gray-900 font-medium capitalize">
                          {booking.payment_method.replace("-", " ")}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={booking.payment_status || "pending"}
                          onChange={(e) =>
                            handleStatusUpdate(
                              booking.booking_id,
                              e.target.value as
                                | "pending"
                                | "completed"
                                | "cancelled"
                            )
                          }
                          className={getStatusSelectClasses(
                            booking.payment_status || "pending"
                          )}
                          title="Click to change status"
                        >
                          <option value="pending">Pending</option>
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
        )}

        {!loading && !error && bookings.length === 0 && (
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

        {/* Pagination */}
        {!loading && !error && bookings.length > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    page: Math.max(1, prev.page - 1),
                  }))
                }
                disabled={pagination.page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                }
                disabled={
                  pagination.page * pagination.limit >= pagination.total
                }
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(pagination.page - 1) * pagination.limit + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}
                  </span>{" "}
                  of <span className="font-medium">{pagination.total}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: Math.max(1, prev.page - 1),
                      }))
                    }
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: prev.page + 1,
                      }))
                    }
                    disabled={
                      pagination.page * pagination.limit >= pagination.total
                    }
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
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
                  <h3 className="text-xl font-bold">
                    Booking Details (
                    {viewingBooking.created_at
                      .replace("T", " ")
                      .replace(/\.\d+$/, "")}
                    )
                  </h3>
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
                        Payment Status
                      </label>
                      <span
                        className={getStatusBadge(
                          viewingBooking.payment_status || "pending"
                        )}
                      >
                        {viewingBooking.payment_status || "pending"}
                      </span>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Payment Method
                      </label>
                      <p className="text-base text-gray-900 font-medium capitalize">
                        {viewingBooking.payment_method.replace("-", " ")}
                      </p>
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
                        {viewingBooking.duration
                          ? "Duration"
                          : "Drop-off Location"}
                      </label>
                      <p className="text-base text-gray-900 font-medium">
                        {viewingBooking.duration ||
                          viewingBooking.drop_off_location}
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
                    Special Instructions and Reference code
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
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
                    <div className="bg-white p-4 rounded-lg border">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Reference code or cost center
                      </label>
                      <p className="text-base text-gray-900">
                        {viewingBooking.reference_code ||
                          "No reference code or cost center"}
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
