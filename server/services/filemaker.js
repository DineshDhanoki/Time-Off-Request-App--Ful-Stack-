const { client } = require("../config/db");
const { handleFileMakerError, transformRecord } = require("../utils/filemaker");
const logger = require("../middleware/logger");

class FileMakerService {
  constructor() {
    this.client = client;
  }

  // Get all records from a layout
  async getAll(layout) {
    try {
      await this.client.authenticate();
      const response = await this.client.list(layout);
      return response.data.map(transformRecord);
    } catch (error) {
      logger.error(`Error getting records from ${layout}:`, error);
      throw handleFileMakerError(error);
    }
  }

  // Get a specific record by ID
  async getById(layout, recordId) {
    try {
      await this.client.authenticate();
      const response = await this.client.get(layout, recordId);
      return transformRecord(response.data[0]);
    } catch (error) {
      logger.error(`Error getting record ${recordId} from ${layout}:`, error);
      throw handleFileMakerError(error);
    }
  }

  // Create a new record
  async create(layout, data) {
    try {
      await this.client.authenticate();
      const response = await this.client.create(layout, data);
      return {
        recordId: response.recordId,
        ...data,
      };
    } catch (error) {
      logger.error(`Error creating record in ${layout}:`, error);
      throw handleFileMakerError(error);
    }
  }

  // Update an existing record
  async update(layout, recordId, data) {
    try {
      await this.client.authenticate();
      await this.client.edit(layout, recordId, data);
      return {
        recordId,
        ...data,
      };
    } catch (error) {
      logger.error(`Error updating record ${recordId} in ${layout}:`, error);
      throw handleFileMakerError(error);
    }
  }

  // Delete a record
  async delete(layout, recordId) {
    try {
      await this.client.authenticate();
      await this.client.delete(layout, recordId);
      return { success: true, recordId };
    } catch (error) {
      logger.error(`Error deleting record ${recordId} from ${layout}:`, error);
      throw handleFileMakerError(error);
    }
  }

  // Find records by query
  async find(layout, query) {
    try {
      await this.client.authenticate();
      const response = await this.client.find(layout, query);
      return response.data.map(transformRecord);
    } catch (error) {
      logger.error(`Error finding records in ${layout}:`, error);
      throw handleFileMakerError(error);
    }
  }
}

module.exports = new FileMakerService();
