const filemakerService = require("./filemaker");
const logger = require("../middleware/logger");

class HRMSService {
  constructor() {
    this.layout = "HRMS_Requests";
  }

  // Process a time-off request through HRMS
  async processRequest(requestData) {
    try {
      logger.info("Processing request through HRMS:", requestData);

      // Generate a unique request_id
      const request_id = `REQ-${Date.now()}-${Math.floor(
        Math.random() * 1000
      )}`;

      // Store the request in HRMS layout with the unique ID
      const hrmsData = {
        ...requestData,
        request_id,
        status: "Pending",
        created_at: new Date().toISOString(),
      };

      await filemakerService.create(this.layout, hrmsData);

      logger.info(`Request processed with ID: ${request_id}`);
      return { ...hrmsData };
    } catch (error) {
      logger.error("Error processing request through HRMS:", error);
      throw error;
    }
  }

  // Update request status in HRMS
  async updateRequestStatus(request_id, status, managerNotes = "") {
    try {
      logger.info(`Updating request ${request_id} status to ${status}`);

      // Find the request by request_id
      const query = { request_id };
      const requests = await filemakerService.find(this.layout, query);

      if (!requests || requests.length === 0) {
        throw new Error(`Request with ID ${request_id} not found`);
      }

      const request = requests[0];

      // Update the request status
      const updateData = {
        status,
        managerNotes,
        updated_at: new Date().toISOString(),
      };

      await filemakerService.update(this.layout, request.id, updateData);

      return { request_id, status, managerNotes };
    } catch (error) {
      logger.error(`Error updating request status: ${error}`);
      throw error;
    }
  }

  // Get request by ID
  async getRequestById(request_id) {
    try {
      const query = { request_id };
      const requests = await filemakerService.find(this.layout, query);

      if (!requests || requests.length === 0) {
        throw new Error(`Request with ID ${request_id} not found`);
      }

      return requests[0];
    } catch (error) {
      logger.error(`Error getting request by ID: ${error}`);
      throw error;
    }
  }
}

module.exports = new HRMSService();
