"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Loader2, FileX } from "lucide-react";
import { Button } from "@/components/ui/button";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Set PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfPreviewProps {
    url: string;
    fileName?: string;
}

export function PdfPreview({ url, fileName }: PdfPreviewProps) {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setLoading(false);
        setError(false);
    };

    const onDocumentLoadError = () => {
        setLoading(false);
        setError(true);
    };

    const goToPrevPage = () => setPageNumber((prev) => Math.max(1, prev - 1));
    const goToNextPage = () => setPageNumber((prev) => Math.min(numPages || 1, prev + 1));
    const zoomIn = () => setScale((prev) => Math.min(2, prev + 0.2));
    const zoomOut = () => setScale((prev) => Math.max(0.5, prev - 0.2));

    if (error) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="h-16 w-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
                    <FileX size={32} className="text-red-400" />
                </div>
                <p className="text-gray-600 font-medium">Unable to load PDF</p>
                <p className="text-sm text-gray-400 mt-1">The file may be corrupted or inaccessible</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* Controls */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={goToPrevPage}
                        disabled={pageNumber <= 1}
                        className="h-8 w-8 p-0"
                    >
                        <ChevronLeft size={16} />
                    </Button>
                    <span className="text-sm text-gray-600 min-w-[80px] text-center">
                        {pageNumber} / {numPages || "?"}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={goToNextPage}
                        disabled={pageNumber >= (numPages || 1)}
                        className="h-8 w-8 p-0"
                    >
                        <ChevronRight size={16} />
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={zoomOut} className="h-8 w-8 p-0">
                        <ZoomOut size={16} />
                    </Button>
                    <span className="text-sm text-gray-600 min-w-[50px] text-center">
                        {Math.round(scale * 100)}%
                    </span>
                    <Button variant="outline" size="sm" onClick={zoomIn} className="h-8 w-8 p-0">
                        <ZoomIn size={16} />
                    </Button>
                </div>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 overflow-auto flex items-start justify-center p-4 bg-gray-100">
                {loading && (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-[#0247ae]" />
                    </div>
                )}
                <Document
                    file={url}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={null}
                    className="shadow-lg"
                >
                    <Page
                        pageNumber={pageNumber}
                        scale={scale}
                        loading={null}
                        className="bg-white"
                    />
                </Document>
            </div>
        </div>
    );
}
