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

# API Gateway
resource "aws_apigatewayv2_api" "assistant_api" {
  name          = "trustate-assistant-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["POST", "OPTIONS"]
    allow_headers = ["content-type"]
    max_age       = 86400
  }
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.assistant_api.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_apigatewayv2_integration" "lambda" {
  api_id                 = aws_apigatewayv2_api.assistant_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.assistant.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "post" {
  api_id    = aws_apigatewayv2_api.assistant_api.id
  route_key = "POST /chat"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.assistant.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.assistant_api.execution_arn}/*/*"
}

output "assistant_api_url" {
  value = "${aws_apigatewayv2_api.assistant_api.api_endpoint}/chat"
}
