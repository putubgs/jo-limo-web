"use client";

import { useState } from "react";
import ReactPaginate from "react-paginate";
import HistoryCard from "@/components/corporate-mobility/booking-history/historyCard";

export default function BookingHistory() {
  const bookings = Array.from({ length: 70 }, (_, i) => ({
    id: i + 1,
  }));

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(0);

  const pageCount = Math.ceil(bookings.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = bookings.slice(offset, offset + itemsPerPage);

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="w-3/4 flex flex-col gap-4">
      {currentItems.map((booking) => (
        <HistoryCard key={booking.id} />
      ))}

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
    </div>
  );
}