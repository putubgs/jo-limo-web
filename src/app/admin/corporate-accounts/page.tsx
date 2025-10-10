"use client";

import { useState, useEffect } from "react";

interface CorporateAccount {
  company_id: string;
  corporate_reference: string;
  company_name: string;
  company_website: string;
  company_address: string;
  company_email: string;
  phone_number: string;
  billing_address: string;
  password?: string; // This will be populated from form data, not from API
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
}

type FormMode = "create" | "edit" | "view" | null;

export default function CorporateAccounts() {
  const [accounts, setAccounts] = useState<CorporateAccount[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [currentAccount, setCurrentAccount] = useState<CorporateAccount | null>(
    null
  );
  const [formData, setFormData] = useState<Partial<CorporateAccount>>({});
  const [successMessage, setSuccessMessage] = useState<{
    show: boolean;
    reference: string;
    email: string;
  }>({ show: false, reference: "", email: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordValidation, setPasswordValidation] = useState({
    isValid: false,
    errors: [] as string[],
    requirements: {
      minLength: false,
      hasUppercase: false,
      hasLowercase: false,
      hasNumber: false,
      hasSpecialChar: false,
    },
  });

  // Password validation function
  const validatePassword = (password: string) => {
    const requirements = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };

    const errors = [];
    if (!requirements.minLength) errors.push("At least 8 characters");
    if (!requirements.hasUppercase) errors.push("One uppercase letter");
    if (!requirements.hasLowercase) errors.push("One lowercase letter");
    if (!requirements.hasNumber) errors.push("One number");
    if (!requirements.hasSpecialChar) errors.push("One special character");

    const isValid = Object.values(requirements).every((req) => req);

    setPasswordValidation({
      isValid,
      errors,
      requirements,
    });

    return isValid;
  };

  // Fetch corporate accounts from API
  const fetchAccounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/corporate-accounts");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch accounts");
      }

      setAccounts(data.accounts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch accounts");
      console.error("Error fetching accounts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const filteredAccounts = accounts.filter((account) => {
    if (!searchTerm.trim()) return true;

    // Split search term into words for flexible multi-word search
    const searchWords = searchTerm.trim().toLowerCase().split(/\s+/);

    // All search words must match at least one field
    return searchWords.every((word) => {
      const companyName = account.company_name.toLowerCase();
      const companyEmail = account.company_email.toLowerCase();
      const corporateRef = account.corporate_reference.toLowerCase();
      const companyId = account.company_id.toLowerCase();

      return (
        companyName.includes(word) ||
        companyEmail.includes(word) ||
        corporateRef.includes(word) ||
        companyId.includes(word)
      );
    });
  });

  const handleSelectAccount = (companyId: string) => {
    setSelectedAccounts((prev) =>
      prev.includes(companyId)
        ? prev.filter((id) => id !== companyId)
        : [...prev, companyId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAccounts.length === filteredAccounts.length) {
      setSelectedAccounts([]);
    } else {
      setSelectedAccounts(filteredAccounts.map((acc) => acc.company_id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedAccounts.length === 0) return;

    if (
      confirm(
        `Are you sure you want to delete ${selectedAccounts.length} account(s)?`
      )
    ) {
      setLoading(true);
      try {
        const response = await fetch(
          "/api/admin/corporate-accounts/bulk-delete",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ids: selectedAccounts }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to delete accounts");
        }

        // Refresh the accounts list
        await fetchAccounts();
        setSelectedAccounts([]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete accounts"
        );
        console.error("Error deleting accounts:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCreateAccount = () => {
    setFormMode("create");
    setCurrentAccount(null);
    setShowPassword(false); // Reset password visibility
    setPasswordValidation({
      // Reset password validation
      isValid: false,
      errors: [],
      requirements: {
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecialChar: false,
      },
    });
    setFormData({
      corporate_reference: "",
      company_name: "",
      company_website: "-",
      company_address: "",
      company_email: "",
      phone_number: "",
      billing_address: "",
      password: "",
    });
  };

  const handleEditAccount = (account: CorporateAccount) => {
    setFormMode("edit");
    setCurrentAccount(account);
    setShowPassword(false); // Reset password visibility
    setFormData({
      ...account,
      company_website: account.company_website || "-", // Show "-" if no website
      password: "", // Clear password field for editing - user can enter new password
    });
  };

  const handleViewAccount = (account: CorporateAccount) => {
    setFormMode("view");
    setCurrentAccount(account);
    setShowPassword(false); // Reset password visibility
    setFormData({
      ...account,
      company_website: account.company_website || "-", // Show "-" if no website
      password: "••••••••••••", // Show placeholder for password in view mode
    });
  };

  const handleSaveAccount = async () => {
    if (formMode === "create") {
      // Validate password before saving
      const isPasswordValid = validatePassword(formData.password || "");
      if (!isPasswordValid) {
        alert("Please ensure the password meets all security requirements.");
        return;
      }

      setLoading(true);
      try {
        const response = await fetch("/api/admin/create-account", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to create account");
        }

        // Refresh the accounts list
        await fetchAccounts();

        // Show success message
        setSuccessMessage({
          show: true,
          reference: formData.corporate_reference || "",
          email: formData.company_email || "",
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create account"
        );
        console.error("Error creating account:", err);
      } finally {
        setLoading(false);
      }
    } else if (formMode === "edit" && currentAccount) {
      // Validate password for edit mode only if a new password is provided
      if (formData.password && formData.password.trim() !== "") {
        const isPasswordValid = validatePassword(formData.password);
        if (!isPasswordValid) {
          alert("Please ensure the password meets all security requirements.");
          return;
        }
      }

      setLoading(true);
      try {
        const response = await fetch(
          `/api/admin/corporate-accounts/${currentAccount.company_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to update account");
        }

        // Refresh the accounts list
        await fetchAccounts();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update account"
        );
        console.error("Error updating account:", err);
      } finally {
        setLoading(false);
      }
    }
    setFormMode(null);
    setCurrentAccount(null);
    setFormData({});
    setShowPassword(false); // Reset password visibility
  };

  const handleFormInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));

    // Validate password on change
    if (name === "password") {
      validatePassword(value);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Corporate Accounts
          </h1>
          <p className="mt-2 text-gray-600">
            Manage corporate partnerships and accounts
          </p>
        </div>
        <button
          onClick={handleCreateAccount}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create Account
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => setError(null)}
                  className="bg-red-50 px-2 py-1.5 rounded-md text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {successMessage.show && (
        <div className="fixed inset-0 bg-black bg-opacity-60 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl">
            {/* Success Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-t-2xl text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-white bg-opacity-20 mb-4">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold">Success!</h3>
              <p className="text-green-100 mt-2">
                Corporate account created successfully
              </p>
            </div>

            {/* Success Content */}
            <div className="p-6 space-y-4">
              <div className="text-center">
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Corporate Reference Number
                  </p>
                  <div className="bg-green-100 border border-green-200 rounded-lg p-3">
                    <span className="text-xl font-mono font-bold text-green-800">
                      {successMessage.reference}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      Email Notification
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      The corporate reference and account password have been
                      sent to{" "}
                      <span className="font-semibold">
                        {successMessage.email}
                      </span>{" "}
                      via email for the client&apos;s records and secure access.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0"
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
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      Account Credentials Created
                    </p>
                    <p className="text-sm text-yellow-700 mt-1">
                      The corporate reference and account password have been
                      successfully created and sent via email. Please ensure the
                      client saves these credentials securely for future account
                      access and management.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Success Footer */}
            <div className="px-6 pb-6">
              <button
                onClick={() =>
                  setSuccessMessage({ show: false, reference: "", email: "" })
                }
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Okay, Got It!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search accounts..."
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
            {selectedAccounts.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete Selected ({selectedAccounts.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Accounts List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">
              Accounts ({filteredAccounts.length})
            </h2>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={
                  filteredAccounts.length > 0 &&
                  selectedAccounts.length === filteredAccounts.length
                }
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">Select all</span>
            </label>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading accounts...</span>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Select
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Corporate Reference
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Website
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAccounts.map((account) => (
                  <tr key={account.company_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedAccounts.includes(account.company_id)}
                        onChange={() => handleSelectAccount(account.company_id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {account.corporate_reference}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {account.company_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {account.company_email}
                      </div>
                      <div className="text-sm text-gray-500">
                        {account.phone_number}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-blue-600 hover:text-blue-800">
                        {account.company_website &&
                        account.company_website !== "-" ? (
                          <a
                            href={account.company_website}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {account.company_website}
                          </a>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleViewAccount(account)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEditAccount(account)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {!loading && filteredAccounts.length === 0 && (
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No accounts found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? "Try adjusting your search criteria."
                : "No accounts match the current filter."}
            </p>
          </div>
        )}
      </div>

      {/* Account Form Modal */}
      {formMode && (
        <div className="fixed inset-0 bg-black bg-opacity-60 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
            {/* Enhanced Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white bg-opacity-20 p-2 rounded-lg">
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
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">
                      {formMode === "create"
                        ? "Create New Corporate Account"
                        : formMode === "edit"
                        ? "Edit Corporate Account"
                        : "Corporate Account Details"}
                    </h3>
                    <p className="text-blue-100 text-sm mt-1">
                      {formMode === "create"
                        ? "Add a new corporate partner to your network"
                        : formMode === "edit"
                        ? "Update corporate account information"
                        : "View corporate account details"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setFormMode(null)}
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

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-hidden">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveAccount();
                }}
                className="h-full flex flex-col"
              >
                <div
                  className="flex-1 overflow-y-auto px-6 py-6 space-y-8"
                  style={{
                    maxHeight: "60vh",
                    scrollbarWidth: "thin",
                    scrollbarColor: "#93c5fd #f3f4f6",
                  }}
                >
                  {/* Account Information Section */}
                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                      Account Credentials
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 flex items-center">
                          <svg
                            className="w-4 h-4 mr-1 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                            />
                          </svg>
                          Corporate Reference *
                        </label>
                        <input
                          type="text"
                          name="corporate_reference"
                          value={formData.corporate_reference || ""}
                          onChange={handleFormInputChange}
                          disabled={formMode === "view"}
                          className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100 py-3 px-4 font-mono"
                          placeholder="e.g., CORP-2024-001"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 flex items-center">
                          <svg
                            className="w-4 h-4 mr-1 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                          Account Password{" "}
                          {formMode === "create"
                            ? "*"
                            : formMode === "edit"
                            ? "(leave empty to keep current)"
                            : ""}
                        </label>
                        <div className="relative">
                          <input
                            type={
                              formMode === "view"
                                ? "password"
                                : showPassword
                                ? "text"
                                : "password"
                            }
                            name="password"
                            value={formData.password || ""}
                            onChange={handleFormInputChange}
                            disabled={formMode === "view"}
                            className={`block w-full rounded-lg shadow-sm focus:ring-2 text-sm disabled:bg-gray-100 py-3 px-4 pr-12 ${
                              formMode !== "view" && formData.password
                                ? passwordValidation.isValid
                                  ? "border-green-300 focus:ring-green-500 focus:border-green-500"
                                  : "border-red-300 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            }`}
                            placeholder={
                              formMode === "create"
                                ? "Create a secure password"
                                : formMode === "edit"
                                ? "Enter new password (leave empty to keep current)"
                                : "Password hidden"
                            }
                            required={formMode === "create"}
                          />
                          {formMode !== "view" && (
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            >
                              {showPassword ? (
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.5 6.5m3.378 3.378a3 3 0 014.243 4.243M6.5 6.5L4 4m2.5 2.5l7 7m-7-7l7 7m0 0L17.5 17.5M21 21l-3.5-3.5m0 0L21 21l-3.5-3.5M17.5 17.5L12 12"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                              )}
                            </button>
                          )}
                        </div>

                        {/* Password Requirements */}
                        {formMode !== "view" &&
                          formData.password &&
                          formData.password.trim() !== "" && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                              <p className="text-sm font-medium text-gray-700 mb-2">
                                Password Requirements:
                              </p>
                              <div className="space-y-1">
                                {[
                                  {
                                    key: "minLength",
                                    text: "At least 8 characters",
                                  },
                                  {
                                    key: "hasUppercase",
                                    text: "One uppercase letter (A-Z)",
                                  },
                                  {
                                    key: "hasLowercase",
                                    text: "One lowercase letter (a-z)",
                                  },
                                  {
                                    key: "hasNumber",
                                    text: "One number (0-9)",
                                  },
                                  {
                                    key: "hasSpecialChar",
                                    text: "One special character (!@#$%^&*)",
                                  },
                                ].map(({ key, text }) => (
                                  <div
                                    key={key}
                                    className="flex items-center text-sm"
                                  >
                                    {passwordValidation.requirements[
                                      key as keyof typeof passwordValidation.requirements
                                    ] ? (
                                      <svg
                                        className="w-4 h-4 text-green-500 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                    ) : (
                                      <svg
                                        className="w-4 h-4 text-red-500 mr-2"
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
                                    )}
                                    <span
                                      className={
                                        passwordValidation.requirements[
                                          key as keyof typeof passwordValidation.requirements
                                        ]
                                          ? "text-green-700"
                                          : "text-red-700"
                                      }
                                    >
                                      {text}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              {passwordValidation.isValid && (
                                <div className="mt-2 flex items-center text-sm text-green-700">
                                  <svg
                                    className="w-4 h-4 text-green-500 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  <span className="font-medium">
                                    Password meets all requirements!
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                      </div>
                    </div>
                  </div>

                  {/* Company Information Section */}
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
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      Company Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 flex items-center">
                          <svg
                            className="w-4 h-4 mr-1 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                          Company Name *
                        </label>
                        <input
                          type="text"
                          name="company_name"
                          value={formData.company_name || ""}
                          onChange={handleFormInputChange}
                          disabled={formMode === "view"}
                          className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100 py-3 px-4"
                          placeholder="e.g., Jordan Tech Solutions"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 flex items-center">
                          <svg
                            className="w-4 h-4 mr-1 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                            />
                          </svg>
                          Company Website
                        </label>
                        <input
                          type="text"
                          name="company_website"
                          value={formData.company_website || ""}
                          onChange={handleFormInputChange}
                          disabled={formMode === "view"}
                          className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100 py-3 px-4"
                          placeholder="https://company.com or - if no website"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information Section */}
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
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      Contact Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 flex items-center">
                          <svg
                            className="w-4 h-4 mr-1 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          Company Email *
                        </label>
                        <input
                          type="email"
                          name="company_email"
                          value={formData.company_email || ""}
                          onChange={handleFormInputChange}
                          disabled={formMode === "view"}
                          className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100 py-3 px-4"
                          placeholder="contact@company.jo"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 flex items-center">
                          <svg
                            className="w-4 h-4 mr-1 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone_number"
                          value={formData.phone_number || ""}
                          onChange={handleFormInputChange}
                          disabled={formMode === "view"}
                          className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100 py-3 px-4"
                          placeholder="+962 6 123 4567"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address Information Section */}
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
                      Address Information
                    </h4>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 flex items-center">
                          <svg
                            className="w-4 h-4 mr-1 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                          Company Address *
                        </label>
                        <textarea
                          name="company_address"
                          value={formData.company_address || ""}
                          onChange={handleFormInputChange}
                          disabled={formMode === "view"}
                          rows={3}
                          className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100 py-3 px-4"
                          placeholder="e.g., Abdali Boulevard, Building 7, Floor 12, Amman, Jordan"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 flex items-center">
                          <svg
                            className="w-4 h-4 mr-1 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          Billing Address *
                        </label>
                        <textarea
                          name="billing_address"
                          value={formData.billing_address || ""}
                          onChange={handleFormInputChange}
                          disabled={formMode === "view"}
                          rows={3}
                          className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100 py-3 px-4"
                          placeholder="e.g., Same as company address or different billing address"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Footer */}
                <div className="flex-shrink-0 bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-2xl">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      {formMode === "create" && (
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
                          Please create a unique corporate reference and secure
                          password
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={() => setFormMode(null)}
                        disabled={loading}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                      {formMode !== "view" && (
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-6 py-2 bg-blue-600 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              {formMode === "create"
                                ? "Creating..."
                                : "Updating..."}
                            </>
                          ) : (
                            <>
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
                                  d="M12 4v16m8-8H4"
                                />
                              </svg>
                              {formMode === "create"
                                ? "Create Corporate Account"
                                : "Update Account"}
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
