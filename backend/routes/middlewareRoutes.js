const express = require('express');
const router = express.Router();
const AppError = require('../middlewares/AppError');
const protect = require('../middlewares/authMiddleware');
const restrictTo = require('../middlewares/roleCheck');
const validate = require('../middlewares/validate');

// In-memory rate limit counter
const rateLimitCounter = {};

// ─── GET /middleware/logger — return request log info ───
router.get('/logger', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      log: {
        method: req.method,
        url: req.originalUrl,
        timestamp: new Date().toISOString()
      }
    }
  });
});

// ─── GET /middleware/auth — protected, return user info ───
router.get('/auth', protect, (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: req.user,
      message: 'Auth working'
    }
  });
});

// ─── GET /middleware/rate-limit — in-memory counter demo ───
router.get('/rate-limit', (req, res) => {
  const ip = req.ip || 'unknown';
  rateLimitCounter[ip] = (rateLimitCounter[ip] || 0) + 1;
  res.status(200).json({
    success: true,
    data: {
      requestCount: rateLimitCounter[ip],
      message: `You have made ${rateLimitCounter[ip]} request(s) from ${ip}`
    }
  });
});

// ─── GET /middleware/error-handler — deliberate error throw ───
router.get('/error-handler', (req, res, next) => {
  next(new AppError('This is a test error', 400));
});

// ─── GET /middleware/request-time — show response time from requestTime middleware ───
router.get('/request-time', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      responseTime: (req.requestTime || 'N/A') + 'ms'
    }
  });
});

// ─── GET /middleware/role-check — protect + admin only ───
router.get('/role-check', protect, restrictTo('admin'), (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      role: req.user.role,
      message: 'Role check passed'
    }
  });
});

// ─── POST /middleware/validation — validate required fields ───
router.post('/validation', validate(['name', 'email']), (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'Validation passed',
      body: req.body
    }
  });
});

// ─── GET /middleware/audit-log — mock audit entry ───
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

