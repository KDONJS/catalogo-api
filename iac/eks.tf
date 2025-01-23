# 🔹 Crear el Cluster EKS con soporte para CNI
resource "aws_eks_cluster" "eks_cluster" {
  name     = "eks-cluster"
  role_arn = aws_iam_role.eks_role.arn

  vpc_config {
    subnet_ids = [aws_subnet.public.id, aws_subnet.private.id]
  }

  # Asegura que los permisos IAM se asignen antes de crear el cluster
  depends_on = [aws_iam_role_policy_attachment.eks_policy]
}

# 🔹 Instalar Amazon VPC CNI automáticamente
resource "aws_eks_addon" "vpc_cni" {
  cluster_name      = aws_eks_cluster.eks_cluster.name
  addon_name        = "vpc-cni"
  addon_version     = "v1.19.2-eksbuild.1"
  resolve_conflicts = "OVERWRITE"
}

# 🔹 Launch Template para garantizar que los nodos usen la AMI correcta
resource "aws_launch_template" "eks_nodes" {
  name_prefix   = "eks-nodes"
  image_id      = data.aws_ami.eks_worker.id
  instance_type = "t3.medium"
  
  # Habilita IMDSv2 para seguridad
  metadata_options {
    http_tokens = "required"
  }

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "EKS-Node"
    }
  }
}

# 🔹 AMI para EKS (Automático según la región)
data "aws_ami" "eks_worker" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amazon-eks-node-*"]
  }
}

resource "aws_eks_node_group" "eks_nodes" {
  cluster_name    = aws_eks_cluster.eks_cluster.name
  node_group_name = "eks-nodes"
  node_role_arn   = aws_iam_role.eks_node_role.arn
  subnet_ids      = [aws_subnet.private_a.id, aws_subnet.private_b.id]

  scaling_config {
    desired_size = 2
    min_size     = 1
    max_size     = 3
  }

  launch_template {
    id      = aws_launch_template.eks_nodes.id
    version = "$Latest"
  }

  depends_on = [aws_eks_addon.vpc_cni]
}