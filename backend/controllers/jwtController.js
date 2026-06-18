// ─────────────────────────────────────────────────────────────
// JWT Controller — Handles all /jwt/* protected routes
//
// These endpoints manage JWT token operations and provide
// authenticated access to employee data.
//
// ALL routes in this controller require a valid JWT token
// (enforced by the authMiddleware applied in jwtRoutes.js).
// After authMiddleware runs, req.user contains:
//   { id: "userId", role: "user|admin", iat: ..., exp: ... }
// ─────────────────────────────────────────────────────────────

const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../middlewares/AppError');
const authService = require('../services/authService');
const employeeService = require('../services/employeeService');

// ─────────────────────────────────────────────
// GET /jwt/profile — Returns the decoded user info from the JWT
// Simply echoes back the user data that authMiddleware decoded
// ─────────────────────────────────────────────
const getJwtProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: { user: req.user } // req.user was set by authMiddleware
  });
});

// ─────────────────────────────────────────────
// GET /jwt/dashboard — Returns aggregated employee statistics
// Calls authService.getDashboardSummary() which runs MongoDB
// aggregation pipelines to compute totalEmployees, topSkill, topDomain
// ─────────────────────────────────────────────
const getJwtDashboard = asyncHandler(async (req, res) => {
  const summary = await authService.getDashboardSummary();
  res.status(200).json({
    success: true,
    data: summary
  });
});

// ─────────────────────────────────────────────
// POST /jwt/generate-token — Issues a brand new JWT
// Uses the current user's id and role from req.user
// ─────────────────────────────────────────────
const generateToken = asyncHandler(async (req, res) => {
  // authService.refreshToken() signs a new JWT with the same payload
  const token = authService.refreshToken(req.user.id, req.user.role);
  res.status(200).json({
    success: true,
    message: 'Token generated successfully',
    data: { token }
  });
});

// ─────────────────────────────────────────────
// POST /jwt/verify-token — Verify and decode a token from the request body
// Accepts { "token": "eyJhbG..." } in the body
// Returns the decoded payload if the token is valid
// ─────────────────────────────────────────────
const verifyToken = asyncHandler(async (req, res, next) => {
  const { token } = req.body;

  if (!token) {
    return next(new AppError('Token is required in request body', 400));
  }

  try {
    // authService.getUserFromToken() calls jwt.verify()
    const decoded = authService.getUserFromToken(token);
    res.status(200).json({
      success: true,
      data: { decoded }
    });
  } catch {
    // jwt.verify() throws if the token is invalid, expired, or tampered
    return next(new AppError('Invalid or expired token', 401));
  }
});

// ─────────────────────────────────────────────
// POST /jwt/refresh-token — Get a new token with extended expiry
// The old token is still valid until it expires.
// The client should replace the old token with the new one.
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
// DELETE /jwt/revoke-token — Revoke (invalidate) the current token
//
// IMPORTANT: JWTs are STATELESS — the server can't truly invalidate
// a token without maintaining a "blacklist" in the database.
// This endpoint just tells the client to discard the token.
// In production, you'd add the token to a blacklist/revocation table.
// ─────────────────────────────────────────────
const revokeToken = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Token revoked — please discard on client side'
  });
});

// ─────────────────────────────────────────────
// GET /jwt/private-employees — Paginated employee list (auth required)
// Same data as GET /employees, but requires authentication
// ─────────────────────────────────────────────
const privateEmployees = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1, 10 results per page
  const result = await employeeService.queryEmployees({}, null, page, limit);
  res.status(200).json({
    success: true,
    data: result
  });
});

// ─────────────────────────────────────────────
// GET /jwt/private-projects — All projects (auth required)
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
// GET /jwt/private-tasks — All tasks (auth required)
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
// GET /jwt/private-analytics — Admin-only analytics
//
// This route has TWO middleware guards in jwtRoutes.js:
//   protect (authMiddleware) → restrictTo('admin')
//
// So the request must:
// 1. Have a valid JWT token (protect)
// 2. The token's role must be 'admin' (restrictTo)
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
