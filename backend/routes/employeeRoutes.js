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
router.get('/employees/:id', employeeController.getEmployeeById);
router.put('/employees/:id', employeeController.replaceEmployee);
router.patch('/employees/:id', employeeController.updateEmployee);
router.delete('/employees/:id', employeeController.deleteEmployeeById);

module.exports = router;
