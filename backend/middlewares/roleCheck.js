// ─────────────────────────────────────────────────────────────
// Role Check Middleware (a.k.a. restrictTo)
//
// PURPOSE: After authMiddleware confirms the user is logged in,
// this middleware checks whether the user has the RIGHT ROLE
// to access a particular route.
//
// This is another "middleware factory" — a function that takes
// arguments and returns a middleware function.
//
// HOW IT WORKS:
//   restrictTo('admin')        → only admins can access
//   restrictTo('admin', 'manager') → admins OR managers can access
//
// The flow for an admin-only route:
//   1. authMiddleware runs first → sets req.user = { id, role: 'user' }
//   2. roleCheck('admin') runs next → checks req.user.role
//   3. 'user' is NOT in ['admin'] → returns 403 Forbidden
//   4. The route handler NEVER runs
//
// If the user IS an admin:
//   3. 'admin' IS in ['admin'] → calls next()
//   4. The route handler runs normally
// ─────────────────────────────────────────────────────────────

const roleCheck = (...allowedRoles) => {
  // ...allowedRoles is a "rest parameter" — it collects all arguments into an array
  // roleCheck('admin', 'manager') → allowedRoles = ['admin', 'manager']

  return (req, res, next) => {
    // Safety check: make sure req.user exists and has a role
    // (this should always be true if authMiddleware ran first)
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. No role assigned.'
      });
    }

    // Check if the user's role is in the list of allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role(s): ${allowedRoles.join(', ')}`,
      });
    }

    // User has the required role — continue to the route handler
    next();
  };
};

module.exports = roleCheck;
