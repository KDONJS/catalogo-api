resource "aws_ebs_volume" "sqlite_volume" {
  availability_zone = "us-east-1a"
  size              = var.volume_size
  tags = {
    Name = "sqlite_volume"
  }
}