// ─────────────────────────────────────────────────────────────
// Employee Routes — Maps URLs to controller functions
//
// WHAT IS A ROUTER?
// express.Router() creates a mini "app" that handles routes.
// It's mounted to the main app in server.js using:
//   app.use('/', employeeRoutes);
//
// Each route definition has 3 parts:
//   router.METHOD(PATH, HANDLER)
//   router.get('/employees', controller.getAllEmployees)
//          ↑         ↑              ↑
//        method    URL path    function to call
//
// ROUTE ORDER MATTERS!
// Express matches routes top-to-bottom and uses the FIRST match.
// Specific routes (like /employees/bulk-create) must come BEFORE
// parameterized routes (like /employees/:id), otherwise Express
// would treat "bulk-create" as an :id parameter.
//
// Example of the problem:
//   router.get('/employees/:id', ...)      ← registered first
//   router.get('/employees/verified', ...) ← never reached!
//   Because Express sees "verified" and matches it as :id = "verified"
// ─────────────────────────────────────────────────────────────

const express = require('express');
const router = express.Router(); // Create a new Router instance
const employeeController = require('../controllers/employeeController');

// ─── Bulk operations (must come before :id routes) ───────────
router.post('/employees/bulk-create', employeeController.bulkCreateEmployees);
router.patch('/employees/bulk-update', employeeController.bulkUpdateEmployees);
router.delete('/employees/bulk-delete', employeeController.bulkDeleteEmployees);

// ─── Check existence (specific path, before :id) ─────────────
router.get('/employees/exists/:id', employeeController.checkEmployeeExists);

// ─── Core CRUD ───────────────────────────────────────────────
router.get('/employees', employeeController.getAllEmployees);     // List all (with filters/pagination)
router.post('/employees', employeeController.createEmployee);    // Create one

// ─── Lookup by field (all specific paths, before :id) ────────
router.get('/employees/name/:name', employeeController.getByName);
router.get('/employees/state/:state', employeeController.getByState);
router.get('/employees/country/:country', employeeController.getByCountry);
router.get('/employees/city/:city', employeeController.getByCity);
router.get('/employees/timezone/:timezone', employeeController.getByTimezone);
router.get('/employees/primary-skill/:skill', employeeController.getByPrimarySkill);
router.get('/employees/secondary-skill/:skill', employeeController.getBySecondarySkill);
router.get('/employees/domain/:domain', employeeController.getByDomain);
router.get('/employees/experience/:years', employeeController.getByExperience);
router.get('/employees/project/:projectId', employeeController.getByProjectId);
router.get('/employees/task/:taskId', employeeController.getByTaskId);
router.get('/employees/certification/:certification', employeeController.getByCertification);

// ─── Sort endpoints ──────────────────────────────────────────
router.get('/employees/sort/experience-desc', employeeController.sortByExperienceDesc);
router.get('/employees/sort/name-asc', employeeController.sortByNameAsc);
router.get('/employees/sort/project-asc', employeeController.sortByProjectAsc);
router.get('/employees/sort/domain-asc', employeeController.sortByDomainAsc);
router.get('/employees/sort/certification-desc', employeeController.sortByCertificationDesc);

// ─── Utility / specialized endpoints ─────────────────────────
router.get('/employees/verified', employeeController.getVerifiedEmployees);
router.get('/employees/projects', employeeController.getAllProjects);
router.get('/employees/tasks', employeeController.getAllTasks);
router.get('/employees/top-experience', employeeController.getTopExperience);
router.get('/employees/top-skills', employeeController.getTopSkills);
router.get('/employees/cloud-engineers', employeeController.getCloudEngineers);
router.get('/employees/devops-engineers', employeeController.getDevOpsEngineers);
router.get('/employees/ai-engineers', employeeController.getAIEngineers);
router.get('/employees/fullstack', employeeController.getFullStackDevelopers);
router.get('/employees/recent-certifications', employeeController.getRecentCertifications);
router.get('/employees/performance/:id', employeeController.getEmployeePerformance);
router.get('/employees/stats/:id', employeeController.getEmployeeStats);

// ─── Parameterized :id routes (MUST be last!) ────────────────
// These catch-all routes would swallow specific paths if placed above
router.get('/employees/:id', employeeController.getEmployeeById);        // Read one
router.put('/employees/:id', employeeController.replaceEmployee);        // Replace one (full update)
router.patch('/employees/:id', employeeController.updateEmployee);       // Update one (partial)
router.delete('/employees/:id', employeeController.deleteEmployeeById);  // Delete one

module.exports = router;
