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

# DynamoDB Table for Transaction Messages
resource "aws_dynamodb_table" "transaction_messages" {
  name         = "trustate-transaction-messages"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "transaction_id"
  range_key    = "sort_key"

  attribute {
    name = "transaction_id"
    type = "S"
  }

  attribute {
    name = "sort_key"
    type = "S"
  }

  ttl {
    attribute_name = "ttl"
    enabled        = true
  }

  tags = {
    Project = "trustate"
  }
}

# DynamoDB Table for WebSocket Connections
resource "aws_dynamodb_table" "websocket_connections" {
  name         = "trustate-websocket-connections"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "connection_id"

  attribute {
    name = "connection_id"
    type = "S"
  }

  attribute {
    name = "transaction_id"
    type = "S"
  }

  global_secondary_index {
    name            = "transaction_id_index"
    hash_key        = "transaction_id"
    projection_type = "ALL"
  }

  ttl {
    attribute_name = "ttl"
    enabled        = true
  }

  tags = {
    Project = "trustate"
  }
}

# IAM Role for WebSocket Lambda
resource "aws_iam_role" "websocket_lambda_role" {
  name = "trustate-websocket-lambda-role"

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

resource "aws_iam_role_policy" "websocket_lambda_policy" {
  name = "trustate-websocket-lambda-policy"
  role = aws_iam_role.websocket_lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Resource = [
          aws_dynamodb_table.transaction_messages.arn,
          aws_dynamodb_table.websocket_connections.arn,
          "${aws_dynamodb_table.websocket_connections.arn}/index/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "execute-api:ManageConnections"
        ]
        Resource = "${aws_apigatewayv2_api.websocket_api.execution_arn}/*"
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

# Lambda for WebSocket handlers
data "archive_file" "websocket_lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/src"
  output_path = "${path.module}/websocket-lambda.zip"
}

resource "aws_lambda_function" "websocket_handler" {
  filename         = data.archive_file.websocket_lambda_zip.output_path
  function_name    = "trustate-websocket-handler"
  role             = aws_iam_role.websocket_lambda_role.arn
  handler          = "index.handler"
  source_code_hash = data.archive_file.websocket_lambda_zip.output_base64sha256
  runtime          = "nodejs20.x"
  timeout          = 30
  memory_size      = 256

  environment {
    variables = {
      MESSAGES_TABLE    = aws_dynamodb_table.transaction_messages.name
      CONNECTIONS_TABLE = aws_dynamodb_table.websocket_connections.name
    }
  }
}

# API Gateway WebSocket API
resource "aws_apigatewayv2_api" "websocket_api" {
  name                       = "trustate-transaction-chat"
  protocol_type              = "WEBSOCKET"
  route_selection_expression = "$request.body.action"
}

resource "aws_apigatewayv2_stage" "websocket_stage" {
  api_id      = aws_apigatewayv2_api.websocket_api.id
  name        = "prod"
  auto_deploy = true
}

# Lambda integration
resource "aws_apigatewayv2_integration" "websocket_integration" {
  api_id                    = aws_apigatewayv2_api.websocket_api.id
  integration_type          = "AWS_PROXY"
  integration_uri           = aws_lambda_function.websocket_handler.invoke_arn
  content_handling_strategy = "CONVERT_TO_TEXT"
  passthrough_behavior      = "WHEN_NO_MATCH"
}

# Routes
resource "aws_apigatewayv2_route" "connect" {
  api_id    = aws_apigatewayv2_api.websocket_api.id
  route_key = "$connect"
  target    = "integrations/${aws_apigatewayv2_integration.websocket_integration.id}"
}

resource "aws_apigatewayv2_route" "disconnect" {
  api_id    = aws_apigatewayv2_api.websocket_api.id
  route_key = "$disconnect"
  target    = "integrations/${aws_apigatewayv2_integration.websocket_integration.id}"
}

resource "aws_apigatewayv2_route" "send_message" {
  api_id    = aws_apigatewayv2_api.websocket_api.id
  route_key = "sendMessage"
  target    = "integrations/${aws_apigatewayv2_integration.websocket_integration.id}"
}

resource "aws_apigatewayv2_route" "get_messages" {
  api_id    = aws_apigatewayv2_api.websocket_api.id
  route_key = "getMessages"
  target    = "integrations/${aws_apigatewayv2_integration.websocket_integration.id}"
}

# Lambda permissions
resource "aws_lambda_permission" "websocket_permission" {
  statement_id  = "AllowAPIGatewayWebSocket"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.websocket_handler.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.websocket_api.execution_arn}/*/*"
}

output "websocket_url" {
  value = "${aws_apigatewayv2_api.websocket_api.api_endpoint}/${aws_apigatewayv2_stage.websocket_stage.name}"
}

output "messages_table_name" {
  value = aws_dynamodb_table.transaction_messages.name
}

output "connections_table_name" {
  value = aws_dynamodb_table.websocket_connections.name
}
