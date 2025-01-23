resource "aws_instance" "app_instance" {
  ami                         = var.ami_id
  instance_type               = var.instance_type
  subnet_id                   = aws_subnet.public.id
  security_groups             = [aws_security_group.instance.name]
  iam_instance_profile        = aws_iam_instance_profile.ec2_instance_profile.name
  associate_public_ip_address = true

  tags = {
    Name = "app_instance"
  }

  user_data = <<-EOF
              #!/bin/bash
              yum update -y
              yum install -y httpd
              systemctl start httpd
              systemctl enable httpd
              mkfs -t ext4 /dev/xvdf
              mkdir /mnt/sqlite
              mount /dev/xvdf /mnt/sqlite
              chown ec2-user:ec2-user /mnt/sqlite
              EOF
}

resource "aws_volume_attachment" "ebs_attachment" {
  device_name = "/dev/xvdf"
  volume_id   = aws_ebs_volume.sqlite_volume.id
  instance_id = aws_instance.app_instance.id
}