// ─────────────────────────────────────────────────────────────
// Search Routes — Full-text search endpoint
//
// Mounted at '/' in server.js, so the full URL is:
//   GET /search/employees?q=Python&page=1&limit=10
// ─────────────────────────────────────────────────────────────

const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// GET /search/employees — Search across multiple employee fields
// The search query is passed as the 'q' query parameter:
//   /search/employees?q=Python → searches name, skills, domains, etc. for "Python"
router.get('/search/employees', employeeController.searchEmployees);

module.exports = router;
