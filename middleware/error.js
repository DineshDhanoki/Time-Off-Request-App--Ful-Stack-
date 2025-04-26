const logger = require("./logger");

module.exports = (err, req, res, next) => {
  logger.error(`${err.name}: ${err.message}`, { stack: err.stack });

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Server Error",
  });
};
