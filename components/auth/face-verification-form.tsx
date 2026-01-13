"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FaceVerificationFormProps {
  onComplete: (faceImage: File) => void;
  onBack: () => void;
  stepInfo?: { current: number; total: number };
}

export function FaceVerificationForm({ onComplete, onBack, stepInfo }: FaceVerificationFormProps) {
  const [faceImage, setFaceImage] = useState<File | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  const handleCapture = (file: File) => {
    setFaceImage(file);
    setShowCamera(false);
  };

  const handleSubmit = () => {
    if (faceImage) {
      onComplete(faceImage);
    }
  };

  return (
    <Card className="w-full max-w-md border-[#E2E8F0] bg-white shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mr-2 h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft size={18} />
          </Button>
          <div className="flex-1 text-center pr-10">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Face Verification
            </CardTitle>
            <p className="text-sm text-gray-500">
              Step {stepInfo?.current ?? 3} of {stepInfo?.total ?? 3}: Capture your face
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!showCamera ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
              <p className="font-medium mb-2">Why do we need this?</p>
              <p>
                This step verifies you are a real person and helps us confirm your identity 
                matches the ID you uploaded. Your photo will be compared against your 
                government ID for security purposes.
              </p>
            </div>

            <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-sm text-gray-600">
              <p className="font-medium text-gray-700 mb-2">Instructions:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Ensure good lighting on your face</li>
                <li>Remove glasses or hats if possible</li>
                <li>Look directly at the camera</li>
                <li>Keep a neutral expression</li>
              </ul>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCamera(true)}
              className="w-full border-[#E2E8F0] hover:bg-gray-50 active:bg-gray-100"
            >
              <Camera className="mr-2 h-4 w-4" />
              {faceImage ? "Retake Photo" : "Start Camera"}
            </Button>
          </div>
        ) : (
          <FaceCapture onCapture={handleCapture} onCancel={() => setShowCamera(false)} />
        )}

        <Button
          onClick={handleSubmit}
          disabled={!faceImage}
          className="w-full bg-gray-800 hover:bg-gray-900 active:bg-gray-950"
        >
          {stepInfo && stepInfo.current < stepInfo.total ? "Continue" : "Complete Registration"}
        </Button>
      </CardContent>
    </Card>
  );
}

interface FaceCaptureProps {
  onCapture: (file: File) => void;
  onCancel: () => void;
}

function FaceCapture({ onCapture, onCancel }: FaceCaptureProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      const video = videoRef.current;
      if (!video) return;
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = mediaStream;
        streamRef.current = mediaStream;
        setStream(mediaStream);
      } catch {
        console.error("Camera access denied");
      }
    };
    startCamera();
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const capture = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "face.jpg", { type: "image/jpeg" });
        onCapture(file);
      }
    }, "image/jpeg");
  };

  const stopCamera = () => {
    stream?.getTracks().forEach((t) => t.stop());
    onCancel();
  };

  return (
    <div className="space-y-3">
      <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-2 left-0 right-0 text-center">
          <span className="rounded bg-black/50 px-3 py-1 text-sm text-white">Look straight at the camera</span>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={stopCamera} className="flex-1 hover:bg-gray-50 active:bg-gray-100">
          Cancel
        </Button>
        <Button onClick={capture} className="flex-1 bg-gray-800 hover:bg-gray-900 active:bg-gray-950">
          Capture
        </Button>
      </div>
    </div>
  );
}
