resource "aws_ebs_volume" "sqlite_volume" {
  availability_zone = "us-east-2a"  # Cambiado a una zona válida
  size              = var.volume_size

  tags = {
    Name = "sqlite_volume"
  }
}

resource "aws_volume_attachment" "ebs_attachment" {
  device_name = "/dev/xvdf"
  volume_id   = aws_ebs_volume.sqlite_volume.id
  instance_id = aws_instance.app_instance.id
}