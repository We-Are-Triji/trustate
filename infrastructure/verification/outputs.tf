output "api_endpoint" {
  description = "Verification API endpoint"
  value       = "${aws_apigatewayv2_api.verification.api_endpoint}/${var.environment}"
}

output "s3_bucket" {
  description = "S3 bucket for verification documents"
  value       = aws_s3_bucket.verification_documents.id
}
