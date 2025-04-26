const express = require("express");
const { check } = require("express-validator");
const requestController = require("../controllers/requestController");
const auth = require("../middleware/auth");

const router = express.Router();

// All routes require authentication
router.use(auth);

// @route   POST api/requests
// @desc    Create a new time-off request
// @access  Private (Employee)
router.post(
  "/",
  [
    check("startDate", "Start date is required").not().isEmpty(),
    check("endDate", "End date is required").not().isEmpty(),
    check("reason", "Reason is required").not().isEmpty(),
  ],
  requestController.createRequest
);

// @route   GET api/requests/employee
// @desc    Get all requests for the logged-in employee
// @access  Private (Employee)
router.get("/employee", requestController.getEmployeeRequests);

// @route   GET api/requests/manager
// @desc    Get all requests for the logged-in manager
// @access  Private (Manager)
router.get("/manager", requestController.getManagerRequests);

// @route   GET api/requests/:id
// @desc    Get a single request by ID
// @access  Private (Employee/Manager/Admin)
router.get("/:id", requestController.getRequestById);

// @route   PUT api/requests/:id/process
// @desc    Process manager's decision (approve/reject)
// @access  Private (Manager)
router.put(
  "/:id/process",
  [
    check("status", "Status is required").isIn(["Approved", "Rejected"]),
    check("notes", "Notes are required").not().isEmpty(),
  ],
  requestController.processRequest
);

module.exports = router;
