// ─────────────────────────────────────────────────────────────
// Global Error Handler Middleware
//
// HOW EXPRESS ERROR HANDLING WORKS:
// - Normal middleware has 3 params: (req, res, next)
// - Error-handling middleware has 4 params: (err, req, res, next)
// - Express knows this is an error handler BECAUSE it has 4 params
// - It MUST be registered LAST with app.use() in server.js
// - Any error thrown or passed to next(err) ends up here
//
// WHAT THIS DOES:
// 1. Extracts the status code (defaults to 500 if not set)
// 2. Logs the error to the server console for debugging
// 3. Sends a clean JSON error response to the client
// 4. In development mode, also includes the stack trace
//    (the stack trace shows exactly where the error occurred)
// ─────────────────────────────────────────────────────────────

const errorHandler = (err, req, res, next) => {
  // If the error has a statusCode (e.g., from AppError), use it; otherwise default to 500
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log the error details to the terminal (not visible to the client)
  console.error(`[ERROR] ${req.method} ${req.originalUrl} - ${statusCode}: ${message}`);

  // Send JSON error response to the client
  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
    // The spread (...) conditionally adds the stack trace ONLY in development mode
    // In production, you don't want to expose internal code paths to users
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
