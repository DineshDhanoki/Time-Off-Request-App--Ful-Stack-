import api from "./api";

const userService = {
  getAllUsers: async () => {
    const response = await api.get("/users");
    return response.data;
  },

  getUsersByRole: async (role) => {
    const response = await api.get(`/users/role/${role}`);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put("/users/profile", userData);
    return response.data;
  },
};

export default userService;
