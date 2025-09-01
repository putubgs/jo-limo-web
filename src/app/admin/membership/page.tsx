"use client";

import { useState, useEffect } from "react";

interface Membership {
  membership_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
}

export default function MembershipApplications() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMemberships, setSelectedMemberships] = useState<string[]>([]);

  useEffect(() => {
    // Simulate fetching membership application data
    const dummyMemberships: Membership[] = [
      {
        membership_id: "550e8400-e29b-41d4-a716-446655441001",
        first_name: "Michael",
        last_name: "Johnson",
        email: "michael.johnson@email.com",
        phone_number: "+962 79 123 4567",
      },
      {
        membership_id: "550e8400-e29b-41d4-a716-446655441002",
        first_name: "Sarah",
        last_name: "Wilson",
        email: "sarah.wilson@gmail.com",
        phone_number: "+962 77 987 6543",
      },
      {
        membership_id: "550e8400-e29b-41d4-a716-446655441003",
        first_name: "David",
        last_name: "Chen",
        email: "david.chen@techstartup.com",
        phone_number: "+962 78 456 7890",
      },
      {
        membership_id: "550e8400-e29b-41d4-a716-446655441004",
        first_name: "Emma",
        last_name: "Rodriguez",
        email: "emma.rodriguez@law.com",
        phone_number: "+962 79 321 0987",
      },
      {
        membership_id: "550e8400-e29b-41d4-a716-446655441005",
        first_name: "Ahmed",
        last_name: "Al-Zahra",
        email: "ahmed.alzahra@gmail.com",
        phone_number: "+962 78 555 1234",
      },
    ];
    setMemberships(dummyMemberships);
  }, []);

  const filteredMemberships = memberships.filter((membership) => {
    const matchesSearch =
      `${membership.first_name} ${membership.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      membership.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membership.membership_id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleSelectMembership = (membershipId: string) => {
    setSelectedMemberships((prev) =>
      prev.includes(membershipId)
        ? prev.filter((id) => id !== membershipId)
        : [...prev, membershipId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMemberships.length === filteredMemberships.length) {
      setSelectedMemberships([]);
    } else {
      setSelectedMemberships(
        filteredMemberships.map((membership) => membership.membership_id)
      );
    }
  };

  const handleDeleteSelected = () => {
    if (selectedMemberships.length === 0) return;

    if (
      confirm(
        `Are you sure you want to delete ${selectedMemberships.length} membership(s)?`
      )
    ) {
      setMemberships((prev) =>
        prev.filter(
          (membership) =>
            !selectedMemberships.includes(membership.membership_id)
        )
      );
      setSelectedMemberships([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Memberships</h1>
        <p className="mt-2 text-gray-600">View and manage member records</p>
      </div>

      {/* Search */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search memberships..."
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
            {selectedMemberships.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete Selected ({selectedMemberships.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Memberships List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">
              Memberships ({filteredMemberships.length})
            </h2>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={
                  filteredMemberships.length > 0 &&
                  selectedMemberships.length === filteredMemberships.length
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
                  Membership ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  First Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone Number
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMemberships.map((membership) => (
                <tr key={membership.membership_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedMemberships.includes(
                        membership.membership_id
                      )}
                      onChange={() =>
                        handleSelectMembership(membership.membership_id)
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {membership.membership_id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {membership.first_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {membership.last_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {membership.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {membership.phone_number}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMemberships.length === 0 && (
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No memberships found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? "Try adjusting your search criteria."
                : "No memberships found."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
