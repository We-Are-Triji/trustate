resource "aws_iam_user" "ai_assistant" {
  name = "trustate-ai-assistant"
  path = "/system/"
}

resource "aws_iam_access_key" "ai_assistant" {
  user = aws_iam_user.ai_assistant.name
}

resource "aws_iam_user_policy" "textract_policy" {
  name = "textract-access"
  user = aws_iam_user.ai_assistant.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "textract:DetectDocumentText",
          "textract:AnalyzeDocument"
        ]
        Effect   = "Allow"
        Resource = "*"
      },
    ]
  })
}

output "aws_access_key_id" {
  value = aws_iam_access_key.ai_assistant.id
}

output "aws_secret_access_key" {
  value     = aws_iam_access_key.ai_assistant.secret
  sensitive = true
}
