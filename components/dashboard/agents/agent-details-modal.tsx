"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, User, Phone, Mail, MapPin, Building2, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AgentDetails {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    licenseNumber?: string;
    brokerage?: string;
    bio?: string;
    location?: string;
    status?: string;
}

interface AgentDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    agent: AgentDetails | null;
}

export function AgentDetailsModal({ isOpen, onClose, agent }: AgentDetailsModalProps) {
    if (!agent) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl"
                    >
                        <div className="absolute right-4 top-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full text-gray-500 hover:bg-gray-100"
                                onClick={onClose}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="mb-6 flex flex-col items-center text-center">
                            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#0247ae]/10 text-2xl font-bold text-[#0247ae]">
                                {agent.firstName?.[0]}
                                {agent.lastName?.[0]}
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {agent.firstName} {agent.lastName}
                            </h2>
                            {agent.brokerage && (
                                <p className="font-medium text-[#0247ae]">{agent.brokerage}</p>
                            )}
                            <div className="mt-2 flex items-center gap-2">
                                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                    Active Agent
                                </span>
                                {agent.licenseNumber && (
                                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                                        License: {agent.licenseNumber}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="rounded-xl bg-gray-50 p-4">
                                <h3 className="mb-3 text-sm font-semibold text-gray-900">Contact Information</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                        <span>{agent.email}</span>
                                    </div>
                                    {agent.phoneNumber && (
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <Phone className="h-4 w-4 text-gray-400" />
                                            <span>{agent.phoneNumber}</span>
                                        </div>
                                    )}
                                    {agent.location && (
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <MapPin className="h-4 w-4 text-gray-400" />
                                            <span>{agent.location}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {agent.bio && (
                                <div>
                                    <h3 className="mb-2 text-sm font-semibold text-gray-900">About</h3>
                                    <p className="text-sm leading-relaxed text-gray-600">{agent.bio}</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
                            <Button variant="outline" onClick={onClose}>
                                Close
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
