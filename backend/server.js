// ─────────────────────────────────────────────────────────────
// SERVER.JS — The main entry point of the application
//
// This file does 4 things:
// 1. Configures middleware (plugins that process every request)
// 2. Registers all route files (maps URLs to handler functions)
// 3. Connects to MongoDB
// 4. Starts the HTTP server
//
// REQUEST LIFECYCLE (what happens when a request comes in):
//   Client → cors → json parser → urlencoded → logger → requestTime
//   → route handler (or 404) → errorHandler → Client (response)
// ─────────────────────────────────────────────────────────────

const express = require('express');   // Express = web framework for Node.js (handles routing, middleware, etc.)
const cors = require('cors');         // CORS = Cross-Origin Resource Sharing (allows frontend on different domain to call this API)
require('dotenv').config();           // Loads variables from .env file into process.env (e.g., MONGO_URI, JWT_SECRET)

const connectDB = require('./config/db'); // Our MongoDB connection function

// ─── Import all route files ──────────────────────────────────
// Each file defines a group of related endpoints
const employeeRoutes = require('./routes/employeeRoutes');     // CRUD operations on employees
const searchRoutes = require('./routes/searchRoutes');         // Full-text search across employees
const filterRoutes = require('./routes/filterRoutes');         // Pre-built filters (e.g., /filter/cloud, /filter/python)
const analyticsRoutes = require('./routes/analyticsRoutes');   // Aggregation analytics (top skills, domains, etc.)
const statsRoutes = require('./routes/statsRoutes');           // Counts and statistics
const authRoutes = require('./routes/authRoutes');             // Register, login, profile management
const jwtRoutes = require('./routes/jwtRoutes');               // Token management (generate, verify, refresh)
const adminRoutes = require('./routes/adminRoutes');           // Admin-only data access
const protectedRoutes = require('./routes/protectedRoutes');   // Auth-required CRUD operations
const middlewareRoutes = require('./routes/middlewareRoutes'); // Demo routes to test middleware features
const metaRoutes = require('./routes/metaRoutes');             // HEAD and OPTIONS HTTP method routes

// ─── Import custom middleware ────────────────────────────────
const logger = require('./middlewares/logger');           // Logs every request to terminal
const requestTime = require('./middlewares/requestTime'); // Measures response time
const errorHandler = require('./middlewares/errorHandler'); // Global error catcher (MUST be last)

// ─── Create the Express application ─────────────────────────
const app = express();

// ═══════════════════════════════════════════════════════════
// MIDDLEWARE REGISTRATION (order matters!)
// Middleware runs in the order it's registered with app.use()
// ═══════════════════════════════════════════════════════════

// 1. CORS — Allows requests from other origins (e.g., a React frontend on localhost:3000)
//    Without this, browsers would block cross-origin API calls
app.use(cors({ preflightContinue: true }));

// 2. JSON body parser — Parses incoming JSON request bodies
//    After this, req.body contains the parsed JSON object
//    Example: POST body '{"name":"John"}' → req.body = { name: "John" }
app.use(express.json());

// 3. URL-encoded parser — Parses form data (e.g., from HTML forms)
//    extended: true allows nested objects in form data
app.use(express.urlencoded({ extended: true }));

// 4. Custom logger — Logs [timestamp] METHOD /url for every request
app.use(logger);

// 5. Request timer — Records start time, logs duration when response finishes
app.use(requestTime);

// ─── Health check route ──────────────────────────────────────
// A simple endpoint to verify the API is running (used by monitoring tools)
app.get('/', (req, res) => {
  res.json({ success: true, message: 'API is running' });
});

// ═══════════════════════════════════════════════════════════
// ROUTE MOUNTING
//
// app.use(prefix, router) maps a route file to a URL prefix.
// Example: app.use('/auth', authRoutes)
//   → POST /auth/login, POST /auth/register, GET /auth/profile
//
// Routes with '/' prefix don't add any prefix to their paths.
// ═══════════════════════════════════════════════════════════
app.use('/', metaRoutes);                    // HEAD/OPTIONS routes (no prefix)
app.use('/', employeeRoutes);                // /employees, /employees/:id, etc.
app.use('/', searchRoutes);                  // /search/employees
app.use('/employees/filter', filterRoutes);  // /employees/filter/cloud, /employees/filter/python, etc.
app.use('/', analyticsRoutes);               // /analytics/employees/top-skills, etc.
app.use('/stats', statsRoutes);              // /stats/employees/count, etc.
app.use('/auth', authRoutes);                // /auth/register, /auth/login, /auth/profile
app.use('/jwt', jwtRoutes);                  // /jwt/profile, /jwt/generate-token, etc.
app.use('/admin', adminRoutes);              // /admin/employees (admin-only)
app.use('/protected', protectedRoutes);      // /protected/employees (auth-required)
app.use('/middleware', middlewareRoutes);     // /middleware/logger, /middleware/auth, etc.

// ─── 404 Handler ─────────────────────────────────────────────
// If no route matched, this middleware catches the request
// It MUST come AFTER all route registrations
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ─── Global Error Handler ────────────────────────────────────
// MUST be the absolute LAST middleware registered
// Express recognizes it as an error handler because it has 4 parameters
app.use(errorHandler);

// ═══════════════════════════════════════════════════════════
// START THE SERVER
// 1. Connect to MongoDB first
// 2. Then start listening for HTTP requests on the specified port
// ═══════════════════════════════════════════════════════════
const PORT = process.env.PORT || 5000; // Use port from .env, or default to 5000

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
});
