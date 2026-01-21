#!/bin/bash
set -e

# Get API endpoint from api-lambda terraform output
API_ENDPOINT=$(cd ../api-lambda && terraform output -raw api_endpoint)

# Create terraform.tfvars
cat > terraform.tfvars <<EOF
domain_name  = "your-domain.com"
api_endpoint = "${API_ENDPOINT}"
aws_region   = "ap-southeast-1"
EOF

echo "terraform.tfvars created"
echo "API endpoint: ${API_ENDPOINT}"
echo ""
echo "Edit terraform.tfvars to set your domain name (or remove domain_name and aliases from main.tf for CloudFront default domain)"
