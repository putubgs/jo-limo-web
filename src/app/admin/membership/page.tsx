"use client";

import { useState, useEffect } from "react";

interface Membership {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at?: string;
}

export default function MembershipApplications() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMemberships, setSelectedMemberships] = useState<string[]>([]);
  const [allMembershipIds, setAllMembershipIds] = useState<string[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchMemberships();
  }, []);

  const fetchMemberships = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/membership/list");
      const data = await response.json();

      if (data.success) {
        setMemberships(data.memberships);
        setTotalRecords(data.memberships?.length || 0);
      } else {
        setError(data.error || "Failed to fetch memberships");
      }
    } catch (error) {
      console.error("Error fetching memberships:", error);
      setError("Failed to fetch memberships");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMembership = async (id: string) => {
    if (!confirm("Are you sure you want to delete this membership?")) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/membership/delete?id=${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        setMemberships(memberships.filter((m) => m.id !== id));
        setSelectedMemberships(
          selectedMemberships.filter((selectedId) => selectedId !== id)
        );
        alert("Membership deleted successfully");
      } else {
        alert(data.error || "Failed to delete membership");
      }
    } catch (error) {
      console.error("Error deleting membership:", error);
      alert("Failed to delete membership");
    } finally {
      setDeleting(false);
    }
  };

  const filteredMemberships = memberships.filter((membership) => {
    if (!searchTerm.trim()) return true;

    // Split search term into words for flexible multi-word search
    const searchWords = searchTerm.trim().toLowerCase().split(/\s+/);

    // All search words must match at least one field
    return searchWords.every((word) => {
      const fullName =
        `${membership.firstname} ${membership.lastname}`.toLowerCase();
      const email = membership.email.toLowerCase();
      const phone = membership.phone.toLowerCase();
      const id = membership.id.toLowerCase();

      return (
        fullName.includes(word) ||
        email.includes(word) ||
        phone.includes(word) ||
        id.includes(word)
      );
    });
  });

  const handleSelectMembership = (membershipId: string) => {
    setSelectedMemberships((prev) =>
      prev.includes(membershipId)
        ? prev.filter((id) => id !== membershipId)
        : [...prev, membershipId]
    );
  };

  const handleSelectAll = async () => {
    // If all are selected, deselect all
    if (
      selectedMemberships.length === allMembershipIds.length &&
      allMembershipIds.length > 0
    ) {
      setSelectedMemberships([]);
      return;
    }

    try {
      setLoading(true);

      // Fetch all membership IDs
      const response = await fetch("/api/membership/list");

      if (!response.ok) {
        throw new Error("Failed to fetch all memberships");
      }

      const data = await response.json();
      if (data.success) {
        const allIds = (data.memberships || []).map((m: Membership) => m.id);
        setAllMembershipIds(allIds);
        setSelectedMemberships(allIds);
      } else {
        throw new Error(data.error || "Failed to fetch all memberships");
      }
    } catch (err) {
      console.error("Error fetching all memberships:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch all memberships"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedMemberships.length === 0) return;

    if (
      confirm(
        `Are you sure you want to delete ${selectedMemberships.length} membership(s)?`
      )
    ) {
      setDeleting(true);
      try {
        // Delete each selected membership
        const deletePromises = selectedMemberships.map((id) =>
          fetch(`/api/membership/delete?id=${id}`, {
            method: "DELETE",
          })
        );

        const results = await Promise.all(deletePromises);
        const failedDeletes = [];

        // Check which deletes failed
        for (let i = 0; i < results.length; i++) {
          const result = await results[i].json();
          if (!result.success) {
            failedDeletes.push(selectedMemberships[i]);
          }
        }

        if (failedDeletes.length === 0) {
          // All deletes successful - update local state
          setMemberships((prev) =>
            prev.filter(
              (membership) => !selectedMemberships.includes(membership.id)
            )
          );
          setSelectedMemberships([]);
          setAllMembershipIds([]); // Reset the all IDs cache
          alert(
            `Successfully deleted ${selectedMemberships.length} membership(s)`
          );
        } else {
          // Some deletes failed
          alert(
            `Failed to delete ${failedDeletes.length} membership(s). Please try again.`
          );
        }
      } catch (error) {
        console.error("Error deleting selected memberships:", error);
        alert("An error occurred while deleting memberships");
      } finally {
        setDeleting(false);
      }
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
                disabled={deleting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  `Delete Selected (${selectedMemberships.length})`
                )}
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
                  selectedMemberships.length === allMembershipIds.length &&
                  allMembershipIds.length > 0
                }
                onChange={handleSelectAll}
                disabled={loading}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
              />
              <span className="text-sm text-gray-600">
                Select all {totalRecords > 0 ? `(${totalRecords})` : ""}
              </span>
            </label>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading memberships...</span>
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
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMemberships.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="text-center">
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
                    </td>
                  </tr>
                ) : (
                  filteredMemberships.map((membership) => (
                    <tr key={membership.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedMemberships.includes(membership.id)}
                          onChange={() => handleSelectMembership(membership.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {membership.id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {membership.firstname}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {membership.lastname}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {membership.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {membership.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDeleteMembership(membership.id)}
                          disabled={deleting}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deleting ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
