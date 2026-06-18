// ─────────────────────────────────────────────────────────────
// Audit Log Middleware — Records WHO did WHAT and WHEN
//
// PURPOSE: Security and debugging. In a real production app,
// these audit entries would be written to a database or log file
// instead of just console.log. This helps answer questions like:
//   "Who deleted employee E00042 at 3 AM?"
//
// WHAT IT LOGS:
//   [AUDIT] 2026-06-03T09:30:00Z | User: 6483abc... | POST /protected/employees | Body: {"id":"E99999",...}
//
// NOTE: req.user is only available AFTER the authMiddleware runs.
// If no user is authenticated, it logs 'anonymous'.
// The request body is only logged for write operations (POST/PUT/PATCH/DELETE).
// ─────────────────────────────────────────────────────────────

const auditLog = (req, res, next) => {
  const timestamp = new Date().toISOString();

  // req.user is set by authMiddleware (JWT decoding). If not logged in, fallback to 'anonymous'
  const user = req.user ? req.user.id || req.user.email : 'anonymous';
  const method = req.method; // GET, POST, PUT, PATCH, DELETE
  const url = req.originalUrl; // Full URL path

  // Only log the request body for methods that change data (not for GET/HEAD)
  const body = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) ? JSON.stringify(req.body) : 'N/A';

  console.log(`[AUDIT] ${timestamp} | User: ${user} | ${method} ${url} | Body: ${body}`);

  next(); // Continue to the next middleware/route handler
};

module.exports = auditLog;
