const API_BASE = process.env.NEXT_PUBLIC_VERIFICATION_API_URL || "";

interface UploadUrlResponse {
  uploadUrl: string;
  key: string;
}

interface AnalyzeIdResponse {
  extracted: Record<string, string>;
}

interface LivenessSessionResponse {
  sessionId: string;
}

interface LivenessResultsResponse {
  status: string;
  confidence: number;
  referenceImage?: {
    Bytes: string;
  };
}

interface CompareFacesResponse {
  verified: boolean;
  needsReview: boolean;
  similarity: number;
  status: "verified" | "review" | "rejected" | "no_match";
}

async function apiRequest<T>(endpoint: string, body: object): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

export async function getUploadUrl(
  userId: string,
  documentType: string,
  contentType: string
): Promise<UploadUrlResponse> {
  return apiRequest("/verify/upload-url", { userId, documentType, contentType });
}

export async function uploadDocument(uploadUrl: string, file: File): Promise<void> {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });

  if (!response.ok) {
    throw new Error("Upload failed");
  }
}

export async function analyzeId(s3Key: string): Promise<AnalyzeIdResponse> {
  return apiRequest("/verify/analyze-id", { s3Key });
}

export async function createLivenessSession(): Promise<LivenessSessionResponse> {
  return apiRequest("/verify/liveness-session", {});
}

export async function getLivenessResults(sessionId: string): Promise<LivenessResultsResponse> {
  return apiRequest("/verify/liveness-session", { action: "get-results", sessionId });
}

export async function compareFaces(
  idImageKey: string,
  livenessImageBytes: string
): Promise<CompareFacesResponse> {
  return apiRequest("/verify/compare-faces", { idImageKey, livenessImageBytes });
}
