"use client";

import { useRef, useState, useEffect } from "react";
import { Eraser, Download, Check, X, Type, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

interface SignaturePadProps {
    isOpen: boolean;
    onClose: () => void;
    onSign: (signatureDataUrl: string) => void;
    documentName?: string;
}

type SignatureMode = "draw" | "type";

export function SignaturePad({ isOpen, onClose, onSign, documentName }: SignaturePadProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [mode, setMode] = useState<SignatureMode>("draw");
    const [typedName, setTypedName] = useState("");
    const [hasSignature, setHasSignature] = useState(false);

    useEffect(() => {
        if (isOpen && mode === "draw") {
            initCanvas();
        }
    }, [isOpen, mode]);

    const initCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set canvas size
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        // Configure drawing style
        ctx.strokeStyle = "#1a1a2e";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        setIsDrawing(true);
        setHasSignature(true);

        const rect = canvas.getBoundingClientRect();
        const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
        const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
        const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasSignature(false);
    };

    const handleConfirm = () => {
        let signatureDataUrl = "";

        if (mode === "draw") {
            const canvas = canvasRef.current;
            if (canvas) {
                signatureDataUrl = canvas.toDataURL("image/png");
            }
        } else {
            // Generate typed signature as image
            const canvas = document.createElement("canvas");
            canvas.width = 400;
            canvas.height = 100;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.font = "italic 32px 'Brush Script MT', cursive, sans-serif";
                ctx.fillStyle = "#1a1a2e";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(typedName, canvas.width / 2, canvas.height / 2);
                signatureDataUrl = canvas.toDataURL("image/png");
            }
        }

        onSign(signatureDataUrl);
        onClose();
        clearCanvas();
        setTypedName("");
    };

    const canConfirm = mode === "draw" ? hasSignature : typedName.trim().length > 0;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <PenTool size={20} className="text-[#0247ae]" />
                        Sign Document
                    </DialogTitle>
                    {documentName && (
                        <p className="text-sm text-gray-500 mt-1">
                            Signing: <span className="font-medium text-gray-700">{documentName}</span>
                        </p>
                    )}
                </DialogHeader>

                {/* Mode Toggle */}
                <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                    <button
                        onClick={() => setMode("draw")}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${mode === "draw"
                                ? "bg-white text-[#0247ae] shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        <PenTool size={16} />
                        Draw
                    </button>
                    <button
                        onClick={() => setMode("type")}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${mode === "type"
                                ? "bg-white text-[#0247ae] shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        <Type size={16} />
                        Type
                    </button>
                </div>

                {/* Signature Area */}
                <div className="border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 overflow-hidden">
                    {mode === "draw" ? (
                        <div className="relative">
                            <canvas
                                ref={canvasRef}
                                className="w-full h-40 cursor-crosshair touch-none"
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={stopDrawing}
                                onMouseLeave={stopDrawing}
                                onTouchStart={startDrawing}
                                onTouchMove={draw}
                                onTouchEnd={stopDrawing}
                            />
                            {!hasSignature && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <p className="text-gray-400 text-sm">Draw your signature here</p>
                                </div>
                            )}
                            <button
                                onClick={clearCanvas}
                                className="absolute top-2 right-2 p-2 rounded-lg bg-white/80 text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm"
                            >
                                <Eraser size={16} />
                            </button>
                        </div>
                    ) : (
                        <div className="p-6">
                            <Input
                                value={typedName}
                                onChange={(e) => setTypedName(e.target.value)}
                                placeholder="Type your full name"
                                className="text-center text-lg"
                            />
                            {typedName && (
                                <div className="mt-4 p-4 bg-white rounded-lg border border-gray-100 text-center">
                                    <p
                                        className="text-2xl text-gray-800"
                                        style={{ fontFamily: "'Brush Script MT', cursive, sans-serif", fontStyle: "italic" }}
                                    >
                                        {typedName}
                                    </p>
                                    <p className="text-[10px] text-gray-400 mt-2">Preview</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <p className="text-xs text-gray-500 text-center">
                    By signing, you acknowledge that you have read and agree to the terms of this document.
                </p>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={onClose}>
                        <X size={16} className="mr-2" />
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={!canConfirm}
                        className="bg-[#0247ae] hover:bg-[#023a8a]"
                    >
                        <Check size={16} className="mr-2" />
                        Apply Signature
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
