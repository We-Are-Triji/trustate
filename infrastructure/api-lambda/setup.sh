#!/bin/bash
set -e

# Load .env from root
if [ -f "../../.env" ]; then
  export $(grep -v '^#' ../../.env | xargs)
fi

# Create terraform.tfvars
cat > terraform.tfvars <<EOF
supabase_url              = "${NEXT_PUBLIC_SUPABASE_URL}"
supabase_service_role_key = "${SUPABASE_SERVICE_ROLE_KEY}"
aws_region                = "ap-southeast-1"
EOF

echo "terraform.tfvars created from .env"
