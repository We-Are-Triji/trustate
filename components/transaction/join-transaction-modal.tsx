"use use client";

import { useState } from "react";
import { Link as LinkIcon, ArrowRight, Building2, MapPin, DollarSign, Loader2, CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/hooks/use-auth";

interface JoinTransactionModalProps {
    onTransactionJoined: () => void;
    trigger?: React.ReactNode;
}

export function JoinTransactionModal({ onTransactionJoined, trigger }: JoinTransactionModalProps) {
    const { userId, firstName, lastName, email } = useAuth();
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState<"link" | "preview" | "code">("link");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Data
    const [inputLink, setInputLink] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [previewData, setPreviewData] = useState<any>(null);
    const [accessCode, setAccessCode] = useState("");

    const extractId = (input: string) => {
        // Handle full URL or raw ID
        try {
            if (input.includes("/")) {
                const parts = input.split("/");
                return parts[parts.length - 1]; // Last part is usually ID
            }
            return input.trim();
        } catch {
            return input.trim();
        }
    };

    const handlePreview = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const id = extractId(inputLink);
        setTransactionId(id);

        try {
            const res = await fetch("/api/transactions/preview", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ transactionId: id }),
            });

            if (res.ok) {
                const data = await res.json();
                setPreviewData(data.transaction);
                setStep("preview");
            } else {
                setError("Transaction not found. Please check the link or ID.");
            }
        } catch (err) {
            setError("Failed to verify link.");
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch("/api/transactions/join", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    access_code: accessCode,
                    client_email: email,
                    client_name: `${firstName} ${lastName}`,
                    // Optionally pass transactionId if API supported verification
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setOpen(false);
                onTransactionJoined();
                // Reset
                setStep("link");
                setInputLink("");
                setAccessCode("");
                setPreviewData(null);
            } else {
                setError(data.error || "Failed to join transaction.");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="bg-[#0247ae] hover:bg-[#0560d4] text-white">
                        <LinkIcon size={18} className="mr-2" />
                        Join Transaction
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-md w-full p-6">
                <DialogHeader>
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-[#0247ae]/10 flex items-center justify-center text-[#0247ae]">
                            <LinkIcon size={24} />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold text-gray-900">Join Transaction</DialogTitle>
                            <DialogDescription>
                                {step === "link" && "Enter the invite link provided by your agent."}
                                {step === "preview" && "Confirm the details needed to join."}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="mt-6">
                    {step === "link" && (
                        <form onSubmit={handlePreview} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Agent Invite Link or ID</label>
                                <Input
                                    placeholder="Paste link here..."
                                    value={inputLink}
                                    onChange={(e) => setInputLink(e.target.value)}
                                    required
                                    className="h-11"
                                />
                            </div>
                            {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
                            <Button type="submit" className="w-full h-11 bg-[#0247ae] hover:bg-[#0560d4]" disabled={loading || !inputLink}>
                                {loading ? <Loader2 className="animate-spin" /> : "Continue"}
                            </Button>
                        </form>
                    )}

                    {step === "preview" && previewData && (
                        <div className="space-y-6">
                            <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-100">
                                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <Building2 size={16} className="text-[#0247ae]" />
                                    {previewData.project_name || "Untitled Project"}
                                </h4>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-start gap-2">
                                        <MapPin size={16} className="text-gray-400 shrink-0 mt-0.5" />
                                        <span>{previewData.property_address}</span>
                                    </div>
                                    {previewData.transaction_value && (
                                        <div className="flex items-center gap-2">
                                            <DollarSign size={16} className="text-gray-400" />
                                            <span>₱{previewData.transaction_value.toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <form onSubmit={handleJoin} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <Lock size={14} />
                                        Enter Access Code
                                    </label>
                                    <Input
                                        placeholder="e.g. ABC-123"
                                        value={accessCode}
                                        onChange={(e) => setAccessCode(e.target.value)}
                                        required
                                        className="h-11 font-mono uppercase tracking-widest text-center text-lg"
                                        maxLength={10}
                                    />
                                    <p className="text-xs text-gray-500 text-center">
                                        This code was sent to you separately by your agent.
                                    </p>
                                </div>

                                {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}

                                <div className="grid grid-cols-2 gap-3">
                                    <Button type="button" variant="outline" onClick={() => { setStep("link"); setError(null); }}>
                                        Back
                                    </Button>
                                    <Button type="submit" className="bg-[#0247ae] hover:bg-[#0560d4]" disabled={loading || !accessCode}>
                                        {loading ? <Loader2 className="animate-spin" /> : "Join Now"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
