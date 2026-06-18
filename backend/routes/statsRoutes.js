// ─────────────────────────────────────────────────────────────
// Stats Routes — Maps statistics URLs to controller functions
//
// All stats routes are public GET endpoints.
// They return counts, averages, and distributions.
//
// Mounted at '/stats' in server.js:
//   app.use('/stats', statsRoutes);
// So '/employees/count' here becomes '/stats/employees/count'
// ─────────────────────────────────────────────────────────────

const express = require('express');
const router = express.Router();

const {
  getEmployeesCount,
  getAverageExperience,
  getTopExperience,
  getProjectCount,
  getTaskCount,
  getCountryCount,
  getStateCount,
  getDomainCount,
  getSkillCount,
  getCertificationCount,
  getTimezoneCount,
  getVerifiedCount,
  getProjectDistribution,
  getTaskDistribution,
  getTechnologyCount
} = require('../controllers/statsController');

// ─── Count endpoints (return single numbers) ─────────────────
router.get('/employees/count', getEmployeesCount);            // Total employees
router.get('/employees/experience-average', getAverageExperience); // Avg experience years
router.get('/employees/top-experience', getTopExperience);    // Top N by experience
router.get('/employees/project-count', getProjectCount);      // Unique project count
router.get('/employees/task-count', getTaskCount);            // Unique task count

// ─── Per-field count endpoints (return arrays) ───────────────
router.get('/employees/country-count', getCountryCount);
router.get('/employees/state-count', getStateCount);
router.get('/employees/domain-count', getDomainCount);
router.get('/employees/skill-count', getSkillCount);
router.get('/employees/certification-count', getCertificationCount);
router.get('/employees/timezone-count', getTimezoneCount);
router.get('/employees/verified-count', getVerifiedCount);

// ─── Distribution endpoints (show spread of data) ────────────
router.get('/employees/project-distribution', getProjectDistribution);
router.get('/employees/task-distribution', getTaskDistribution);
router.get('/employees/technology-count', getTechnologyCount);

module.exports = router;
