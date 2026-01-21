#!/bin/bash
set -e

echo "Building Next.js app..."
npm run build

echo "Syncing to S3..."
aws s3 sync out/ s3://$(cd infrastructure/frontend && terraform output -raw s3_bucket_name) --delete

echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id $(cd infrastructure/frontend && terraform output -raw cloudfront_distribution_id) \
  --paths "/*"

echo "Frontend deployment complete!"
