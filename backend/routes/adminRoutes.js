const express = require('express');
const router = express.Router();
const asyncHandler = require('../middlewares/asyncHandler');
const protect = require('../middlewares/authMiddleware');
const restrictTo = require('../middlewares/roleCheck');
const employeeService = require('../services/employeeService');

// All admin routes require authentication + admin role
router.use(protect, restrictTo('admin'));

// ─── GET /admin/employees — paginated employees ───
router.get('/employees', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const result = await employeeService.queryEmployees({}, null, page, limit);
  res.status(200).json({ success: true, data: result });
}));

// ─── GET /admin/projects — all projects ───
router.get('/projects', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const result = await employeeService.getAllProjects({ page, limit });
  res.status(200).json({ success: true, data: result });
}));

// ─── GET /admin/tasks — all tasks ───
router.get('/tasks', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const result = await employeeService.getAllTasks({ page, limit });
  res.status(200).json({ success: true, data: result });
}));

// ─── GET /admin/certifications — all certification records ───
router.get('/certifications', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const result = await employeeService.getRecentCertifications({ page, limit });
  res.status(200).json({ success: true, data: result });
}));

module.exports = router;

