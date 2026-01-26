"use client";

import { useState } from "react";
import { Building2, FileText, CreditCard, UserCheck, Image, Send, CheckCircle2, Loader2, Lock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TransmittalCardProps {
    transactionId: string;
    developerName: string;
    packageItems: {
        name: string;
        type: string;
        icon: "document" | "id" | "payment" | "photo";
    }[];
    onTransmit?: () => void;
    isTransmitted?: boolean;
    transmittedAt?: string;
}

export function TransmittalCard({
    transactionId,
    developerName,
    packageItems,
    onTransmit,
    isTransmitted = false,
    transmittedAt
}: TransmittalCardProps) {
    const [isTransmitting, setIsTransmitting] = useState(false);

    const handleTransmit = async () => {
        setIsTransmitting(true);

        try {
            const response = await fetch(`/api/transactions/${transactionId}/transmit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    developer_name: developerName,
                    package_items: packageItems
                }),
            });

            if (response.ok) {
                onTransmit?.();
            }
        } catch (error) {
            console.error("Failed to transmit:", error);
        } finally {
            setIsTransmitting(false);
        }
    };

    const getItemIcon = (icon: string) => {
        switch (icon) {
            case "document": return <FileText size={16} className="text-blue-600" />;
            case "id": return <UserCheck size={16} className="text-purple-600" />;
            case "payment": return <CreditCard size={16} className="text-green-600" />;
            case "photo": return <Image size={16} className="text-orange-600" />;
            default: return <FileText size={16} className="text-gray-600" />;
        }
    };

    if (isTransmitted) {
        return (
            <Card className="border-green-300 bg-green-50">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <CheckCircle2 size={24} className="text-green-600" />
                            </div>
                            <div>
                                <CardTitle className="text-lg text-green-800">Package Transmitted</CardTitle>
                                <CardDescription className="text-green-600">
                                    Sent to {developerName} on {transmittedAt ? new Date(transmittedAt).toLocaleDateString() : "N/A"}
                                </CardDescription>
                            </div>
                        </div>
                        <Badge className="bg-green-100 text-green-700 border-0">
                            <Lock size={12} className="mr-1" />
                            Locked
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2 text-sm text-green-700">
                        <Lock size={14} />
                        <span>Transaction is now in read-only mode</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-blue-300 bg-gradient-to-br from-blue-50 to-white">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Building2 size={24} className="text-[#0247ae]" />
                    </div>
                    <div>
                        <CardTitle className="text-lg">Developer Handoff</CardTitle>
                        <CardDescription>Transmit package to {developerName}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Package Items */}
                <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Package Contents:</p>
                    <div className="grid grid-cols-2 gap-2">
                        {packageItems.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200"
                            >
                                {getItemIcon(item.icon)}
                                <span className="text-sm text-gray-700">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Warning */}
                <div className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <AlertCircle size={18} className="text-orange-600 mt-0.5" />
                    <div className="text-sm">
                        <p className="font-medium text-orange-800">This action cannot be undone</p>
                        <p className="text-orange-600">Once transmitted, the transaction will be locked in read-only mode.</p>
                    </div>
                </div>

                {/* Transmit Button */}
                <Button
                    onClick={handleTransmit}
                    disabled={isTransmitting}
                    className="w-full bg-[#0247ae] hover:bg-[#023a8a] text-white py-6 text-lg"
                >
                    {isTransmitting ? (
                        <><Loader2 size={20} className="mr-2 animate-spin" />Transmitting...</>
                    ) : (
                        <><Send size={20} className="mr-2" />Transmit to Developer</>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}
