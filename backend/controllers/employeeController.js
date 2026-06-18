// ─────────────────────────────────────────────────────────────
// Employee Controller — Handles HTTP requests for employee endpoints
//
// WHAT IS A CONTROLLER?
// A controller is the "middleman" between HTTP and business logic:
//   1. Receives the HTTP request (req)
//   2. Extracts data from it (params, query, body)
//   3. Calls the appropriate service function
//   4. Sends the HTTP response (res) back to the client
//
// Controllers should NOT contain business logic or database queries.
// That belongs in the service layer (employeeService.js).
//
// COMMON PATTERNS IN THIS FILE:
//   req.params  → URL parameters (e.g., /employees/:id → req.params.id)
//   req.query   → Query string params (e.g., ?page=1&limit=10 → req.query.page)
//   req.body    → JSON body from POST/PUT/PATCH requests
//   res.json()  → Send a JSON response
//   res.status() → Set the HTTP status code (200, 201, 400, 404, etc.)
// ─────────────────────────────────────────────────────────────

const asyncHandler = require('../middlewares/asyncHandler'); // Catches async errors automatically
const AppError = require('../middlewares/AppError');         // Custom error class with status codes
const employeeService = require('../services/employeeService'); // Business logic layer

// ═══════════════════════════════════════════════════════════
// CRUD OPERATIONS (Create, Read, Update, Delete)
// ═══════════════════════════════════════════════════════════

// GET /employees — Get all employees with optional filtering, sorting, and pagination
// Example: GET /employees?country=USA&sort=name&page=1&limit=10
const getAllEmployees = asyncHandler(async (req, res) => {
  // Destructure: extract sort, page, limit from query; everything else goes into "filters"
  // The "...filters" uses the REST operator to collect remaining properties
  const { sort, page, limit, ...filters } = req.query;
  const result = await employeeService.queryEmployees(filters, sort, page, limit);
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
});

// GET /employees/:id — Get a single employee by their ID
// :id is a URL parameter — Express extracts it into req.params.id
const getEmployeeById = asyncHandler(async (req, res) => {
  const employee = await employeeService.getEmployeeById(req.params.id);
  if (!employee) {
    throw new AppError('Employee not found', 404); // asyncHandler catches this and forwards to errorHandler
  }
  res.json({ success: true, data: employee });
});

// POST /employees — Create a new employee
// The request body (req.body) contains the new employee's data as JSON
const createEmployee = asyncHandler(async (req, res) => {
  // Destructure the required fields from the request body
  const { id, name, profile } = req.body;
  // Optional chaining (?.) safely accesses nested email
  const email = profile?.contact?.email;

  // Validate required fields before hitting the database
  if (!id || !name || !email) {
    throw new AppError('ID, name, and email are required', 400); // 400 = Bad Request
  }

  // Check for duplicate ID to prevent conflicts
  if (req.body.id) {
    const exists = await employeeService.employeeExists(req.body.id);
    if (exists) {
      throw new AppError('Employee with this ID already exists', 409); // 409 = Conflict
    }
  }

  const employee = await employeeService.createEmployee(req.body);
  res.status(201).json({ success: true, data: employee }); // 201 = Created (resource was successfully created)
});

// DELETE /employees/:id — Delete an employee by ID
const deleteEmployeeById = asyncHandler(async (req, res) => {
  const employee = await employeeService.deleteEmployeeById(req.params.id);
  if (!employee) {
    throw new AppError('Employee not found', 404);
  }
  res.json({ success: true, message: 'Employee deleted successfully' });
});

// GET /employees/exists/:id — Quick check if an employee exists (returns true/false)
const checkEmployeeExists = asyncHandler(async (req, res) => {
  const exists = await employeeService.employeeExists(req.params.id);
  res.json({ success: true, exists });
});

// POST /employees/bulk-create — Create multiple employees at once
// Request body must be an ARRAY of employee objects: [ {...}, {...}, ... ]
const bulkCreateEmployees = asyncHandler(async (req, res) => {
  // Validate that the body is a non-empty array
  if (!Array.isArray(req.body) || req.body.length === 0) {
    throw new AppError('Request body must be a non-empty array of employees', 400);
  }
  // Validate each employee in the array has required fields
  for (const emp of req.body) {
    const email = emp.profile?.contact?.email;
    if (!emp.id || !emp.name || !email) {
      throw new AppError('Each employee must have an id, name, and profile.contact.email', 400);
    }
  }
  const result = await employeeService.bulkCreate(req.body);
  res.status(201).json({ success: true, count: result.length, data: result });
});

// PUT /employees/:id — Replace an entire employee document
// PUT = full replacement (must include ALL fields)
// Different from PATCH which is a partial update
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

// PATCH /employees/:id — Partially update an employee
// PATCH = partial update (only send the fields you want to change)
// Example body: { "name": "New Name" } — only updates the name
const updateEmployee = asyncHandler(async (req, res) => {
  // Prevent empty string values for critical fields
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

// PATCH /employees/bulk-update — Update multiple employees at once
// Body format: { "updates": [ { "id": "E00001", "data": { "name": "New" } }, ... ] }
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

// DELETE /employees/bulk-delete — Delete multiple employees at once
// Body format: { "ids": ["E00001", "E00002"] }
const bulkDeleteEmployees = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new AppError('ids must be a non-empty array', 400);
  }
  const result = await employeeService.bulkDelete(ids);
  res.json({ success: true, deletedCount: result.deletedCount });
});

