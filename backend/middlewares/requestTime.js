// ─────────────────────────────────────────────────────────────
// Request Time Middleware — Measures how long each request takes
//
// HOW IT WORKS:
// 1. When a request arrives, we record the current timestamp
//    (Date.now() returns milliseconds since Jan 1, 1970)
// 2. We attach it to req.requestTime so other middleware can use it
// 3. We listen for the 'finish' event on the response object
//    — 'finish' fires when Express has finished sending the response
// 4. At that point, we calculate the difference (duration)
//    and log it to the terminal
//
// EXAMPLE OUTPUT:
//   [TIMING] GET /employees - 45ms
//   [TIMING] POST /auth/login - 120ms
//
// This is useful for finding slow endpoints during development.
// ─────────────────────────────────────────────────────────────

const requestTime = (req, res, next) => {
  // Record the start time on the request object
  req.requestTime = Date.now();

  // res.on('finish', callback) — Node.js event listener
  // The 'finish' event fires when the response has been fully sent to the client
  res.on('finish', () => {
    const duration = Date.now() - req.requestTime; // Calculate elapsed time in ms
    console.log(`[TIMING] ${req.method} ${req.originalUrl} - ${duration}ms`);
  });

  next(); // Pass control to the next middleware
};

module.exports = requestTime;
