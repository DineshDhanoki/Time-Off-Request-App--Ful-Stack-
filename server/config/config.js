require("dotenv").config();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "your_jwt_secret",
  filemaker: {
    server: process.env.FM_SERVER || "your-filemaker-server.com",
    database: process.env.FM_DATABASE || "TimeOffRequestsDB",
    username: process.env.FM_USERNAME || "admin",
    password: process.env.FM_PASSWORD || "password",
  },
};
