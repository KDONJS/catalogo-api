resource "aws_ebs_volume" "sqlite_volume" {
  availability_zone = aws_instance.app_instance.availability_zone
  size              = var.volume_size
  tags = {
    Name = "sqlite_volume"
  }
}