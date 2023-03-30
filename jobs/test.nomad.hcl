job "test" {
  group "test" {
    count = 2

    network {
      mode = "host"
      port "www" {}
    }

    task "test" {
      driver = "docker"

      config {
        image   = "busybox:1"
        command = "httpd"
        args    = ["-v", "-f", "-p", "${NOMAD_PORT_www}", "-h", "/local"]
        ports   = ["www"]
      }

      template {
        data        = <<EOF
hello world
EOF
        destination = "local/index.html"
      }

      resources {
        cpu    = 50
        memory = 100
      }
    }
  }
}
