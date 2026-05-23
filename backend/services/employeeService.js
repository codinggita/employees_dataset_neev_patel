// Employee Service
// Core business logic for employee operations

const Employee = require('../models/Employee');

const getAllEmployees = () => {
  return Employee.find();
};

const getEmployeeById = (id) => {
  return Employee.findOne({ id });
};

const createEmployee = (data) => {
  return Employee.create(data);
};

const deleteEmployeeById = (id) => {
  return Employee.findOneAndDelete({ id });
};

const employeeExists = async (id) => {
  const employee = await Employee.findOne({ id });
  return !!employee;
};

const bulkCreate = (dataArray) => {
  return Employee.insertMany(dataArray);
};

const updateEmployeeById = (id, data) => {
  return Employee.findOneAndUpdate({ id }, data, { new: true, runValidators: true });
};

const replaceEmployeeById = (id, data) => {
  return Employee.findOneAndReplace({ id }, data, { new: true });
};

const bulkUpdate = (updates) => {
  return Promise.all(updates.map(({ id, data }) => updateEmployeeById(id, data)));
};

const bulkDelete = (ids) => {
  return Employee.deleteMany({ id: { $in: ids } });
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  deleteEmployeeById,
  employeeExists,
  bulkCreate,
  updateEmployeeById,
  replaceEmployeeById,
  bulkUpdate,
  bulkDelete,
};
