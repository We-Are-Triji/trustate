"use client";

import { useState, useCallback } from "react";
import { Upload, FileText, Image, File, X, Eye, Download, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Document {
    id: string;
    name: string;
    type: string;
    size: number;
    uploadedAt: string;
    status: "pending" | "verified" | "rejected";
}

interface DocumentVaultProps {
    transactionId: string;
}

export function DocumentVault({ transactionId }: DocumentVaultProps) {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

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
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            handleFiles(files);
        }
    };

    const handleFiles = (files: File[]) => {
        const newDocs: Document[] = files.map((file, index) => ({
            id: `doc-${Date.now()}-${index}`,
            name: file.name,
            type: file.type,
            size: file.size,
            uploadedAt: new Date().toISOString(),
            status: "pending" as const,
        }));

        setDocuments((prev) => [...prev, ...newDocs]);
    };

    const removeDocument = (id: string) => {
        setDocuments((prev) => prev.filter((doc) => doc.id !== id));
        if (selectedDoc?.id === id) {
            setSelectedDoc(null);
        }
    };

    const getFileIcon = (type: string) => {
        if (type.startsWith("image/")) return Image;
        if (type.includes("pdf")) return FileText;
        return File;
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const getStatusBadge = (status: Document["status"]) => {
        switch (status) {
            case "verified":
                return <Badge className="bg-green-100 text-green-700 border-0">Verified</Badge>;
            case "rejected":
                return <Badge className="bg-red-100 text-red-700 border-0">Rejected</Badge>;
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
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        />
                        <Button className="bg-[#0247ae] hover:bg-[#0560d4] text-white cursor-pointer" asChild>
                            <span>
                                <Plus size={16} className="mr-2" />
                                Upload
                            </span>
                        </Button>
                    </label>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {documents.length === 0 ? (
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`h-full min-h-[300px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all ${isDragging
                                    ? "border-[#0247ae] bg-blue-50"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                        >
                            <div className={`h-16 w-16 rounded-full flex items-center justify-center mb-4 ${isDragging ? "bg-[#0247ae]/10" : "bg-gray-100"
                                }`}>
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
                                const FileIcon = getFileIcon(doc.type);
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
                                                <h4 className="font-medium text-gray-900 truncate">{doc.name}</h4>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-xs text-gray-500">{formatFileSize(doc.size)}</span>
                                                    <span className="text-xs text-gray-400">•</span>
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(doc.uploadedAt).toLocaleDateString()}
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
                    <div className="p-6 border-b border-gray-100 bg-white flex items-center justify-between">
                        <div className="min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">{selectedDoc.name}</h3>
                            <p className="text-sm text-gray-500">{formatFileSize(selectedDoc.size)}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                                <Download size={16} className="mr-2" />
                                Download
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedDoc(null)}
                            >
                                <X size={16} />
                            </Button>
                        </div>
                    </div>
                    <div className="flex-1 flex items-center justify-center p-8">
                        <div className="text-center">
                            <div className="h-20 w-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                <Eye size={32} className="text-gray-400" />
                            </div>
                            <p className="text-gray-500 text-sm">
                                Document preview will be available here
                            </p>
                            <p className="text-gray-400 text-xs mt-1">
                                (PDF viewer integration coming soon)
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
