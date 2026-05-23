// Employee Controller
// Handles request/response for employee CRUD and info routes

const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../middlewares/AppError');
const employeeService = require('../services/employeeService');

// GET /employees — Get all employees (now with query params, pagination, and sorting)
const getAllEmployees = asyncHandler(async (req, res) => {
  const { sort, page, limit, ...filters } = req.query;
  const result = await employeeService.queryEmployees(filters, sort, page, limit);
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
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

// PUT /employees/:id — Replace employee by ID
const replaceEmployee = asyncHandler(async (req, res) => {
  const employee = await employeeService.replaceEmployeeById(req.params.id, req.body);
  if (!employee) {
    throw new AppError('Employee not found', 404);
  }
  res.json({ success: true, data: employee });
});

// PATCH /employees/:id — Update employee by ID
const updateEmployee = asyncHandler(async (req, res) => {
  const employee = await employeeService.updateEmployeeById(req.params.id, req.body);
  if (!employee) {
    throw new AppError('Employee not found', 404);
  }
  res.json({ success: true, data: employee });
});

// PATCH /employees/bulk-update — Bulk update employees
const bulkUpdateEmployees = asyncHandler(async (req, res) => {
  const { updates } = req.body;
  const result = await employeeService.bulkUpdate(updates);
  res.json({ success: true, count: result.length, data: result });
});

// DELETE /employees/bulk-delete — Bulk delete employees
const bulkDeleteEmployees = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  const result = await employeeService.bulkDelete(ids);
  res.json({ success: true, deletedCount: result.deletedCount });
});

// GET /employees/name/:name — Find employees by name
const getByName = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.findByName(req.params.name, { page, limit });
  if (!result.data.length) {
    throw new AppError('Employee not found', 404);
  }
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
});

// GET /employees/state/:state — Find employees by state
const getByState = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.findByState(req.params.state, { page, limit });
  if (!result.data.length) {
    throw new AppError('Employee not found', 404);
  }
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
});

// GET /employees/country/:country — Find employees by country
const getByCountry = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.findByCountry(req.params.country, { page, limit });
  if (!result.data.length) {
    throw new AppError('Employee not found', 404);
  }
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
});

// GET /employees/city/:city — Find employees by city
const getByCity = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.findByCity(req.params.city, { page, limit });
  if (!result.data.length) {
    throw new AppError('Employee not found', 404);
  }
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
});

// GET /employees/timezone/:timezone — Find employees by timezone
const getByTimezone = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.findByTimezone(req.params.timezone, { page, limit });
  if (!result.data.length) {
    throw new AppError('Employee not found', 404);
  }
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
});

// GET /employees/primary-skill/:skill — Find employees by primary skill
const getByPrimarySkill = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.findByPrimarySkill(req.params.skill, { page, limit });
  if (!result.data.length) {
    throw new AppError('Employee not found', 404);
  }
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
});

// GET /employees/secondary-skill/:skill — Find employees by secondary skill
const getBySecondarySkill = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.findBySecondarySkill(req.params.skill, { page, limit });
  if (!result.data.length) {
    throw new AppError('Employee not found', 404);
  }
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
});

// GET /employees/domain/:domain — Find employees by domain
const getByDomain = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.findByDomain(req.params.domain, { page, limit });
  if (!result.data.length) {
    throw new AppError('Employee not found', 404);
  }
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
});

// GET /employees/experience/:years — Find employees by experience years
const getByExperience = asyncHandler(async (req, res) => {
  const years = req.params.years;
  if (isNaN(Number(years))) {
    throw new AppError('Experience must be a valid number', 400);
  }
  const { page, limit } = req.query;
  const result = await employeeService.findByExperience(years, { page, limit });
  if (!result.data.length) {
    throw new AppError('Employee not found', 404);
  }
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
});

// GET /employees/project/:projectId — Find employees by project ID
const getByProjectId = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.findByProjectId(req.params.projectId, { page, limit });
  if (!result.data.length) {
    throw new AppError('Employee not found', 404);
  }
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
});

// GET /employees/task/:taskId — Find employees by task ID
const getByTaskId = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.findByTaskId(req.params.taskId, { page, limit });
  if (!result.data.length) {
    throw new AppError('Employee not found', 404);
  }
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
});

// GET /employees/certification/:certification — Find employees by certification
const getByCertification = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.findByCertification(req.params.certification, { page, limit });
  if (!result.data.length) {
    throw new AppError('Employee not found', 404);
  }
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
});

// Sort controllers
const sortByExperienceDesc = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.queryEmployees({}, { 'profile.projects.tasks.assignedTo.skills.experience.years': -1 }, page, limit);
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
});

const sortByNameAsc = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.queryEmployees({}, { name: 1 }, page, limit);
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
});

const sortByProjectAsc = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.queryEmployees({}, { 'profile.projects.projectId': 1 }, page, limit);
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
});

const sortByDomainAsc = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.queryEmployees({}, { 'profile.projects.tasks.assignedTo.skills.experience.domains': 1 }, page, limit);
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
});

const sortByCertificationDesc = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.queryEmployees({}, { 'profile.projects.tasks.assignedTo.skills.experience.certifications.current': -1 }, page, limit);
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
});

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  deleteEmployeeById,
  checkEmployeeExists,
  bulkCreateEmployees,
  replaceEmployee,
  updateEmployee,
  bulkUpdateEmployees,
  bulkDeleteEmployees,
  getByName,
  getByState,
  getByCountry,
  getByCity,
  getByTimezone,
  getByPrimarySkill,
  getBySecondarySkill,
  getByDomain,
  getByExperience,
  getByProjectId,
  getByTaskId,
  getByCertification,
  sortByExperienceDesc,
  sortByNameAsc,
  sortByProjectAsc,
  sortByDomainAsc,
  sortByCertificationDesc,
};
