// ─────────────────────────────────────────────────────────────
// Meta Routes — HEAD and OPTIONS HTTP method handlers
//
// WHAT ARE HEAD AND OPTIONS?
// HTTP has several methods beyond GET/POST/PUT/DELETE:
//
// HEAD: Same as GET but returns ONLY headers (no body).
//   Used for: checking if a resource exists, getting metadata,
//   monitoring server health without transferring data.
//   Example: HEAD /employees returns 200 with headers but no JSON body.
//
// OPTIONS: Returns which HTTP methods are allowed on a URL.
//   Used for: CORS preflight requests, API discovery.
//   The "Allow" header lists permitted methods.
//   Example: OPTIONS /employees → Allow: GET, POST, HEAD, OPTIONS
//
// These routes are mounted at '/' in server.js (no prefix).
// ─────────────────────────────────────────────────────────────

const express = require('express');
const router = express.Router();
const asyncHandler = require('../middlewares/asyncHandler');
const Employee = require('../models/Employee');
const authMiddleware = require('../middlewares/authMiddleware');

// ========================
// HEAD Routes
// ========================

// HEAD /employees — Quick check: "Does this endpoint exist?" → 200
// res.end() sends the response with no body (required for HEAD)
router.head('/employees', asyncHandler(async (req, res) => {
  res.status(200).end();
}));

// HEAD /employees/system/health — Health check without a response body
router.head('/employees/system/health', asyncHandler(async (req, res) => {
  res.status(200).end();
}));

// HEAD /stats/employees/count — Returns the count in a HEADER instead of body
// res.set() adds a custom response header
// Custom headers often start with "X-" (a convention, not a requirement)
router.head('/stats/employees/count', asyncHandler(async (req, res) => {
  const count = await Employee.countDocuments({});
  res.set('X-Total-Count', String(count)); // Set custom header with the count
  res.status(200).end(); // End without a body
}));

// HEAD /auth/profile — Check if a token is valid (no data returned)
// authMiddleware runs first — if token is invalid, returns 401
// If valid, returns 200 with no body
router.head('/auth/profile', authMiddleware, (req, res) => {
  res.status(200).end();
});

// ========================
// OPTIONS Routes
// ========================

// OPTIONS /employees — Tell the client which methods are allowed
// The "Allow" header is a standard HTTP header for this purpose
router.options('/employees', (req, res) => {
  res.set('Allow', 'GET, POST, HEAD, OPTIONS');
  res.status(200).end();
});

// OPTIONS /employees/:id — Single employee supports more methods
router.options('/employees/:id', (req, res) => {
  res.set('Allow', 'GET, PUT, PATCH, DELETE, HEAD, OPTIONS');
  res.status(200).end();
});

// OPTIONS /auth/login — Login only supports POST
router.options('/auth/login', (req, res) => {
  res.set('Allow', 'POST, OPTIONS');
  res.status(200).end();
});

// OPTIONS /admin/employees — Admin endpoints are read-only
router.options('/admin/employees', (req, res) => {
  res.set('Allow', 'GET, HEAD, OPTIONS');
  res.status(200).end();
});

// OPTIONS /search/employees — Search is read-only
router.options('/search/employees', (req, res) => {
  res.set('Allow', 'GET, HEAD, OPTIONS');
  res.status(200).end();
});

module.exports = router;
