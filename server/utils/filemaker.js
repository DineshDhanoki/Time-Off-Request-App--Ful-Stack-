const { client } = require("../config/db");
const logger = require("../middleware/logger");

// Helper function to handle FileMaker errors
const handleFileMakerError = (error) => {
  logger.error("FileMaker error:", error);

  if (error.code && error.message) {
    return {
      status: error.code >= 400 ? error.code : 500,
      message: error.message,
    };
  }

  return {
    status: 500,
    message: "An error occurred with the FileMaker service",
  };
};

// Transform FileMaker record to application format
const transformRecord = (record) => {
  const { fieldData, recordId, portalData } = record;
  return {
    id: recordId,
    ...fieldData,
    ...(portalData ? { portalData } : {}),
  };
};

module.exports = {
  handleFileMakerError,
  transformRecord,
};
