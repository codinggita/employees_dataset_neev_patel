// ─────────────────────────────────────────────────────────────
// JWT Routes — Token management and private data access
//
// ALL routes here require authentication (valid JWT token).
// The 'protect' middleware is applied per-route (not via router.use)
// so you can see exactly which middleware each route uses.
//
// Mounted at '/jwt' in server.js:
//   app.use('/jwt', jwtRoutes);
// So '/profile' here becomes '/jwt/profile'
// ─────────────────────────────────────────────────────────────

const express = require('express');
const router = express.Router();

const {
  getJwtProfile,
  getJwtDashboard,
  generateToken,
  verifyToken,
  refreshToken,
  revokeToken,
  privateEmployees,
  privateProjects,
  privateTasks,
  privateAnalytics
} = require('../controllers/jwtController');

const protect = require('../middlewares/authMiddleware');   // Verifies JWT token
const restrictTo = require('../middlewares/roleCheck');     // Checks user role

// ─── All JWT routes require a valid Bearer token ─────────────
// 'protect' is the second argument — runs before the controller
router.get('/profile',             protect, getJwtProfile);       // Get decoded JWT payload
router.get('/dashboard',           protect, getJwtDashboard);     // Get aggregated stats
router.post('/generate-token',     protect, generateToken);       // Generate a new token
router.post('/verify-token',       protect, verifyToken);         // Verify a token from body
router.post('/refresh-token',      protect, refreshToken);        // Get a fresh token
router.delete('/revoke-token',     protect, revokeToken);         // "Revoke" token (client-side)
router.get('/private-employees',   protect, privateEmployees);    // Auth-only employee list
router.get('/private-projects',    protect, privateProjects);     // Auth-only project list
router.get('/private-tasks',       protect, privateTasks);        // Auth-only task list

// Admin only — requires BOTH auth AND admin role
// Middleware chain: protect → restrictTo('admin') → privateAnalytics
router.get('/private-analytics',   protect, restrictTo('admin'), privateAnalytics);

module.exports = router;
