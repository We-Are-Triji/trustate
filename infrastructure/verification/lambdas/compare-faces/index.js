const { RekognitionClient, CompareFacesCommand, DetectFacesCommand } = require("@aws-sdk/client-rekognition");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");

const rekognition = new RekognitionClient({});
const s3 = new S3Client({});
const BUCKET = process.env.S3_BUCKET;

const SIMILARITY_THRESHOLD = 90;
const REVIEW_THRESHOLD = 80;

exports.handler = async (event) => {
  try {
    const { idImageKey, livenessImageBytes } = JSON.parse(event.body);

    if (!idImageKey || !livenessImageBytes) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required images" }),
      };
    }

    const idImageBytes = await getS3Object(idImageKey);

    const command = new CompareFacesCommand({
      SourceImage: { Bytes: idImageBytes },
      TargetImage: { Bytes: Buffer.from(livenessImageBytes, "base64") },
      SimilarityThreshold: REVIEW_THRESHOLD,
    });

    const result = await rekognition.send(command);
    const match = result.FaceMatches?.[0];

    if (!match) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          verified: false,
          status: "no_match",
          message: "No face match found",
        }),
      };
    }

    const similarity = match.Similarity;
    const verified = similarity >= SIMILARITY_THRESHOLD;
    const needsReview = similarity >= REVIEW_THRESHOLD && similarity < SIMILARITY_THRESHOLD;

    return {
      statusCode: 200,
      body: JSON.stringify({
        verified,
        needsReview,
        similarity,
        status: verified ? "verified" : needsReview ? "review" : "rejected",
      }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Face comparison failed" }),
    };
  }
};

async function getS3Object(key) {
  const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  const response = await s3.send(command);
  return Buffer.from(await response.Body.transformToByteArray());
}
