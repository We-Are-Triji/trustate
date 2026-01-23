"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Camera, ArrowLeft, CheckCircle, HelpCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const isDev = process.env.NODE_ENV === "development";

interface FaceVerificationContentProps {
  onComplete: (faceImage: File) => void;
  onBack: () => void;
  onDevBypass?: () => void;
}

export function FaceVerificationContent({ onComplete, onBack, onDevBypass }: FaceVerificationContentProps) {
  const [faceImage, setFaceImage] = useState<File | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  const stopAllStreams = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      stopAllStreams();
    };
  }, [stopAllStreams]);

  const handleDevBypass = () => {
    const timestamp = Date.now();
    const fakeBlob = new Blob(['fake-face-image'], { type: 'image/png' });
    const fakeFace = new File([fakeBlob], `face-${timestamp}.png`, { type: 'image/png' });
    setFaceImage(fakeFace);
    
    setTimeout(() => {
      onComplete(fakeFace);
    }, 100);
  };

  const handleCapture = (file: File) => {
    stopAllStreams();
    setFaceImage(file);
    setShowCamera(false);
  };

  const handleCancel = () => {
    stopAllStreams();
    setShowCamera(false);
  };

  const handleBack = () => {
    stopAllStreams();
    onBack();
  };

  const handleSubmit = () => {
    stopAllStreams();
    if (faceImage) onComplete(faceImage);
  };

  const tips = [
    "Good lighting on your face",
    "Remove glasses or hats",
    "Look directly at camera",
    "Neutral expression"
  ];

  return (
    <>
      <CardHeader className="pb-1 pt-5 animate-[fadeInUp_0.5s_ease-out]">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <CardTitle className="text-2xl font-bold text-[#0247ae] font-[family-name:var(--font-arsenal-sc)]">
              Face Verification
            </CardTitle>
            <p className="text-gray-500 text-sm">Capture your face to verify your identity</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col px-6 pb-4">
        {!showCamera ? (
          <div className="grid grid-cols-2 gap-x-8 flex-1">
            {/* Left Column - Tips */}
            <div className="space-y-3 animate-[fadeInUp_0.5s_ease-out_0.1s_both]">
              <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
                <Camera className="h-4 w-4 text-[#0247ae]" />
                <h3 className="font-semibold text-[#0247ae] text-sm">Tips for best results</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="ml-auto text-gray-400 hover:text-[#0247ae] transition-colors">
                        <HelpCircle className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-xs bg-[#0247ae] text-white p-3 rounded-lg">
                      <p className="font-semibold mb-1">Why do we need this?</p>
                      <p className="text-xs leading-relaxed opacity-90">
                        Face verification confirms you are a real person and that your identity matches the ID you uploaded. 
                        This protects against fraud and ensures secure transactions.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {tips.map((tip, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-lg bg-gray-50 p-2.5">
                    <div className="h-5 w-5 rounded-full bg-[#ffce08]/20 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-[#d4a900]" />
                    </div>
                    <span className="text-xs text-gray-600">{tip}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-lg bg-[#0247ae]/5 p-3 border border-[#0247ae]/10">
                <p className="text-xs text-gray-600 leading-relaxed">
                  <span className="font-medium text-[#0247ae]">Privacy:</span> Your photo is only used for verification and is securely stored.
                </p>
              </div>
            </div>

            {/* Right Column - Camera Preview */}
            <div className="flex flex-col items-center justify-center animate-[fadeInUp_0.5s_ease-out_0.2s_both]">
              <div className={`w-36 h-36 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
                faceImage 
                  ? "bg-[#ffce08]/10 border-4 border-[#ffce08]" 
                  : "bg-gray-50 border-4 border-dashed border-gray-200"
              }`}>
                {faceImage ? (
                  <div className="flex flex-col items-center">
                    <CheckCircle className="h-12 w-12 text-[#ffce08]" />
                    <span className="text-[#d4a900] text-xs font-medium mt-1">Captured</span>
                  </div>
                ) : (
                  <Camera className="h-14 w-14 text-gray-300" />
                )}
              </div>
              <Button
                type="button"
                onClick={() => setShowCamera(true)}
                className={`h-9 px-6 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  faceImage
                    ? "bg-white border-2 border-[#0247ae] text-[#0247ae] hover:bg-[#0247ae]/5"
                    : "bg-[#0247ae] text-white hover:bg-[#023a8a] shadow-lg shadow-[#0247ae]/25"
                }`}
              >
                <Camera className="mr-2 h-4 w-4" />
                {faceImage ? "Retake" : "Start Camera"}
              </Button>
            </div>
          </div>
        ) : (
          <FaceCapture 
            onCapture={handleCapture} 
            onCancel={handleCancel}
            streamRef={streamRef}
          />
        )}

        <div className="flex items-center justify-between pt-4 mt-3 border-t border-gray-100 animate-[fadeInUp_0.5s_ease-out_0.3s_both]">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="h-9 px-4 text-gray-600 hover:text-[#0247ae] hover:border-[#0247ae]"
          >
            <ArrowLeft size={16} className="mr-1" />
            Previous
          </Button>
          <div className="flex gap-2">
            {isDev && onDevBypass && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDevBypass}
                className="border-dashed border-orange-400 text-orange-600 hover:bg-orange-50 h-9"
              >
                [DEV] Fill & Skip
              </Button>
            )}
            <Button
              onClick={handleSubmit}
              disabled={!faceImage}
              className="bg-[#0247ae] hover:bg-[#023a8a] active:bg-[#022d6e] px-6 h-9 text-sm font-semibold shadow-lg shadow-[#0247ae]/25 hover:shadow-xl hover:shadow-[#0247ae]/30 transition-all duration-200 disabled:opacity-50 disabled:shadow-none"
            >
              Continue
            </Button>
          </div>
        </div>
      </CardContent>
    </>
  );
}

interface FaceCaptureProps {
  onCapture: (file: File) => void;
  onCancel: () => void;
  streamRef: React.MutableRefObject<MediaStream | null>;
}

function FaceCapture({ onCapture, onCancel, streamRef }: FaceCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const stopStream = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }
  }, [streamRef]);

  useEffect(() => {
    let mounted = true;
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (!mounted) {
          mediaStream.getTracks().forEach((t) => t.stop());
          return;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        streamRef.current = mediaStream;
      } catch {
        console.error("Camera access denied");
      }
    };
    startCamera();
    return () => {
      mounted = false;
      stopStream();
    };
  }, [streamRef, stopStream]);

  const capture = () => {
    setIsScanning(true);
    setTimeout(() => {
      const video = videoRef.current;
      if (!video) return;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d")?.drawImage(video, 0, 0);
      stopStream();
      canvas.toBlob((blob) => {
        if (blob) onCapture(new File([blob], "face.jpg", { type: "image/jpeg" }));
      }, "image/jpeg");
    }, 2000);
  };

  const handleCancelClick = () => {
    stopStream();
    onCancel();
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center animate-[fadeInScale_0.3s_ease-out]">
      <div className="relative w-full max-w-md aspect-video overflow-hidden rounded-xl bg-black shadow-xl">
        <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
        <div className="absolute inset-0 border-2 border-white/20 rounded-xl pointer-events-none" />
        
        {isScanning && (
          <>
            <div className="absolute inset-0 bg-[#0247ae]/10 pointer-events-none" />
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#0247ae] to-transparent animate-[scanLine_1.5s_ease-in-out_infinite]" 
                 style={{ top: '0%', animation: 'scanLine 1.5s ease-in-out infinite' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-white text-sm font-medium flex items-center gap-2">
                  <span className="h-2 w-2 bg-[#0247ae] rounded-full animate-pulse" />
                  Scanning face...
                </p>
              </div>
            </div>
          </>
        )}
        
        <div className="absolute bottom-3 left-0 right-0 text-center">
          <span className="rounded-full bg-black/60 px-3 py-1.5 text-xs text-white backdrop-blur-sm">
            {isScanning ? "Hold still..." : "Position your face in the center"}
          </span>
        </div>
      </div>
      <div className="flex gap-3 mt-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleCancelClick} 
          disabled={isScanning}
          className="h-9 px-5 rounded-lg border-2"
        >
          Cancel
        </Button>
        <Button 
          size="sm"
          onClick={capture} 
          disabled={isScanning}
          className="h-9 px-5 rounded-lg bg-[#0247ae] hover:bg-[#023a8a] shadow-lg shadow-[#0247ae]/25 font-semibold"
        >
          <Camera className="mr-2 h-4 w-4" />
          {isScanning ? "Scanning..." : "Capture"}
        </Button>
      </div>
      
      <style jsx>{`
        @keyframes scanLine {
          0%, 100% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          50% { top: 100%; }
        }
      `}</style>
    </div>
  );
}
