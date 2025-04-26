const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

// Get all users (admin only)
exports.getAllUsers = asyncHandler(async (req, res) => {
  // Check if user is admin
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized" });
  }

  const users = await User.findAll();

  // Remove passwords from response
  const sanitizedUsers = users.map((user) => {
    const { password, ...userData } = user;
    return userData;
  });

  res.json(sanitizedUsers);
});

// Get users by role
exports.getUsersByRole = asyncHandler(async (req, res) => {
  const { role } = req.params;

  // Validate role
  if (!["employee", "manager", "admin"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  // Only managers and admins can view users by role
  if (req.user.role === "employee") {
    return res.status(403).json({ message: "Not authorized" });
  }

  const users = await User.findByRole(role);

  // Remove passwords from response
  const sanitizedUsers = users.map((user) => {
    const { password, ...userData } = user;
    return userData;
  });

  res.json(sanitizedUsers);
});

// Get user by ID
exports.getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check authorization
  if (req.user.role !== "admin" && req.user.id !== id) {
    return res.status(403).json({ message: "Not authorized" });
  }

  // Remove password from response
  const { password, ...userData } = user;

  res.json(userData);
});

// Update user
exports.updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  // Check if user exists
  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check authorization
  if (req.user.role !== "admin" && req.user.id !== id) {
    return res.status(403).json({ message: "Not authorized" });
  }

  // Prevent non-admins from changing roles
  if (req.user.role !== "admin" && role && role !== user.role) {
    return res.status(403).json({ message: "Not authorized to change role" });
  }

  // Update user data
  const updateData = {};

  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (role && req.user.role === "admin") updateData.role = role;

  const updatedUser = await User.update(id, updateData);

  // Remove password from response
  const { password, ...userData } = updatedUser;

  res.json(userData);
});

// Delete user (admin only)
exports.deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if user is admin
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized" });
  }

  // Check if user exists
  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  await User.delete(id);

  res.json({ message: "User deleted" });
});
