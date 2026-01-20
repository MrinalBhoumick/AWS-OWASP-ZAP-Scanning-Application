variable "db_user" {
  description = "Database username"
  type        = string
  default     = "appuser"
}

variable "db_pass" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-west-2"
}
