const express = require('express');
const router = express.Router();
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

router.get('/analytics/employees/top-skills', getTopSkills);
router.get('/analytics/employees/top-domains', getTopDomains);
router.get('/analytics/employees/top-certifications', getTopCertifications);
router.get('/analytics/employees/top-projects', getTopProjects);
router.get('/analytics/employees/top-technologies', getTopTechnologies);
router.get('/analytics/employees/timezone-analysis', getTimezoneAnalysis);
router.get('/analytics/employees/location-analysis', getLocationAnalysis);

router.get('/analytics/employees/experience-analysis', getExperienceAnalysis);
router.get('/analytics/employees/verification-analysis', getVerificationAnalysis);
router.get('/analytics/employees/project-analysis', getProjectAnalysis);
router.get('/analytics/employees/task-analysis', getTaskAnalysis);
router.get('/analytics/employees/skill-distribution', getSkillDistribution);
router.get('/analytics/employees/domain-distribution', getDomainDistribution);
router.get('/analytics/employees/country-analysis', getCountryAnalysis);
router.get('/analytics/employees/state-analysis', getStateAnalysis);

module.exports = router;
