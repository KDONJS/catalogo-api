resource "aws_eks_cluster" "eks" {
  name     = "my-eks-cluster"
  role_arn = aws_iam_role.eks_role.arn

  vpc_config {
    subnet_ids = [aws_subnet.eks_public_subnet_1.id, aws_subnet.eks_public_subnet_2.id]
  }

  tags = {
    Name = "eks-cluster"
  }
}

resource "aws_eks_node_group" "eks_nodes" {
  cluster_name  = aws_eks_cluster.eks.name
  node_role_arn = aws_iam_role.eks_role.arn
  subnet_ids    = [aws_subnet.eks_public_subnet_1.id, aws_subnet.eks_public_subnet_2.id]
  instance_types = ["t3.medium"]

  scaling_config {
    desired_size = 2
    max_size     = 3
    min_size     = 1
  }

  tags = {
    Name = "eks-node-group"
  }
}