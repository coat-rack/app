module.exports = {
  apps: [
    {
      name: "sandbox",
      script: "serve",
      env: {
        PM2_SERVE_PATH: "./sandbox/",
        PM2_SERVE_PORT: 5000,
      },
    },
    {
      name: "server",
      script: "./server/index.js",
    },
    {
      name: "web",
      script: "serve",
      env: {
        PM2_SERVE_PATH: "./web/",
        PM2_SERVE_PORT: 4000,
      },
    },
  ],
}
