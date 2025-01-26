output "eks_cluster_name" {
  description = "Nombre del clúster EKS"
  value       = aws_eks_cluster.eks.name
}

output "eks_cluster_endpoint" {
  description = "Endpoint del clúster EKS"
  value       = aws_eks_cluster.eks.endpoint
}

output "eks_cluster_certificate_authority" {
  description = "Certificado del clúster EKS"
  value       = aws_eks_cluster.eks.certificate_authority[0].data
}