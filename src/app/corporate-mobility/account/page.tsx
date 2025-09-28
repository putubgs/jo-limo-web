"use client";

import { useEffect, useState } from "react";
import { useReservationStore } from "@/lib/reservation-store";

interface CorporateAccount {
  company_id: string;
  corporate_reference: string;
  company_name: string;
  company_website: string;
  company_address: string;
  company_email: string;
  phone_number: string;
  billing_address: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export default function Account() {
  const { resetForCorporateMobility } = useReservationStore();
  const [accountData, setAccountData] = useState<CorporateAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reset all booking state when user enters corporate mobility account
  useEffect(() => {
    resetForCorporateMobility();
  }, [resetForCorporateMobility]);

  // Fetch corporate account data
  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const response = await fetch("/api/corporate-mobility/account");
        const data = await response.json();

        if (response.ok && data.success) {
          setAccountData(data.account);
        } else {
          setError(data.error || "Failed to load account information");
        }
      } catch (err) {
        setError("Failed to load account data");
        console.error("Account data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, []);

  if (loading) {
    return (
      <div className="w-3/4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4">Loading account information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-3/4 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!accountData) {
    return (
      <div className="w-3/4 flex items-center justify-center">
        <div className="text-center">
          <p>No account data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-3/4 flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-[#494949] font-bold">Company Name : </label>
        <input
          type="text"
          className="rounded-lg border border-[#CACACA] p-5 text-[#6C6C6C]"
          value={accountData.company_name}
          readOnly
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[#494949] font-bold">Company Website : </label>
        <input
          type="text"
          className="rounded-lg border border-[#CACACA] p-5 text-[#6C6C6C]"
          value={
            accountData.company_website === "-"
              ? "No website provided"
              : accountData.company_website
          }
          readOnly
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[#494949] font-bold">Company Address : </label>
        <input
          type="text"
          className="rounded-lg border border-[#CACACA] p-5 text-[#6C6C6C]"
          value={accountData.company_address}
          readOnly
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[#494949] font-bold">Company Email : </label>
        <input
          type="text"
          className="rounded-lg border border-[#CACACA] p-5 text-[#6C6C6C]"
          value={accountData.company_email}
          readOnly
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[#494949] font-bold">Phone Number : </label>
        <input
          type="text"
          className="rounded-lg border border-[#CACACA] p-5 text-[#6C6C6C]"
          value={accountData.phone_number}
          readOnly
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[#494949] font-bold">Billing Address : </label>
        <input
          type="text"
          className="rounded-lg border border-[#CACACA] p-5 text-[#6C6C6C]"
          value={accountData.billing_address}
          readOnly
        />
      </div>
    </div>
  );
}