// ═══════════════════════════════════════════════════════════
// LOOKUP CONTROLLERS — Find employees by specific fields
//
// All these follow the same pattern:
// 1. Extract the URL parameter (req.params.xxx)
// 2. Extract pagination from query string (req.query)
// 3. Call the service function
// 4. If no results, throw 404
// 5. Return paginated results
// ═══════════════════════════════════════════════════════════

// GET /employees/name/:name — Find employees by name (partial, case-insensitive)
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

// GET /employees/country/:country
const getByCountry = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.findByCountry(req.params.country, { page, limit });
  if (!result.data.length) {
    throw new AppError('Employee not found', 404);
  }
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
});

// GET /employees/city/:city
const getByCity = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.findByCity(req.params.city, { page, limit });
  if (!result.data.length) {
    throw new AppError('Employee not found', 404);
  }
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
});

// GET /employees/timezone/:timezone
const getByTimezone = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.findByTimezone(req.params.timezone, { page, limit });
  if (!result.data.length) {
    throw new AppError('Employee not found', 404);
  }
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
});

// GET /employees/primary-skill/:skill
const getByPrimarySkill = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.findByPrimarySkill(req.params.skill, { page, limit });
  if (!result.data.length) {
    throw new AppError('Employee not found', 404);
  }
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
});

// GET /employees/secondary-skill/:skill
const getBySecondarySkill = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.findBySecondarySkill(req.params.skill, { page, limit });
  if (!result.data.length) {
    throw new AppError('Employee not found', 404);
  }
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
});

// GET /employees/domain/:domain
const getByDomain = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.findByDomain(req.params.domain, { page, limit });
  if (!result.data.length) {
    throw new AppError('Employee not found', 404);
  }
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
});

// GET /employees/experience/:years — Find employees by years of experience
const getByExperience = asyncHandler(async (req, res) => {
  const years = req.params.years;
  // Validate that the years parameter is a number
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

// GET /employees/project/:projectId
const getByProjectId = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.findByProjectId(req.params.projectId, { page, limit });
  if (!result.data.length) {
    throw new AppError('Employee not found', 404);
  }
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
});

// GET /employees/task/:taskId
const getByTaskId = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.findByTaskId(req.params.taskId, { page, limit });
  if (!result.data.length) {
    throw new AppError('Employee not found', 404);
  }
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
});

// GET /employees/certification/:certification
const getByCertification = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.findByCertification(req.params.certification, { page, limit });
  if (!result.data.length) {
    throw new AppError('Employee not found', 404);
  }
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
});

// ═══════════════════════════════════════════════════════════
// SORT CONTROLLERS — Pre-defined sorting endpoints
//
// These call queryEmployees with a specific sort object.
// Sort values: 1 = ascending (A→Z), -1 = descending (Z→A)
// ═══════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════
// UTILITY CONTROLLERS — Specialized data endpoints
// ═══════════════════════════════════════════════════════════

// GET /employees/verified — Get all employees with verified certifications
const getVerifiedEmployees = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.getVerifiedEmployees({ page, limit });
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
});

// GET /employees/projects — Get all project data
const getAllProjects = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.getAllProjects({ page, limit });
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
});

// GET /employees/tasks — Get all task data
const getAllTasks = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.getAllTasks({ page, limit });
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
});

// GET /employees/top-experience — Get employees with highest experience
const getTopExperience = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const result = await employeeService.getTopExperience(limit);
  res.json({ success: true, count: result.length, data: result });
});

// GET /employees/top-skills — Get aggregated skill rankings
const getTopSkills = asyncHandler(async (req, res) => {
  const result = await employeeService.getTopSkills();
  res.json({ success: true, count: result.length, data: result });
});

// Domain-specific endpoints — filter by work domain
const getCloudEngineers = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.getCloudEngineers({ page, limit });
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
});

const getDevOpsEngineers = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.getDevOpsEngineers({ page, limit });
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
});

const getAIEngineers = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.getAIEngineers({ page, limit });
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
});

const getFullStackDevelopers = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.getFullStackDevelopers({ page, limit });
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
});

const getRecentCertifications = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.getRecentCertifications({ page, limit });
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
});

// GET /search/employees?q=Python — Full-text search across multiple fields
const searchEmployees = asyncHandler(async (req, res) => {
  const { q, page, limit } = req.query; // q = search query from URL
  const result = await employeeService.searchEmployees(q, { page, limit });
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
});

// GET /employees/performance/:id — Get computed performance summary for one employee
const getEmployeePerformance = asyncHandler(async (req, res) => {
  const result = await employeeService.getEmployeePerformance(req.params.id);
  if (!result) throw new AppError('Employee not found', 404);
  res.json({ success: true, data: result });
});

// GET /employees/stats/:id — Get certification statistics for one employee
const getEmployeeStats = asyncHandler(async (req, res) => {
  const result = await employeeService.getEmployeeStats(req.params.id);
  if (!result) throw new AppError('Employee not found', 404);
  res.json({ success: true, data: result });
});

// ─── Export all controller functions ─────────────────────────
// These are imported by the route files (employeeRoutes.js, searchRoutes.js)
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
