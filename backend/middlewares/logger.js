// ─────────────────────────────────────────────────────────────
// Logger Middleware
//
// WHAT IS MIDDLEWARE?
// Middleware is a function that runs BETWEEN receiving a request
// and sending a response. Think of it as a "checkpoint" that every
// request passes through. Each middleware can:
//   1. Inspect/modify the request (req)
//   2. Inspect/modify the response (res)
//   3. Call next() to pass control to the next middleware/route
//   4. Or end the request by sending a response
//
// WHAT THIS DOES:
// Logs every incoming HTTP request to the terminal, showing:
//   [2026-06-03T09:30:00.000Z] GET /employees
//   [2026-06-03T09:30:01.123Z] POST /auth/login
//
// This helps you see what endpoints are being hit while developing.
// ─────────────────────────────────────────────────────────────

const logger = (req, res, next) => {
  const timestamp = new Date().toISOString(); // Current time in ISO format
  // req.method = GET, POST, PUT, PATCH, DELETE
  // req.originalUrl = the full URL path (e.g., /employees?page=1)
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next(); // IMPORTANT: always call next() or the request will hang forever
};

module.exports = logger;
