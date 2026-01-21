#!/bin/bash
set -e

# Load .env from root
if [ -f "../../.env" ]; then
  export $(grep -v '^#' ../../.env | xargs)
fi

# Get AWS account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_REPO="${AWS_ACCOUNT_ID}.dkr.ecr.ap-southeast-1.amazonaws.com/trustate"

# Create terraform.tfvars
cat > terraform.tfvars <<EOF
ecr_repository_url    = "${ECR_REPO}"
cognito_user_pool_id  = "${NEXT_PUBLIC_COGNITO_USER_POOL_ID}"
cognito_client_id     = "${NEXT_PUBLIC_COGNITO_CLIENT_ID}"
supabase_url          = "${NEXT_PUBLIC_SUPABASE_URL}"
supabase_anon_key     = "${NEXT_PUBLIC_SUPABASE_ANON_KEY}"
supabase_service_key  = "${SUPABASE_SERVICE_ROLE_KEY}"
websocket_url         = "${NEXT_PUBLIC_WEBSOCKET_URL}"
aws_region            = "ap-southeast-1"
EOF

echo "terraform.tfvars created"
