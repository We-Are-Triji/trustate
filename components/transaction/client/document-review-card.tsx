"use client";

import { useState } from "react";
import { FileText, Sparkles, X, Loader2, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Document {
    id: string;
    name: string;
    type: "reservation_agreement" | "buyers_info_sheet";
    description: string;
}

interface DocumentReviewCardProps {
    transactionId: string;
    onComplete?: () => void;
}

const MOCK_DOCUMENTS: Document[] = [
    {
        id: "doc-ra-001",
        name: "Reservation Agreement",
        type: "reservation_agreement",
        description: "Official agreement securing your property reservation"
    },
    {
        id: "doc-bis-002",
        name: "Buyer's Information Sheet",
        type: "buyers_info_sheet",
        description: "Your personal and contact information for the transaction"
    }
];

const AI_EXPLANATIONS = {
    reservation_agreement: {
        title: "Reservation Agreement Explained",
        content: `**What is a Reservation Agreement?**

A Reservation Agreement is a legally binding document that secures your intent to purchase the property. It's the first formal step in the buying process.

**What's in it for you:**

• **Property Hold**: The developer reserves the specific unit for you and removes it from the market
• **Price Lock**: Your purchase price is locked in, protecting you from future price increases
• **Priority Status**: You get priority processing for the full purchase contract
• **Refund Terms**: Clear conditions under which your reservation fee can be refunded
• **Timeline**: Establishes deadlines for completing the full purchase

**Key Points to Review:**

✓ Unit details (location, size, price)
✓ Reservation fee amount and payment terms
✓ Validity period of the reservation
✓ Cancellation and refund policy
✓ Next steps and timeline

This document protects both you and the developer by formalizing your commitment to purchase.`
    },
    buyers_info_sheet: {
        title: "Buyer's Information Sheet Explained",
        content: `**What is a Buyer's Information Sheet?**

The Buyer's Information Sheet (BIS) is a comprehensive form that collects all your personal, contact, and financial information needed to process your property purchase.

**What's in it for you:**

• **Streamlined Process**: Provides all necessary information upfront, avoiding delays
• **Credit Assessment**: Helps determine your financing eligibility if needed
• **Legal Compliance**: Ensures all regulatory requirements are met
• **Communication**: Establishes official contact channels for updates
• **Documentation**: Creates a complete record for the transaction

**Information Typically Required:**

✓ Full legal name and identification details
✓ Contact information (address, phone, email)
✓ Employment and income details
✓ Civil status and dependents
✓ Emergency contact information
✓ Preferred payment method

**Why It Matters:**

This sheet ensures the developer has accurate information to prepare your contracts, process payments, and communicate important updates throughout the buying process. Accurate information here prevents delays and complications later.`
    }
};

export function DocumentReviewCard({ transactionId, onComplete }: DocumentReviewCardProps) {
    const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);
    const [reviewedDocs, setReviewedDocs] = useState<Set<string>>(new Set());

    const handleAIExplain = async (doc: Document) => {
        setSelectedDoc(doc);
        setIsLoading(true);
        setShowExplanation(true);

        // Simulate AI processing
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
    };

    const handleMarkReviewed = async (docId: string) => {
        setReviewedDocs(prev => new Set([...prev, docId]));
        setShowExplanation(false);
        setSelectedDoc(null);

        // Check if all documents reviewed
        if (reviewedDocs.size + 1 === MOCK_DOCUMENTS.length) {
            // Mark documents as reviewed in progress
            try {
                await fetch(`/api/transactions/${transactionId}/progress`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ documents_signed: true }),
                });
            } catch (error) {
                console.error("Failed to update progress:", error);
            }
            setTimeout(() => onComplete?.(), 500);
        }
    };

    const allReviewed = reviewedDocs.size === MOCK_DOCUMENTS.length;

    return (
        <>
            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white shadow-lg">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="h-14 w-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                            <FileText size={28} className="text-[#0247ae]" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">Review Documents</CardTitle>
                            <CardDescription>
                                {allReviewed 
                                    ? "All documents reviewed!" 
                                    : `Review ${MOCK_DOCUMENTS.length - reviewedDocs.size} document${MOCK_DOCUMENTS.length - reviewedDocs.size > 1 ? 's' : ''}`
                                }
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    {MOCK_DOCUMENTS.map((doc) => {
                        const isReviewed = reviewedDocs.has(doc.id);
                        return (
                            <div
                                key={doc.id}
                                className={`p-4 rounded-xl border transition-all ${
                                    isReviewed
                                        ? "border-green-200 bg-green-50"
                                        : "border-gray-200 bg-white"
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                                            isReviewed ? "bg-green-100" : "bg-gray-100"
                                        }`}>
                                            {isReviewed ? (
                                                <CheckCircle2 size={20} className="text-green-600" />
                                            ) : (
                                                <FileText size={20} className="text-gray-600" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className={`font-medium ${isReviewed ? "text-green-800" : "text-gray-900"}`}>
                                                {doc.name}
                                            </p>
                                            <p className="text-xs text-gray-500">{doc.description}</p>
                                        </div>
                                    </div>
                                    {!isReviewed && (
                                        <Button
                                            onClick={() => handleAIExplain(doc)}
                                            size="sm"
                                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                                        >
                                            <Sparkles size={14} className="mr-1" />
                                            AI Explain
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {allReviewed && (
                        <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200 text-center">
                            <CheckCircle2 size={32} className="mx-auto text-green-600 mb-2" />
                            <p className="font-medium text-green-800">All documents reviewed!</p>
                            <p className="text-sm text-green-600">Proceeding to next step...</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* AI Explanation Dialog */}
            <Dialog open={showExplanation} onOpenChange={setShowExplanation}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <div className="flex items-center justify-between">
                            <DialogTitle className="flex items-center gap-2">
                                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                                    <Sparkles size={20} className="text-white" />
                                </div>
                                {selectedDoc && AI_EXPLANATIONS[selectedDoc.type].title}
                            </DialogTitle>
                        </div>
                    </DialogHeader>

                    {isLoading ? (
                        <div className="py-12 text-center">
                            <Loader2 size={40} className="mx-auto text-purple-600 animate-spin mb-4" />
                            <p className="text-gray-600">AI is analyzing the document...</p>
                            <p className="text-sm text-gray-400 mt-1">Preparing personalized explanation</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="prose prose-sm max-w-none">
                                {selectedDoc && AI_EXPLANATIONS[selectedDoc.type].content.split('\n\n').map((paragraph, idx) => {
                                    if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                                        return (
                                            <h3 key={idx} className="text-lg font-bold text-gray-900 mt-4 mb-2">
                                                {paragraph.replace(/\*\*/g, '')}
                                            </h3>
                                        );
                                    }
                                    if (paragraph.startsWith('•')) {
                                        return (
                                            <ul key={idx} className="list-disc pl-5 space-y-1 text-gray-700">
                                                {paragraph.split('\n').map((item, i) => (
                                                    <li key={i}>{item.replace('• ', '')}</li>
                                                ))}
                                            </ul>
                                        );
                                    }
                                    if (paragraph.startsWith('✓')) {
                                        return (
                                            <ul key={idx} className="space-y-1 text-gray-700">
                                                {paragraph.split('\n').map((item, i) => (
                                                    <li key={i} className="flex items-start gap-2">
                                                        <CheckCircle2 size={16} className="text-green-600 mt-0.5 shrink-0" />
                                                        <span>{item.replace('✓ ', '')}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        );
                                    }
                                    return (
                                        <p key={idx} className="text-gray-700 leading-relaxed">
                                            {paragraph}
                                        </p>
                                    );
                                })}
                            </div>

                            <div className="flex gap-2 pt-4 border-t">
                                <Button
                                    onClick={() => selectedDoc && handleMarkReviewed(selectedDoc.id)}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                >
                                    <CheckCircle2 size={16} className="mr-2" />
                                    I Understand
                                </Button>
                                <Button
                                    onClick={() => setShowExplanation(false)}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    Close
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
