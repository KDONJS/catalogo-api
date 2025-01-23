resource "aws_lb" "eks_ingress_lb" {
  name               = "eks-ingress-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.eks_sg.id]
  subnets           = [aws_subnet.public.id, aws_subnet.private.id]
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.eks_ingress_lb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "forward"
    target_group_arn = aws_lb_target_group.eks_ingress_tg.arn
  }
}

resource "aws_lb_target_group" "eks_ingress_tg" {
  name     = "eks-ingress-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id
}