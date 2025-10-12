"use client";

import { useState } from "react";
import { calculateDistanceAndTime } from "@/lib/distance-calculator";

interface TestResult {
  origin: string;
  destination: string;
  distance?: string;
  duration?: string;
  error?: string;
  timestamp: string;
}

export default function DistanceTest() {
  const [origin, setOrigin] = useState(
    "Queen Alia International Airport, Airport Road, Jordan"
  );
  const [destination, setDestination] = useState("Amman, Jordan");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  const testDistance = async () => {
    if (!origin || !destination) {
      alert("Please enter both origin and destination");
      return;
    }

    setLoading(true);
    const timestamp = new Date().toLocaleTimeString();

    try {
      console.log("🧪 Testing Distance API...");
      const result = await calculateDistanceAndTime(origin, destination);

      if (result) {
        const newResult: TestResult = {
          origin,
          destination,
          distance: result.distance,
          duration: result.duration,
          timestamp,
        };
        setResults((prev) => [newResult, ...prev]);
        console.log("✅ Test successful:", result);
      } else {
        const newResult: TestResult = {
          origin,
          destination,
          error: "No result returned (check console for details)",
          timestamp,
        };
        setResults((prev) => [newResult, ...prev]);
        console.log("❌ Test failed: No result returned");
      }
    } catch (error) {
      const newResult: TestResult = {
        origin,
        destination,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp,
      };
      setResults((prev) => [newResult, ...prev]);
      console.error("❌ Test error:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white border rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-4">🧪 Distance Matrix API Test</h2>
      <p className="text-gray-600 mb-6">
        Test your Google Distance Matrix API integration. Open browser console
        (F12) to see detailed logs.
      </p>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Origin:
          </label>
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter origin location"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Destination:
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter destination location"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={testDistance}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "🔄 Testing..." : "🚗 Test Distance API"}
          </button>

          {results.length > 0 && (
            <button
              onClick={clearResults}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Clear Results
            </button>
          )}
        </div>
      </div>

      {results.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Test Results:</h3>
          <div className="space-y-3">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-md border ${
                  result.error
                    ? "bg-red-50 border-red-200"
                    : "bg-green-50 border-green-200"
                }`}
              >
                <div className="text-sm text-gray-600 mb-1">
                  {result.timestamp} - {result.origin} → {result.destination}
                </div>

                {result.error ? (
                  <div className="text-red-700 font-medium">
                    ❌ Error: {result.error}
                  </div>
                ) : (
                  <div className="text-green-700 font-medium">
                    ✅ Success: {result.duration} • {result.distance}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h4 className="text-sm font-semibold mb-2">💡 Troubleshooting:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Check browser console for detailed error messages</li>
          <li>
            • Ensure Distance Matrix API is enabled in Google Cloud Console
          </li>
          <li>• Verify GOOGLE_API_KEY is set in your .env.local file</li>
          <li>
            • Try different location formats (e.g., &quot;Amman, Jordan&quot;)
          </li>
        </ul>
      </div>
    </div>
  );
}
