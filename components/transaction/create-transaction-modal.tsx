"use client";

import { useState } from "react";
import { Building2, MapPin, DollarSign, Loader2, Tag, Home, User, FileText, Plus, HardHat } from "lucide-react";
import { nanoid } from "nanoid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/lib/hooks/use-auth";
import type { Transaction } from "@/lib/types/transaction";
import { DeveloperAutocomplete } from "./developer-autocomplete";

interface CreateTransactionModalProps {
    onTransactionCreated: () => void;
    trigger?: React.ReactNode;
}

export function CreateTransactionModal({ onTransactionCreated, trigger }: CreateTransactionModalProps) {
    const { userId } = useAuth();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form State
    const [developer, setDeveloper] = useState<{ id: string; name: string; logo: string } | null>(null);
    const [projectName, setProjectName] = useState("");
    const [transType, setTransType] = useState("");
    const [address, setAddress] = useState("");
    const [propType, setPropType] = useState("");
    const [price, setPrice] = useState("");
    const [reservationNo, setReservationNo] = useState("");

    const formatPrice = (value: string) => {
        const number = value.replace(/\D/g, "");
        return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPrice(e.target.value);
        setPrice(formatted);
    };

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!developer) {
            // Should be handled by required check or UI but good to be safe
            return;
        }

        setLoading(true);

        const payload = {
            project_name: projectName,
            developer_id: developer.id,
            transaction_type: transType || "preselling",
            unit_address: address,
            property_type: propType || "condo",
            transaction_value: parseInt(price.replace(/,/g, "")) || null,
            client_name: null, // Client joins via invite code
            reservation_number: reservationNo || null,
        };

        try {
            // Try API first
            const response = await fetch("/api/transactions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": userId || "demo-user",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                // Also save to localStorage for offline/demo access
                const stored = localStorage.getItem("mock_transactions");
                const transactions = stored ? JSON.parse(stored) : [];
                localStorage.setItem("mock_transactions", JSON.stringify([data.transaction, ...transactions]));
            }
        } catch (error) {
            console.error("Failed to create transaction via API:", error);
        }

        setLoading(false);
        setOpen(false);

        // Reset form
        setDeveloper(null);
        setProjectName("");
        setTransType("");
        setAddress("");
        setPropType("");
        setPrice("");
        setReservationNo("");

        // Notify parent
        onTransactionCreated();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="bg-[#0247ae] hover:bg-[#0560d4] text-white">
                        <Plus size={18} className="mr-2" />
                        New Transaction
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#0247ae]/10 flex items-center justify-center text-[#0247ae]">
                            <Building2 size={20} />
                        </div>
                        <div>
                            <DialogTitle className="text-xl">Create New Transaction</DialogTitle>
                            <DialogDescription>Enter the property details to initiate a transaction.</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-6 py-4">
                    {/* Row 0: Developer */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <HardHat size={16} className="text-[#0247ae]" />
                            Developer <span className="text-red-500">*</span>
                        </label>
                        <DeveloperAutocomplete
                            onSelect={setDeveloper}
                            selectedDeveloper={developer}
                        />
                    </div>

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
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <Tag size={16} className="text-[#0247ae]" />
                                Transaction Type
                            </label>
                            <Select value={transType} onValueChange={setTransType}>
                                <SelectTrigger>
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
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <Home size={16} className="text-[#0247ae]" />
                                Property Type
                            </label>
                            <Select value={propType} onValueChange={setPropType}>
                                <SelectTrigger>
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

                    {/* Row 3: The Money */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <DollarSign size={16} className="text-[#0247ae]" />
                                Total Contract Price
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₱</span>
                                <Input
                                    type="text"
                                    placeholder="0"
                                    className="pl-7"
                                    value={price}
                                    onChange={handlePriceChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <FileText size={16} className="text-[#0247ae]" />
                                Reservation Number <span className="text-gray-400 font-normal">(Optional)</span>
                            </label>
                            <Input
                                placeholder="e.g. OR-12345"
                                value={reservationNo}
                                onChange={(e) => setReservationNo(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-[#0247ae] hover:bg-[#0560d4] text-white min-w-[120px]"
                            disabled={loading || !developer}
                        >
                            {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                            Create Transaction
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
