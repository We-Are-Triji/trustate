"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function TransactionPage() {
  const params = useParams();
  const router = useRouter();
  const transactionId = params.id as string;
  const [isVerifying, setIsVerifying] = useState(true);
  const [needsCode, setNeedsCode] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    checkAccess();
  }, [transactionId]);

  const checkAccess = async () => {
    try {
      const response = await fetch(`/api/transactions/${transactionId}/access`, {
        method: "GET",
      });

      if (response.ok) {
        // User already has access
        setIsVerifying(false);
      } else if (response.status === 403) {
        // Needs access code
        setNeedsCode(true);
        setIsVerifying(false);
      } else {
        setError("Transaction not found");
        setIsVerifying(false);
      }
    } catch {
      setError("Failed to verify access");
      setIsVerifying(false);
    }
  };

  const handleSubmitCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`/api/transactions/${transactionId}/access`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_code: accessCode.toUpperCase() }),
      });

      if (response.ok) {
        setNeedsCode(false);
        // Reload to show transaction interface
        window.location.reload();
      } else {
        const data = await response.json();
        setError(data.error || "Invalid access code");
      }
    } catch {
      setError("Failed to verify code");
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#0247ae] mx-auto mb-4" />
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md text-center">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">✕</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-2 bg-[#0247ae] text-white rounded-lg hover:bg-[#023a8a]"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (needsCode) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full">
          <div className="h-12 w-12 rounded-full bg-[#0247ae]/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-[#0247ae] text-2xl">🔒</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">Enter Access Code</h2>
          <p className="text-gray-600 mb-6 text-center text-sm">
            This transaction is protected. Please enter the access code provided by your agent.
          </p>
          <form onSubmit={handleSubmitCode} className="space-y-4">
            <div>
              <input
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                placeholder="XXXXXX"
                maxLength={6}
                className="w-full px-4 py-3 text-center text-2xl font-mono tracking-widest border-2 border-gray-200 rounded-lg focus:border-[#0247ae] focus:outline-none uppercase"
                autoFocus
              />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            <button
              type="submit"
              disabled={accessCode.length !== 6}
              className="w-full py-3 bg-[#0247ae] text-white rounded-lg font-medium hover:bg-[#023a8a] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Verify Access
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <p className="p-8 text-center text-gray-600">Transaction interface will be here</p>
    </div>
  );
}
