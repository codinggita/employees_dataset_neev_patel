const express = require('express');
const router = express.Router();
const asyncHandler = require('../middlewares/asyncHandler');
const Employee = require('../models/Employee');
const authMiddleware = require('../middlewares/authMiddleware');

// ========================
// HEAD Routes
// ========================

// HEAD /employees — 200, no body
router.head('/employees', asyncHandler(async (req, res) => {
  res.status(200).end();
}));

// HEAD /employees/system/health — 200, no body
router.head('/employees/system/health', asyncHandler(async (req, res) => {
  res.status(200).end();
}));

// HEAD /stats/employees/count — 200, set X-Total-Count header, no body
router.head('/stats/employees/count', asyncHandler(async (req, res) => {
  const count = await Employee.countDocuments({});
  res.set('X-Total-Count', String(count));
  res.status(200).end();
}));

// HEAD /auth/profile — verify token, return 200 or 401, no body
router.head('/auth/profile', authMiddleware, (req, res) => {
  res.status(200).end();
});

// ========================
// OPTIONS Routes
// ========================

// OPTIONS /employees — Allow: GET, POST, HEAD, OPTIONS
router.options('/employees', (req, res) => {
  res.set('Allow', 'GET, POST, HEAD, OPTIONS');
  res.status(200).end();
});

// OPTIONS /employees/:id — Allow: GET, PUT, PATCH, DELETE, HEAD, OPTIONS
router.options('/employees/:id', (req, res) => {
  res.set('Allow', 'GET, PUT, PATCH, DELETE, HEAD, OPTIONS');
  res.status(200).end();
});

// OPTIONS /auth/login — Allow: POST, OPTIONS
router.options('/auth/login', (req, res) => {
  res.set('Allow', 'POST, OPTIONS');
  res.status(200).end();
});

// OPTIONS /admin/employees — Allow: GET, HEAD, OPTIONS
router.options('/admin/employees', (req, res) => {
  res.set('Allow', 'GET, HEAD, OPTIONS');
  res.status(200).end();
});

// OPTIONS /search/employees — Allow: GET, HEAD, OPTIONS
router.options('/search/employees', (req, res) => {
  res.set('Allow', 'GET, HEAD, OPTIONS');
  res.status(200).end();
});

module.exports = router;
