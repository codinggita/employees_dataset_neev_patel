const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// Search routes
router.get('/search/employees', employeeController.searchEmployees);

module.exports = router;
