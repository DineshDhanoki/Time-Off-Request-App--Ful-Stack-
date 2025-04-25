const { FileMakerClient } = require("fms-api-client");
const config = require("./config");
const logger = require("../middleware/logger");

// Initialize FileMaker client
const client = new FileMakerClient({
  server: config.filemaker.server,
  database: config.filemaker.database,
  user: config.filemaker.username,
  password: config.filemaker.password,
});

// Test the connection
const testConnection = async () => {
  try {
    await client.authenticate();
    logger.info("Successfully connected to FileMaker Server");
    return true;
  } catch (error) {
    logger.error("Failed to connect to FileMaker Server:", error.message);
    return false;
  }
};

module.exports = {
  client,
  testConnection,
};
