// ─────────────────────────────────────────────────────────────
// Filter Routes — Pre-built filter endpoints for common queries
//
// DIFFERENCE FROM EMPLOYEE ROUTES:
// - Employee routes use URL parameters: /employees/domain/Cloud
// - Filter routes use hardcoded MongoDB queries: /employees/filter/cloud
//
// These routes are mounted at '/employees/filter' in server.js:
//   app.use('/employees/filter', filterRoutes);
// So '/high-experience' here becomes '/employees/filter/high-experience'
//
// MONGODB QUERY OPERATORS USED:
//   $gte  → Greater than or equal to (experience >= 8)
//   $lte  → Less than or equal to (experience <= 2)
//   $all  → Array must contain ALL specified values (React AND Node.js)
//   No operator → Exact match (domains includes "Cloud")
//
// All filter routes are public GET endpoints with optional pagination.
// ─────────────────────────────────────────────────────────────

const express = require('express');
const router = express.Router();
const asyncHandler = require('../middlewares/asyncHandler');
const employeeService = require('../services/employeeService');

// ─── Experience filters ──────────────────────────────────────

// GET /employees/filter/high-experience — Employees with 8+ years
router.get('/high-experience', asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.filterEmployees(
    { 'profile.projects.tasks.assignedTo.skills.experience.years': { $gte: 8 } }, // $gte = >= 8
    { page, limit }
  );
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
}));

// GET /employees/filter/low-experience — Employees with 2 or fewer years
router.get('/low-experience', asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.filterEmployees(
    { 'profile.projects.tasks.assignedTo.skills.experience.years': { $lte: 2 } }, // $lte = <= 2
    { page, limit }
  );
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
}));

// ─── Certification filter ────────────────────────────────────

// GET /employees/filter/verified — Only verified certifications
router.get('/verified', asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.filterEmployees(
    { 'profile.projects.tasks.assignedTo.skills.experience.certifications.meta.verified': true },
    { page, limit }
  );
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
}));

// ─── Domain filters ──────────────────────────────────────────
// When querying an array field with a simple value, MongoDB checks
// if the array CONTAINS that value. So { domains: 'Cloud' } matches
// any document where the domains array includes "Cloud".

// GET /employees/filter/cloud — Employees in the Cloud domain
router.get('/cloud', asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.filterEmployees(
    { 'profile.projects.tasks.assignedTo.skills.experience.domains': 'Cloud' },
    { page, limit }
  );
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
}));

// GET /employees/filter/finance
router.get('/finance', asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.filterEmployees(
    { 'profile.projects.tasks.assignedTo.skills.experience.domains': 'Finance' },
    { page, limit }
  );
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
}));

// GET /employees/filter/healthcare
router.get('/healthcare', asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.filterEmployees(
    { 'profile.projects.tasks.assignedTo.skills.experience.domains': 'Healthcare' },
    { page, limit }
  );
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
}));

// GET /employees/filter/devops
router.get('/devops', asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.filterEmployees(
    { 'profile.projects.tasks.assignedTo.skills.experience.domains': 'DevOps' },
    { page, limit }
  );
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
}));

// GET /employees/filter/ai
router.get('/ai', asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.filterEmployees(
    { 'profile.projects.tasks.assignedTo.skills.experience.domains': 'AI' },
    { page, limit }
  );
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
}));

// ─── Skill / Technology filters ──────────────────────────────

// GET /employees/filter/fullstack — Must have BOTH React AND Node.js
// $all operator: the array must contain ALL specified values
router.get('/fullstack', asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.filterEmployees(
    { 'profile.projects.tasks.assignedTo.skills.secondary': { $all: ['React', 'Node.js'] } },
    { page, limit }
  );
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
}));

// GET /employees/filter/kubernetes — Secondary skills includes Kubernetes
router.get('/kubernetes', asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.filterEmployees(
    { 'profile.projects.tasks.assignedTo.skills.secondary': 'Kubernetes' },
    { page, limit }
  );
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
}));

// GET /employees/filter/react
router.get('/react', asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.filterEmployees(
    { 'profile.projects.tasks.assignedTo.skills.secondary': 'React' },
    { page, limit }
  );
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
}));

// GET /employees/filter/nodejs
router.get('/nodejs', asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.filterEmployees(
    { 'profile.projects.tasks.assignedTo.skills.secondary': 'Node.js' },
    { page, limit }
  );
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
}));

// ─── Primary skill filters ──────────────────────────────────

// GET /employees/filter/java — Primary skill is Java
router.get('/java', asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.filterEmployees(
    { 'profile.projects.tasks.assignedTo.skills.primary': 'Java' },
    { page, limit }
  );
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
}));

// GET /employees/filter/python — Primary skill is Python
router.get('/python', asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.filterEmployees(
    { 'profile.projects.tasks.assignedTo.skills.primary': 'Python' },
    { page, limit }
  );
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
}));

// ─── Certification sort ──────────────────────────────────────

// GET /employees/filter/recent-certifications — Sorted by most recently updated
router.get('/recent-certifications', asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const Employee = require('../models/Employee');
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 20;
  const skip = (pageNum - 1) * limitNum;
  const total = await Employee.countDocuments({});
  const data = await Employee.find({})
    .sort({ 'profile.projects.tasks.assignedTo.skills.experience.certifications.meta.lastUpdated': -1 })
    .skip(skip)
    .limit(limitNum);
  res.json({ success: true, count: data.length, total, page: pageNum, totalPages: Math.ceil(total / limitNum), data });
}));

module.exports = router;
