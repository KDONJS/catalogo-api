resource "kubernetes_persistent_volume_claim" "sqlite_pvc" {
  metadata {
    name = "sqlite-pvc"
  }

  spec {
    access_modes = ["ReadWriteOnce"]
    resources {
      requests = {
        storage = "1Gi"
      }
    }
  }
}