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

module.exports = {
  getTopSkills,
  getTopDomains,
  getTopCertifications,
  getTopProjects,
  getTopTechnologies,
  getTimezoneAnalysis,
  getLocationAnalysis
};
