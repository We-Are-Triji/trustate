#!/bin/bash

# Load .env from root
if [ -f "../../.env" ]; then
  export $(grep -v '^#' ../../.env | xargs)
fi

# Create terraform.tfvars
cat > terraform.tfvars <<EOF
cognito_user_pool_id = "${NEXT_PUBLIC_COGNITO_USER_POOL_ID}"
aws_region          = "ap-southeast-1"
EOF

echo "terraform.tfvars created from .env"
