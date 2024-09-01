module.exports = {
  apps: [
    {
      name: "ml-notification-with-health-checker",
      script: "npm",
      args: "run start",
      watch: true,
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production",
      },
      health_check: {
        http_url: "http://localhost:3000",
        interval: 600000,
        max_retries: 2,
      },
    },
  ],
}
