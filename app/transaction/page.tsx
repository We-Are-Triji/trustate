"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Building2, MapPin, DollarSign, Loader2, Tag, Home, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/lib/hooks/use-auth";

export default function CreateTransactionPage() {
    const router = useRouter();
    const { userId } = useAuth();
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLoading(false);
        router.push("/dashboard/transactions");
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-900 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="mb-6 hover:bg-transparent hover:text-[#0247ae] px-0"
                >
                    <ArrowLeft size={18} className="mr-2" />
                    Back to Dashboard
                </Button>

                <Card className="border-gray-200 dark:border-gray-700 shadow-lg">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-full bg-[#0247ae]/10 flex items-center justify-center text-[#0247ae]">
                                <Building2 size={20} />
                            </div>
                            <div>
                                <CardTitle className="text-xl text-gray-900 dark:text-white">Create New Transaction</CardTitle>
                                <CardDescription>Enter the property details to initiate a transaction.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <form onSubmit={onSubmit}>
                        <CardContent className="space-y-6">
                            {/* Row 1: The Context */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <Building2 size={16} className="text-[#0247ae]" />
                                        Project Name
                                    </label>
                                    <Input
                                        required
                                        placeholder="e.g. Mandani Bay"
                                        className="bg-gray-50 dark:bg-gray-800"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <Tag size={16} className="text-[#0247ae]" />
                                        Transaction Type
                                    </label>
                                    <Select>
                                        <SelectTrigger className="bg-gray-50 dark:bg-gray-800">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="preselling">Pre-Selling</SelectItem>
                                            <SelectItem value="resale">Resale</SelectItem>
                                            <SelectItem value="rental">Rental</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Row 2: The Unit Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <MapPin size={16} className="text-[#0247ae]" />
                                        Unit / Property Address
                                    </label>
                                    <Input
                                        required
                                        placeholder="e.g. Tower 2, Unit 15-B"
                                        className="bg-gray-50 dark:bg-gray-800"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <Home size={16} className="text-[#0247ae]" />
                                        Property Type
                                    </label>
                                    <Select>
                                        <SelectTrigger className="bg-gray-50 dark:bg-gray-800">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="condo">Condominium</SelectItem>
                                            <SelectItem value="house_lot">House & Lot</SelectItem>
                                            <SelectItem value="lot_only">Lot Only</SelectItem>
                                            <SelectItem value="commercial">Commercial</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Row 3: The Money & People */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <DollarSign size={16} className="text-[#0247ae]" />
                                        Total Contract Price
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₱</span>
                                        <Input
                                            type="number"
                                            placeholder="0.00"
                                            className="pl-7 bg-gray-50 dark:bg-gray-800"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <User size={16} className="text-[#0247ae]" />
                                        Client Name
                                    </label>
                                    <Input
                                        required
                                        placeholder="e.g. Juan Cruz"
                                        className="bg-gray-50 dark:bg-gray-800"
                                    />
                                </div>
                            </div>

                            {/* Row 4: The Status */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <FileText size={16} className="text-[#0247ae]" />
                                    Reservation Number <span className="text-gray-400 font-normal">(Optional)</span>
                                </label>
                                <Input
                                    placeholder="e.g. OR-12345"
                                    className="bg-gray-50 dark:bg-gray-800"
                                />
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                className="hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-[#0247ae] hover:bg-[#0560d4] text-white min-w-[120px]"
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                                Create
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}
