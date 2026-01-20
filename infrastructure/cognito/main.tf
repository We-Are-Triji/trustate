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

resource "aws_cognito_user_pool" "main" {
  name = var.user_pool_name

  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = false
    require_uppercase = true
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  # Standard attributes
  schema {
    name                = "email"
    attribute_data_type = "String"
    required            = true
    mutable             = true

    string_attribute_constraints {
      min_length = 1
      max_length = 256
    }
  }

  schema {
    name                = "phone_number"
    attribute_data_type = "String"
    required            = false
    mutable             = true

    string_attribute_constraints {
      min_length = 1
      max_length = 20
    }
  }

  schema {
    name                = "given_name"
    attribute_data_type = "String"
    required            = false
    mutable             = true

    string_attribute_constraints {
      min_length = 1
      max_length = 100
    }
  }

  schema {
    name                = "family_name"
    attribute_data_type = "String"
    required            = false
    mutable             = true

    string_attribute_constraints {
      min_length = 1
      max_length = 100
    }
  }

  schema {
    name                = "middle_name"
    attribute_data_type = "String"
    required            = false
    mutable             = true

    string_attribute_constraints {
      min_length = 0
      max_length = 100
    }
  }

  schema {
    name                = "birthdate"
    attribute_data_type = "String"
    required            = false
    mutable             = true

    string_attribute_constraints {
      min_length = 0
      max_length = 10
    }
  }

  # Custom attributes
  schema {
    name                     = "nationality"
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    required                 = false

    string_attribute_constraints {
      min_length = 0
      max_length = 100
    }
  }

  schema {
    name                     = "status"
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    required                 = false

    string_attribute_constraints {
      min_length = 0
      max_length = 50
    }
  }

  schema {
    name                     = "account_type"
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    required                 = false

    string_attribute_constraints {
      min_length = 0
      max_length = 20
    }
  }

  tags = var.tags
}

resource "aws_cognito_user_pool_client" "main" {
  name         = "${var.user_pool_name}-client"
  user_pool_id = aws_cognito_user_pool.main.id

  explicit_auth_flows = [
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_PASSWORD_AUTH"
  ]

  read_attributes = [
    "email",
    "phone_number",
    "given_name",
    "family_name",
    "middle_name",
    "birthdate",
    "custom:nationality",
    "custom:status",
    "custom:account_type"
  ]

  write_attributes = [
    "email",
    "phone_number",
    "given_name",
    "family_name",
    "middle_name",
    "birthdate",
    "custom:nationality",
    "custom:status",
    "custom:account_type"
  ]

  prevent_user_existence_errors = "ENABLED"
  generate_secret               = false
}

# Cleanup Lambda for unconfirmed users
data "archive_file" "cleanup_lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../lambda/cognito-cleanup"
  output_path = "${path.module}/cognito-cleanup.zip"
}

resource "aws_iam_role" "cleanup_lambda_role" {
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

resource "aws_iam_role_policy" "cleanup_lambda_policy" {
  name = "trustate-cognito-cleanup-policy"
  role = aws_iam_role.cleanup_lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "cognito-idp:ListUsers",
          "cognito-idp:AdminDeleteUser"
        ]
        Resource = aws_cognito_user_pool.main.arn
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
  filename         = data.archive_file.cleanup_lambda_zip.output_path
  function_name    = "trustate-cognito-cleanup"
  role            = aws_iam_role.cleanup_lambda_role.arn
  handler         = "index.handler"
  source_code_hash = data.archive_file.cleanup_lambda_zip.output_base64sha256
  runtime         = "nodejs20.x"
  timeout         = 60

  environment {
    variables = {
      COGNITO_USER_POOL_ID = aws_cognito_user_pool.main.id
      AWS_REGION          = var.aws_region
    }
  }
}

resource "aws_cloudwatch_event_rule" "daily_cleanup" {
  name                = "trustate-cognito-cleanup-daily"
  description         = "Trigger Cognito cleanup daily"
  schedule_expression = "rate(1 day)"
}

resource "aws_cloudwatch_event_target" "cleanup_lambda_target" {
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
