output "instance_public_ip" {
  description = "Dirección IP pública de la instancia"
  value       = aws_instance.app_instance.public_ip
}

output "instance_private_ip" {
  description = "Dirección IP privada de la instancia"
  value       = aws_instance.app_instance.private_ip
}

output "volume_id" {
  description = "ID del volumen EBS SQLite"
  value       = aws_ebs_volume.sqlite_volume.id
}