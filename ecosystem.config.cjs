// PM2 process for the VPS: `pm2 start ecosystem.config.cjs`.
// Listens only on 127.0.0.1, so it's reachable through Nginx and not directly from the internet.
// Secrets come from .env.local, which `next start` loads automatically.
module.exports = {
  apps: [
    {
      name: "hercall",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3100 -H 127.0.0.1",
      env: { NODE_ENV: "production" },
      max_memory_restart: "400M",
    },
  ],
};
