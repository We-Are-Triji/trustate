#!/bin/bash
set -e

echo "Building Next.js app..."
npm run build

echo "Getting S3 bucket and CloudFront ID from Terraform..."
cd infrastructure/frontend
S3_BUCKET=$(terraform output -raw s3_bucket_name)
CF_DIST_ID=$(terraform output -raw cloudfront_distribution_id)
cd ../..

echo "Deploying to S3: $S3_BUCKET"
aws s3 sync out/ s3://$S3_BUCKET \
  --delete \
  --cache-control "public,max-age=31536000,immutable" \
  --exclude "*.html" \
  --exclude "*.json"

aws s3 sync out/ s3://$S3_BUCKET \
  --cache-control "public,max-age=0,must-revalidate" \
  --exclude "*" \
  --include "*.html" \
  --include "*.json"

echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id $CF_DIST_ID \
  --paths "/*"

echo "✅ Deployment complete!"
