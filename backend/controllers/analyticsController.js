const asyncHandler = require('../middlewares/asyncHandler');
const analyticsService = require('../services/analyticsService');

// GET /analytics/employees/top-skills
const getTopSkills = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const result = await analyticsService.getTopSkills(limit);
  res.status(200).json({ success: true, data: result });
});

// GET /analytics/employees/top-domains
const getTopDomains = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const result = await analyticsService.getTopDomains(limit);
  res.status(200).json({ success: true, data: result });
});

// GET /analytics/employees/top-certifications
const getTopCertifications = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const result = await analyticsService.getTopCertifications(limit);
  res.status(200).json({ success: true, data: result });
});

// GET /analytics/employees/top-projects
const getTopProjects = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const result = await analyticsService.getTopProjects(limit);
  res.status(200).json({ success: true, data: result });
});

// GET /analytics/employees/top-technologies
const getTopTechnologies = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const result = await analyticsService.getTopTechnologies(limit);
  res.status(200).json({ success: true, data: result });
});

// GET /analytics/employees/timezone-analysis
const getTimezoneAnalysis = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const result = await analyticsService.getTimezoneAnalysis(limit);
  res.status(200).json({ success: true, data: result });
});

// GET /analytics/employees/location-analysis
const getLocationAnalysis = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const result = await analyticsService.getLocationAnalysis(limit);
  res.status(200).json({ success: true, data: result });
});

// GET /analytics/employees/experience-analysis
const getExperienceAnalysis = asyncHandler(async (req, res) => {
  const result = await analyticsService.getExperienceAnalysis();
  res.status(200).json({ success: true, data: result });
});

// GET /analytics/employees/verification-analysis
const getVerificationAnalysis = asyncHandler(async (req, res) => {
  const result = await analyticsService.getVerificationAnalysis();
  res.status(200).json({ success: true, data: result });
});

// GET /analytics/employees/project-analysis
const getProjectAnalysis = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const result = await analyticsService.getProjectAnalysis(limit);
  res.status(200).json({ success: true, data: result });
});

// GET /analytics/employees/task-analysis
const getTaskAnalysis = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const result = await analyticsService.getTaskAnalysis(limit);
  res.status(200).json({ success: true, data: result });
});

// GET /analytics/employees/skill-distribution
const getSkillDistribution = asyncHandler(async (req, res) => {
  const result = await analyticsService.getSkillDistribution();
  res.status(200).json({ success: true, data: result });
});

// GET /analytics/employees/domain-distribution
const getDomainDistribution = asyncHandler(async (req, res) => {
  const result = await analyticsService.getDomainDistribution();
  res.status(200).json({ success: true, data: result });
});

// GET /analytics/employees/country-analysis
const getCountryAnalysis = asyncHandler(async (req, res) => {
  const result = await analyticsService.getCountryAnalysis();
  res.status(200).json({ success: true, data: result });
});

// GET /analytics/employees/state-analysis
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
