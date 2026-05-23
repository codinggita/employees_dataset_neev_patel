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

// Pagination helper
const paginate = async (query, { page = 1, limit = 10 } = {}) => {
  page = parseInt(page);
  limit = parseInt(limit);
  const skip = (page - 1) * limit;
  const total = await Employee.countDocuments(query);
  const data = await Employee.find(query).skip(skip).limit(limit);
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

const findByName = (name, pagination) => {
  return paginate({ name: { $regex: name, $options: 'i' } }, pagination);
};

const findByState = (state, pagination) => {
  return paginate({ 'profile.contact.address.location.state': state }, pagination);
};

const findByCountry = (country, pagination) => {
  return paginate({ 'profile.contact.address.location.country': country }, pagination);
};

const findByCity = (city, pagination) => {
  return paginate({ 'profile.contact.address.city': city }, pagination);
};

const findByTimezone = (timezone, pagination) => {
  return paginate({ 'profile.contact.address.location.geo.timezone.name': timezone }, pagination);
};

const findByPrimarySkill = (skill, pagination) => {
  return paginate({ 'profile.projects.tasks.assignedTo.skills.primary': skill }, pagination);
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
  findByName,
  findByState,
  findByCountry,
  findByCity,
  findByTimezone,
  findByPrimarySkill,
};
