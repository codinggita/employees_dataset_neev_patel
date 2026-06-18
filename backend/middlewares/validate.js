// ─────────────────────────────────────────────────────────────
// Validation Middleware — Checks that required fields exist in req.body
//
// HOW IT WORKS:
// This is a "middleware factory" — a function that RETURNS a middleware.
// You call it with the list of required fields, and it gives you back
// a middleware function that checks for those fields.
//
// USAGE EXAMPLE:
//   router.post('/validation', validate(['name', 'email']), handler);
//
//   If someone sends { "name": "John" } without "email",
//   the response will be:
//   { success: false, message: "Missing required fields: email", statusCode: 400 }
//
// WHY A FACTORY?
// Because different routes need different required fields.
// validate(['name', 'email']) and validate(['password']) create
// different middleware functions with different validation rules.
// ─────────────────────────────────────────────────────────────

const validate = (requiredFields) => {
  // This is the actual middleware function returned by the factory
  return (req, res, next) => {
    const missingFields = [];

    // Loop through each required field and check if it exists in req.body
    for (const field of requiredFields) {
      if (!req.body[field]) {
        missingFields.push(field); // Collect all missing fields
      }
    }

    // If any fields are missing, send a 400 error and DON'T call next()
    // (this stops the request from reaching the route handler)
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
        statusCode: 400
      });
    }

    // All required fields present — continue to the next middleware/route handler
    next();
  };
};

module.exports = validate;
