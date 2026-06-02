const express = require('express');
const router = express.Router();
const asyncHandler = require('../middlewares/asyncHandler');
const employeeService = require('../services/employeeService');

// GET /employees/filter/high-experience — experience.years >= 8
router.get('/high-experience', asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.filterEmployees(
    { 'profile.projects.tasks.assignedTo.skills.experience.years': { $gte: 8 } },
    { page, limit }
  );
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
}));

// GET /employees/filter/low-experience — experience.years <= 2
router.get('/low-experience', asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.filterEmployees(
    { 'profile.projects.tasks.assignedTo.skills.experience.years': { $lte: 2 } },
    { page, limit }
  );
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
}));

// GET /employees/filter/verified — certifications.meta.verified = true
router.get('/verified', asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.filterEmployees(
    { 'profile.projects.tasks.assignedTo.skills.experience.certifications.meta.verified': true },
    { page, limit }
  );
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
}));

// GET /employees/filter/cloud — domains includes "Cloud"
router.get('/cloud', asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.filterEmployees(
    { 'profile.projects.tasks.assignedTo.skills.experience.domains': 'Cloud' },
    { page, limit }
  );
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
}));

// GET /employees/filter/finance — domains includes "Finance"
router.get('/finance', asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.filterEmployees(
    { 'profile.projects.tasks.assignedTo.skills.experience.domains': 'Finance' },
    { page, limit }
  );
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
}));

// GET /employees/filter/healthcare — domains includes "Healthcare"
router.get('/healthcare', asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.filterEmployees(
    { 'profile.projects.tasks.assignedTo.skills.experience.domains': 'Healthcare' },
    { page, limit }
  );
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
}));

// GET /employees/filter/devops — domains includes "DevOps"
router.get('/devops', asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.filterEmployees(
    { 'profile.projects.tasks.assignedTo.skills.experience.domains': 'DevOps' },
    { page, limit }
  );
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
}));

// GET /employees/filter/ai — domains includes "AI"
router.get('/ai', asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.filterEmployees(
    { 'profile.projects.tasks.assignedTo.skills.experience.domains': 'AI' },
    { page, limit }
  );
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
}));

module.exports = router;
