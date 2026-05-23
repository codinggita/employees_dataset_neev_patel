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

const findBySecondarySkill = (skill, pagination) => {
  return paginate({ 'profile.projects.tasks.assignedTo.skills.secondary': skill }, pagination);
};

const findByDomain = (domain, pagination) => {
  return paginate({ 'profile.projects.tasks.assignedTo.skills.experience.domains': domain }, pagination);
};

const findByExperience = (years, pagination) => {
  const parsed = Number(years);
  if (isNaN(parsed)) {
    const AppError = require('../middlewares/AppError');
    throw new AppError('Experience must be a valid number', 400);
  }
  return paginate({ 'profile.projects.tasks.assignedTo.skills.experience.years': parsed }, pagination);
};

const findByProjectId = (projectId, pagination) => {
  return paginate({ 'profile.projects.projectId': projectId }, pagination);
};

const findByTaskId = (taskId, pagination) => {
  return paginate({ 'profile.projects.tasks.taskId': taskId }, pagination);
};

const findByCertification = (certification, pagination) => {
  return paginate({
    'profile.projects.tasks.assignedTo.skills.experience.certifications.current': {
      $regex: certification,
      $options: 'i'
    }
  }, pagination);
};

const queryEmployees = async (filters, sort, page = 1, limit = 10) => {
  page = parseInt(page);
  limit = parseInt(limit);

  if (page <= 0 || limit <= 0) {
    const AppError = require('../middlewares/AppError');
    throw new AppError('Page and limit must be greater than zero', 400);
  }

  const query = {};

  if (filters.country) query['profile.contact.address.location.country'] = { $regex: filters.country, $options: 'i' };
  if (filters.state) query['profile.contact.address.location.state'] = filters.state;
  if (filters.city) query['profile.contact.address.city'] = filters.city;
  if (filters.primarySkill) query['profile.projects.tasks.assignedTo.skills.primary'] = filters.primarySkill;
  if (filters.secondarySkill) query['profile.projects.tasks.assignedTo.skills.secondary'] = filters.secondarySkill;
  if (filters.domain) query['profile.projects.tasks.assignedTo.skills.experience.domains'] = filters.domain;
  if (filters.experience) query['profile.projects.tasks.assignedTo.skills.experience.years'] = Number(filters.experience);
  if (filters.verified !== undefined) query['profile.projects.tasks.assignedTo.skills.experience.certifications.meta.verified'] = filters.verified === 'true' || filters.verified === true;
  if (filters.certification) query['profile.projects.tasks.assignedTo.skills.experience.certifications.current'] = filters.certification;
  if (filters.timezone) query['profile.contact.address.location.geo.timezone.name'] = filters.timezone;
  if (filters.project) query['profile.projects.projectId'] = filters.project;
  if (filters.task) query['profile.projects.tasks.taskId'] = filters.task;
  if (filters.technology) query['profile.projects.tasks.assignedTo.skills.secondary'] = filters.technology;
  
  if (filters.skill) {
    query.$or = [
      { 'profile.projects.tasks.assignedTo.skills.primary': filters.skill },
      { 'profile.projects.tasks.assignedTo.skills.secondary': filters.skill }
    ];
  }

  let sortObj = {};
  if (typeof sort === 'object' && sort !== null) {
    sortObj = sort;
  } else if (typeof sort === 'string') {
    if (sort === 'name') sortObj = { name: 1 };
    else if (sort === 'experience') sortObj = { 'profile.projects.tasks.assignedTo.skills.experience.years': -1 };
    else if (sort === 'lastUpdated') sortObj = { 'profile.projects.tasks.assignedTo.skills.experience.certifications.meta.lastUpdated': -1 };
    else if (sort === 'country') sortObj = { 'profile.contact.address.location.country': 1 };
    else if (sort === 'state') sortObj = { 'profile.contact.address.location.state': 1 };
    else if (sort === 'city') sortObj = { 'profile.contact.address.city': 1 };
  }

  const skip = (page - 1) * limit;
  const total = await Employee.countDocuments(query);
  const data = await Employee.find(query).sort(sortObj).skip(skip).limit(limit);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
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
  findBySecondarySkill,
  findByDomain,
  findByExperience,
  findByProjectId,
  findByTaskId,
  findByCertification,
  queryEmployees,
};
