const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// Employee routes (order matters — specific routes before parameterized ones)
router.post('/employees/bulk-create', employeeController.bulkCreateEmployees);
router.patch('/employees/bulk-update', employeeController.bulkUpdateEmployees);
router.delete('/employees/bulk-delete', employeeController.bulkDeleteEmployees);
router.get('/employees/exists/:id', employeeController.checkEmployeeExists);
router.get('/employees', employeeController.getAllEmployees);
router.post('/employees', employeeController.createEmployee);
router.get('/employees/name/:name', employeeController.getByName);
router.get('/employees/state/:state', employeeController.getByState);
router.get('/employees/country/:country', employeeController.getByCountry);
router.get('/employees/city/:city', employeeController.getByCity);
router.get('/employees/timezone/:timezone', employeeController.getByTimezone);
router.get('/employees/primary-skill/:skill', employeeController.getByPrimarySkill);
router.get('/employees/:id', employeeController.getEmployeeById);
router.put('/employees/:id', employeeController.replaceEmployee);
router.patch('/employees/:id', employeeController.updateEmployee);
router.delete('/employees/:id', employeeController.deleteEmployeeById);

module.exports = router;
