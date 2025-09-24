"use client";

import { useRouter, usePathname } from "next/navigation";

interface DataValidationErrorProps {
  title: string;
  message: string;
  showBackButton?: boolean;
  backToHome?: boolean;
  grayBackButton?: boolean;
}

export default function DataValidationError({
  title,
  message,
  showBackButton = true,
  backToHome = false,
  grayBackButton = false,
}: DataValidationErrorProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isCorporateMobility = pathname.includes("/corporate-mobility/account");

  const handleGoBack = () => {
    if (backToHome) {
      router.push("/");
    } else if (isCorporateMobility) {
      router.push("/corporate-mobility/account/reserve");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 text-2xl font-bold mb-6 mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-4">{title}</h1>
        <p className="text-gray-600 mb-8">{message}</p>

        {showBackButton && (
          <div className="space-y-3">
            <button
              onClick={handleGoBack}
              className={`w-full font-semibold py-3 px-6 rounded-lg transition-colors duration-200 ${
                grayBackButton
                  ? "bg-gray-500 hover:bg-gray-600 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {backToHome ? "Back to Homepage" : "Try Again"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
