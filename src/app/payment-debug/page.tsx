"use client";

import { useState } from "react";

export default function PaymentDebugPage() {
  const [envCheck, setEnvCheck] = useState<Record<string, unknown> | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const checkEnvironment = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/env-check");
      const data = await response.json();
      setEnvCheck(data);
    } catch {
      setEnvCheck({ error: "Failed to check environment" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            HyperPay Environment Debug
          </h1>

          <div className="mb-8">
            <button
              onClick={checkEnvironment}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading
                ? "Checking Environment..."
                : "Check Environment Variables"}
            </button>
          </div>

          {envCheck && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Environment Status
                </h2>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-auto">
                  {JSON.stringify(envCheck, null, 2)}
                </pre>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">
                  Environment Analysis
                </h3>
                <div className="space-y-2 text-sm">
                  {envCheck.hasEntityId ? (
                    <div className="flex items-center text-green-700">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Entity ID is configured
                    </div>
                  ) : (
                    <div className="flex items-center text-red-700">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      Missing Entity ID
                    </div>
                  )}

                  {envCheck.hasAccessToken ? (
                    <div className="flex items-center text-green-700">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Access Token is configured
                    </div>
                  ) : (
                    <div className="flex items-center text-red-700">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      Missing Access Token
                    </div>
                  )}

                  {envCheck.hasBaseUrl ? (
                    <div className="flex items-center text-green-700">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Base URL is configured: {String(envCheck.baseUrl)}
                    </div>
                  ) : (
                    <div className="flex items-center text-red-700">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      Missing Base URL
                    </div>
                  )}

                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <div className="font-medium text-yellow-800">
                      Environment Mode:
                    </div>
                    <div className="text-yellow-700">
                      {String(envCheck.isTestMode)}
                    </div>
                  </div>

                  {Number(envCheck.tokenLength) > 0 && (
                    <div className="mt-2">
                      <div className="font-medium text-gray-700">
                        Token Length: {String(envCheck.tokenLength)} characters
                      </div>
                      <div className="text-sm text-gray-600">
                        {Number(envCheck.tokenLength) === 32
                          ? "✅ Standard test token length"
                          : Number(envCheck.tokenLength) < 32
                          ? "⚠️ Shorter than expected"
                          : "✅ Production or extended token"}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-amber-900 mb-4">
                  Common Issues & Solutions
                </h3>
                <div className="space-y-3 text-sm text-amber-800">
                  <div>
                    <strong>Error 200.300.404:</strong> Usually indicates
                    test/production environment mismatch or expired session.
                  </div>
                  <div>
                    <strong>Solution:</strong> Ensure your Entity ID matches the
                    Base URL environment (test.oppwa.com = test entity).
                  </div>
                  <div>
                    <strong>Test Environment:</strong> Base URL should be
                    https://test.oppwa.com with test Entity ID.
                  </div>
                  <div>
                    <strong>Session Expiry:</strong> Payment sessions expire
                    after 30 minutes of inactivity.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
