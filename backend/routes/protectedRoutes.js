// ─────────────────────────────────────────────────────────────
// Protected Routes — Employee CRUD that requires authentication
//
// DIFFERENCE FROM REGULAR EMPLOYEE ROUTES:
// - Regular routes (employeeRoutes.js): Anyone can access
// - Protected routes (this file): Must have a valid JWT token
//
// router.use(protect) applies the auth middleware to ALL routes
// in this file. This is equivalent to adding 'protect' to each
// route individually, but cleaner when ALL routes need it.
//
// These routes are mounted at '/protected' in server.js:
//   app.use('/protected', protectedRoutes);
// So POST '/employees' here becomes POST '/protected/employees'
// ─────────────────────────────────────────────────────────────

const express = require('express');
const router = express.Router();
const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../middlewares/AppError');
const protect = require('../middlewares/authMiddleware');
const employeeService = require('../services/employeeService');

// Apply auth middleware to ALL routes in this file
// Every request to /protected/* must include a valid Bearer token
router.use(protect);

// ─── POST /protected/employees — Create employee (auth required) ───
router.post('/employees', asyncHandler(async (req, res) => {
  const { id, name, profile } = req.body;
  const email = profile?.contact?.email;

  // Validate required fields
  if (!id || !name || !email) {
    throw new AppError('ID, name, and email are required', 400);
  }

  // Prevent duplicate employee IDs
  const exists = await employeeService.employeeExists(id);
  if (exists) {
    throw new AppError('Employee with this ID already exists', 409);
  }

  const employee = await employeeService.createEmployee(req.body);
  res.status(201).json({ success: true, message: 'Employee created', data: employee });
}));

// ─── PATCH /protected/employees/:id — Update employee (auth required) ───
router.patch('/employees/:id', asyncHandler(async (req, res, next) => {
  if (req.body.name === '') {
    throw new AppError('Name cannot be empty', 400);
  }
  if (req.body.profile?.contact?.email === '') {
    throw new AppError('Email cannot be empty', 400);
  }

  const employee = await employeeService.updateEmployeeById(req.params.id, req.body);
  if (!employee) {
    return next(new AppError('Employee not found', 404));
  }
  res.status(200).json({ success: true, message: 'Employee updated', data: employee });
}));

// ─── DELETE /protected/employees/:id — Delete employee (auth required) ───
router.delete('/employees/:id', asyncHandler(async (req, res, next) => {
  const employee = await employeeService.deleteEmployeeById(req.params.id);
  if (!employee) {
    return next(new AppError('Employee not found', 404));
  }
  res.status(200).json({ success: true, message: 'Employee deleted' });
}));

// ═══════════════════════════════════════════════════════════
// PLACEHOLDER ROUTES — Return 501 Not Implemented
//
// 501 means "the server does not support this functionality yet"
// These are here to reserve the URL paths for future development.
// The frontend can call these endpoints and get a meaningful
// error instead of a confusing 404.
// ═══════════════════════════════════════════════════════════

// ─── POST /protected/projects — Create project (placeholder) ───
router.post('/projects', (req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet' });
});

// ─── PATCH /protected/projects/:projectId — Update project (placeholder) ───
router.patch('/projects/:projectId', (req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet' });
});

// ─── DELETE /protected/projects/:projectId — Delete project (placeholder) ───
router.delete('/projects/:projectId', (req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet' });
});

module.exports = router;
