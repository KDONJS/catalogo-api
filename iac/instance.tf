resource "aws_instance" "app_instance" {
  ami                         = var.ami_id
  instance_type               = var.instance_type
  subnet_id                   = aws_subnet.public.id
  vpc_security_group_ids      = [aws_security_group.instance.id]
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

              DEVICE_NAME=$(lsblk -nd --output NAME | grep nvme || echo xvdf)
              mkfs -t ext4 /dev/$DEVICE_NAME
              mkdir /mnt/sqlite
              mount /dev/$DEVICE_NAME /mnt/sqlite
              chown ec2-user:ec2-user /mnt/sqlite
              EOF
}