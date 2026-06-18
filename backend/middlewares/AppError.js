// ─────────────────────────────────────────────────────────────
// Custom Error Class — AppError
//
// WHY: JavaScript's built-in Error class only has a "message".
// In a REST API we also need an HTTP status code (400, 404, 500, etc.)
// so our error handler can send the right response to the client.
//
// HOW: We extend (inherit from) the built-in Error class and add
// a "statusCode" property. This way, whenever we throw an error
// anywhere in the app, we can include the HTTP code:
//   throw new AppError('Employee not found', 404);
//
// The errorHandler middleware will then catch it and send:
//   { success: false, message: 'Employee not found', statusCode: 404 }
// ─────────────────────────────────────────────────────────────

class AppError extends Error {
  constructor(message, statusCode) {
    // super(message) calls the parent Error constructor to set this.message
    super(message);

    this.statusCode = statusCode;

    // "status" is a human-readable label:
    //   4xx errors (client mistakes) → 'fail'
    //   5xx errors (server mistakes) → 'error'
    this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
  }
}
module.exports = AppError;
