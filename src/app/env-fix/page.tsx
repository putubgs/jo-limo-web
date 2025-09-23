"use client";

export default function EnvFixPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            🔧 HyperPay Environment Fix
          </h1>

          <div className="space-y-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-red-900 mb-4">
                🚨 CRITICAL: Your environment is likely misconfigured
              </h2>
              <p className="text-red-800 mb-4">
                Based on the <code>200.300.404</code> error, you&apos;re mixing
                test/production environments.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-green-900 mb-4">
                ✅ CORRECT Test Environment Setup
              </h2>
              <p className="text-green-800 mb-4">
                Add these EXACT values to your <code>.env.local</code> file:
              </p>
              <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto">
                {`# Test Environment (WORKING)
NEXT_PUBLIC_PAYMENT_BASE_URL=https://test.oppwa.com
PAYMENT_ENTITY_ID=8ac7a4c8961da56701961e524812020b
PAYMENT_ACCESS_TOKEN=your_test_access_token_here
NEXT_PUBLIC_APP_URL=http://localhost:3000`}
              </pre>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-yellow-900 mb-4">
                ⚠️ Common Mistakes
              </h2>
              <div className="space-y-3 text-yellow-800">
                <div className="flex items-start space-x-2">
                  <span className="text-red-500 font-bold">❌</span>
                  <div>
                    <strong>Wrong Base URL:</strong>{" "}
                    <code>https://eu-test.oppwa.com</code>
                    <br />
                    <strong className="text-green-600">✅ Correct:</strong>{" "}
                    <code>https://test.oppwa.com</code>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-red-500 font-bold">❌</span>
                  <div>
                    <strong>Wrong Entity ID Length:</strong> Production Entity
                    ID (longer than 32 chars)
                    <br />
                    <strong className="text-green-600">✅ Correct:</strong> Test
                    Entity ID (exactly 32 characters)
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-red-500 font-bold">❌</span>
                  <div>
                    <strong>Wrong Access Token:</strong> Production token with
                    test Entity ID
                    <br />
                    <strong className="text-green-600">✅ Correct:</strong> Both
                    Entity ID and Access Token must be from TEST environment
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                🔑 How to Get Test Credentials
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-blue-800">
                <li>Login to HyperPay Test Dashboard</li>
                <li>
                  Go to <strong>Integration → API Keys</strong>
                </li>
                <li>
                  Copy the <strong>TEST Entity ID</strong> (32 characters)
                </li>
                <li>
                  Copy the <strong>TEST Access Token</strong>
                </li>
                <li>Make sure both are from the TEST environment</li>
              </ol>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-purple-900 mb-4">
                🧪 Test Card Numbers (Use These)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Visa (Successful):</strong>
                  <code className="block bg-white p-2 rounded mt-1">
                    4200000000000000
                  </code>
                </div>
                <div>
                  <strong>Mastercard (Successful):</strong>
                  <code className="block bg-white p-2 rounded mt-1">
                    5555555555554444
                  </code>
                </div>
                <div>
                  <strong>Expiry Date:</strong>
                  <code className="block bg-white p-2 rounded mt-1">12/25</code>
                </div>
                <div>
                  <strong>CVV:</strong>
                  <code className="block bg-white p-2 rounded mt-1">123</code>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 text-white rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">🚀 Next Steps</h2>
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  Update your <code>.env.local</code> with the correct values
                  above
                </li>
                <li>
                  Restart your development server: <code>npm run dev</code>
                </li>
                <li>Test payment with the test card numbers provided</li>
                <li>The 3D Secure should redirect to a separate page now</li>
                <li>Payment status should show success after approval</li>
              </ol>
            </div>

            <div className="text-center">
              <button
                onClick={() => (window.location.href = "/payment-debug")}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                🔍 Check Current Environment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
