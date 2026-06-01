const express = require('express');
const router = express.Router();
const {
  getTopSkills,
  getTopDomains,
  getTopCertifications,
  getTopProjects,
  getTopTechnologies,
  getTimezoneAnalysis,
  getLocationAnalysis
} = require('../controllers/analyticsController');

router.get('/analytics/employees/top-skills', getTopSkills);
router.get('/analytics/employees/top-domains', getTopDomains);
router.get('/analytics/employees/top-certifications', getTopCertifications);
router.get('/analytics/employees/top-projects', getTopProjects);
router.get('/analytics/employees/top-technologies', getTopTechnologies);
router.get('/analytics/employees/timezone-analysis', getTimezoneAnalysis);
router.get('/analytics/employees/location-analysis', getLocationAnalysis);

module.exports = router;
