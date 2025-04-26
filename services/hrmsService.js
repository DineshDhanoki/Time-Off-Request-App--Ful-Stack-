// server/services/hrmsService.js
const { v4: uuidv4 } = require("uuid");

/**
 * A mock HRMS service that simulates integration with an external HR Management System
 */
class HrmsService {
  /**
   * Submit a time-off request to the HRMS
   * Returns a unique request ID from the HRMS
   */
  async submitRequest(requestData) {
    // In a real implementation, this would make an API call to the HRMS
    // For simulation, we'll just generate a UUID as a request ID

    // Simulate API latency
    await new Promise((resolve) => setTimeout(resolve, 500));

    const hrmsRequestId = `HRMS-${uuidv4().substring(0, 8).toUpperCase()}`;

    console.log(
      `HRMS: Received request for employee ${requestData.employee_id}. Assigned ID: ${hrmsRequestId}`
    );

    return {
      success: true,
      hrmsRequestId,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Update the status of a request in the HRMS
   */
  async updateRequestStatus(hrmsRequestId, status, managerNotes = null) {
    // Simulate API latency
    await new Promise((resolve) => setTimeout(resolve, 300));

    console.log(`HRMS: Updated request ${hrmsRequestId} status to ${status}`);

    return {
      success: true,
      hrmsRequestId,
      status,
      updatedAt: new Date().toISOString(),
    };
  }
}

module.exports = new HrmsService();
