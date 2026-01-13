terraform {
  required_version = ">= 1.0"
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

locals {
  prefix = "trustate-${var.environment}"
}

# S3 Bucket for verification documents
resource "aws_s3_bucket" "verification_documents" {
  bucket = "${local.prefix}-verification-docs"

  tags = {
    Name        = "${local.prefix}-verification-docs"
    Environment = var.environment
  }
}

resource "aws_s3_bucket_versioning" "verification_documents" {
  bucket = aws_s3_bucket.verification_documents.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "verification_documents" {
  bucket = aws_s3_bucket.verification_documents.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "verification_documents" {
  bucket = aws_s3_bucket.verification_documents.id

  rule {
    id     = "cleanup-old-documents"
    status = "Enabled"

    expiration {
      days = 30
    }

    filter {
      prefix = "temp/"
    }
  }

  rule {
    id     = "archive-verified-documents"
    status = "Enabled"

    transition {
      days          = 90
      storage_class = "GLACIER"
    }

    filter {
      prefix = "verified/"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "verification_documents" {
  bucket = aws_s3_bucket.verification_documents.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_cors_configuration" "verification_documents" {
  bucket = aws_s3_bucket.verification_documents.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST", "GET"]
    allowed_origins = var.allowed_origins
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

# IAM Role for Lambda functions
resource "aws_iam_role" "verification_lambda" {
  name = "${local.prefix}-verification-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "verification_lambda" {
  name = "${local.prefix}-verification-lambda-policy"
  role = aws_iam_role.verification_lambda.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject"
        ]
        Resource = "${aws_s3_bucket.verification_documents.arn}/*"
      },
      {
        Effect = "Allow"
        Action = [
          "textract:AnalyzeID",
          "textract:AnalyzeDocument",
          "textract:DetectDocumentText"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "rekognition:CreateFaceLivenessSession",
          "rekognition:GetFaceLivenessSessionResults",
          "rekognition:CompareFaces",
          "rekognition:DetectFaces"
        ]
        Resource = "*"
      }
    ]
  })
}

# Lambda function for ID analysis
resource "aws_lambda_function" "analyze_id" {
  filename         = data.archive_file.analyze_id.output_path
  source_code_hash = data.archive_file.analyze_id.output_base64sha256
  function_name    = "${local.prefix}-analyze-id"
  role             = aws_iam_role.verification_lambda.arn
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  timeout          = 30
  memory_size      = 256

  environment {
    variables = {
      S3_BUCKET   = aws_s3_bucket.verification_documents.id
      ENVIRONMENT = var.environment
    }
  }

  tags = {
    Name        = "${local.prefix}-analyze-id"
    Environment = var.environment
  }
}

# Lambda function for liveness session
resource "aws_lambda_function" "create_liveness_session" {
  filename         = data.archive_file.create_liveness_session.output_path
  source_code_hash = data.archive_file.create_liveness_session.output_base64sha256
  function_name    = "${local.prefix}-create-liveness-session"
  role             = aws_iam_role.verification_lambda.arn
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  timeout          = 30
  memory_size      = 256

  environment {
    variables = {
      S3_BUCKET   = aws_s3_bucket.verification_documents.id
      ENVIRONMENT = var.environment
    }
  }

  tags = {
    Name        = "${local.prefix}-create-liveness-session"
    Environment = var.environment
  }
}

# Lambda function for face comparison
resource "aws_lambda_function" "compare_faces" {
  filename         = data.archive_file.compare_faces.output_path
  source_code_hash = data.archive_file.compare_faces.output_base64sha256
  function_name    = "${local.prefix}-compare-faces"
  role             = aws_iam_role.verification_lambda.arn
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  timeout          = 30
  memory_size      = 256

  environment {
    variables = {
      S3_BUCKET   = aws_s3_bucket.verification_documents.id
      ENVIRONMENT = var.environment
    }
  }

  tags = {
    Name        = "${local.prefix}-compare-faces"
    Environment = var.environment
  }
}

# Lambda function for presigned URL generation
resource "aws_lambda_function" "get_upload_url" {
  filename         = data.archive_file.get_upload_url.output_path
  source_code_hash = data.archive_file.get_upload_url.output_base64sha256
  function_name    = "${local.prefix}-get-upload-url"
  role             = aws_iam_role.verification_lambda.arn
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  timeout          = 10
  memory_size      = 128

  environment {
    variables = {
      S3_BUCKET   = aws_s3_bucket.verification_documents.id
      ENVIRONMENT = var.environment
    }
  }

  tags = {
    Name        = "${local.prefix}-get-upload-url"
    Environment = var.environment
  }
}

# Lambda code archives
data "archive_file" "get_upload_url" {
  type        = "zip"
  source_dir  = "${path.module}/lambdas/get-upload-url"
  output_path = "${path.module}/dist/get-upload-url.zip"
}

data "archive_file" "analyze_id" {
  type        = "zip"
  source_dir  = "${path.module}/lambdas/analyze-id"
  output_path = "${path.module}/dist/analyze-id.zip"
}

data "archive_file" "create_liveness_session" {
  type        = "zip"
  source_dir  = "${path.module}/lambdas/create-liveness-session"
  output_path = "${path.module}/dist/create-liveness-session.zip"
}

data "archive_file" "compare_faces" {
  type        = "zip"
  source_dir  = "${path.module}/lambdas/compare-faces"
  output_path = "${path.module}/dist/compare-faces.zip"
}

# API Gateway
resource "aws_apigatewayv2_api" "verification" {
  name          = "${local.prefix}-verification-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = var.allowed_origins
    allow_methods = ["GET", "POST", "OPTIONS"]
    allow_headers = ["Content-Type", "Authorization"]
    max_age       = 300
  }
}

resource "aws_apigatewayv2_stage" "verification" {
  api_id      = aws_apigatewayv2_api.verification.id
  name        = var.environment
  auto_deploy = true
}

# API Gateway integrations
resource "aws_apigatewayv2_integration" "get_upload_url" {
  api_id             = aws_apigatewayv2_api.verification.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.get_upload_url.invoke_arn
  integration_method = "POST"
}

resource "aws_apigatewayv2_integration" "analyze_id" {
  api_id             = aws_apigatewayv2_api.verification.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.analyze_id.invoke_arn
  integration_method = "POST"
}

resource "aws_apigatewayv2_integration" "create_liveness_session" {
  api_id             = aws_apigatewayv2_api.verification.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.create_liveness_session.invoke_arn
  integration_method = "POST"
}

resource "aws_apigatewayv2_integration" "compare_faces" {
  api_id             = aws_apigatewayv2_api.verification.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.compare_faces.invoke_arn
  integration_method = "POST"
}

# API Gateway routes
resource "aws_apigatewayv2_route" "get_upload_url" {
  api_id    = aws_apigatewayv2_api.verification.id
  route_key = "POST /verify/upload-url"
  target    = "integrations/${aws_apigatewayv2_integration.get_upload_url.id}"
}

resource "aws_apigatewayv2_route" "analyze_id" {
  api_id    = aws_apigatewayv2_api.verification.id
  route_key = "POST /verify/analyze-id"
  target    = "integrations/${aws_apigatewayv2_integration.analyze_id.id}"
}

resource "aws_apigatewayv2_route" "create_liveness_session" {
  api_id    = aws_apigatewayv2_api.verification.id
  route_key = "POST /verify/liveness-session"
  target    = "integrations/${aws_apigatewayv2_integration.create_liveness_session.id}"
}

resource "aws_apigatewayv2_route" "compare_faces" {
  api_id    = aws_apigatewayv2_api.verification.id
  route_key = "POST /verify/compare-faces"
  target    = "integrations/${aws_apigatewayv2_integration.compare_faces.id}"
}

# Lambda permissions for API Gateway
resource "aws_lambda_permission" "get_upload_url" {
  statement_id  = "AllowAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_upload_url.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.verification.execution_arn}/*/*"
}

resource "aws_lambda_permission" "analyze_id" {
  statement_id  = "AllowAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.analyze_id.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.verification.execution_arn}/*/*"
}

resource "aws_lambda_permission" "create_liveness_session" {
  statement_id  = "AllowAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.create_liveness_session.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.verification.execution_arn}/*/*"
}

resource "aws_lambda_permission" "compare_faces" {
  statement_id  = "AllowAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.compare_faces.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.verification.execution_arn}/*/*"
}
