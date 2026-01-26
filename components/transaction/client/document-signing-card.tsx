"use client";

import { useState, useEffect, useCallback } from "react";
import { FileText, PenTool, CheckCircle2, Clock, Loader2, Eye, Send, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Document {
    id: string;
    file_name: string;
    document_type: string;
    status: string;
}

interface SigningRecord {
    document_id: string;
    status: string;
    signed_at?: string;
}

type SigningStatusType = "pending" | "ready" | "signing" | "submitted" | "validated";

interface SigningStatus {
    status: SigningStatusType;
    documents: Document[];
    signing_records: SigningRecord[];
    signed_count: number;
    total_documents: number;
    validated: boolean;
}

interface DocumentSigningCardProps {
    transactionId: string;
    onComplete?: () => void;
}

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SignaturePad } from "@/components/ui/signature-pad";

export function DocumentSigningCard({ transactionId, onComplete }: DocumentSigningCardProps) {
    const [signingStatus, setSigningStatus] = useState<SigningStatus>({
        status: "pending",
        documents: [],
        signing_records: [],
        signed_count: 0,
        total_documents: 0,
        validated: false,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeDoc, setActiveDoc] = useState<Document | null>(null);

    // Fetch signing status
    const fetchStatus = useCallback(async () => {
        try {
            const res = await fetch(`/api/transactions/${transactionId}/client-signing`);
            if (res.ok) {
                const data = await res.json();
                setSigningStatus(data);
                if (data.validated) {
                    onComplete?.();
                }
            }
        } catch (error) {
            console.error("Failed to fetch signing status:", error);
        } finally {
            setIsLoading(false);
        }
    }, [transactionId, onComplete]);

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 3000);
        return () => clearInterval(interval);
    }, [fetchStatus]);

    // Sign a document
    const handleSignDocument = (doc: Document) => {
        setActiveDoc(doc);
    };

    const handleSaveSignature = async (signatureData: string) => {
        if (!activeDoc) return;

        try {
            await fetch(`/api/transactions/${transactionId}/client-signing`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "sign",
                    document_id: activeDoc.id,
                    document_name: activeDoc.file_name,
                    signature_data: signatureData,
                }),
            });

            setActiveDoc(null);
            fetchStatus();
        } catch (error) {
            console.error("Failed to sign document:", error);
        }
    };

    // Submit all signed documents
    const handleSubmitAll = async () => {
        setIsSubmitting(true);

        try {
            await fetch(`/api/transactions/${transactionId}/client-signing`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "submit_all" }),
            });

            fetchStatus();
        } catch (error) {
            console.error("Failed to submit documents:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isDocumentSigned = (docId: string) => {
        return signingStatus.signing_records.some(
            r => r.document_id === docId && (r.status === "signed" || r.status === "validated")
        );
    };

    const allDocumentsSigned = signingStatus.documents.length > 0 &&
        signingStatus.documents.every(d => isDocumentSigned(d.id));

    if (isLoading) {
        return (
            <Card className="border-gray-200 shadow-lg animate-pulse">
                <CardContent className="py-12 text-center">
                    <Loader2 size={32} className="mx-auto text-gray-400 animate-spin" />
                </CardContent>
            </Card>
        );
    }

    // STATE: Validated
    if (signingStatus.validated) {
        return (
            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white shadow-lg">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-14 w-14 bg-green-100 rounded-2xl flex items-center justify-center">
                                <CheckCircle2 size={28} className="text-green-600" />
                            </div>
                            <div>
                                <CardTitle className="text-xl text-green-800">Documents Validated</CardTitle>
                                <CardDescription className="text-green-600">All documents have been approved</CardDescription>
                            </div>
                        </div>
                        <Badge className="bg-green-100 text-green-700 border-0">Complete</Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-center p-6 bg-white rounded-2xl border border-green-200">
                        <CheckCircle2 size={48} className="mx-auto text-green-500 mb-3" />
                        <p className="text-green-800 font-medium">
                            {signingStatus.total_documents} document(s) signed and validated
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // STATE: Submitted - Waiting for Validation
    if (signingStatus.status === "submitted" || (allDocumentsSigned && !signingStatus.validated)) {
        return (
            <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white shadow-lg">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-14 w-14 bg-orange-100 rounded-2xl flex items-center justify-center">
                                <Clock size={28} className="text-orange-600" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Documents Submitted</CardTitle>
                                <CardDescription>Waiting for Agent Validation</CardDescription>
                            </div>
                        </div>
                        <Badge className="bg-orange-100 text-orange-700 border-0 animate-pulse">Pending</Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                        <CheckCircle2 size={20} className="text-green-600" />
                        <div>
                            <p className="font-medium text-green-800">All Documents Signed</p>
                            <p className="text-sm text-green-600">{signingStatus.signed_count} of {signingStatus.total_documents} signed</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl border border-orange-200">
                        <AlertCircle size={20} className="text-orange-600" />
                        <p className="text-sm text-gray-700">
                            Your agent is reviewing your signed documents. You&apos;ll be notified once validated.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // STATE: Documents Ready / Signing
    return (
        <>
            <Dialog open={!!activeDoc} onOpenChange={(open) => !open && setActiveDoc(null)}>
                <DialogContent className="sm:max-w-md">
                    {activeDoc && (
                        <SignaturePad
                            title={`Sign ${activeDoc.file_name}`}
                            description="Please sign your name clearly in the box below."
                            onSave={handleSaveSignature}
                            onCancel={() => setActiveDoc(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>

            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white shadow-lg">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="h-14 w-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                            <FileText size={28} className="text-[#0247ae]" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">Documents Ready for Signature</CardTitle>
                            <CardDescription>Review and sign your transaction documents</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* No documents yet */}
                    {signingStatus.documents.length === 0 && (
                        <div className="text-center p-8 bg-gray-50 rounded-xl border border-gray-200">
                            <Clock size={32} className="mx-auto text-gray-400 mb-3" />
                            <p className="text-gray-600">Waiting for documents from your agent...</p>
                        </div>
                    )}

                    {/* Document list */}
                    {signingStatus.documents.map(doc => {
                        const isSigned = isDocumentSigned(doc.id);

                        return (
                            <div key={doc.id} className={`p-4 rounded-xl border-2 transition-all ${isSigned
                                ? "border-green-200 bg-green-50"
                                : "border-gray-200 bg-white"
                                }`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isSigned ? "bg-green-100" : "bg-gray-100"
                                            }`}>
                                            {isSigned ? (
                                                <CheckCircle2 size={20} className="text-green-600" />
                                            ) : (
                                                <FileText size={20} className="text-gray-400" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{doc.file_name}</p>
                                            <p className="text-sm text-gray-500">
                                                {doc.document_type === "reservation_agreement"
                                                    ? "Reservation Agreement"
                                                    : "Buyer's Information Sheet"}
                                            </p>
                                        </div>
                                    </div>
                                    {!isSigned && (
                                        <Button
                                            onClick={() => handleSignDocument(doc)}
                                            className="bg-[#0247ae] hover:bg-[#023a8a]"
                                        >
                                            <><PenTool size={14} className="mr-2" />Sign Now</>
                                        </Button>
                                    )}
                                    {isSigned && (
                                        <Badge className="bg-green-100 text-green-700 border-0">Signed</Badge>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {/* Submit button */}
                    {allDocumentsSigned && (
                        <Button
                            onClick={handleSubmitAll}
                            disabled={isSubmitting}
                            className="w-full bg-[#0247ae] hover:bg-[#023a8a] text-white py-6 text-lg"
                        >
                            {isSubmitting ? (
                                <><Loader2 size={20} className="mr-2 animate-spin" />Submitting...</>
                            ) : (
                                <><Send size={20} className="mr-2" />Submit Signed Documents</>
                            )}
                        </Button>
                    )}

                    {/* Progress indicator */}
                    {signingStatus.documents.length > 0 && !allDocumentsSigned && (
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                            <AlertCircle size={16} className="text-gray-400" />
                            <span>{signingStatus.signed_count} of {signingStatus.total_documents} documents signed</span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    );
}
