const express = require("express");
const { check } = require("express-validator");
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

const router = express.Router();

// All routes require authentication
router.use(auth);

// @route   GET api/users
// @desc    Get all users
// @access  Private (Admin)
router.get("/", userController.getAllUsers);

// @route   GET api/users/role/:role
// @desc    Get users by role
// @access  Private (Manager/Admin)
router.get("/role/:role", userController.getUsersByRole);

// @route   GET api/users/:id
// @desc    Get user by ID
// @access  Private (Self/Admin)
router.get("/:id", userController.getUserById);

// @route   PUT api/users/:id
// @desc    Update user
// @access  Private (Self/Admin)
router.put(
  "/:id",
  [
    check("name", "Name is required").optional(),
    check("email", "Please include a valid email").optional().isEmail(),
  ],
  userController.updateUser
);

// @route   DELETE api/users/:id
// @desc    Delete user
// @access  Private (Admin)
router.delete("/:id", userController.deleteUser);

module.exports = router;
