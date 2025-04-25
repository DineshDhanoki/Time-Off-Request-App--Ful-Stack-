// client/src/services/authService.js
import api from "./api";

const authService = {
  // Login user
  login: async (credentials) => {
    return api.post("/auth/login", credentials);
  },

  // Register user
  register: async (userData) => {
    return api.post("/auth/register", userData);
  },

  // Get current user
  getCurrentUser: async () => {
    return api.get("/auth/me");
  },

  // Update user profile
  updateProfile: async (userData) => {
    return api.put("/auth/profile", userData);
  },
};

export default authService;
