module.exports = {
  apps: [
    {
      name: "Integra",
      script: "./src/server/index.js",
      watch: false,
      // Delay between restart
      watch_delay: 1000,
      ignore_watch: ["node_modules", "./server/db"],
      env: {
        PORT: 3038,
        NODE_ENV: "production",
      },
    },
  ],
};
