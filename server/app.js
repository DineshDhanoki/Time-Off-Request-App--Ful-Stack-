const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { testConnection } = require("./config/db");
const errorMiddleware = require("./middleware/error");

// Route imports
const authRoutes = require("./routes/authRoutes");
const requestRoutes = require("./routes/requestRoutes");
const userRoutes = require("./routes/userRoutes");

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Test database connection
testConnection();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/users", userRoutes);

// Base route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Time-Off Request API" });
});

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;
