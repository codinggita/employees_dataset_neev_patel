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

const getVerifiedEmployees = (pagination) => {
  return paginate({ 'profile.projects.tasks.assignedTo.skills.experience.certifications.meta.verified': true }, pagination);
};

const getAllProjects = async (pagination) => {
  const { page = 1, limit = 10 } = pagination || {};
  const skip = (page - 1) * limit;
  const total = await Employee.countDocuments({});
  const data = await Employee.find({}).select('profile.projects -_id').skip(skip).limit(limit);
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

const getAllTasks = async (pagination) => {
  const { page = 1, limit = 10 } = pagination || {};
  const skip = (page - 1) * limit;
  const total = await Employee.countDocuments({});
  const data = await Employee.find({}).select('profile.projects.tasks -_id').skip(skip).limit(limit);
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

const getTopExperience = async (limit = 10) => {
  return Employee.find().sort({ 'profile.projects.tasks.assignedTo.skills.experience.years': -1 }).limit(limit);
};

const getTopSkills = async () => {
  return Employee.aggregate([
    { $unwind: '$profile.projects' },
    { $unwind: '$profile.projects.tasks' },
    {
      $group: {
        _id: '$profile.projects.tasks.assignedTo.skills.primary',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);
};

const getCloudEngineers = (pagination) => {
  return paginate({ 'profile.projects.tasks.assignedTo.skills.experience.domains': 'Cloud' }, pagination);
};

const getDevOpsEngineers = (pagination) => {
  return paginate({ 'profile.projects.tasks.assignedTo.skills.experience.domains': 'DevOps' }, pagination);
};

const getAIEngineers = (pagination) => {
  return paginate({ 'profile.projects.tasks.assignedTo.skills.experience.domains': 'AI' }, pagination);
};

const getFullStackDevelopers = (pagination) => {
  return paginate({
    'profile.projects.tasks.assignedTo.skills.secondary': { $all: ['React', 'Node.js'] }
  }, pagination);
};

const getRecentCertifications = async (pagination) => {
  const { page = 1, limit = 20 } = pagination || {};
  const skip = (page - 1) * limit;
  const total = await Employee.countDocuments({});
  const data = await Employee.find({}).sort({ 'profile.projects.tasks.assignedTo.skills.experience.certifications.meta.lastUpdated': -1 }).skip(skip).limit(limit);
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

const searchEmployees = async (q, pagination) => {
  if (!q || q.trim() === '') {
    const AppError = require('../middlewares/AppError');
    throw new AppError('Search query cannot be empty', 400);
  }
  const regex = { $regex: q, $options: 'i' };
  const query = {
    $or: [
      { name: regex },
      { 'profile.projects.tasks.assignedTo.skills.primary': regex },
      { 'profile.projects.tasks.assignedTo.skills.secondary': regex },
      { 'profile.projects.tasks.assignedTo.skills.experience.domains': regex },
      { 'profile.projects.tasks.assignedTo.skills.experience.certifications.current': regex },
      { 'profile.contact.address.location.country': regex },
      { 'profile.contact.address.city': regex },
      { 'profile.projects.name': regex },
      { 'profile.projects.tasks.description': regex }
    ]
  };
  return paginate(query, pagination);
};

const getEmployeePerformance = async (id) => {
  const employee = await Employee.findOne({ id });
  if (!employee) return null;

  let totalProjects = employee.profile?.projects?.length || 0;
  let totalTasks = 0;
  let primarySkill = null;
  let domains = [];
  let experienceYears = 0;

  if (employee.profile?.projects?.length > 0) {
    employee.profile.projects.forEach(p => {
      if (p.tasks) totalTasks += p.tasks.length;
      if (!primarySkill && p.tasks?.[0]?.assignedTo?.skills?.primary) {
        primarySkill = p.tasks[0].assignedTo.skills.primary;
        domains = p.tasks[0].assignedTo.skills.experience?.domains || [];
        experienceYears = p.tasks[0].assignedTo.skills.experience?.years || 0;
      }
    });
  }

  return {
    name: employee.name,
    totalProjects,
    totalTasks,
    primarySkill,
    domains,
    experienceYears
  };
};

const getEmployeeStats = async (id) => {
  const employee = await Employee.findOne({ id });
  if (!employee) return null;

  let currentCertCount = 0;
  let expiredCertCount = 0;
  let verified = false;
  let lastUpdated = null;

  const tasks = employee.profile?.projects?.[0]?.tasks;
  if (tasks && tasks.length > 0) {
    const certs = tasks[0].assignedTo?.skills?.experience?.certifications;
    if (certs) {
      currentCertCount = certs.current?.length || 0;
      expiredCertCount = certs.expired?.length || 0;
      verified = certs.meta?.verified || false;
      lastUpdated = certs.meta?.lastUpdated || null;
    }
  }

  return {
    name: employee.name,
    currentCertCount,
    expiredCertCount,
    verified,
    lastUpdated
  };
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
  getVerifiedEmployees,
  getAllProjects,
  getAllTasks,
  getTopExperience,
  getTopSkills,
  getCloudEngineers,
  getDevOpsEngineers,
  getAIEngineers,
  getFullStackDevelopers,
  getRecentCertifications,
  searchEmployees,
  getEmployeePerformance,
  getEmployeeStats,
};
