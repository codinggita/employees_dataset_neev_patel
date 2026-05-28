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

const protect = require('../middlewares/authMiddleware');
const restrictTo = require('../middlewares/roleCheck');  // roleCheck acts as restrictTo

// ─── All JWT routes require a valid Bearer token ───
router.get('/profile',             protect, getJwtProfile);
router.get('/dashboard',           protect, getJwtDashboard);
router.post('/generate-token',     protect, generateToken);
router.post('/verify-token',       protect, verifyToken);
router.post('/refresh-token',      protect, refreshToken);
router.delete('/revoke-token',     protect, revokeToken);
router.get('/private-employees',   protect, privateEmployees);
router.get('/private-projects',    protect, privateProjects);
router.get('/private-tasks',       protect, privateTasks);

// Admin only
router.get('/private-analytics',   protect, restrictTo('admin'), privateAnalytics);

module.exports = router;

