"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type FaceDirection = "front" | "left" | "right";

const FACE_STEPS: { direction: FaceDirection; label: string }[] = [
  { direction: "front", label: "Look straight" },
  { direction: "left", label: "Turn left" },
  { direction: "right", label: "Turn right" },
];

interface FaceVerificationFormProps {
  onComplete: (faceImage: File) => void;
  onBack: () => void;
}

export function FaceVerificationForm({ onComplete, onBack }: FaceVerificationFormProps) {
  const [faceStep, setFaceStep] = useState(0);
  const [faceImages, setFaceImages] = useState<Record<FaceDirection, File | null>>({
    front: null,
    left: null,
    right: null,
  });
  const [showCamera, setShowCamera] = useState(false);

  const handleFaceCapture = (file: File) => {
    const direction = FACE_STEPS[faceStep].direction;
    setFaceImages((prev) => ({ ...prev, [direction]: file }));
    if (faceStep < FACE_STEPS.length - 1) {
      setFaceStep(faceStep + 1);
    } else {
      setShowCamera(false);
    }
  };

  const allFacesCaptured = Object.values(faceImages).every(Boolean);

  const handleSubmit = () => {
    if (allFacesCaptured && faceImages.front) {
      onComplete(faceImages.front);
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
            <p className="text-sm text-gray-500">Step 3 of 3: Capture your face</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!showCamera ? (
          <div className="space-y-3">
            {FACE_STEPS.map((step) => (
              <div
                key={step.direction}
                className="flex items-center gap-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4"
              >
                {faceImages[step.direction] ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                )}
                <span className="text-sm text-gray-600">{step.label}</span>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFaceStep(0);
                setShowCamera(true);
              }}
              className="w-full border-[#E2E8F0]"
            >
              <Camera className="mr-2 h-4 w-4" />
              {allFacesCaptured ? "Retake Photos" : "Start Camera"}
            </Button>
          </div>
        ) : (
          <FaceCapture
            direction={FACE_STEPS[faceStep].direction}
            label={FACE_STEPS[faceStep].label}
            onCapture={handleFaceCapture}
            onCancel={() => setShowCamera(false)}
          />
        )}

        <Button
          onClick={handleSubmit}
          disabled={!allFacesCaptured}
          className="w-full bg-gray-800 hover:bg-gray-900"
        >
          Complete Registration
        </Button>
      </CardContent>
    </Card>
  );
}

interface FaceCaptureProps {
  direction: FaceDirection;
  label: string;
  onCapture: (file: File) => void;
  onCancel: () => void;
}

function FaceCapture({ direction, label, onCapture, onCancel }: FaceCaptureProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      const video = videoRef.current;
      if (!video) return;
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = mediaStream;
        setStream(mediaStream);
      } catch {
        console.error("Camera access denied");
      }
    };
    startCamera();
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
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
        const file = new File([blob], `face-${direction}.jpg`, { type: "image/jpeg" });
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
          <span className="rounded bg-black/50 px-3 py-1 text-sm text-white">{label}</span>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={stopCamera} className="flex-1">
          Cancel
        </Button>
        <Button onClick={capture} className="flex-1 bg-gray-800 hover:bg-gray-900">
          Capture
        </Button>
      </div>
    </div>
  );
}
