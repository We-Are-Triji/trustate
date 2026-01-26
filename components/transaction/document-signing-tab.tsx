"use client";

import { useState, useEffect, useCallback } from "react";
import { FileText, PenTool, Send, CheckCircle2, Clock, Loader2, FileCheck, User, Users, Building2, AlertCircle, ThumbsUp, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/hooks/use-auth";

interface DocumentForSigning {
    id: string;
    name: string;
    type: "reservation_agreement" | "buyers_info_sheet" | "contract";
    status: "pending" | "preparing" | "sent" | "signed" | "validated";
    signatureFields: SignatureField[];
}

interface SignatureField {
    id: string;
    role: "client" | "agent" | "broker";
    label: string;
    signed: boolean;
    signedAt?: string;
}

interface DocumentSigningTabProps {
    transactionId: string;
    onDocumentsSigned?: () => void;
}

export function DocumentSigningTab({ transactionId, onDocumentsSigned }: DocumentSigningTabProps) {
    const { accountType } = useAuth();
    const isAgent = accountType === "agent" || accountType === "broker";

    // Mock documents for signing
    const [documents, setDocuments] = useState<DocumentForSigning[]>([
        {
            id: "doc-ra",
            name: "Reservation Agreement",
            type: "reservation_agreement",
            status: "pending",
            signatureFields: [
                { id: "sig-client", role: "client", label: "Buyer Signature", signed: false },
                { id: "sig-agent", role: "agent", label: "Agent Signature", signed: false },
            ]
        },
        {
            id: "doc-bis",
            name: "Buyer's Information Sheet",
            type: "buyers_info_sheet",
            status: "pending",
            signatureFields: [
                { id: "sig-client-bis", role: "client", label: "Buyer Signature", signed: false },
            ]
        }
    ]);

    const [selectedDoc, setSelectedDoc] = useState<DocumentForSigning | null>(null);
    const [isPreparing, setIsPreparing] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isValidating, setIsValidating] = useState(false);

    // Prepare document for e-sign
    const handlePrepareForESign = async (docId: string) => {
        setIsPreparing(true);

        // Simulate preparation
        await new Promise(r => setTimeout(r, 1500));

        setDocuments(prev => prev.map(d =>
            d.id === docId ? { ...d, status: "preparing" } : d
        ));

        setIsPreparing(false);
    };

    // Send for signature
    const handleSendForSignature = async (docId: string) => {
        setIsSending(true);

        // Simulate sending
        await new Promise(r => setTimeout(r, 1000));

        setDocuments(prev => prev.map(d =>
            d.id === docId ? { ...d, status: "sent" } : d
        ));

        setIsSending(false);
    };

    // Simulate client signing (demo)
    const handleSimulateClientSign = async (docId: string) => {
        // Simulate client signing after 2 seconds
        await new Promise(r => setTimeout(r, 2000));

        setDocuments(prev => prev.map(d => {
            if (d.id === docId) {
                return {
                    ...d,
                    status: "signed",
                    signatureFields: d.signatureFields.map(sf => ({
                        ...sf,
                        signed: true,
                        signedAt: new Date().toISOString()
                    }))
                };
            }
            return d;
        }));
    };

    // Validate documents
    const handleValidateDocuments = async () => {
        setIsValidating(true);

        try {
            // Update step progress
            await fetch(`/api/transactions/${transactionId}/progress`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ documents_signed: true }),
            });

            setDocuments(prev => prev.map(d => ({ ...d, status: "validated" })));
            onDocumentsSigned?.();
        } catch (error) {
            console.error("Failed to validate documents:", error);
        } finally {
            setIsValidating(false);
        }
    };

    const allDocumentsSigned = documents.every(d => d.status === "signed" || d.status === "validated");
    const allDocumentsValidated = documents.every(d => d.status === "validated");

    const getStatusBadge = (status: DocumentForSigning["status"]) => {
        switch (status) {
            case "validated":
                return <Badge className="bg-green-100 text-green-700 border-0"><CheckCircle2 size={12} className="mr-1" />Validated</Badge>;
            case "signed":
                return <Badge className="bg-blue-100 text-blue-700 border-0"><CheckCircle2 size={12} className="mr-1" />Signed</Badge>;
            case "sent":
                return <Badge className="bg-yellow-100 text-yellow-700 border-0"><Clock size={12} className="mr-1" />Awaiting Signature</Badge>;
            case "preparing":
                return <Badge className="bg-purple-100 text-purple-700 border-0"><PenTool size={12} className="mr-1" />Ready to Send</Badge>;
            default:
                return <Badge className="bg-gray-100 text-gray-600 border-0"><FileText size={12} className="mr-1" />Pending</Badge>;
        }
    };

    const getRoleIcon = (role: SignatureField["role"]) => {
        switch (role) {
            case "client": return <User size={14} />;
            case "agent": return <Users size={14} />;
            case "broker": return <Building2 size={14} />;
        }
    };

    // AGENT VIEW
    if (isAgent) {
        return (
            <div className="h-full overflow-y-auto">
                <div className="p-6 space-y-6 max-w-5xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Document Assembly</h2>
                            <p className="text-gray-500 mt-1">Prepare and collect signatures on transaction documents</p>
                        </div>
                        {allDocumentsValidated && (
                            <Badge className="bg-green-100 text-green-700 border-0 text-sm px-4 py-2">
                                <CheckCircle2 size={16} className="mr-2" />
                                All Documents Validated
                            </Badge>
                        )}
                    </div>

                    {/* Documents List */}
                    <Card className="border-gray-200">
                        <CardHeader>
                            <CardTitle className="text-base">Required for Signing</CardTitle>
                            <CardDescription>Documents from Phase 1 that require signatures</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {documents.map(doc => (
                                <div key={doc.id} className={`p-4 rounded-xl border ${doc.status === "validated" ? "border-green-200 bg-green-50" :
                                        doc.status === "signed" ? "border-blue-200 bg-blue-50" :
                                            "border-gray-200 bg-white"
                                    }`}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3">
                                            <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${doc.status === "validated" ? "bg-green-100" :
                                                    doc.status === "signed" ? "bg-blue-100" :
                                                        "bg-gray-100"
                                                }`}>
                                                <FileText size={24} className={
                                                    doc.status === "validated" ? "text-green-600" :
                                                        doc.status === "signed" ? "text-blue-600" :
                                                            "text-gray-400"
                                                } />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{doc.name}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {getStatusBadge(doc.status)}
                                                </div>

                                                {/* Signature Fields */}
                                                <div className="mt-3 space-y-1">
                                                    {doc.signatureFields.map(field => (
                                                        <div key={field.id} className={`flex items-center gap-2 text-sm ${field.signed ? "text-green-600" : "text-gray-500"
                                                            }`}>
                                                            {field.signed ? (
                                                                <CheckCircle2 size={14} />
                                                            ) : (
                                                                getRoleIcon(field.role)
                                                            )}
                                                            <span>{field.label}</span>
                                                            {field.signed && field.signedAt && (
                                                                <span className="text-xs text-gray-400">
                                                                    ({new Date(field.signedAt).toLocaleDateString()})
                                                                </span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col gap-2">
                                            {doc.status === "pending" && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    disabled={isPreparing}
                                                    onClick={() => handlePrepareForESign(doc.id)}
                                                    className="text-[#0247ae] border-[#0247ae]"
                                                >
                                                    {isPreparing ? <Loader2 size={14} className="mr-1 animate-spin" /> : <PenTool size={14} className="mr-1" />}
                                                    Prepare for E-Sign
                                                </Button>
                                            )}
                                            {doc.status === "preparing" && (
                                                <Button
                                                    size="sm"
                                                    disabled={isSending}
                                                    onClick={() => handleSendForSignature(doc.id)}
                                                    className="bg-[#0247ae] hover:bg-[#023a8a]"
                                                >
                                                    {isSending ? <Loader2 size={14} className="mr-1 animate-spin" /> : <Send size={14} className="mr-1" />}
                                                    Send for Signature
                                                </Button>
                                            )}
                                            {doc.status === "sent" && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleSimulateClientSign(doc.id)}
                                                    className="text-orange-600 border-orange-300"
                                                >
                                                    <Clock size={14} className="mr-1" />
                                                    Simulate Client Sign (Demo)
                                                </Button>
                                            )}
                                            {doc.status === "signed" && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                >
                                                    <Eye size={14} className="mr-1" />
                                                    View Signed Document
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Validation Section */}
                    {allDocumentsSigned && !allDocumentsValidated && (
                        <Card className="border-blue-300 bg-gradient-to-br from-blue-50 to-white">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <FileCheck size={20} className="text-[#0247ae]" />
                                    All Documents Signed
                                </CardTitle>
                                <CardDescription>Review and validate to proceed to Developer Handoff</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                                    <CheckCircle2 size={24} className="text-green-600" />
                                    <div>
                                        <p className="font-medium text-green-800">All signatures collected</p>
                                        <p className="text-sm text-green-600">{documents.length} document(s) fully signed</p>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleValidateDocuments}
                                    disabled={isValidating}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
                                >
                                    {isValidating ? (
                                        <><Loader2 size={20} className="mr-2 animate-spin" />Validating...</>
                                    ) : (
                                        <><ThumbsUp size={20} className="mr-2" />Validate Documents</>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Validated State */}
                    {allDocumentsValidated && (
                        <Card className="border-green-300 bg-green-50">
                            <CardContent className="py-8 text-center">
                                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 size={32} className="text-green-600" />
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-2">Documents Validated</h4>
                                <p className="text-sm text-gray-600 max-w-md mx-auto">
                                    All documents have been signed and validated. Developer Handoff is now unlocked.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        );
    }

    // CLIENT VIEW
    return (
        <div className="h-full overflow-y-auto">
            <div className="p-6 space-y-6 max-w-4xl mx-auto">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Document Signing</h2>
                    <p className="text-gray-500 mt-1">Review and sign your transaction documents</p>
                </div>

                <Card className="border-gray-200">
                    <CardContent className="py-12 text-center">
                        <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <PenTool size={32} className="text-[#0247ae]" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Document Signing Coming Soon</h4>
                        <p className="text-sm text-gray-500 max-w-md mx-auto">
                            Your agent will prepare documents for your signature. You&apos;ll receive a notification when documents are ready.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
