const filemakerService = require("../services/filemaker");

class Request {
  constructor() {
    this.layout = "TimeOffRequests";
  }

  async create(requestData) {
    return await filemakerService.create(this.layout, requestData);
  }

  async findById(id) {
    return await filemakerService.getById(this.layout, id);
  }

  async update(id, data) {
    return await filemakerService.update(this.layout, id, data);
  }

  async delete(id) {
    return await filemakerService.delete(this.layout, id);
  }

  async findAll() {
    return await filemakerService.getAll(this.layout);
  }

  async findByEmployee(employeeId) {
    const query = { employeeId };
    return await filemakerService.find(this.layout, query);
  }

  async findByManager(managerId) {
    const query = { managerId };
    return await filemakerService.find(this.layout, query);
  }

  async findByStatus(status) {
    const query = { status };
    return await filemakerService.find(this.layout, query);
  }

  async findByDateRange(startDate, endDate) {
    // This is a simplified version; in a real application, you would need
    // to handle date range queries according to FileMaker's query capabilities
    const query = {
      startDate: { $gte: startDate },
      endDate: { $lte: endDate },
    };
    return await filemakerService.find(this.layout, query);
  }

  async findApprovedByRoleAndDateRange(role, startDate, endDate) {
    // This would be used by managers to check for skill availability
    const query = {
      role,
      status: "Approved",
      startDate: { $lte: endDate },
      endDate: { $gte: startDate },
    };
    return await filemakerService.find(this.layout, query);
  }
}

module.exports = new Request();
