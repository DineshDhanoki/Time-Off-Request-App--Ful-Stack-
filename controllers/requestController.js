// server/controllers/requestController.js
const filemaker = require("../services/filemaker");
const hrmsService = require("../services/hrmsService");
const notificationService = require("../services/notificationService");
const asyncHandler = require("../utils/asyncHandler");

// Create a new time-off request
exports.createRequest = asyncHandler(async (req, res) => {
  const { start_date, end_date, reason } = req.body;
  const employee_id = req.user.id; // From auth middleware

  // Validate input
  if (!start_date || !end_date || !reason) {
    return res.status(400).json({
      success: false,
      message: "Please provide start date, end date, and reason",
    });
  }

  // 1. Save request to FileMaker
  const fmResponse = await filemaker.createTimeOffRequest({
    employee_id,
    start_date,
    end_date,
    reason,
    status: "pending",
  });

  const requestId = fmResponse.recordId;

  // 2. Send to HRMS to get unique request ID
  const hrmsResponse = await hrmsService.submitRequest({
    employee_id,
    start_date,
    end_date,
    reason,
  });

  // 3. Update FileMaker record with HRMS ID
  await filemaker.updateRequestWithHrmsId(
    requestId,
    hrmsResponse.hrmsRequestId
  );

  // 4. Notify managers via WebSocket
  const requestData = {
    id: requestId,
    hrms_id: hrmsResponse.hrmsRequestId,
    employee_id,
    employee_name: req.user.name, // Assuming user object has name
    start_date,
    end_date,
    reason,
    status: "pending",
    created_at: new Date().toISOString(),
  };

  notificationService.notifyNewRequest(requestData);

  res.status(201).json({
    success: true,
    message: "Time-off request created successfully",
    data: {
      id: requestId,
      hrms_id: hrmsResponse.hrmsRequestId,
      status: "pending",
    },
  });
});

// Get requests for the logged-in employee
exports.getMyRequests = asyncHandler(async (req, res) => {
  const employee_id = req.user.id;

  const response = await filemaker.getRequestsByEmployee(employee_id);

  res.status(200).json({
    success: true,
    data: response.data,
  });
});

// Get pending requests for manager
exports.getPendingRequests = asyncHandler(async (req, res) => {
  // Verify user is a manager
  if (req.user.role !== "manager" && req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Not authorized to access manager resources",
    });
  }

  const departmentIds = req.user.departments || [req.user.department_id];

  const response = await filemaker.getPendingRequestsForManager(departmentIds);

  res.status(200).json({
    success: true,
    data: response.data,
  });
});

// Update request status (approve or reject)
exports.updateRequestStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  // Validate input
  if (!status || !["approved", "rejected"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid status (approved or rejected)",
    });
  }

  // 1. Get the request from FileMaker to verify it exists and get details
  const requestQuery = await filemaker.makeRequest(
    "get",
    `layouts/${filemaker.layout}/records/${id}`
  );
  const request = requestQuery.data;

  if (!request) {
    return res.status(404).json({
      success: false,
      message: "Request not found",
    });
  }

  // 2. Update status in FileMaker
  await filemaker.updateRequestStatus(id, status, notes);

  // 3. Update status in HRMS
  await hrmsService.updateRequestStatus(request.hrms_request_id, status, notes);

  // 4. Send notification to employee
  const notificationData = {
    id,
    status,
    notes,
    updated_at: new Date().toISOString(),
    updated_by: req.user.id,
  };

  notificationService.notifyRequestStatusChange(
    request.employee_id,
    notificationData
  );

  res.status(200).json({
    success: true,
    message: `Request ${status} successfully`,
    data: {
      id,
      status,
      updated_at: new Date().toISOString(),
    },
  });
});

// Check availability for time period and role
exports.checkAvailability = asyncHandler(async (req, res) => {
  const { role_id, start_date, end_date } = req.query;

  if (!role_id || !start_date || !end_date) {
    return res.status(400).json({
      success: false,
      message: "Please provide role_id, start_date, and end_date",
    });
  }

  const approvedRequests = await filemaker.getApprovedRequestsByRoleAndPeriod(
    role_id,
    start_date,
    end_date
  );

  res.status(200).json({
    success: true,
    data: {
      role_id,
      start_date,
      end_date,
      conflicting_requests: approvedRequests.data || [],
    },
  });
});
