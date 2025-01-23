output "instance_public_ip" {
  value = aws_instance.app_instance.public_ip
}

output "volume_id" {
  value = aws_ebs_volume.sqlite_volume.id
}