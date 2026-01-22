#!/bin/bash
set -e

if [ -f "../../.env" ]; then
  export $(grep -v '^#' ../../.env | xargs)
fi

cat > terraform.tfvars <<EOF
github_repo          = "https://github.com/YOUR_USERNAME/trustate"
github_token         = "YOUR_GITHUB_TOKEN"
cognito_user_pool_id = "${NEXT_PUBLIC_COGNITO_USER_POOL_ID}"
cognito_client_id    = "${NEXT_PUBLIC_COGNITO_CLIENT_ID}"
supabase_url         = "${NEXT_PUBLIC_SUPABASE_URL}"
supabase_anon_key    = "${NEXT_PUBLIC_SUPABASE_ANON_KEY}"
supabase_service_key = "${SUPABASE_SERVICE_ROLE_KEY}"
websocket_url        = "${NEXT_PUBLIC_WEBSOCKET_URL}"
aws_region           = "ap-southeast-1"
EOF

echo "terraform.tfvars created - edit github_repo and github_token"
