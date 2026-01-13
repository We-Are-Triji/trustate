const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const crypto = require("crypto");

const s3 = new S3Client({});
const BUCKET = process.env.S3_BUCKET;

exports.handler = async (event) => {
  try {
    const { userId, documentType, contentType } = JSON.parse(event.body);

    if (!userId || !documentType || !contentType) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    const key = `temp/${userId}/${documentType}-${crypto.randomUUID()}`;
    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

    return {
      statusCode: 200,
      body: JSON.stringify({ uploadUrl, key }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to generate upload URL" }),
    };
  }
};
