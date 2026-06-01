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

router.get('/employees/count', getEmployeesCount);
router.get('/employees/experience-average', getAverageExperience);
router.get('/employees/top-experience', getTopExperience);
router.get('/employees/project-count', getProjectCount);
router.get('/employees/task-count', getTaskCount);
router.get('/employees/country-count', getCountryCount);
router.get('/employees/state-count', getStateCount);
router.get('/employees/domain-count', getDomainCount);
router.get('/employees/skill-count', getSkillCount);
router.get('/employees/certification-count', getCertificationCount);
router.get('/employees/timezone-count', getTimezoneCount);
router.get('/employees/verified-count', getVerifiedCount);
router.get('/employees/project-distribution', getProjectDistribution);
router.get('/employees/task-distribution', getTaskDistribution);
router.get('/employees/technology-count', getTechnologyCount);

module.exports = router;
