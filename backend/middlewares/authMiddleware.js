// ─────────────────────────────────────────────────────────────
// Auth Middleware — Protects routes by requiring a valid JWT
//
// WHAT IS JWT (JSON Web Token)?
// A JWT is a signed string that proves a user's identity.
// After login, the server creates a token containing the user's
// ID and role, signs it with a secret key, and sends it back.
// For every future request to a protected route, the client
// sends the token in the Authorization header:
//   Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
//
// HOW THIS MIDDLEWARE WORKS:
// 1. Checks if the Authorization header exists and starts with "Bearer "
// 2. Extracts the token string after "Bearer "
// 3. Verifies the token using jwt.verify() with the same secret
//    that was used to sign it (JWT_SECRET from .env)
// 4. If valid, the decoded payload (user id + role) is attached
//    to req.user — making it available to all downstream handlers
// 5. If invalid/expired, returns 401 Unauthorized
//
// USAGE: Applied to routes that require login, e.g.:
//   router.get('/profile', protect, getProfile);
//   The request goes through: protect → getProfile
//   If protect fails, getProfile never runs
// ─────────────────────────────────────────────────────────────

const jwt = require('jsonwebtoken'); // Library for creating and verifying JWTs

const authMiddleware = (req, res, next) => {
  try {
    // Step 1: Get the Authorization header from the incoming request
    // Example header value: "Bearer eyJhbGciOiJIUzI1NiIs..."
    const authHeader = req.headers.authorization;

    // Step 2: Check if header exists and has the correct format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Step 3: Extract the token (everything after "Bearer ")
    const token = authHeader.split(' ')[1]; // Split by space, take the second part

    // Step 4: Verify and decode the token
    // jwt.verify() checks the signature and expiration
    // If valid, returns the payload: { id: '...', role: 'user', iat: ..., exp: ... }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Step 5: Attach the decoded user info to the request object
    // Now any handler after this middleware can access req.user.id, req.user.role
    req.user = decoded;

    // Step 6: Continue to the next middleware or route handler
    next();
  } catch (error) {
    // jwt.verify() throws if the token is tampered with, expired, or malformed
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.'
    });
  }
};

module.exports = authMiddleware;
