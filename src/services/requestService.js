// client/src/services/requestService.js
import api from "./api";

const requestService = {
  // Get all requests for the current user
  getUserRequests: async () => {
    return api.get("/requests/user");
  },

  // Get all requests for the manager
  getManagerRequests: async () => {
    return api.get("/requests/manager");
  },

  // Get a single request by ID
  getRequestById: async (id) => {
    return api.get(`/requests/${id}`);
  },

  // Create a new request
  createRequest: async (requestData) => {
    return api.post("/requests", requestData);
  },

  // Update a request
  updateRequest: async (id, requestData) => {
    return api.put(`/requests/${id}`, requestData);
  },

  // Approve a request
  approveRequest: async (id, comments) => {
    return api.put(`/requests/${id}/approve`, { comments });
  },

  // Reject a request
  rejectRequest: async (id, comments) => {
    return api.put(`/requests/${id}/reject`, { comments });
  },

  // Get availability data for a date range
  checkAvailability: async (startDate, endDate, role) => {
    return api.get("/requests/availability", {
      params: { startDate, endDate, role },
    });
  },

  // Get scheduled jobs for a date range
  getScheduledJobs: async (startDate, endDate, employeeId) => {
    return api.get("/requests/jobs", {
      params: { startDate, endDate, employeeId },
    });
  },
};

export default requestService;
