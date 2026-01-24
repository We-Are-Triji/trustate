"use client";

import { useState } from "react";
import { ArrowLeft, Link as LinkIcon, Users, Loader2, AlertCircle, User, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/hooks/use-auth";

interface BrokerInfo {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    picture: string | null;
}

interface BrokerConnectionFormProps {
    onSubmit: (nexusLink: string) => void;
    onBack: () => void;
}

type Step = "nexus-validation" | "broker-preview" | "totp-verification" | "success";

export function BrokerConnectionForm({ onSubmit, onBack }: BrokerConnectionFormProps) {
    const { userId } = useAuth();
    const [step, setStep] = useState<Step>("nexus-validation");
    const [nexusLink, setNexusLink] = useState("");
    const [nexusCode, setNexusCode] = useState("");
    const [brokerInfo, setBrokerInfo] = useState<BrokerInfo | null>(null);
    const [totpCode, setTotpCode] = useState("");
    const [isValidating, setIsValidating] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState("");

    const handleValidateNexus = async () => {
        if (!nexusLink.trim()) return;

        setIsValidating(true);
        setError("");

        try {
            const res = await fetch("/api/broker/nexus/validate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nexusLink: nexusLink.trim() }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to validate nexus link");
                return;
            }

            setNexusCode(data.nexusCode);
            setBrokerInfo(data.broker);
            setStep("broker-preview");
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setIsValidating(false);
        }
    };

    const handleConfirmBroker = () => {
        setStep("totp-verification");
    };

    const handleChangeBroker = () => {
        setStep("nexus-validation");
        setBrokerInfo(null);
        setNexusCode("");
        setNexusLink("");
        setError("");
    };

    const handleVerifyCode = async () => {
        if (totpCode.length !== 6) return;

        setIsVerifying(true);
        setError("");

        try {
            const res = await fetch("/api/broker/nexus/verify-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nexusCode,
                    totpCode,
                    agentId: userId,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Invalid verification code");
                return;
            }

            setStep("success");
            setTimeout(() => {
                onSubmit(nexusLink.trim());
            }, 2000);
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setIsVerifying(false);
        }
    };

    // Nexus Validation Step
    if (step === "nexus-validation") {
        return (
            <>
                <CardHeader className="pb-1 pt-5 animate-[fadeInUp_0.5s_ease-out]">
                    <div className="text-center">
                        <CardTitle className="text-2xl font-bold text-[#0247ae] font-[family-name:var(--font-arsenal-sc)]">
                            Connect to Broker
                        </CardTitle>
                        <p className="text-gray-500 text-sm">Enter your broker&apos;s nexus link</p>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col items-center justify-center px-6 pb-4">
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-6 max-w-md w-full space-y-4">
                        <div className="text-center space-y-2">
                            <div className="h-12 w-12 rounded-full bg-[#0247ae]/10 flex items-center justify-center mx-auto">
                                <Users size={24} className="text-[#0247ae]" />
                            </div>
                            <p className="text-sm text-gray-600">
                                Request the nexus link from your supervising broker
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-600">Broker Nexus Link *</label>
                            <div className="relative">
                                <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    value={nexusLink}
                                    onChange={(e) => {
                                        setNexusLink(e.target.value);
                                        setError("");
                                    }}
                                    placeholder="https://trustate.triji.me/nexus/..."
                                    className="h-10 w-full pl-10 pr-4 rounded-lg border-2 border-gray-200 bg-white focus:outline-none focus:border-[#0247ae] focus:ring-2 focus:ring-[#0247ae]/10"
                                />
                            </div>
                            {error && (
                                <div className="flex items-center gap-2 text-red-600 text-sm">
                                    <AlertCircle size={16} />
                                    <span>{error}</span>
                                </div>
                            )}
                        </div>

                        <div className="rounded-lg bg-[#0247ae]/5 p-3 border border-[#0247ae]/10">
                            <p className="font-semibold text-[#0247ae] mb-1 text-xs">Expected Format</p>
                            <p className="text-xs text-gray-600 font-mono">https://trustate.triji.me/nexus/...</p>
                        </div>

                        <Button
                            onClick={handleValidateNexus}
                            disabled={!nexusLink.trim() || isValidating}
                            className="w-full bg-[#0247ae] hover:bg-[#023a8a] h-10"
                        >
                            {isValidating ? (
                                <>
                                    <Loader2 size={16} className="animate-spin mr-2" />
                                    Validating...
                                </>
                            ) : (
                                "Validate Link"
                            )}
                        </Button>
                    </div>

                    <Button
                        variant="ghost"
                        onClick={onBack}
                        className="mt-4 text-gray-600"
                    >
                        <ArrowLeft size={16} className="mr-1" />
                        Back
                    </Button>
                </CardContent>
            </>
        );
    }

    // Broker Preview Step
    if (step === "broker-preview" && brokerInfo) {
        return (
            <>
                <CardHeader className="pb-1 pt-5 animate-[fadeInUp_0.5s_ease-out]">
                    <div className="text-center">
                        <CardTitle className="text-2xl font-bold text-[#0247ae] font-[family-name:var(--font-arsenal-sc)]">
                            Confirm Broker
                        </CardTitle>
                        <p className="text-gray-500 text-sm">Is this your supervising broker?</p>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col items-center justify-center px-6 pb-4">
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-6 max-w-md w-full space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-[#0247ae]/10 flex items-center justify-center shrink-0">
                                {brokerInfo.picture ? (
                                    <img src={brokerInfo.picture} alt="Broker" className="h-16 w-16 rounded-full object-cover" />
                                ) : (
                                    <User size={32} className="text-[#0247ae]" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-lg font-semibold text-gray-900">
                                    {brokerInfo.firstName} {brokerInfo.lastName}
                                </p>
                                <p className="text-sm text-gray-500">{brokerInfo.email}</p>
                                <p className="text-xs text-[#0247ae] font-medium mt-1">Licensed Broker</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <Button
                            variant="outline"
                            onClick={handleChangeBroker}
                            className="h-9 px-6"
                        >
                            Change Broker
                        </Button>
                        <Button
                            onClick={handleConfirmBroker}
                            className="bg-[#0247ae] hover:bg-[#023a8a] h-9 px-6"
                        >
                            Yes, Continue
                        </Button>
                    </div>
                </CardContent>
            </>
        );
    }

    // TOTP Verification Step
    if (step === "totp-verification" && brokerInfo) {
        return (
            <>
                <CardHeader className="pb-1 pt-5 animate-[fadeInUp_0.5s_ease-out]">
                    <div className="text-center">
                        <CardTitle className="text-2xl font-bold text-[#0247ae] font-[family-name:var(--font-arsenal-sc)]">
                            Enter Verification Code
                        </CardTitle>
                        <p className="text-gray-500 text-sm">Ask {brokerInfo.firstName} for the 6-digit code</p>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col items-center justify-center px-6 pb-4">
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-6 max-w-md w-full space-y-4">
                        <div className="text-center space-y-2">
                            <div className="h-12 w-12 rounded-full bg-[#0247ae]/10 flex items-center justify-center mx-auto">
                                <Award size={24} className="text-[#0247ae]" />
                            </div>
                            <p className="text-sm text-gray-600">
                                Your broker will provide a 6-digit code that changes every 30 seconds
                            </p>
                        </div>

                        <div className="space-y-2">
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                value={totpCode}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, "");
                                    setTotpCode(val);
                                    setError("");
                                }}
                                placeholder="000000"
                                className="h-14 w-full text-center text-2xl font-mono tracking-widest rounded-lg border-2 border-gray-200 bg-white focus:outline-none focus:border-[#0247ae] focus:ring-2 focus:ring-[#0247ae]/10"
                            />
                            {error && (
                                <div className="flex items-center gap-2 text-red-600 text-sm">
                                    <AlertCircle size={16} />
                                    <span>{error}</span>
                                </div>
                            )}
                        </div>

                        <Button
                            onClick={handleVerifyCode}
                            disabled={totpCode.length !== 6 || isVerifying}
                            className="w-full bg-[#0247ae] hover:bg-[#023a8a] h-10"
                        >
                            {isVerifying ? (
                                <>
                                    <Loader2 size={16} className="animate-spin mr-2" />
                                    Verifying...
                                </>
                            ) : (
                                "Verify & Submit"
                            )}
                        </Button>
                    </div>

                    <Button
                        variant="ghost"
                        onClick={() => setStep("broker-preview")}
                        className="mt-4 text-gray-600"
                    >
                        <ArrowLeft size={16} className="mr-1" />
                        Back
                    </Button>
                </CardContent>
            </>
        );
        // Success Step
        if (step === "success" && brokerInfo) {
            return (
                <>
                    <CardHeader className="pb-1 pt-5 animate-[fadeInUp_0.5s_ease-out]">
                        <div className="text-center">
                            <CardTitle className="text-2xl font-bold text-[#0247ae] font-[family-name:var(--font-arsenal-sc)]">
                                Request Sent!
                            </CardTitle>
                            <p className="text-gray-500 text-sm">Waiting for broker approval</p>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col items-center justify-center px-6 pb-4">
                        <div className="bg-white rounded-xl p-6 max-w-md w-full text-center space-y-4">
                            <div className="mx-auto h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center animate-[bounce_0.5s_ease-out]">
                                <Award size={40} className="text-emerald-600" />
                                // Success Step
                                if (step === "success" && brokerInfo) {
        return (
                                <>
                                    <CardHeader className="pb-1 pt-5 animate-[fadeInUp_0.5s_ease-out]">
                                        <div className="text-center">
                                            <CardTitle className="text-2xl font-bold text-[#0247ae] font-[family-name:var(--font-arsenal-sc)]">
                                                Request Sent!
                                            </CardTitle>
                                            <p className="text-gray-500 text-sm">Waiting for broker approval</p>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-1 flex flex-col items-center justify-center px-6 pb-4">
                                        <div className="bg-white rounded-xl p-6 max-w-md w-full text-center space-y-4">
                                            <div className="mx-auto h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center animate-[bounce_0.5s_ease-out]">
                                                <Award size={40} className="text-emerald-600" />
                                            </div>

                                            <div className="space-y-1">
                                                <p className="font-semibold text-gray-900">Successfully Connected to</p>
    }

                                                // Success Step
                                                if (step === "success" && brokerInfo) {
        return (
                                                <>
                                                    <CardHeader className="pb-1 pt-5 animate-[fadeInUp_0.5s_ease-out]">
                                                        <div className="text-center">
                                                            <CardTitle className="text-2xl font-bold text-[#0247ae] font-[family-name:var(--font-arsenal-sc)]">
                                                                Request Sent!
                                                            </CardTitle>
                                                            <p className="text-gray-500 text-sm">Waiting for broker approval</p>
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent className="flex-1 flex flex-col items-center justify-center px-6 pb-4">
                                                        <div className="bg-white rounded-xl p-6 max-w-md w-full text-center space-y-4">
                                                            <div className="mx-auto h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center animate-[bounce_0.5s_ease-out]">
                                                                <Award size={40} className="text-emerald-600" />
                                                            </div>

                                                            <div className="space-y-1">
                                                                <p className="font-semibold text-gray-900">Successfully Connected to</p>
                                                                <p className="text-lg text-[#0247ae] font-bold">
                                                                    {brokerInfo.firstName} {brokerInfo.lastName}
                                                                </p>
                                                            </div>

                                                            <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                                                                Redirecting to dashboard...
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </>
                                                );
    }

                                                return null;
}
                                                ```
