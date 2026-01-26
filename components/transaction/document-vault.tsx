"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { Upload, FileText, Image, File, X, Eye, Download, Loader2, Plus, Sparkles, Trash2, CheckCircle, AlertCircle, PenTool, ThumbsUp, ThumbsDown, FileCheck, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/hooks/use-auth";
import { SignaturePad } from "./signature-pad";

const PdfPreview = dynamic(() => import("./pdf-preview").then(mod => mod.PdfPreview), {
    ssr: false,
    loading: () => <div className="h-full flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[#0247ae]" /></div>
});

interface Document {
    id: string;
    file_name: string;
    file_url: string;
    document_type: string;
    status: "pending" | "reviewed" | "flagged" | "acknowledged" | "signed" | "rejected";
    created_at: string;
    uploaded_by?: string;
    size?: number;
    type?: string;
    requires_wet_ink?: boolean;
}

interface DocumentVaultProps {
    transactionId: string;
    onAnalyzeDocument?: (doc: Document) => void;
}

export function DocumentVault({ transactionId, onAnalyzeDocument }: DocumentVaultProps) {
    const { userId, accountType } = useAuth();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [signatureDoc, setSignatureDoc] = useState<Document | null>(null);

    const isAgent = accountType === "agent" || accountType === "broker";

    // Fetch documents on mount and poll for updates
    useEffect(() => {
        fetchDocuments();
        const interval = setInterval(fetchDocuments, 3000);
        return () => clearInterval(interval);
    }, [transactionId]);

    const fetchDocuments = async () => {
        try {
            const response = await fetch(`/api/transactions/${transactionId}/documents`, {
                headers: { "x-user-id": userId || "demo-user" },
            });
            if (response.ok) {
                const data = await response.json();
                setDocuments(data.documents || []);
            }
        } catch (error) {
            console.error("Failed to fetch documents:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const logDocumentView = async (docName: string) => {
        try {
            await fetch(`/api/transactions/${transactionId}/activity`, {
                method: "POST",
                body: JSON.stringify({
                    action_type: "view",
                    description: `Viewed document: ${docName}`,
                    actor_id: userId || "demo-user",
                    actor_type: accountType
                }),
            });
        } catch (e) {
            console.error("Failed to log view", e);
        }
    };

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    }, [transactionId]);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            handleFiles(files);
        }
    };

    const handleFiles = async (files: File[]) => {
        setIsUploading(true);

        // Count existing RA and BIS documents
        const existingRA = documents.filter(d => d.document_type === "reservation_agreement").length;
        const existingBIS = documents.filter(d => d.document_type === "buyers_info_sheet").length;

        let raCount = existingRA;
        let bisCount = existingBIS;

        for (const file of files) {
            let documentType = "other";

            // Auto-detect document type based on upload order
            if (raCount === 0) {
                documentType = "reservation_agreement";
                raCount++;
            } else if (bisCount === 0) {
                documentType = "buyers_info_sheet";
                bisCount++;
            } else {
                // Check filename for hints
                const fileNameLower = file.name.toLowerCase();
                if (fileNameLower.includes("payment") || fileNameLower.includes("receipt")) {
                    documentType = "payment_proof";
                } else if (fileNameLower.includes("id") || fileNameLower.includes("identity")) {
                    documentType = "identity";
                }
            }

            try {
                // 1. Request presigned URL from API
                const response = await fetch(`/api/transactions/${transactionId}/documents`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-user-id": userId || "demo-user",
                    },
                    body: JSON.stringify({
                        file_name: file.name,
                        file_type: file.type,
                        file_size: file.size,
                        document_type: documentType,
                    }),
                });

                if (response.ok) {
                    const { document, upload_url } = await response.json();

                    // 2. Upload file directly to S3
                    await fetch(upload_url, {
                        method: "PUT",
                        body: file,
                        headers: { "Content-Type": file.type },
                    });

                    // 3. Add to local state
                    setDocuments((prev) => [document, ...prev]);
                } else {
                    // Fallback: add locally without S3
                    const localDoc: Document = {
                        id: `local-${Date.now()}`,
                        file_name: file.name,
                        file_url: URL.createObjectURL(file),
                        document_type: documentType,
                        status: "pending",
                        created_at: new Date().toISOString(),
                        uploaded_by: userId || "demo-user",
                        size: file.size,
                        type: file.type,
                    };
                    setDocuments((prev) => [localDoc, ...prev]);
                }
            } catch (error) {
                console.error("Upload failed:", error);
                // Fallback: add locally
                const localDoc: Document = {
                    id: `local-${Date.now()}`,
                    file_name: file.name,
                    file_url: URL.createObjectURL(file),
                    document_type: documentType,
                    status: "pending",
                    created_at: new Date().toISOString(),
                    uploaded_by: userId || "demo-user",
                    size: file.size,
                    type: file.type,
                };
                setDocuments((prev) => [localDoc, ...prev]);
            }
        }

        // Update step progress based on document counts
        try {
            const progressUpdate: Record<string, boolean> = {};
            if (raCount > 0) progressUpdate.ra_uploaded = true;
            if (bisCount > 0) progressUpdate.bis_uploaded = true;

            if (Object.keys(progressUpdate).length > 0) {
                await fetch(`/api/transactions/${transactionId}/progress`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(progressUpdate),
                });
            }
        } catch (error) {
            console.error("Failed to update progress:", error);
        }

        setIsUploading(false);
        fetchDocuments(); // Refresh to get latest state
    };

    const removeDocument = async (id: string) => {
        try {
            await fetch(`/api/transactions/${transactionId}/documents/${id}`, {
                method: "DELETE",
                headers: { "x-user-id": userId || "demo-user" },
            });
        } catch (error) {
            console.error("Failed to delete document:", error);
        }

        setDocuments((prev) => prev.filter((doc) => doc.id !== id));
        if (selectedDoc?.id === id) {
            setSelectedDoc(null);
        }
    };

    const getFileIcon = (fileName: string) => {
        if (fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return Image;
        if (fileName.match(/\.pdf$/i)) return FileText;
        return File;
    };

    const getStatusBadge = (status: Document["status"]) => {
        switch (status) {
            case "reviewed":
                return <Badge className="bg-green-50 text-green-700 border-green-200"><CheckCircle size={10} className="mr-1" />Verified</Badge>;
            case "flagged":
            case "rejected":
                return <Badge className="bg-red-50 text-red-700 border-red-200"><AlertCircle size={10} className="mr-1" />{status === "rejected" ? "Rejected" : "Flagged"}</Badge>;
            case "acknowledged":
                return <Badge className="bg-blue-50 text-blue-700 border-blue-200"><FileCheck size={10} className="mr-1" />Acknowledged</Badge>;
            case "signed":
                return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200"><PenTool size={10} className="mr-1" />Signed</Badge>;
            default:
                return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
        }
    };

    const updateDocumentStatus = async (docId: string, newStatus: Document["status"]) => {
        try {
            await fetch(`/api/transactions/${transactionId}/documents/${docId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": userId || "demo-user"
                },
                body: JSON.stringify({ status: newStatus })
            });
            setDocuments(prev => prev.map(d => d.id === docId ? { ...d, status: newStatus } : d));
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    const handleSignDocument = async (signatureDataUrl: string) => {
        if (!signatureDoc) return;
        // In real implementation, merge signature into PDF
        // For demo, just update status
        await updateDocumentStatus(signatureDoc.id, "signed");
        setSignatureDoc(null);
    };

    const RenderDocumentList = ({ docs, title, allowUpload = false, allowDelete = false }: { docs: Document[], title: string, allowUpload?: boolean, allowDelete?: boolean }) => (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">{title}</h3>
                {allowUpload && (
                    <label>
                        <input
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileInput}
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.webp"
                            disabled={isUploading}
                        />
                        <Button className="bg-[#0247ae] hover:bg-[#0560d4] text-white cursor-pointer h-8 text-xs" asChild disabled={isUploading}>
                            <span>
                                {isUploading ? <Loader2 size={12} className="mr-2 animate-spin" /> : <Plus size={12} className="mr-2" />}
                                {isUploading ? "Uploading..." : "Upload New"}
                            </span>
                        </Button>
                    </label>
                )}
            </div>

            {docs.length === 0 ? (
                <div
                    onDragOver={allowUpload ? handleDragOver : undefined}
                    onDragLeave={allowUpload ? handleDragLeave : undefined}
                    onDrop={allowUpload ? handleDrop : undefined}
                    className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 transition-all ${allowUpload && isDragging ? "border-[#0247ae] bg-blue-50" : "border-gray-200"
                        } ${!allowUpload ? "bg-gray-50 border-gray-100" : ""}`}
                >
                    {allowUpload ? (
                        <>
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 ${isDragging ? "bg-[#0247ae]/10" : "bg-gray-100"}`}>
                                <Upload size={20} className={isDragging ? "text-[#0247ae]" : "text-gray-400"} />
                            </div>
                            <p className="text-sm text-gray-500 font-medium">No documents uploaded yet</p>
                            <p className="text-xs text-gray-400 mt-1">Drag files here to upload requirement</p>
                        </>
                    ) : (
                        <p className="text-sm text-gray-400 italic">No shared documents available</p>
                    )}
                </div>
            ) : (
                <div className="space-y-2">
                    {docs.map((doc) => {
                        const FileIcon = getFileIcon(doc.file_name);
                        const isOwner = doc.uploaded_by === userId;
                        const canDelete = allowDelete && (isAgent || isOwner);

                        return (
                            <div
                                key={doc.id}
                                onClick={() => {
                                    setSelectedDoc(doc);
                                    logDocumentView(doc.file_name);
                                }}
                                className={`p-3 rounded-lg border transition-all cursor-pointer group flex items-center gap-3 ${selectedDoc?.id === doc.id
                                    ? "border-[#0247ae] bg-blue-50/50"
                                    : "border-gray-200 hover:border-gray-300 bg-white"
                                    }`}
                            >
                                <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                                    <FileIcon size={20} className="text-gray-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-gray-900 truncate">{doc.file_name}</h4>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[10px] text-gray-500 capitalize">{doc.document_type}</span>
                                        <span className="text-[10px] text-gray-400">•</span>
                                        <span className="text-[10px] text-gray-500">
                                            {new Date(doc.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {getStatusBadge(doc.status)}

                                    {/* AI Assistant Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onAnalyzeDocument?.(doc);
                                        }}
                                        className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-all"
                                        title="Ask AI about this document"
                                    >
                                        <Sparkles size={16} />
                                    </button>

                                    {/* Sign/Acknowledge (Client on shared docs) OR Approve/Reject (Agent on client uploads) */}
                                    {!isAgent && !isOwner && doc.status === "pending" && (
                                        <>
                                            {doc.requires_wet_ink ? (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        window.open(doc.file_url, "_blank");
                                                    }}
                                                    className="h-8 px-2 rounded-lg flex items-center gap-1 text-xs text-orange-600 bg-orange-50 hover:bg-orange-100 transition-all"
                                                    title="Print and sign physically"
                                                >
                                                    <Printer size={14} />
                                                    Wet Ink
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSignatureDoc(doc);
                                                    }}
                                                    className="h-8 px-2 rounded-lg flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-all"
                                                    title="Sign this document"
                                                >
                                                    <PenTool size={14} />
                                                    Sign
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    updateDocumentStatus(doc.id, "acknowledged");
                                                }}
                                                className="h-8 px-2 rounded-lg flex items-center gap-1 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 transition-all"
                                                title="Acknowledge you have read this"
                                            >
                                                <FileCheck size={14} />
                                                Ack
                                            </button>
                                        </>
                                    )}

                                    {/* Agent Approve/Reject on Client Uploads */}
                                    {isAgent && !isOwner && doc.status === "pending" && (
                                        <>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    updateDocumentStatus(doc.id, "reviewed");
                                                }}
                                                className="h-8 w-8 rounded-lg flex items-center justify-center text-green-600 hover:bg-green-50 transition-all"
                                                title="Approve document"
                                            >
                                                <ThumbsUp size={16} />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    updateDocumentStatus(doc.id, "rejected");
                                                }}
                                                className="h-8 w-8 rounded-lg flex items-center justify-center text-red-600 hover:bg-red-50 transition-all"
                                                title="Reject document"
                                            >
                                                <ThumbsDown size={16} />
                                            </button>
                                        </>
                                    )}

                                    {canDelete && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeDocument(doc.id);
                                            }}
                                            className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );

    // Derived Lists
    const myUploads = documents.filter(d => d.uploaded_by === userId || d.uploaded_by === "demo-user"); // Fallback for dev
    const sharedDocs = documents.filter(d => d.uploaded_by !== userId && d.uploaded_by !== "demo-user");

    // Agent sees unified list (everything is effectively manageable)
    // Client sees split list
    const showUnified = isAgent;

    return (
        <div className="h-full flex">
            {/* Document List */}
            <div className={`${selectedDoc ? "w-1/2 border-r border-gray-100" : "w-full"} flex flex-col`}>
                <div className="flex-1 overflow-y-auto p-6 bg-white">
                    {isLoading ? (
                        <div className="h-full flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-[#0247ae]" />
                        </div>
                    ) : (
                        <>
                            {showUnified ? (
                                <RenderDocumentList
                                    docs={documents}
                                    title="All Documents"
                                    allowUpload={true}
                                    allowDelete={true}
                                />
                            ) : (
                                <>
                                    <RenderDocumentList
                                        docs={myUploads}
                                        title="My Uploads (Required)"
                                        allowUpload={true}
                                        allowDelete={true}
                                    />
                                    <div className="my-6 border-t border-gray-100"></div>
                                    <RenderDocumentList
                                        docs={sharedDocs}
                                        title="Transaction Files (Read Only)"
                                        allowUpload={false}
                                        allowDelete={false}
                                    />
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Document Preview */}
            {selectedDoc && (
                <div className="w-1/2 flex flex-col bg-gray-50">
                    <div className="p-4 border-b border-gray-100 bg-white flex items-center justify-between">
                        <div className="min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">{selectedDoc.file_name}</h3>
                            <p className="text-sm text-gray-500 capitalize">{selectedDoc.document_type}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => onAnalyzeDocument?.(selectedDoc)} className="text-purple-600 border-purple-200 hover:bg-purple-50">
                                <Sparkles size={16} className="mr-2" />
                                Ask AI
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                                <a href={selectedDoc.file_url} target="_blank" rel="noopener noreferrer">
                                    <Download size={16} className="mr-2" />
                                    Download
                                </a>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setSelectedDoc(null)}>
                                <X size={16} />
                            </Button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-hidden p-4">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full overflow-hidden flex flex-col">
                            {selectedDoc.file_name.toLowerCase().endsWith(".pdf") ? (
                                <PdfPreview url={selectedDoc.file_url} fileName={selectedDoc.file_name} />
                            ) : selectedDoc.file_name.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                <div className="h-full flex items-center justify-center p-4 bg-gray-50">
                                    <img
                                        src={selectedDoc.file_url}
                                        alt={selectedDoc.file_name}
                                        className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
                                    />
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-gray-50">
                                    <div className="h-20 w-20 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4">
                                        <Eye size={32} className="text-gray-400" />
                                    </div>
                                    <p className="text-gray-500 text-sm font-medium">Preview not available</p>
                                    <p className="text-gray-400 text-xs mt-1">Please download the file to view its contents</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {/* Signature Pad Modal */}
            <SignaturePad
                isOpen={!!signatureDoc}
                onClose={() => setSignatureDoc(null)}
                onSign={handleSignDocument}
                documentName={signatureDoc?.file_name}
            />
        </div>
    );
}
