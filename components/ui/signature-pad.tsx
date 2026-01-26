"use client";

import { useRef, useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Eraser, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SignaturePadProps {
    onSave: (signatureData: string) => void;
    onCancel: () => void;
    title?: string;
    description?: string;
}

export function SignaturePad({ onSave, onCancel, title = "Sign Document", description = "Please sign within the box below." }: SignaturePadProps) {
    const sigPad = useRef<SignatureCanvas>(null);
    const [isEmpty, setIsEmpty] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(300);

    // Responsive width
    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setWidth(containerRef.current.clientWidth);
            }
        };

        updateWidth();
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, []);

    const clear = () => {
        sigPad.current?.clear();
        setIsEmpty(true);
    };

    const save = () => {
        if (sigPad.current && !sigPad.current.isEmpty()) {
            // Save as PNG
            const dataUrl = sigPad.current.getTrimmedCanvas().toDataURL("image/png");
            onSave(dataUrl);
        }
    };

    const handleEnd = () => {
        if (sigPad.current) {
            setIsEmpty(sigPad.current.isEmpty());
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500">{description}</p>
            </div>

            <div
                ref={containerRef}
                className="border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 overflow-hidden relative"
                style={{ height: 200 }}
            >
                <SignatureCanvas
                    ref={sigPad}
                    canvasProps={{
                        width: width,
                        height: 200,
                        className: "cursor-crosshair active:cursor-grabbing"
                    }}
                    onEnd={handleEnd}
                    penColor="black"
                    backgroundColor="rgba(0,0,0,0)"
                />

                {isEmpty && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                        <span className="text-2xl font-handwriting text-gray-400">Sign Here</span>
                    </div>
                )}
            </div>

            <div className="flex gap-3 justify-end">
                <Button
                    variant="outline"
                    onClick={clear}
                    disabled={isEmpty}
                    className="text-gray-600"
                    size="sm"
                >
                    <Eraser size={16} className="mr-2" />
                    Clear
                </Button>
                <Button
                    variant="ghost"
                    onClick={onCancel}
                    size="sm"
                >
                    Cancel
                </Button>
                <Button
                    onClick={save}
                    disabled={isEmpty}
                    className="bg-[#0247ae] hover:bg-[#023a8a] text-white"
                    size="sm"
                >
                    <Check size={16} className="mr-2" />
                    Adopt & Sign
                </Button>
            </div>
        </div>
    );
}
