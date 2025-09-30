"use client";

import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import HistoryCard from "@/components/corporate-mobility/booking-history/historyCard";
import type { BookingHistory } from "@/types/booking";
import Image from "next/image";

export default function BookingHistory() {
  const [bookings, setBookings] = useState<BookingHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState<BookingHistory | null>(
    null
  );
  const [showDetailModal, setShowDetailModal] = useState(false);
  const itemsPerPage = 5;

  const pageCount = Math.ceil(totalCount / itemsPerPage);

  const fetchBookings = async (page: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/corporate-mobility/booking-history?page=${
          page + 1
        }&limit=${itemsPerPage}`
      );
      const data = await response.json();

      if (response.ok && data.success) {
        setBookings(data.bookings);
        setTotalCount(data.total);
        setError(null);
      } else {
        setError(data.error || "Failed to fetch booking history");
        setBookings([]);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to fetch booking history");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(currentPage);
  }, [currentPage]);

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  const handleDetailClick = (booking: BookingHistory) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedBooking(null);
  };

  // Helper function to format date and time
  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Helper function to get vehicle image based on selected class
  const getVehicleImage = (selectedClass: string) => {
    const classImages: { [key: string]: string } = {
      executive: "/images/mercedes_bens_img.png",
      luxury: "/images/luxury.png",
      mpv: "/images/mercedes_img.png",
      suv: "/images/cadilac_img.png",
    };
    return classImages[selectedClass] || "/images/mercedes_bens_img.png";
  };

  // Helper function to get vehicle name
  const getVehicleName = (selectedClass: string) => {
    const classNames: { [key: string]: string } = {
      executive: "Executive",
      luxury: "Luxury",
      mpv: "MPV",
      suv: "SUV",
    };
    return classNames[selectedClass] || "Executive";
  };

  if (loading) {
    return (
      <div className="w-3/4 flex justify-center items-center h-64">
        <div className="text-gray-500">Loading booking history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-3/4 flex justify-center items-center h-64">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="w-3/4 flex justify-center items-center h-64">
        <div className="text-gray-500">No booking history found.</div>
      </div>
    );
  }

  return (
    <div className="md:w-3/4 w-full flex flex-col gap-4 pb-[100px] md:pb-0 md:px-0 px-6">
      {bookings.map((booking, index) => (
        <HistoryCard
          key={booking.booking_id || index}
          image={getVehicleImage(booking.selected_class)}
          imageName={getVehicleName(booking.selected_class)}
          dateTime={formatDateTime(booking.date_and_time)}
          pickup={booking.pick_up_location}
          dropoff={booking.drop_off_location}
          price={`JOD ${parseFloat(booking.price.toString()).toFixed(2)}`}
          onDetailClick={() => handleDetailClick(booking)}
        />
      ))}

      {pageCount > 1 && (
        <div className="mt-8 flex justify-end">
          <ReactPaginate
            breakLabel="..."
            nextLabel="▶"
            previousLabel="◀"
            onPageChange={handlePageClick}
            pageRangeDisplayed={4}
            marginPagesDisplayed={1}
            pageCount={pageCount}
            containerClassName="flex items-center gap-6 text-gray-500 select-none"
            pageClassName="cursor-pointer text-gray-500"
            activeClassName="text-black font-bold"
            previousClassName="cursor-pointer text-gray-500"
            nextClassName="cursor-pointer text-gray-500"
            breakClassName="cursor-default text-gray-500"
            forcePage={currentPage}
          />
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Booking Details</h2>
              <button
                onClick={closeDetailModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vehicle Image */}
              <div className="flex justify-center items-center">
                <Image
                  src={getVehicleImage(selectedBooking.selected_class)}
                  alt={getVehicleName(selectedBooking.selected_class)}
                  width={200}
                  height={150}
                  className="rounded-lg h-fit"
                />
              </div>

              {/* Booking Information */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Booking Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Reference Code:</span>{" "}
                      {selectedBooking.reference_code || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Booking Type:</span>{" "}
                      {selectedBooking.booking_type === "one-way"
                        ? "One Way"
                        : "By Hour"}
                    </p>
                    <p>
                      <span className="font-medium">Vehicle Class:</span>{" "}
                      {getVehicleName(selectedBooking.selected_class)}
                    </p>
                    <p>
                      <span className="font-medium">Date & Time:</span>{" "}
                      {formatDateTime(selectedBooking.date_and_time)}
                    </p>
                    {selectedBooking.duration && (
                      <p>
                        <span className="font-medium">Duration:</span>{" "}
                        {selectedBooking.duration}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Location Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Pickup:</span>{" "}
                      {selectedBooking.pick_up_location}
                    </p>
                    <p>
                      <span className="font-medium">Dropoff:</span>{" "}
                      {selectedBooking.drop_off_location}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Customer Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {selectedBooking.first_name} {selectedBooking.last_name}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {selectedBooking.email}
                    </p>
                    <p>
                      <span className="font-medium">Mobile:</span>{" "}
                      {selectedBooking.mobile_number}
                    </p>
                    {selectedBooking.pickup_sign && (
                      <p>
                        <span className="font-medium">Pickup Sign:</span>{" "}
                        {selectedBooking.pickup_sign}
                      </p>
                    )}
                    {selectedBooking.flight_number && (
                      <p>
                        <span className="font-medium">Flight Number:</span>{" "}
                        {selectedBooking.flight_number}
                      </p>
                    )}
                    {selectedBooking.notes_for_the_chauffeur && (
                      <p>
                        <span className="font-medium">Notes:</span>{" "}
                        {selectedBooking.notes_for_the_chauffeur}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Payment Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Payment Method:</span>{" "}
                      {selectedBooking.payment_method === "corporate-billing"
                        ? "Corporate Billing"
                        : selectedBooking.payment_method}
                    </p>
                    <p>
                      <span className="font-medium">Payment Status:</span>
                      <span
                        className={`ml-2 px-2 py-1 rounded text-xs ${
                          selectedBooking.payment_status === "completed"
                            ? "bg-green-100 text-green-800"
                            : selectedBooking.payment_status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedBooking.payment_status
                          .charAt(0)
                          .toUpperCase() +
                          selectedBooking.payment_status.slice(1)}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Total Price:</span> JOD{" "}
                      {parseFloat(selectedBooking.price.toString()).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Booking Timeline
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Booked on:</span>{" "}
                      {formatDateTime(selectedBooking.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
