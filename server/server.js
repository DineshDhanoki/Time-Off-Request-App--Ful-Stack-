const http = require("http");
const app = require("./app");
const config = require("./config/config");
const logger = require("./middleware/logger");
const notificationService = require("./services/notificationService");

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket notifications
notificationService.initialize(server);

// Start server
const PORT = config.port;
server.listen(PORT, () => {
  logger.info(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection:", err);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
  // Close server & exit process
  server.close(() => process.exit(1));
});
