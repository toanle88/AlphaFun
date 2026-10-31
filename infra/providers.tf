terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.1.0"
    }
  }

  # Backend settings are supplied by the trusted workflow at init time. Keep
  # environment and state-account identifiers out of the repository.
  backend "azurerm" {
    use_oidc = true
  }
}

provider "azurerm" {
  features {}
  use_oidc = true
}
