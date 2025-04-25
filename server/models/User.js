const filemakerService = require("../services/filemaker");

class User {
  constructor() {
    this.layout = "Users";
  }

  async create(userData) {
    return await filemakerService.create(this.layout, userData);
  }

  async findById(id) {
    return await filemakerService.getById(this.layout, id);
  }

  async findByEmail(email) {
    const query = { email };
    const users = await filemakerService.find(this.layout, query);
    return users.length > 0 ? users[0] : null;
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

  async findByRole(role) {
    const query = { role };
    return await filemakerService.find(this.layout, query);
  }

  async findManager(employeeId) {
    // In a real application, there would be a relationship between employees and managers
    // For simplicity, we're assuming that the manager information is stored in the user record
    const employee = await this.findById(employeeId);
    if (!employee || !employee.managerId) {
      return null;
    }

    return await this.findById(employee.managerId);
  }
}

module.exports = new User();
