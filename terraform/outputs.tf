output "alb_dns_name" {
  description = "Application Load Balancer DNS name"
  value       = aws_lb.app.dns_name
}

output "alb_url" {
  description = "Application URL"
  value       = "http://${aws_lb.app.dns_name}"
}

output "rds_endpoint" {
  description = "RDS endpoint"
  value       = aws_db_instance.pg.endpoint
}

output "rds_address" {
  description = "RDS address"
  value       = aws_db_instance.pg.address
}

output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}
