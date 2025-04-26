// server/services/filemaker.js
const axios = require("axios");
const config = require("../config/config");

class FileMakerService {
  constructor() {
    this.baseUrl = config.filemaker.serverUrl;
    this.database = config.filemaker.database;
    this.layout = config.filemaker.layout;
    this.token = null;
    this.tokenExpiration = null;
  }

  /**
   * Login to FileMaker Data API and get session token
   */
  async authenticate() {
    try {
      const response = await axios({
        method: "post",
        url: `${this.baseUrl}/fmi/data/v1/databases/${this.database}/sessions`,
        headers: {
          "Content-Type": "application/json",
        },
        auth: {
          username: config.filemaker.username,
          password: config.filemaker.password,
        },
      });

      this.token = response.data.response.token;
      this.tokenExpiration = new Date(Date.now() + 15 * 60 * 1000); // 15 min expiration
      return this.token;
    } catch (error) {
      console.error(
        "FileMaker authentication error:",
        error.response ? error.response.data : error.message
      );
      throw new Error("Failed to authenticate with FileMaker");
    }
  }

  /**
   * Check if token is valid, request new one if needed
   */
  async ensureValidToken() {
    if (!this.token || new Date() >= this.tokenExpiration) {
      await this.authenticate();
    }
    return this.token;
  }

  /**
   * Generic request method with token handling
   */
  async makeRequest(method, endpoint, data = null) {
    const token = await this.ensureValidToken();

    try {
      const response = await axios({
        method,
        url: `${this.baseUrl}/fmi/data/v1/databases/${this.database}/${endpoint}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data,
      });

      return response.data.response;
    } catch (error) {
      // If token is invalid, try to authenticate once more
      if (error.response && error.response.status === 401) {
        await this.authenticate();
        return this.makeRequest(method, endpoint, data);
      }

      console.error(
        "FileMaker API error:",
        error.response ? error.response.data : error.message
      );
      throw new Error(
        error.response?.data?.messages?.[0]?.message ||
          "FileMaker request failed"
      );
    }
  }

  /**
   * Create a new time-off request in FileMaker
   */
  async createTimeOffRequest(requestData) {
    const {
      employee_id,
      start_date,
      end_date,
      reason,
      status = "pending",
    } = requestData;

    const fieldData = {
      employee_id,
      start_date,
      end_date,
      reason,
      status,
      created_at: new Date().toISOString(),
    };

    return this.makeRequest(
      "post",
      `layouts/${config.filemaker.requestsLayout}/records`,
      {
        fieldData,
      }
    );
  }

  /**
   * Update a time-off request with HRMS ID
   */
  async updateRequestWithHrmsId(recordId, hrmsId) {
    return this.makeRequest(
      "patch",
      `layouts/${config.filemaker.requestsLayout}/records/${recordId}`,
      {
        fieldData: {
          hrms_request_id: hrmsId,
        },
      }
    );
  }

  /**
   * Update request status (approved/rejected)
   */
  async updateRequestStatus(recordId, status, managerNotes = null) {
    const fieldData = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (managerNotes) {
      fieldData.manager_notes = managerNotes;
    }

    return this.makeRequest(
      "patch",
      `layouts/${config.filemaker.requestsLayout}/records/${recordId}`,
      {
        fieldData,
      }
    );
  }

  /**
   * Get time-off requests by employee ID
   */
  async getRequestsByEmployee(employeeId) {
    const query = {
      query: [
        {
          employee_id: employeeId,
        },
      ],
    };

    return this.makeRequest(
      "post",
      `layouts/${config.filemaker.requestsLayout}/_find`,
      query
    );
  }

  /**
   * Get all pending requests for a manager
   */
  async getPendingRequestsForManager(departmentIds) {
    const query = {
      query: [
        {
          status: "pending",
          department_id: departmentIds,
        },
      ],
    };

    return this.makeRequest(
      "post",
      `layouts/${config.filemaker.requestsLayout}/_find`,
      query
    );
  }

  /**
   * Get approved requests for a time period and role
   * Used for checking availability
   */
  async getApprovedRequestsByRoleAndPeriod(roleId, startDate, endDate) {
    const query = {
      query: [
        {
          role_id: roleId,
          status: "approved",
          start_date: `<=${endDate}`,
          end_date: `>=${startDate}`,
        },
      ],
    };

    return this.makeRequest(
      "post",
      `layouts/${config.filemaker.requestsLayout}/_find`,
      query
    );
  }

  /**
   * Get user by credentials for login
   */
  async getUserByCredentials(email, password) {
    const query = {
      query: [
        {
          email: email,
          password: password, // In production, use proper password handling!
        },
      ],
    };

    return this.makeRequest(
      "post",
      `layouts/${config.filemaker.usersLayout}/_find`,
      query
    );
  }

  /**
   * Create new user (registration)
   */
  async createUser(userData) {
    return this.makeRequest(
      "post",
      `layouts/${config.filemaker.usersLayout}/records`,
      {
        fieldData: userData,
      }
    );
  }
}

module.exports = new FileMakerService();
