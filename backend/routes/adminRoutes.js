// ─────────────────────────────────────────────────────────────
// Admin Routes — Endpoints restricted to admin users only
//
// TWO MIDDLEWARE GUARDS:
//   1. protect (authMiddleware) — checks for a valid JWT token
//   2. restrictTo('admin') — checks that req.user.role === 'admin'
//
// If a regular user (role: 'user') tries to access these routes,
// they'll get: 403 { message: "Access denied. Required role(s): admin" }
//
// These routes are mounted at '/admin' in server.js:
//   app.use('/admin', adminRoutes);
// So GET '/employees' here becomes GET '/admin/employees'
// ─────────────────────────────────────────────────────────────

const express = require('express');
const router = express.Router();
const asyncHandler = require('../middlewares/asyncHandler');
const protect = require('../middlewares/authMiddleware');   // Verifies JWT token
const restrictTo = require('../middlewares/roleCheck');     // Checks user role
const employeeService = require('../services/employeeService');

// Apply BOTH middleware to ALL routes in this file
// Every request must: 1) have a valid token, 2) belong to an admin
router.use(protect, restrictTo('admin'));

// ─── GET /admin/employees — Paginated employee list (admin only) ───
router.get('/employees', asyncHandler(async (req, res) => {
  // Destructure with defaults: if page/limit not provided, use 1 and 10
  const { page = 1, limit = 10 } = req.query;
  const result = await employeeService.queryEmployees({}, null, page, limit);
  res.status(200).json({ success: true, data: result });
}));

// ─── GET /admin/projects — All projects (admin only) ───
router.get('/projects', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const result = await employeeService.getAllProjects({ page, limit });
  res.status(200).json({ success: true, data: result });
}));

// ─── GET /admin/tasks — All tasks (admin only) ───
router.get('/tasks', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const result = await employeeService.getAllTasks({ page, limit });
  res.status(200).json({ success: true, data: result });
}));

// ─── GET /admin/certifications — All certification records (admin only) ───
router.get('/certifications', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const result = await employeeService.getRecentCertifications({ page, limit });
  res.status(200).json({ success: true, data: result });
}));

module.exports = router;
