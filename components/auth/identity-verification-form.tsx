"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Camera, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PH_VALID_IDS, type PhilippineID } from "@/lib/types/registration";

interface IdentityVerificationFormProps {
  onComplete: (data: { idType: PhilippineID; idImage: File; faceImage: File }) => void;
}

type FaceDirection = "front" | "left" | "right";

const FACE_STEPS: { direction: FaceDirection; label: string }[] = [
  { direction: "front", label: "Look straight" },
  { direction: "left", label: "Turn left" },
  { direction: "right", label: "Turn right" },
];

export function IdentityVerificationForm({ onComplete }: IdentityVerificationFormProps) {
  const [idType, setIdType] = useState<PhilippineID | "">("");
  const [idImage, setIdImage] = useState<File | null>(null);
  const [faceStep, setFaceStep] = useState(0);
  const [faceImages, setFaceImages] = useState<Record<FaceDirection, File | null>>({
    front: null,
    left: null,
    right: null,
  });
  const [showCamera, setShowCamera] = useState(false);

  const handleIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setIdImage(file);
  };

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
  const canSubmit = idType && idImage && allFacesCaptured;

  const handleSubmit = () => {
    if (canSubmit && faceImages.front) {
      onComplete({
        idType: idType as PhilippineID,
        idImage: idImage!,
        faceImage: faceImages.front,
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl border-[#E2E8F0] bg-white shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-center text-xl font-semibold text-gray-800">
          Identity Verification
        </CardTitle>
        <p className="text-center text-sm text-gray-500">Step 3 of 3: Verify your identity</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label className="text-sm text-gray-600">Government ID Type</Label>
            <Select value={idType} onValueChange={(v) => setIdType(v as PhilippineID)}>
              <SelectTrigger className="border-[#E2E8F0] bg-[#F8FAFC]">
                <SelectValue placeholder="Select ID type" />
              </SelectTrigger>
              <SelectContent>
                {PH_VALID_IDS.map((id) => (
                  <SelectItem key={id} value={id}>
                    {id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Label className="text-sm text-gray-600">Upload ID Photo</Label>
            <label className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#CBD5E1]">
              <input type="file" accept="image/*" onChange={handleIdUpload} className="hidden" />
              {idImage ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle size={20} />
                  <span className="text-sm">{idImage.name}</span>
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-500">Click to upload</span>
                </>
              )}
            </label>
          </div>

          <div className="space-y-3">
            <Label className="text-sm text-gray-600">Face Verification</Label>
            {!showCamera ? (
              <div className="space-y-2">
                {FACE_STEPS.map((step, i) => (
                  <div
                    key={step.direction}
                    className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3"
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
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!canSubmit}
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
          id="face-video"
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
