#!/bin/bash
set -e

cd "$(dirname "$0")/../lambda/api"

echo "Installing dependencies..."
npm install

echo "Building Lambda..."
npx esbuild index.ts --bundle --platform=node --target=node20 --outfile=dist/index.js --external:@aws-sdk/*

echo "Creating deployment package..."
cd dist
zip -r ../api-lambda.zip index.js
cd ..

echo "Build complete: api-lambda.zip"
