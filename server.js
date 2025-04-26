// server/server.js
const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
const config = require("./config/config");
const notificationService = require("./services/notificationService");

// Import routes
const authRoutes = require("./routes/authRoutes");
const requestRoutes = require("./routes/requestRoutes");
const userRoutes = require("./routes/userRoutes");

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/users", userRoutes);

// HRMS Mock API route
app.post("/api/hrms/requests", (req, res) => {
  const requestId = `HRMS-${Math.random()
    .toString(36)
    .substring(2, 10)
    .toUpperCase()}`;
  res.json({
    success: true,
    requestId,
    message: "Request processed successfully",
  });
});

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Something went wrong on the server",
  });
});

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket with the server
notificationService.initialize(server);

// Start server
const PORT = config.port;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${config.nodeEnv} mode`);
});

module.exports = server;
