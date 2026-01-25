terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# =============================================================================
# VARIABLES
# =============================================================================

variable "aws_region" {
  description = "AWS region for all resources"
  type        = string
  default     = "ap-southeast-1"
}

variable "environment" {
  description = "Environment name (e.g., prod, staging)"
  type        = string
  default     = "prod"
}

variable "project_name" {
  description = "Project name prefix for resources"
  type        = string
  default     = "trustate"
}

# =============================================================================
# S3 BUCKET FOR DOCUMENT STORAGE
# =============================================================================

resource "aws_s3_bucket" "documents" {
  bucket = "${var.project_name}-documents-${var.environment}"

  tags = {
    Name        = "${var.project_name}-documents"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Block public access
resource "aws_s3_bucket_public_access_block" "documents" {
  bucket = aws_s3_bucket.documents.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Enable versioning for document safety
resource "aws_s3_bucket_versioning" "documents" {
  bucket = aws_s3_bucket.documents.id

  versioning_configuration {
    status = "Enabled"
  }
}

# Server-side encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "documents" {
  bucket = aws_s3_bucket.documents.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Lifecycle rules for cost optimization
resource "aws_s3_bucket_lifecycle_configuration" "documents" {
  bucket = aws_s3_bucket.documents.id

  rule {
    id     = "transition-to-ia"
    status = "Enabled"

    # Move to Infrequent Access after 90 days
    transition {
      days          = 90
      storage_class = "STANDARD_IA"
    }

    # Move to Glacier after 1 year
    transition {
      days          = 365
      storage_class = "GLACIER"
    }

    # Delete incomplete multipart uploads after 7 days
    abort_incomplete_multipart_upload {
      days_after_initiation = 7
    }
  }

  rule {
    id     = "delete-old-versions"
    status = "Enabled"

    noncurrent_version_expiration {
      noncurrent_days = 90
    }
  }
}

# CORS configuration for presigned URL uploads
resource "aws_s3_bucket_cors_configuration" "documents" {
  bucket = aws_s3_bucket.documents.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "HEAD"]
    allowed_origins = [
      "http://localhost:3000",
      "https://*.amplifyapp.com",
      "https://trustate.ph",
      "https://*.trustate.ph"
    ]
    expose_headers  = ["ETag"]
    max_age_seconds = 3600
  }
}

# =============================================================================
# IAM USER FOR APPLICATION (Next.js API Routes)
# =============================================================================

resource "aws_iam_user" "app_user" {
  name = "${var.project_name}-app-user-${var.environment}"

  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_iam_access_key" "app_user" {
  user = aws_iam_user.app_user.name
}

# S3 access policy for the application
resource "aws_iam_user_policy" "app_s3_policy" {
  name = "${var.project_name}-app-s3-policy"
  user = aws_iam_user.app_user.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowS3DocumentOperations"
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.documents.arn,
          "${aws_s3_bucket.documents.arn}/*"
        ]
      }
    ]
  })
}

# =============================================================================
# OUTPUTS
# =============================================================================

output "s3_bucket_name" {
  description = "Name of the S3 bucket for documents"
  value       = aws_s3_bucket.documents.id
}

output "s3_bucket_arn" {
  description = "ARN of the S3 bucket"
  value       = aws_s3_bucket.documents.arn
}

output "s3_bucket_region" {
  description = "Region of the S3 bucket"
  value       = var.aws_region
}

output "app_aws_access_key_id" {
  description = "Access key ID for the application IAM user"
  value       = aws_iam_access_key.app_user.id
  sensitive   = true
}

output "app_aws_secret_access_key" {
  description = "Secret access key for the application IAM user"
  value       = aws_iam_access_key.app_user.secret
  sensitive   = true
}

output "env_variables" {
  description = "Environment variables to add to Amplify"
  value       = <<-EOT
    
    # Add these to Amplify Environment Variables:
    AWS_REGION=${var.aws_region}
    AWS_S3_DOCUMENTS_BUCKET=${aws_s3_bucket.documents.id}
    APP_AWS_ACCESS_KEY_ID=<run: terraform output -raw app_aws_access_key_id>
    APP_AWS_SECRET_ACCESS_KEY=<run: terraform output -raw app_aws_secret_access_key>
    
  EOT
}
