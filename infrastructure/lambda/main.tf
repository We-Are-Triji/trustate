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

variable "aws_region" {
  default = "ap-southeast-1"
}

variable "groq_api_key" {
  type      = string
  sensitive = true
}

# IAM Role for Lambda
resource "aws_iam_role" "lambda_role" {
  name = "trustate-assistant-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Lambda Function
data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/src"
  output_path = "${path.module}/lambda.zip"
}

resource "aws_lambda_function" "assistant" {
  filename         = data.archive_file.lambda_zip.output_path
  function_name    = "trustate-ai-assistant"
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.handler"
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  runtime          = "nodejs20.x"
  timeout          = 30
  memory_size      = 256

  environment {
    variables = {
      GROQ_API_KEY = var.groq_api_key
    }
  }
}

# Lambda Function URL (simpler than API Gateway)
resource "aws_lambda_function_url" "assistant_url" {
  function_name      = aws_lambda_function.assistant.function_name
  authorization_type = "NONE"

  cors {
    allow_origins     = ["*"]
    allow_methods     = ["POST"]
    allow_headers     = ["content-type"]
    max_age           = 86400
  }
}

output "assistant_url" {
  value = aws_lambda_function_url.assistant_url.function_url
}
