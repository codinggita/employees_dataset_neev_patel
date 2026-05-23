// Employee Controller
// Handles request/response for employee CRUD and info routes

const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../middlewares/AppError');
const employeeService = require('../services/employeeService');

// GET /employees — Get all employees
const getAllEmployees = asyncHandler(async (req, res) => {
  const employees = await employeeService.getAllEmployees();
  res.json({ success: true, count: employees.length, data: employees });
});

// GET /employees/:id — Get employee by ID
const getEmployeeById = asyncHandler(async (req, res) => {
  const employee = await employeeService.getEmployeeById(req.params.id);
  if (!employee) {
    throw new AppError('Employee not found', 404);
  }
  res.json({ success: true, data: employee });
});

// POST /employees — Create a new employee
const createEmployee = asyncHandler(async (req, res) => {
  const { name, profile } = req.body;
  const email = profile?.contact?.email;

  if (!name || !email) {
    throw new AppError('Name and email are required', 400);
  }

  // Check for duplicate id
  if (req.body.id) {
    const exists = await employeeService.employeeExists(req.body.id);
    if (exists) {
      throw new AppError('Employee with this ID already exists', 409);
    }
  }

  const employee = await employeeService.createEmployee(req.body);
  res.status(201).json({ success: true, data: employee });
});

// DELETE /employees/:id — Delete employee by ID
const deleteEmployeeById = asyncHandler(async (req, res) => {
  const employee = await employeeService.deleteEmployeeById(req.params.id);
  if (!employee) {
    throw new AppError('Employee not found', 404);
  }
  res.json({ success: true, message: 'Employee deleted successfully' });
});

// GET /employees/exists/:id — Check if employee exists
const checkEmployeeExists = asyncHandler(async (req, res) => {
  const exists = await employeeService.employeeExists(req.params.id);
  res.json({ success: true, exists });
});

// POST /employees/bulk-create — Bulk create employees
const bulkCreateEmployees = asyncHandler(async (req, res) => {
  const result = await employeeService.bulkCreate(req.body);
  res.status(201).json({ success: true, count: result.length, data: result });
});

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  deleteEmployeeById,
  checkEmployeeExists,
  bulkCreateEmployees,
};
