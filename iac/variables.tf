variable "instance_type" {
  description = "Tipo de instancia de AWS EC2"
  default     = "t2.micro"
}

variable "ami_id" {
  description = "ID de la AMI a usar en AWS EC2"
  default     = "ami-0c55b159cbfafe1f0"
}

variable "volume_size" {
  description = "Tamaño del volumen EBS en GB"
  default     = 10
}