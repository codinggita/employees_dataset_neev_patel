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
  const { id, name, profile } = req.body;
  const email = profile?.contact?.email;

  if (!id || !name || !email) {
    throw new AppError('ID, name, and email are required', 400);
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
  if (!Array.isArray(req.body) || req.body.length === 0) {
    throw new AppError('Request body must be a non-empty array of employees', 400);
  }
  for (const emp of req.body) {
    const email = emp.profile?.contact?.email;
    if (!emp.id || !emp.name || !email) {
      throw new AppError('Each employee must have an id, name, and profile.contact.email', 400);
    }
  }
  const result = await employeeService.bulkCreate(req.body);
  res.status(201).json({ success: true, count: result.length, data: result });
});

// PUT /employees/:id — Replace employee by ID
const replaceEmployee = asyncHandler(async (req, res) => {
  const { name, profile } = req.body;
  const email = profile?.contact?.email;
  if (!name || !email) {
    throw new AppError('Name and email are required', 400);
  }
  const employee = await employeeService.replaceEmployeeById(req.params.id, req.body);
  if (!employee) {
    throw new AppError('Employee not found', 404);
  }
  res.json({ success: true, data: employee });
});

// PATCH /employees/:id — Update employee by ID
const updateEmployee = asyncHandler(async (req, res) => {
  if (req.body.name === '') {
    throw new AppError('Name cannot be empty', 400);
  }
  if (req.body.profile?.contact?.email === '') {
    throw new AppError('Email cannot be empty', 400);
  }
  const employee = await employeeService.updateEmployeeById(req.params.id, req.body);
  if (!employee) {
    throw new AppError('Employee not found', 404);
  }
  res.json({ success: true, data: employee });
});

// PATCH /employees/bulk-update — Bulk update employees
const bulkUpdateEmployees = asyncHandler(async (req, res) => {
  const { updates } = req.body;
  if (!Array.isArray(updates) || updates.length === 0) {
    throw new AppError('Updates must be a non-empty array', 400);
  }
  for (const item of updates) {
    if (!item.id || !item.data) {
      throw new AppError('Each update item must contain an id and data object', 400);
    }
  }
  const result = await employeeService.bulkUpdate(updates);
  res.json({ success: true, count: result.length, data: result });
});

// DELETE /employees/bulk-delete — Bulk delete employees
const bulkDeleteEmployees = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new AppError('ids must be a non-empty array', 400);
  }
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

// GET /employees/verified
const getVerifiedEmployees = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.getVerifiedEmployees({ page, limit });
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
});

// GET /employees/projects
const getAllProjects = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.getAllProjects({ page, limit });
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
});

// GET /employees/tasks
const getAllTasks = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.getAllTasks({ page, limit });
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
});

// GET /employees/top-experience
const getTopExperience = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const result = await employeeService.getTopExperience(limit);
  res.json({ success: true, count: result.length, data: result });
});

// GET /employees/top-skills
const getTopSkills = asyncHandler(async (req, res) => {
  const result = await employeeService.getTopSkills();
  res.json({ success: true, count: result.length, data: result });
});

// GET /employees/cloud-engineers
const getCloudEngineers = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.getCloudEngineers({ page, limit });
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
});

// GET /employees/devops-engineers
const getDevOpsEngineers = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.getDevOpsEngineers({ page, limit });
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
});

// GET /employees/ai-engineers
const getAIEngineers = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.getAIEngineers({ page, limit });
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
});

// GET /employees/fullstack
const getFullStackDevelopers = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.getFullStackDevelopers({ page, limit });
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
});

// GET /employees/recent-certifications
const getRecentCertifications = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.getRecentCertifications({ page, limit });
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
});

// GET /search/employees?q=
const searchEmployees = asyncHandler(async (req, res) => {
  const { q, page, limit } = req.query;
  const result = await employeeService.searchEmployees(q, { page, limit });
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
});

// GET /employees/performance/:id
const getEmployeePerformance = asyncHandler(async (req, res) => {
  const result = await employeeService.getEmployeePerformance(req.params.id);
  if (!result) throw new AppError('Employee not found', 404);
  res.json({ success: true, data: result });
});

// GET /employees/stats/:id
const getEmployeeStats = asyncHandler(async (req, res) => {
  const result = await employeeService.getEmployeeStats(req.params.id);
  if (!result) throw new AppError('Employee not found', 404);
  res.json({ success: true, data: result });
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
  getVerifiedEmployees,
  getAllProjects,
  getAllTasks,
  getTopExperience,
  getTopSkills,
  getCloudEngineers,
  getDevOpsEngineers,
  getAIEngineers,
  getFullStackDevelopers,
  getRecentCertifications,
  searchEmployees,
  getEmployeePerformance,
  getEmployeeStats,
};
