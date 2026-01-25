# Trustate Infrastructure - S3 Document Storage

This Terraform configuration creates the S3 bucket and IAM resources needed for the document vault feature.

## Resources Created

- **S3 Bucket**: `trustate-documents-prod`
  - Versioning enabled
  - Server-side encryption (AES256)
  - Public access blocked
  - Lifecycle rules for cost optimization:
    - Move to Infrequent Access after 90 days
    - Move to Glacier after 1 year
    - Delete old versions after 90 days
  - CORS configured for presigned URL uploads

- **IAM User**: `trustate-app-user-prod`
  - Access key for Next.js API routes
  - Limited permissions (S3 only)

## Usage

### 1. Initialize Terraform
```bash
cd infrastructure/s3
terraform init
```

### 2. Plan and Apply
```bash
terraform plan
terraform apply
```

### 3. Get Credentials
```bash
# Get the access key ID
terraform output -raw app_aws_access_key_id

# Get the secret access key
terraform output -raw app_aws_secret_access_key

# Get the bucket name
terraform output -raw s3_bucket_name
```

### 4. Add to Amplify Environment Variables
Go to AWS Amplify Console → App Settings → Environment Variables and add:

| Variable | Value |
|----------|-------|
| `AWS_REGION` | `ap-southeast-1` |
| `AWS_S3_DOCUMENTS_BUCKET` | Output from `terraform output s3_bucket_name` |
| `APP_AWS_ACCESS_KEY_ID` | Output from `terraform output -raw app_aws_access_key_id` |
| `APP_AWS_SECRET_ACCESS_KEY` | Output from `terraform output -raw app_aws_secret_access_key` |

## Cost Optimization

The lifecycle rules automatically:
- Move infrequently accessed files to cheaper storage tiers
- Delete old versions to prevent storage bloat
- Clean up incomplete uploads
