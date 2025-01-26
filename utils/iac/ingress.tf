resource "kubernetes_ingress_v1" "app_ingress" {
  metadata {
    name = "app-ingress"
    annotations = {
      "kubernetes.io/ingress.class"       = "alb"
      "alb.ingress.kubernetes.io/scheme"  = "internet-facing"
    }
  }

  spec {
    rule {
      host = "myapp.example.com"
      http {
        path {
          path = "/"
          backend {
            service {
              name = "myapp-service"
              port {
                number = 80
              }
            }
          }
        }
      }
    }
  }
}