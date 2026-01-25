"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Loader2, UserPlus, CheckCircle, AlertCircle, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function JoinTransactionPage() {
    const router = useRouter();
    const [accessCode, setAccessCode] = useState("");
    const [clientName, setClientName] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<{ transactionId: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await fetch("/api/transactions/join", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    access_code: accessCode.trim(),
                    client_name: clientName.trim(),
                    client_email: clientEmail.trim(),
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess({ transactionId: data.transaction_id });
            } else {
                setError(data.error || "Failed to join transaction");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const formatAccessCode = (value: string) => {
        return value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to TruState!</h1>
                    <p className="text-gray-600 mb-6">
                        You've successfully joined the transaction. Your agent will be notified.
                    </p>
                    <Button
                        onClick={() => router.push(`/transaction/${success.transactionId}`)}
                        className="w-full bg-[#0247ae] hover:bg-[#0560d4] text-white"
                    >
                        View Transaction
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="h-14 w-14 rounded-xl bg-[#0247ae] flex items-center justify-center mx-auto mb-4">
                        <Building2 className="h-7 w-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Join Transaction</h1>
                    <p className="text-gray-600 mt-2">
                        Enter the access code provided by your agent to join the transaction.
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Access Code */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <KeyRound size={16} className="text-[#0247ae]" />
                                Access Code
                            </label>
                            <Input
                                required
                                placeholder="Enter 6-character code"
                                value={accessCode}
                                onChange={(e) => setAccessCode(formatAccessCode(e.target.value))}
                                className="text-center text-2xl tracking-widest font-mono uppercase"
                                maxLength={6}
                            />
                        </div>

                        {/* Client Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <UserPlus size={16} className="text-[#0247ae]" />
                                Your Full Name
                            </label>
                            <Input
                                required
                                placeholder="e.g., Juan dela Cruz"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                            />
                        </div>

                        {/* Client Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Email Address</label>
                            <Input
                                type="email"
                                required
                                placeholder="your@email.com"
                                value={clientEmail}
                                onChange={(e) => setClientEmail(e.target.value)}
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isLoading || accessCode.length !== 6}
                            className="w-full bg-[#0247ae] hover:bg-[#0560d4] text-white py-3"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Joining...
                                </>
                            ) : (
                                "Join Transaction"
                            )}
                        </Button>
                    </form>

                    <p className="text-xs text-gray-400 text-center mt-6">
                        By joining, you agree to TruState's Terms of Service and Privacy Policy.
                    </p>
                </div>
            </div>
        </div>
    );
}
