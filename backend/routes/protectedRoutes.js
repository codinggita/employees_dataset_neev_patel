const express = require('express');
const router = express.Router();
const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../middlewares/AppError');
const protect = require('../middlewares/authMiddleware');
const employeeService = require('../services/employeeService');

// All protected routes require authentication
router.use(protect);

// ─── POST /protected/employees — create employee ───
router.post('/employees', asyncHandler(async (req, res) => {
  const employee = await employeeService.createEmployee(req.body);
  res.status(201).json({ success: true, message: 'Employee created', data: employee });
}));

// ─── PATCH /protected/employees/:id — update employee ───
router.patch('/employees/:id', asyncHandler(async (req, res, next) => {
  const employee = await employeeService.updateEmployeeById(req.params.id, req.body);
  if (!employee) {
    return next(new AppError('Employee not found', 404));
  }
  res.status(200).json({ success: true, message: 'Employee updated', data: employee });
}));

// ─── DELETE /protected/employees/:id — delete employee ───
router.delete('/employees/:id', asyncHandler(async (req, res, next) => {
  const employee = await employeeService.deleteEmployeeById(req.params.id);
  if (!employee) {
    return next(new AppError('Employee not found', 404));
  }
  res.status(200).json({ success: true, message: 'Employee deleted' });
}));

// ─── POST /protected/projects — placeholder (501) ───
router.post('/projects', (req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet' });
});

// ─── PATCH /protected/projects/:projectId — placeholder (501) ───
router.patch('/projects/:projectId', (req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet' });
});

// ─── DELETE /protected/projects/:projectId — placeholder (501) ───
router.delete('/projects/:projectId', (req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet' });
});

module.exports = router;

