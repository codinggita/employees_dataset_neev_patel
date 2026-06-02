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

// GET /employees/filter/fullstack — secondary skills includes "React" AND "Node.js"
router.get('/fullstack', asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.filterEmployees(
    { 'profile.projects.tasks.assignedTo.skills.secondary': { $all: ['React', 'Node.js'] } },
    { page, limit }
  );
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
}));

// GET /employees/filter/kubernetes — secondary skills includes "Kubernetes"
router.get('/kubernetes', asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.filterEmployees(
    { 'profile.projects.tasks.assignedTo.skills.secondary': 'Kubernetes' },
    { page, limit }
  );
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
}));

// GET /employees/filter/react — secondary skills includes "React"
router.get('/react', asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.filterEmployees(
    { 'profile.projects.tasks.assignedTo.skills.secondary': 'React' },
    { page, limit }
  );
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
}));

// GET /employees/filter/nodejs — secondary skills includes "Node.js"
router.get('/nodejs', asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.filterEmployees(
    { 'profile.projects.tasks.assignedTo.skills.secondary': 'Node.js' },
    { page, limit }
  );
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
}));

// GET /employees/filter/java — primary skill = "Java"
router.get('/java', asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.filterEmployees(
    { 'profile.projects.tasks.assignedTo.skills.primary': 'Java' },
    { page, limit }
  );
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
}));

// GET /employees/filter/python — primary skill = "Python"
router.get('/python', asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await employeeService.filterEmployees(
    { 'profile.projects.tasks.assignedTo.skills.primary': 'Python' },
    { page, limit }
  );
  res.json({ success: true, count: result.data.length, total: result.total, page: result.page, totalPages: result.totalPages, data: result.data });
}));

// GET /employees/filter/recent-certifications — sort by lastUpdated desc, top 20
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
