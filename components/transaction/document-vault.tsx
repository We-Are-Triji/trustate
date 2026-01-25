"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { Upload, FileText, Image, File, X, Eye, Download, Loader2, Plus, Sparkles, Trash2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/hooks/use-auth";

const PdfPreview = dynamic(() => import("./pdf-preview").then(mod => mod.PdfPreview), {
    ssr: false,
    loading: () => <div className="h-full flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[#0247ae]" /></div>
});

interface Document {
    id: string;
    file_name: string;
    file_url: string;
    document_type: string;
    status: "pending" | "reviewed" | "flagged" | "acknowledged";
    created_at: string;
    uploaded_by?: string;
    size?: number;
    type?: string;
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

    const isAgent = accountType === "agent" || accountType === "broker";

    // Fetch documents on mount
    useEffect(() => {
        fetchDocuments();
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

        for (const file of files) {
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
                        document_type: "other",
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
                        document_type: "other",
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
                    document_type: "other",
                    status: "pending",
                    created_at: new Date().toISOString(),
                    uploaded_by: userId || "demo-user",
                    size: file.size,
                    type: file.type,
                };
                setDocuments((prev) => [localDoc, ...prev]);
            }
        }

        setIsUploading(false);
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
                return <Badge className="bg-red-50 text-red-700 border-red-200"><AlertCircle size={10} className="mr-1" />Flagged</Badge>;
            case "acknowledged":
                return <Badge className="bg-blue-50 text-blue-700 border-blue-200">Acknowledged</Badge>;
            default:
                return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
        }
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
        </div>
    );
}
