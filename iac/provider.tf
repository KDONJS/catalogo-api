provider "aws" {
  region = "us-east-2"
}

provider "kubernetes" {
  host                   = aws_eks_cluster.eks.endpoint
  token                  = data.aws_eks_cluster_auth.eks.token  # Ya estará declarado correctamente
  cluster_ca_certificate = base64decode(aws_eks_cluster.eks.certificate_authority[0].data)
}