// JWT Controller — Handles all /jwt protected routes
const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../middlewares/AppError');
const authService = require('../services/authService');
const employeeService = require('../services/employeeService');

// ─────────────────────────────────────────────
// GET /jwt/profile   (protect)
// Returns the decoded user from the JWT (set by authMiddleware)
// ─────────────────────────────────────────────
const getJwtProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: { user: req.user }
  });
});

// ─────────────────────────────────────────────
// GET /jwt/dashboard   (protect)
// Returns aggregated employee stats
// ─────────────────────────────────────────────
const getJwtDashboard = asyncHandler(async (req, res) => {
  const summary = await authService.getDashboardSummary();
  res.status(200).json({
    success: true,
    data: summary
  });
});

// ─────────────────────────────────────────────
// POST /jwt/generate-token   (protect)
// Issues a fresh token for the authenticated user
// ─────────────────────────────────────────────
const generateToken = asyncHandler(async (req, res) => {
  const token = authService.refreshToken(req.user.id, req.user.role);
  res.status(200).json({
    success: true,
    message: 'Token generated successfully',
    data: { token }
  });
});

// ─────────────────────────────────────────────
// POST /jwt/verify-token   (protect)
// Accepts { token } in body, decodes and returns payload
// ─────────────────────────────────────────────
const verifyToken = asyncHandler(async (req, res, next) => {
  const { token } = req.body;

  if (!token) {
    return next(new AppError('Token is required in request body', 400));
  }

  try {
    const decoded = authService.getUserFromToken(token);
    res.status(200).json({
      success: true,
      data: { decoded }
    });
  } catch {
    return next(new AppError('Invalid or expired token', 401));
  }
});

// ─────────────────────────────────────────────
// POST /jwt/refresh-token   (protect)
// Generates a new token using current req.user identity
// ─────────────────────────────────────────────
const refreshToken = asyncHandler(async (req, res) => {
  const newToken = authService.refreshToken(req.user.id, req.user.role);
  res.status(200).json({
    success: true,
    message: 'Token refreshed successfully',
    data: { token: newToken }
  });
});

// ─────────────────────────────────────────────
// DELETE /jwt/revoke-token   (protect)
// Stateless revocation notice — client must discard token
// ─────────────────────────────────────────────
const revokeToken = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Token revoked — please discard on client side'
  });
});

// ─────────────────────────────────────────────
// GET /jwt/private-employees   (protect)
// Paginated employee list, only for authenticated users
// ─────────────────────────────────────────────
const privateEmployees = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const result = await employeeService.paginate({}, { page, limit });
  res.status(200).json({
    success: true,
    data: result
  });
});

// ─────────────────────────────────────────────
// GET /jwt/private-projects   (protect)
// Returns all projects (paginated)
// ─────────────────────────────────────────────
const privateProjects = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const result = await employeeService.getAllProjects({ page, limit });
  res.status(200).json({
    success: true,
    data: result
  });
});

// ─────────────────────────────────────────────
// GET /jwt/private-tasks   (protect)
// Returns all tasks (paginated)
// ─────────────────────────────────────────────
const privateTasks = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const result = await employeeService.getAllTasks({ page, limit });
  res.status(200).json({
    success: true,
    data: result
  });
});

// ─────────────────────────────────────────────
// GET /jwt/private-analytics   (protect + admin only)
// Admin-only: returns dashboard summary
// ─────────────────────────────────────────────
const privateAnalytics = asyncHandler(async (req, res) => {
  const summary = await authService.getDashboardSummary();
  res.status(200).json({
    success: true,
    data: summary
  });
});

module.exports = {
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
};
