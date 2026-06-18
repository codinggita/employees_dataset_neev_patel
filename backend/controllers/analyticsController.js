// ─────────────────────────────────────────────────────────────
// Analytics Controller — Handles HTTP requests for analytics endpoints
//
// Each function:
// 1. Extracts the optional "limit" query parameter
// 2. Calls the corresponding analyticsService function
// 3. Returns the result as JSON
//
// All analytics routes are GET-only and public (no auth required).
// ─────────────────────────────────────────────────────────────

const asyncHandler = require('../middlewares/asyncHandler');
const analyticsService = require('../services/analyticsService');

// GET /analytics/employees/top-skills — Most common primary skills
const getTopSkills = asyncHandler(async (req, res) => {
  // parseInt converts string "10" to number 10; defaults to 10 if not provided
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const result = await analyticsService.getTopSkills(limit);
  res.status(200).json({ success: true, data: result });
});

// GET /analytics/employees/top-domains — Most common work domains
const getTopDomains = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const result = await analyticsService.getTopDomains(limit);
  res.status(200).json({ success: true, data: result });
});

// GET /analytics/employees/top-certifications — Most held certifications
const getTopCertifications = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const result = await analyticsService.getTopCertifications(limit);
  res.status(200).json({ success: true, data: result });
});

// GET /analytics/employees/top-projects — Projects with most employees
const getTopProjects = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const result = await analyticsService.getTopProjects(limit);
  res.status(200).json({ success: true, data: result });
});

// GET /analytics/employees/top-technologies — Most used secondary skills
const getTopTechnologies = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const result = await analyticsService.getTopTechnologies(limit);
  res.status(200).json({ success: true, data: result });
});

// GET /analytics/employees/timezone-analysis — Employee distribution by timezone
const getTimezoneAnalysis = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const result = await analyticsService.getTimezoneAnalysis(limit);
  res.status(200).json({ success: true, data: result });
});

// GET /analytics/employees/location-analysis — Distribution by state + country
const getLocationAnalysis = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const result = await analyticsService.getLocationAnalysis(limit);
  res.status(200).json({ success: true, data: result });
});

// GET /analytics/employees/experience-analysis — Count at each experience level
const getExperienceAnalysis = asyncHandler(async (req, res) => {
  const result = await analyticsService.getExperienceAnalysis();
  res.status(200).json({ success: true, data: result });
});

// GET /analytics/employees/verification-analysis — Verified vs unverified split
const getVerificationAnalysis = asyncHandler(async (req, res) => {
  const result = await analyticsService.getVerificationAnalysis();
  res.status(200).json({ success: true, data: result });
});

// GET /analytics/employees/project-analysis — Projects with task & employee counts
const getProjectAnalysis = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const result = await analyticsService.getProjectAnalysis(limit);
  res.status(200).json({ success: true, data: result });
});

// GET /analytics/employees/task-analysis — Task ID distribution
const getTaskAnalysis = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const result = await analyticsService.getTaskAnalysis(limit);
  res.status(200).json({ success: true, data: result });
});

// GET /analytics/employees/skill-distribution — Full skill breakdown (no limit)
const getSkillDistribution = asyncHandler(async (req, res) => {
  const result = await analyticsService.getSkillDistribution();
  res.status(200).json({ success: true, data: result });
});

// GET /analytics/employees/domain-distribution — Full domain breakdown (no limit)
const getDomainDistribution = asyncHandler(async (req, res) => {
  const result = await analyticsService.getDomainDistribution();
  res.status(200).json({ success: true, data: result });
});

// GET /analytics/employees/country-analysis — Employees per country
const getCountryAnalysis = asyncHandler(async (req, res) => {
  const result = await analyticsService.getCountryAnalysis();
  res.status(200).json({ success: true, data: result });
});

// GET /analytics/employees/state-analysis — Employees per state
const getStateAnalysis = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const result = await analyticsService.getStateAnalysis(limit);
  res.status(200).json({ success: true, data: result });
});

module.exports = {
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
};
