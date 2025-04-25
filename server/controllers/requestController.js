const Request = require("../models/Request");
const User = require("../models/User");
const hrmsService = require("../services/hrmsService");
const notificationService = require("../services/notificationService");
const asyncHandler = require("../utils/asyncHandler");
const logger = require("../middleware/logger");

// Create a new time-off request
exports.createRequest = asyncHandler(async (req, res) => {
  const { startDate, endDate, reason } = req.body;
  const employeeId = req.user.id;

  // Get employee details
  const employee = await User.findById(employeeId);
  if (!employee) {
    return res.status(404).json({ message: "Employee not found" });
  }

  // Get manager
  const manager = await User.findManager(employeeId);
  if (!manager) {
    return res
      .status(404)
      .json({ message: "Manager not found for this employee" });
  }

  // Create request
  const requestData = {
    employeeId,
    employeeName: employee.name,
    role: employee.role,
    managerId: manager.id,
    managerName: manager.name,
    startDate,
    endDate,
    reason,
    status: "Pending",
    createdAt: new Date().toISOString(),
  };

  // Save request in app database
  const savedRequest = await Request.create(requestData);

  // Process request through HRMS
  const hrmsResponse = await hrmsService.processRequest({
    ...requestData,
    requestId: savedRequest.id,
  });

  // Update request with HRMS request_id
  const updatedRequest = await Request.update(savedRequest.id, {
    hrmsRequestId: hrmsResponse.request_id,
  });

  // Send notification to manager
  notificationService.sendToUser(manager.id, "NEW_REQUEST", {
    requestId: savedRequest.id,
    employeeName: employee.name,
    startDate,
    endDate,
  });

  res.status(201).json(updatedRequest);
});

// Get all requests for the logged-in employee
exports.getEmployeeRequests = asyncHandler(async (req, res) => {
  const employeeId = req.user.id;
  const requests = await Request.findByEmployee(employeeId);
  res.json(requests);
});

// Get all requests for the logged-in manager
exports.getManagerRequests = asyncHandler(async (req, res) => {
  const managerId = req.user.id;
  const requests = await Request.findByManager(managerId);
  res.json(requests);
});

// Get a single request by ID
exports.getRequestById = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id);

  if (!request) {
    return res.status(404).json({ message: "Request not found" });
  }

  // Check if user is authorized to see this request
  if (
    req.user.role !== "admin" &&
    request.employeeId !== req.user.id &&
    request.managerId !== req.user.id
  ) {
    return res
      .status(403)
      .json({ message: "Not authorized to view this request" });
  }

  res.json(request);
});

// Process manager's decision (approve/reject)
exports.processRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  const managerId = req.user.id;

  // Validate status
  if (!["Approved", "Rejected"].includes(status)) {
    return res
      .status(400)
      .json({ message: "Status must be either Approved or Rejected" });
  }

  // Get request
  const request = await Request.findById(id);
  if (!request) {
    return res.status(404).json({ message: "Request not found" });
  }

  // Check if user is the manager for this request
  if (request.managerId !== managerId) {
    return res
      .status(403)
      .json({ message: "Not authorized to process this request" });
  }

  // Check for conflicts if approving
  if (status === "Approved") {
    // Get other approved requests for the same role and date range
    const approvedRequests = await Request.findApprovedByRoleAndDateRange(
      request.role,
      request.startDate,
      request.endDate
    );

    // Filter out the current request if it was already approved
    const otherApprovedRequests = approvedRequests.filter((r) => r.id !== id);

    // Simple conflict check - in a real app this would be more sophisticated
    if (otherApprovedRequests.length > 0) {
      logger.info(`Found ${otherApprovedRequests.length} conflicting requests`);
      // You could implement more complex logic here to determine if there's a real conflict
    }

    // Here you would add logic to check job scheduler for availability
    // This is a placeholder for the actual logic
    const jobsInRange = []; // This would come from your job scheduling system

    if (jobsInRange.length > 0) {
      logger.info(
        `Found ${jobsInRange.length} jobs scheduled during the requested time off`
      );
      // More complex logic to determine if there's sufficient staffing
    }
  }

  // Update request status
  const updateData = {
    status,
    managerNotes: notes,
    processedAt: new Date().toISOString(),
  };

  const updatedRequest = await Request.update(id, updateData);

  // Update HRMS
  await hrmsService.updateRequestStatus(request.hrmsRequestId, status, notes);

  // Send notification to employee
  notificationService.sendToUser(request.employeeId, "REQUEST_DECISION", {
    requestId: id,
    status,
    managerNotes: notes,
  });

  res.json(updatedRequest);
});
