# Cognito Cleanup Lambda

Automatically deletes unconfirmed Cognito users after 3 days.

## Setup

1. Install Lambda dependencies:
```bash
cd infrastructure/lambda/cognito-cleanup
npm install
```

2. Generate terraform.tfvars from root .env:
```bash
cd infrastructure/cognito-cleanup
./setup.sh
```

3. Deploy:
```bash
terraform init
terraform apply
```

## How it works

- Runs daily via EventBridge
- Queries all UNCONFIRMED users
- Deletes users created more than 3 days ago
- Logs deleted usernames
