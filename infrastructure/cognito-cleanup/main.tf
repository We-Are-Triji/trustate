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

variable "cognito_user_pool_id" {
  type = string
}

data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../lambda/cognito-cleanup"
  output_path = "${path.module}/cognito-cleanup.zip"
}

resource "aws_iam_role" "lambda_role" {
  name = "trustate-cognito-cleanup-role"

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

resource "aws_iam_role_policy" "lambda_policy" {
  name = "trustate-cognito-cleanup-policy"
  role = aws_iam_role.lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "cognito-idp:ListUsers",
          "cognito-idp:AdminDeleteUser"
        ]
        Resource = "arn:aws:cognito-idp:${var.aws_region}:*:userpool/${var.cognito_user_pool_id}"
      },
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

resource "aws_lambda_function" "cognito_cleanup" {
  filename         = data.archive_file.lambda_zip.output_path
  function_name    = "trustate-cognito-cleanup"
  role            = aws_iam_role.lambda_role.arn
  handler         = "index.handler"
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  runtime         = "nodejs20.x"
  timeout         = 60

  environment {
    variables = {
      COGNITO_USER_POOL_ID = var.cognito_user_pool_id
      AWS_REGION          = var.aws_region
    }
  }
}

resource "aws_cloudwatch_event_rule" "daily_cleanup" {
  name                = "trustate-cognito-cleanup-daily"
  description         = "Trigger Cognito cleanup daily"
  schedule_expression = "rate(1 day)"
}

resource "aws_cloudwatch_event_target" "lambda_target" {
  rule      = aws_cloudwatch_event_rule.daily_cleanup.name
  target_id = "CognitoCleanupLambda"
  arn       = aws_lambda_function.cognito_cleanup.arn
}

resource "aws_lambda_permission" "allow_eventbridge" {
  statement_id  = "AllowExecutionFromEventBridge"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.cognito_cleanup.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.daily_cleanup.arn
}

output "lambda_function_name" {
  value = aws_lambda_function.cognito_cleanup.function_name
}
