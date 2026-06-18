// ─────────────────────────────────────────────────────────────
// Async Handler — Catches errors in async route handlers
//
// PROBLEM: Express does NOT automatically catch errors thrown
// inside async functions. Without this wrapper, if an async
// controller throws an error, the server hangs and the client
// gets no response.
//
// SOLUTION: This wrapper takes an async function (fn), calls it,
// and if it rejects (throws an error), it passes that error to
// next() — which sends it to the errorHandler middleware.
//
// WITHOUT asyncHandler you'd have to write try/catch in EVERY route:
//   router.get('/employees', async (req, res, next) => {
//     try {
//       const data = await Employee.find();
//       res.json(data);
//     } catch (err) {
//       next(err); // <-- boilerplate you'd repeat 50+ times
//     }
//   });
//
// WITH asyncHandler:
//   router.get('/employees', asyncHandler(async (req, res) => {
//     const data = await Employee.find();
//     res.json(data);  // errors auto-forwarded to errorHandler
//   }));
// ─────────────────────────────────────────────────────────────

const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
module.exports = asyncHandler;
