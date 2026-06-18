// ─────────────────────────────────────────────────────────────
// Middleware Demo Routes — Test and showcase middleware features
//
// These routes exist purely for TESTING and DEMONSTRATION.
// They let you verify that each middleware works correctly
// by hitting specific endpoints in Postman.
//
// Mounted at '/middleware' in server.js:
//   app.use('/middleware', middlewareRoutes);
// So '/logger' here becomes '/middleware/logger'
// ─────────────────────────────────────────────────────────────

const express = require('express');
const router = express.Router();
const AppError = require('../middlewares/AppError');
const protect = require('../middlewares/authMiddleware');
const restrictTo = require('../middlewares/roleCheck');
const validate = require('../middlewares/validate');

// In-memory rate limit counter — stores request counts per IP address
// NOTE: This is a simple demo. In production, use Redis or a proper rate limiter.
const rateLimitCounter = {};

// ─── GET /middleware/logger — Shows what the logger middleware captures ───
router.get('/logger', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      log: {
        method: req.method,        // e.g., "GET"
        url: req.originalUrl,      // e.g., "/middleware/logger"
        timestamp: new Date().toISOString()
      }
    }
  });
});

// ─── GET /middleware/auth — Tests auth middleware ─────────────
// 'protect' middleware runs first:
//   - If no token → 401 response (never reaches the handler)
//   - If valid token → req.user is set, handler runs
router.get('/auth', protect, (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: req.user,  // The decoded JWT payload
      message: 'Auth working'
    }
  });
});

// ─── GET /middleware/rate-limit — Simple rate limiting demo ───
// Counts how many requests each IP address has made
// In a real app, you'd add a time window and block after N requests
router.get('/rate-limit', (req, res) => {
  const ip = req.ip || 'unknown'; // req.ip is the client's IP address
  rateLimitCounter[ip] = (rateLimitCounter[ip] || 0) + 1; // Increment counter
  res.status(200).json({
    success: true,
    data: {
      requestCount: rateLimitCounter[ip],
      message: `You have made ${rateLimitCounter[ip]} request(s) from ${ip}`
    }
  });
});

// ─── GET /middleware/error-handler — Deliberately triggers an error ───
// Calling next(error) skips all remaining middleware and goes
// straight to the error handler (the one with 4 parameters)
router.get('/error-handler', (req, res, next) => {
  next(new AppError('This is a test error', 400)); // Pass error to errorHandler
});

// ─── GET /middleware/request-time — Shows the request timestamp ───
// req.requestTime was set by the requestTime middleware (in server.js)
// It records when the request first arrived
router.get('/request-time', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      responseTime: (req.requestTime || 'N/A') + 'ms'
    }
  });
});

// ─── GET /middleware/role-check — Tests role-based access control ───
// Two middleware guards: protect (valid token) → restrictTo('admin')
// Only admin users can access this endpoint
router.get('/role-check', protect, restrictTo('admin'), (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      role: req.user.role,
      message: 'Role check passed'
    }
  });
});

// ─── POST /middleware/validation — Tests the validate middleware ───
// validate(['name', 'email']) creates a middleware that checks
// if both 'name' and 'email' exist in the request body
// If they don't, it returns 400 without reaching the handler
router.post('/validation', validate(['name', 'email']), (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'Validation passed',
      body: req.body // Echo back the validated body
    }
  });
});

// ─── GET /middleware/audit-log — Mock audit log entry ─────────
// Shows what an audit log entry would look like
router.get('/audit-log', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      timestamp: new Date().toISOString(),
      user: 'anonymous',
      action: 'GET /middleware/audit-log'
    }
  });
});

module.exports = router;
