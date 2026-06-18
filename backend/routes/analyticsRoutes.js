// ─────────────────────────────────────────────────────────────
// Analytics Routes — Maps analytics URLs to controller functions
//
// All analytics routes are public GET endpoints.
// They return aggregated data (counts, rankings, distributions).
//
// Mounted at '/' in server.js, so the full URLs are:
//   GET /analytics/employees/top-skills
//   GET /analytics/employees/top-domains
//   etc.
// ─────────────────────────────────────────────────────────────

const express = require('express');
const router = express.Router();

// Import all analytics controller functions using destructuring
const {
  getTopSkills,
  getTopDomains,
  getTopCertifications,
  getTopProjects,
  getTopTechnologies,
  getTimezoneAnalysis,
  getLocationAnalysis,
  getExperienceAnalysis,
  getVerificationAnalysis,
  getProjectAnalysis,
  getTaskAnalysis,
  getSkillDistribution,
  getDomainDistribution,
  getCountryAnalysis,
  getStateAnalysis
} = require('../controllers/analyticsController');

// ─── Ranked "top N" endpoints (support ?limit=10) ────────────
router.get('/analytics/employees/top-skills', getTopSkills);
router.get('/analytics/employees/top-domains', getTopDomains);
router.get('/analytics/employees/top-certifications', getTopCertifications);
router.get('/analytics/employees/top-projects', getTopProjects);
router.get('/analytics/employees/top-technologies', getTopTechnologies);

// ─── Analysis endpoints ──────────────────────────────────────
router.get('/analytics/employees/timezone-analysis', getTimezoneAnalysis);
router.get('/analytics/employees/location-analysis', getLocationAnalysis);
router.get('/analytics/employees/experience-analysis', getExperienceAnalysis);
router.get('/analytics/employees/verification-analysis', getVerificationAnalysis);
router.get('/analytics/employees/project-analysis', getProjectAnalysis);
router.get('/analytics/employees/task-analysis', getTaskAnalysis);

// ─── Full distribution endpoints (no limit) ──────────────────
router.get('/analytics/employees/skill-distribution', getSkillDistribution);
router.get('/analytics/employees/domain-distribution', getDomainDistribution);
router.get('/analytics/employees/country-analysis', getCountryAnalysis);
router.get('/analytics/employees/state-analysis', getStateAnalysis);

module.exports = router;
