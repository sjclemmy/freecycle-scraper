locals {
  namespace      = "freecycle-scraper"
  application    = "freecycle scraper"
  lambda_runtime = "nodejs18.x"

  tags = {
    Project     = local.application
    ManagedBy   = "Terraform"
    Application = local.application
    Owner       = "Original Eye"
    Environment = var.environment
  }
}
