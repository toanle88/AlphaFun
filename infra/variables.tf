variable "resource_group_name" {
  type        = string
  description = "Name of the Azure resource group managed by this stack."
}

variable "resource_group_location" {
  type        = string
  description = "Azure region for the managed resource group."
}

variable "tag_environment" {
  type        = string
  description = "Environment tag applied to managed resources."
}
