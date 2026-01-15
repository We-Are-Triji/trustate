variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "ap-southeast-1"
}

variable "user_pool_name" {
  description = "Name of the Cognito user pool"
  type        = string
  default     = "trustate-users"
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default = {
    Project   = "trustate"
    ManagedBy = "terraform"
  }
}
