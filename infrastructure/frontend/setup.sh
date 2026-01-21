#!/bin/bash
set -e

# Get API endpoint from api-lambda terraform output
API_ENDPOINT=$(cd ../api-lambda && terraform output -raw api_endpoint)

# Load .env from root
if [ -f "../../.env" ]; then
  export $(grep -v '^#' ../../.env | xargs)
fi

# Create terraform.tfvars
cat > terraform.tfvars <<EOF
domain_name  = "trustate.com"
api_endpoint = "${API_ENDPOINT}"
aws_region   = "ap-southeast-1"
EOF

echo "terraform.tfvars created"
echo "API endpoint: ${API_ENDPOINT}"
