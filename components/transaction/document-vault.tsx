"use client";

import { useState, useCallback, useEffect } from "react";
import { Upload, FileText, Image, File, X, Eye, Download, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PdfPreview } from "./pdf-preview";

interface Document {
    id: string;
    file_name: string;
    file_url: string;
    document_type: string;
    status: "pending" | "reviewed" | "flagged" | "acknowledged";
    created_at: string;
    // For local tracking
    size?: number;
    type?: string;
}

interface DocumentVaultProps {
    transactionId: string;
}

export function DocumentVault({ transactionId }: DocumentVaultProps) {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);

    // Fetch documents on mount
    useEffect(() => {
        fetchDocuments();
    }, [transactionId]);

    const fetchDocuments = async () => {
        try {
            const response = await fetch(`/api/transactions/${transactionId}/documents`, {
                headers: { "x-user-id": "demo-user" },
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
                        "x-user-id": "demo-user",
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
                headers: { "x-user-id": "demo-user" },
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
                return <Badge className="bg-green-100 text-green-700 border-0">Verified</Badge>;
            case "flagged":
                return <Badge className="bg-red-100 text-red-700 border-0">Flagged</Badge>;
            case "acknowledged":
                return <Badge className="bg-blue-100 text-blue-700 border-0">Acknowledged</Badge>;
            default:
                return <Badge className="bg-yellow-100 text-yellow-700 border-0">Pending Review</Badge>;
        }
    };

    return (
        <div className="h-full flex">
            {/* Document List */}
            <div className={`${selectedDoc ? "w-1/2 border-r border-gray-100" : "w-full"} flex flex-col`}>
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Document Vault</h2>
                        <p className="text-sm text-gray-500">{documents.length} documents</p>
                    </div>
                    <label>
                        <input
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileInput}
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.webp"
                            disabled={isUploading}
                        />
                        <Button className="bg-[#0247ae] hover:bg-[#0560d4] text-white cursor-pointer" asChild disabled={isUploading}>
                            <span>
                                {isUploading ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Plus size={16} className="mr-2" />}
                                {isUploading ? "Uploading..." : "Upload"}
                            </span>
                        </Button>
                    </label>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="h-full flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-[#0247ae]" />
                        </div>
                    ) : documents.length === 0 ? (
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`h-full min-h-[300px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all ${isDragging ? "border-[#0247ae] bg-blue-50" : "border-gray-200 hover:border-gray-300"
                                }`}
                        >
                            <div className={`h-16 w-16 rounded-full flex items-center justify-center mb-4 ${isDragging ? "bg-[#0247ae]/10" : "bg-gray-100"}`}>
                                <Upload size={28} className={isDragging ? "text-[#0247ae]" : "text-gray-400"} />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {isDragging ? "Drop files here" : "No documents uploaded yet"}
                            </h3>
                            <p className="text-sm text-gray-500 mb-4 text-center max-w-xs">
                                Drag and drop your files here, or click the upload button above
                            </p>
                            <p className="text-xs text-gray-400">
                                Supports: PDF, JPG, PNG, DOC, DOCX (Max 10MB)
                            </p>
                        </div>
                    ) : (
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`space-y-3 ${isDragging ? "opacity-50" : ""}`}
                        >
                            {documents.map((doc) => {
                                const FileIcon = getFileIcon(doc.file_name);
                                return (
                                    <div
                                        key={doc.id}
                                        onClick={() => setSelectedDoc(doc)}
                                        className={`p-4 rounded-xl border transition-all cursor-pointer group ${selectedDoc?.id === doc.id
                                            ? "border-[#0247ae] bg-blue-50/50"
                                            : "border-gray-200 hover:border-gray-300 bg-white"
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                                <FileIcon size={24} className="text-gray-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-gray-900 truncate">{doc.file_name}</h4>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-xs text-gray-500 capitalize">{doc.document_type}</span>
                                                    <span className="text-xs text-gray-400">•</span>
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(doc.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {getStatusBadge(doc.status)}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeDocument(doc.id);
                                                    }}
                                                    className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
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
                    <div className="flex-1 overflow-hidden">
                        {selectedDoc.file_name.toLowerCase().endsWith(".pdf") ? (
                            <PdfPreview url={selectedDoc.file_url} fileName={selectedDoc.file_name} />
                        ) : selectedDoc.file_name.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                            <div className="h-full flex items-center justify-center p-4 bg-gray-100">
                                <img
                                    src={selectedDoc.file_url}
                                    alt={selectedDoc.file_name}
                                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                                />
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                                <div className="h-20 w-20 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                                    <Eye size={32} className="text-gray-400" />
                                </div>
                                <p className="text-gray-500 text-sm">Preview not available for this file type</p>
                                <p className="text-gray-400 text-xs mt-1">Click download to view the file</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
