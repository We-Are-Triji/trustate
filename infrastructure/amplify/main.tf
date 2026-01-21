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

variable "github_repo" {
  type = string
}

variable "github_token" {
  type      = string
  sensitive = true
}

variable "domain_name" {
  type = string
}

resource "aws_amplify_app" "trustate" {
  name       = "trustate"
  repository = var.github_repo

  access_token = var.github_token

  build_spec = <<-EOT
    version: 1
    frontend:
      phases:
        preBuild:
          commands:
            - npm ci
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: .next
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
  EOT

  environment_variables = {
    NEXT_PUBLIC_COGNITO_USER_POOL_ID = var.cognito_user_pool_id
    NEXT_PUBLIC_COGNITO_CLIENT_ID    = var.cognito_client_id
    NEXT_PUBLIC_SUPABASE_URL         = var.supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY    = var.supabase_anon_key
    NEXT_PUBLIC_WEBSOCKET_URL        = var.websocket_url
    SUPABASE_SERVICE_ROLE_KEY        = var.supabase_service_key
  }

  custom_rule {
    source = "/<*>"
    status = "404"
    target = "/index.html"
  }
}

resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.trustate.id
  branch_name = "main"

  enable_auto_build = true
}

resource "aws_amplify_domain_association" "trustate" {
  app_id      = aws_amplify_app.trustate.id
  domain_name = var.domain_name

  sub_domain {
    branch_name = aws_amplify_branch.main.branch_name
    prefix      = ""
  }

  sub_domain {
    branch_name = aws_amplify_branch.main.branch_name
    prefix      = "www"
  }
}

variable "cognito_user_pool_id" {
  type = string
}

variable "cognito_client_id" {
  type = string
}

variable "supabase_url" {
  type = string
}

variable "supabase_anon_key" {
  type = string
}

variable "supabase_service_key" {
  type      = string
  sensitive = true
}

variable "websocket_url" {
  type = string
}

output "amplify_app_id" {
  value = aws_amplify_app.trustate.id
}

output "default_domain" {
  value = aws_amplify_app.trustate.default_domain
}
