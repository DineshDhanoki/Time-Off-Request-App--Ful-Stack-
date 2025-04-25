const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const logger = require("../middleware/logger");

// Register user
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if user exists
  let user = await User.findByEmail(email);
  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Create user object
  const newUser = {
    name,
    email,
    password: await bcrypt.hash(password, 10),
    role: role || "employee", // Default role is employee
    createdAt: new Date().toISOString(),
  };

  // Save user to database
  user = await User.create(newUser);

  // Create JWT payload
  const payload = {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };

  // Sign and return JWT
  jwt.sign(payload, config.jwtSecret, { expiresIn: "24h" }, (err, token) => {
    if (err) throw err;
    res.json({ token });
  });
});

// Authenticate user & get token
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findByEmail(email);
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Create JWT payload
  const payload = {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };

  // Sign and return JWT
  jwt.sign(payload, config.jwtSecret, { expiresIn: "24h" }, (err, token) => {
    if (err) throw err;
    res.json({ token });
  });
});

// Get current user
exports.getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Don't send password
  const { password, ...userData } = user;
  res.json(userData);
});
