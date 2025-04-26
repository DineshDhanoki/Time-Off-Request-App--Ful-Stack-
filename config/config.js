// server/config/config.js
require("dotenv").config();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "your-secret-key",
  jwtExpiration: process.env.JWT_EXPIRATION || "1d",

  // FileMaker configuration
  filemaker: {
    serverUrl:
      process.env.FILEMAKER_SERVER_URL || "https://your-filemaker-server.com",
    database: process.env.FILEMAKER_DATABASE || "TimeOffRequests",
    username: process.env.FILEMAKER_USERNAME || "apiuser",
    password: process.env.FILEMAKER_PASSWORD || "apipassword",
    layout: process.env.FILEMAKER_LAYOUT || "main",
    requestsLayout: process.env.FILEMAKER_REQUESTS_LAYOUT || "requests",
    usersLayout: process.env.FILEMAKER_USERS_LAYOUT || "users",
  },

  // HRMS mock service
  hrmsApi: process.env.HRMS_API_URL || "http://localhost:5000/api/hrms",
};
