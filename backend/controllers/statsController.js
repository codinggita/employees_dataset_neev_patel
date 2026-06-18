// ─────────────────────────────────────────────────────────────
// Stats Controller — Handles HTTP requests for statistics endpoints
//
// Similar to analyticsController, but focused on counts,
// averages, and distributions rather than ranked lists.
//
// All stats routes are GET-only, public (no auth).
// ─────────────────────────────────────────────────────────────

const asyncHandler = require('../middlewares/asyncHandler');
const statsService = require('../services/statsService');

// GET /stats/employees/count — Total number of employees
const getEmployeesCount = asyncHandler(async (req, res) => {
  const result = await statsService.getEmployeesCount();
  res.status(200).json({ success: true, count: result });
});

// GET /stats/employees/experience-average — Average years of experience
const getAverageExperience = asyncHandler(async (req, res) => {
  const result = await statsService.getAverageExperience();
  res.status(200).json({ success: true, data: result });
});

// GET /stats/employees/top-experience — Employees with highest experience
const getTopExperience = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const result = await statsService.getTopExperience(limit);
  res.status(200).json({ success: true, data: result });
});

// GET /stats/employees/project-count — Number of unique projects
const getProjectCount = asyncHandler(async (req, res) => {
  const result = await statsService.getProjectCount();
  res.status(200).json({ success: true, count: result });
});

// GET /stats/employees/task-count — Number of unique tasks
const getTaskCount = asyncHandler(async (req, res) => {
  const result = await statsService.getTaskCount();
  res.status(200).json({ success: true, count: result });
});

// GET /stats/employees/country-count — Employees per country
const getCountryCount = asyncHandler(async (req, res) => {
  const result = await statsService.getCountryCount();
  res.status(200).json({ success: true, data: result });
});

// GET /stats/employees/state-count — Employees per state
const getStateCount = asyncHandler(async (req, res) => {
  const result = await statsService.getStateCount();
  res.status(200).json({ success: true, data: result });
});

// GET /stats/employees/domain-count — Employees per domain
const getDomainCount = asyncHandler(async (req, res) => {
  const result = await statsService.getDomainCount();
  res.status(200).json({ success: true, data: result });
});

// GET /stats/employees/skill-count — Employees per primary skill
const getSkillCount = asyncHandler(async (req, res) => {
  const result = await statsService.getSkillCount();
  res.status(200).json({ success: true, data: result });
});

// GET /stats/employees/certification-count — Count per certification
const getCertificationCount = asyncHandler(async (req, res) => {
  const result = await statsService.getCertificationCount();
  res.status(200).json({ success: true, data: result });
});

// GET /stats/employees/timezone-count — Employees per timezone
const getTimezoneCount = asyncHandler(async (req, res) => {
  const result = await statsService.getTimezoneCount();
  res.status(200).json({ success: true, data: result });
});

// GET /stats/employees/verified-count — How many employees have verified certs
const getVerifiedCount = asyncHandler(async (req, res) => {
  const result = await statsService.getVerifiedCount();
  res.status(200).json({ success: true, count: result });
});

// GET /stats/employees/project-distribution — Employees per project (with names)
const getProjectDistribution = asyncHandler(async (req, res) => {
  const result = await statsService.getProjectDistribution();
  res.status(200).json({ success: true, data: result });
});

// GET /stats/employees/task-distribution — Employees per task
const getTaskDistribution = asyncHandler(async (req, res) => {
  const result = await statsService.getTaskDistribution();
  res.status(200).json({ success: true, data: result });
});

// GET /stats/employees/technology-count — Count per secondary skill/technology
const getTechnologyCount = asyncHandler(async (req, res) => {
  const result = await statsService.getTechnologyCount();
  res.status(200).json({ success: true, data: result });
});

module.exports = {
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
};
