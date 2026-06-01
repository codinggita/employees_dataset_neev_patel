const asyncHandler = require('../middlewares/asyncHandler');
const statsService = require('../services/statsService');

// GET /stats/employees/count
const getEmployeesCount = asyncHandler(async (req, res) => {
  const result = await statsService.getEmployeesCount();
  res.status(200).json({ success: true, count: result });
});

// GET /stats/employees/experience-average
const getAverageExperience = asyncHandler(async (req, res) => {
  const result = await statsService.getAverageExperience();
  res.status(200).json({ success: true, data: result });
});

// GET /stats/employees/top-experience
const getTopExperience = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const result = await statsService.getTopExperience(limit);
  res.status(200).json({ success: true, data: result });
});

// GET /stats/employees/project-count
const getProjectCount = asyncHandler(async (req, res) => {
  const result = await statsService.getProjectCount();
  res.status(200).json({ success: true, count: result });
});

// GET /stats/employees/task-count
const getTaskCount = asyncHandler(async (req, res) => {
  const result = await statsService.getTaskCount();
  res.status(200).json({ success: true, count: result });
});

// GET /stats/employees/country-count
const getCountryCount = asyncHandler(async (req, res) => {
  const result = await statsService.getCountryCount();
  res.status(200).json({ success: true, data: result });
});

// GET /stats/employees/state-count
const getStateCount = asyncHandler(async (req, res) => {
  const result = await statsService.getStateCount();
  res.status(200).json({ success: true, data: result });
});

// GET /stats/employees/domain-count
const getDomainCount = asyncHandler(async (req, res) => {
  const result = await statsService.getDomainCount();
  res.status(200).json({ success: true, data: result });
});

// GET /stats/employees/skill-count
const getSkillCount = asyncHandler(async (req, res) => {
  const result = await statsService.getSkillCount();
  res.status(200).json({ success: true, data: result });
});

// GET /stats/employees/certification-count
const getCertificationCount = asyncHandler(async (req, res) => {
  const result = await statsService.getCertificationCount();
  res.status(200).json({ success: true, data: result });
});

// GET /stats/employees/timezone-count
const getTimezoneCount = asyncHandler(async (req, res) => {
  const result = await statsService.getTimezoneCount();
  res.status(200).json({ success: true, data: result });
});

// GET /stats/employees/verified-count
const getVerifiedCount = asyncHandler(async (req, res) => {
  const result = await statsService.getVerifiedCount();
  res.status(200).json({ success: true, count: result });
});

// GET /stats/employees/project-distribution
const getProjectDistribution = asyncHandler(async (req, res) => {
  const result = await statsService.getProjectDistribution();
  res.status(200).json({ success: true, data: result });
});

// GET /stats/employees/task-distribution
const getTaskDistribution = asyncHandler(async (req, res) => {
  const result = await statsService.getTaskDistribution();
  res.status(200).json({ success: true, data: result });
});

// GET /stats/employees/technology-count
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
