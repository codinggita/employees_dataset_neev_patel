// ─────────────────────────────────────────────────────────────
// Employee Service — Core business logic for all employee operations
//
// This file contains ALL the database queries for employees.
// Controllers call these functions — they never talk to the
// database directly. This separation keeps the code organized.
//
// KEY MONGOOSE METHODS USED:
//   .find(query)         → Find all documents matching the query
//   .findOne(query)      → Find the first matching document
//   .create(data)        → Create a new document
//   .findOneAndUpdate()  → Find one and update it
//   .findOneAndReplace() → Find one and completely replace it
//   .findOneAndDelete()  → Find one and delete it
//   .insertMany(array)   → Insert multiple documents at once
//   .deleteMany(query)   → Delete all documents matching the query
//   .countDocuments(query) → Count matching documents
//   .aggregate(pipeline) → Run an aggregation pipeline
//
// KEY MONGODB QUERY OPERATORS:
//   $regex   → Pattern matching (like SQL's LIKE)
//   $options: 'i' → Case-insensitive matching
//   $in      → Match any value in an array
//   $all     → Match documents that have ALL specified values
//   $gte     → Greater than or equal to
//   $lte     → Less than or equal to
//   $or      → Match if ANY condition is true
// ─────────────────────────────────────────────────────────────

const Employee = require('../models/Employee');

// ═══════════════════════════════════════════════════════════
// BASIC CRUD OPERATIONS
// ═══════════════════════════════════════════════════════════

// Find ALL employees (no filter)
const getAllEmployees = () => {
  return Employee.find(); // .find() with no args returns every document
};

// Find ONE employee by their custom id field (e.g., "E00001")
// Note: We use { id } not { _id } because we have a custom "id" field
const getEmployeeById = (id) => {
  return Employee.findOne({ id });
};

// Create a new employee document from the request body data
const createEmployee = (data) => {
  return Employee.create(data); // Validates against the schema, then inserts
};

// Find and delete an employee by id
// Returns the deleted document (or null if not found)
const deleteEmployeeById = (id) => {
  return Employee.findOneAndDelete({ id });
};

// Check if an employee exists (returns true/false)
// !! converts a truthy/falsy value to a boolean
// If employee is found → !!employee → true
// If not found (null) → !!null → false
const employeeExists = async (id) => {
  const employee = await Employee.findOne({ id });
  return !!employee;
};

// Insert multiple employees at once
// insertMany() is much faster than calling create() in a loop
const bulkCreate = (dataArray) => {
  return Employee.insertMany(dataArray);
};

// PATCH — Partially update an employee (only change the fields provided)
// { new: true } tells Mongoose to return the UPDATED document (not the old one)
// { runValidators: true } ensures the update still passes schema validation
const updateEmployeeById = (id, data) => {
  return Employee.findOneAndUpdate({ id }, data, { new: true, runValidators: true });
};

// PUT — Completely replace an employee document with new data
// Unlike update, this REMOVES any fields not in the new data
const replaceEmployeeById = (id, data) => {
  return Employee.findOneAndReplace({ id }, data, { new: true });
};

// Update multiple employees at once
// Promise.all() runs all updates in parallel (simultaneously) for speed
const bulkUpdate = (updates) => {
  return Promise.all(updates.map(({ id, data }) => updateEmployeeById(id, data)));
};

// Delete multiple employees whose id is in the provided array
// $in operator: matches any document whose "id" is in the ids array
// Example: { id: { $in: ["E00001", "E00002"] } }
const bulkDelete = (ids) => {
  return Employee.deleteMany({ id: { $in: ids } });
};

// ═══════════════════════════════════════════════════════════
// PAGINATION HELPER
//
// Pagination splits large result sets into smaller "pages".
// Instead of returning 4000 employees at once, return 10 at a time.
//
// HOW IT WORKS:
//   page=1, limit=10 → skip 0, show items 1-10
//   page=2, limit=10 → skip 10, show items 11-20
//   page=3, limit=10 → skip 20, show items 21-30
//
// skip = (page - 1) * limit
//   page 1: (1-1)*10 = skip 0
//   page 2: (2-1)*10 = skip 10
//   page 3: (3-1)*10 = skip 20
// ═══════════════════════════════════════════════════════════
const paginate = async (query, { page = 1, limit = 10 } = {}) => {
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  // Validate that page and limit are positive numbers
  if (isNaN(pageNum) || pageNum <= 0 || isNaN(limitNum) || limitNum <= 0) {
    const AppError = require('../middlewares/AppError');
    throw new AppError('Page and limit must be greater than zero', 400);
  }

  const skip = (pageNum - 1) * limitNum;

  // countDocuments() counts total matches (for calculating total pages)
  const total = await Employee.countDocuments(query);

  // .find(query).skip(n).limit(n) — the Mongoose way to paginate
  const data = await Employee.find(query).skip(skip).limit(limitNum);

  return {
    data,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum) // Math.ceil rounds up: 41/10 = 5 pages
  };
};

// ═══════════════════════════════════════════════════════════
// LOOKUP / SEARCH FUNCTIONS
//
// Each function queries a specific nested field using dot notation.
// MongoDB dot notation lets you query nested objects:
//   'profile.contact.address.location.state' → employee.profile.contact.address.location.state
//
// $regex with $options: 'i' provides case-insensitive partial matching:
//   { name: { $regex: 'john', $options: 'i' } }
//   → matches "John", "JOHN", "john doe", etc.
// ═══════════════════════════════════════════════════════════

const findByName = (name, pagination) => {
  return paginate({ name: { $regex: name, $options: 'i' } }, pagination);
};

const findByState = (state, pagination) => {
  return paginate({ 'profile.contact.address.location.state': { $regex: state, $options: 'i' } }, pagination);
};

const findByCountry = (country, pagination) => {
  return paginate({ 'profile.contact.address.location.country': { $regex: country, $options: 'i' } }, pagination);
};

const findByCity = (city, pagination) => {
  return paginate({ 'profile.contact.address.city': { $regex: city, $options: 'i' } }, pagination);
};

const findByTimezone = (timezone, pagination) => {
  return paginate({ 'profile.contact.address.location.geo.timezone.name': { $regex: timezone, $options: 'i' } }, pagination);
};

const findByPrimarySkill = (skill, pagination) => {
  return paginate({ 'profile.projects.tasks.assignedTo.skills.primary': { $regex: skill, $options: 'i' } }, pagination);
};

const findBySecondarySkill = (skill, pagination) => {
  return paginate({ 'profile.projects.tasks.assignedTo.skills.secondary': { $regex: skill, $options: 'i' } }, pagination);
};

const findByDomain = (domain, pagination) => {
  return paginate({ 'profile.projects.tasks.assignedTo.skills.experience.domains': { $regex: domain, $options: 'i' } }, pagination);
};

// Experience is a number, so we use exact match instead of $regex
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

// ═══════════════════════════════════════════════════════════
// ADVANCED QUERY — queryEmployees
//
// This is the most powerful query function. It supports:
//   - Dynamic filtering (build query from URL params)
//   - Sorting (by name, experience, country, etc.)
//   - Pagination
//
// It's used by GET /employees?country=USA&sort=name&page=1&limit=10
// ═══════════════════════════════════════════════════════════
const queryEmployees = async (filters, sort, page = 1, limit = 10) => {
  page = parseInt(page);
  limit = parseInt(limit);

  if (page <= 0 || limit <= 0) {
    const AppError = require('../middlewares/AppError');
    throw new AppError('Page and limit must be greater than zero', 400);
  }

  // Build the MongoDB query object dynamically based on which filters were provided
  const query = {};

  // Each "if" only adds the filter if that query param was sent by the client
  if (filters.country) query['profile.contact.address.location.country'] = { $regex: filters.country, $options: 'i' };
  if (filters.state) query['profile.contact.address.location.state'] = { $regex: filters.state, $options: 'i' };
  if (filters.city) query['profile.contact.address.city'] = { $regex: filters.city, $options: 'i' };
  if (filters.primarySkill) query['profile.projects.tasks.assignedTo.skills.primary'] = { $regex: filters.primarySkill, $options: 'i' };
  if (filters.secondarySkill) query['profile.projects.tasks.assignedTo.skills.secondary'] = { $regex: filters.secondarySkill, $options: 'i' };
  if (filters.domain) query['profile.projects.tasks.assignedTo.skills.experience.domains'] = { $regex: filters.domain, $options: 'i' };
  if (filters.experience) query['profile.projects.tasks.assignedTo.skills.experience.years'] = Number(filters.experience);
  if (filters.verified !== undefined) query['profile.projects.tasks.assignedTo.skills.experience.certifications.meta.verified'] = filters.verified === 'true' || filters.verified === true;
  if (filters.certification) query['profile.projects.tasks.assignedTo.skills.experience.certifications.current'] = { $regex: filters.certification, $options: 'i' };
  if (filters.timezone) query['profile.contact.address.location.geo.timezone.name'] = { $regex: filters.timezone, $options: 'i' };
  if (filters.project) query['profile.projects.projectId'] = filters.project;
  if (filters.task) query['profile.projects.tasks.taskId'] = filters.task;
  if (filters.technology) query['profile.projects.tasks.assignedTo.skills.secondary'] = filters.technology;
  
  // $or operator — matches if primary OR secondary skill matches
  if (filters.skill) {
    query.$or = [
      { 'profile.projects.tasks.assignedTo.skills.primary': filters.skill },
      { 'profile.projects.tasks.assignedTo.skills.secondary': filters.skill }
    ];
  }

  // Build sort object — determines the order of results
  // 1 = ascending (A→Z, 0→9), -1 = descending (Z→A, 9→0)
  let sortObj = {};
  if (typeof sort === 'object' && sort !== null) {
    sortObj = sort; // Already a sort object (used internally by sort controllers)
  } else if (typeof sort === 'string') {
    // Map sort string from URL params to MongoDB sort objects
    if (sort === 'name') sortObj = { name: 1 };
    else if (sort === 'experience') sortObj = { 'profile.projects.tasks.assignedTo.skills.experience.years': -1 };
    else if (sort === 'lastUpdated') sortObj = { 'profile.projects.tasks.assignedTo.skills.experience.certifications.meta.lastUpdated': -1 };
    else if (sort === 'country') sortObj = { 'profile.contact.address.location.country': 1 };
    else if (sort === 'state') sortObj = { 'profile.contact.address.location.state': 1 };
    else if (sort === 'city') sortObj = { 'profile.contact.address.city': 1 };
  }

  const skip = (page - 1) * limit;
  const total = await Employee.countDocuments(query);

  // Chain: find → sort → skip → limit
  // MongoDB executes these in an optimized order internally
  const data = await Employee.find(query).sort(sortObj).skip(skip).limit(limit);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

// ═══════════════════════════════════════════════════════════
// SPECIALIZED QUERIES
// ═══════════════════════════════════════════════════════════

// Find employees whose certifications are verified (meta.verified = true)
const getVerifiedEmployees = (pagination) => {
  return paginate({ 'profile.projects.tasks.assignedTo.skills.experience.certifications.meta.verified': true }, pagination);
};

// Get only the projects data from each employee
// .select('profile.projects -_id') → include projects, exclude MongoDB's _id
const getAllProjects = async (pagination) => {
  const { page = 1, limit = 10 } = pagination || {};
  const skip = (page - 1) * limit;
  const total = await Employee.countDocuments({});
  const data = await Employee.find({}).select('profile.projects -_id').skip(skip).limit(limit);
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

// Get only the tasks data from each employee
const getAllTasks = async (pagination) => {
  const { page = 1, limit = 10 } = pagination || {};
  const skip = (page - 1) * limit;
  const total = await Employee.countDocuments({});
  const data = await Employee.find({}).select('profile.projects.tasks -_id').skip(skip).limit(limit);
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

// Get employees with the most experience, sorted descending
const getTopExperience = async (limit = 10) => {
  return Employee.find().sort({ 'profile.projects.tasks.assignedTo.skills.experience.years': -1 }).limit(limit);
};

// Aggregation: Count occurrences of each primary skill across all tasks
// $unwind flattens arrays — required before $group when data is nested in arrays
const getTopSkills = async () => {
  return Employee.aggregate([
    { $unwind: '$profile.projects' },       // 1 doc per project
    { $unwind: '$profile.projects.tasks' }, // 1 doc per task
    {
      $group: {
        _id: '$profile.projects.tasks.assignedTo.skills.primary', // Group by primary skill
        count: { $sum: 1 } // Count how many tasks use each skill
      }
    },
    { $sort: { count: -1 } }, // Most popular first
    { $limit: 10 }            // Top 10 only
  ]);
};

// Find employees working in specific domains
const getCloudEngineers = (pagination) => {
  return paginate({ 'profile.projects.tasks.assignedTo.skills.experience.domains': 'Cloud' }, pagination);
};

const getDevOpsEngineers = (pagination) => {
  return paginate({ 'profile.projects.tasks.assignedTo.skills.experience.domains': 'DevOps' }, pagination);
};

const getAIEngineers = (pagination) => {
  return paginate({ 'profile.projects.tasks.assignedTo.skills.experience.domains': 'AI' }, pagination);
};

// Full-stack developers have BOTH React and Node.js in their secondary skills
// $all operator: the array must contain ALL specified values
const getFullStackDevelopers = (pagination) => {
  return paginate({
    'profile.projects.tasks.assignedTo.skills.secondary': { $all: ['React', 'Node.js'] }
  }, pagination);
};

// Get employees sorted by most recent certification update
const getRecentCertifications = async (pagination) => {
  const { page = 1, limit = 20 } = pagination || {};
  const skip = (page - 1) * limit;
  const total = await Employee.countDocuments({});
  const data = await Employee.find({}).sort({ 'profile.projects.tasks.assignedTo.skills.experience.certifications.meta.lastUpdated': -1 }).skip(skip).limit(limit);
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

// ═══════════════════════════════════════════════════════════
// FULL-TEXT SEARCH
//
// Searches across MULTIPLE fields using $or with $regex.
// The same search term is checked against name, skills, domains,
// certifications, country, city, project names, and task descriptions.
// ═══════════════════════════════════════════════════════════
const searchEmployees = async (q, pagination) => {
  if (!q || q.trim() === '') {
    const AppError = require('../middlewares/AppError');
    throw new AppError('Search query cannot be empty', 400);
  }

  // Create a reusable regex object for case-insensitive matching
  const regex = { $regex: q, $options: 'i' };

  // $or: match if ANY of these conditions is true
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

// ═══════════════════════════════════════════════════════════
// EMPLOYEE PERFORMANCE & STATS
// These extract computed data from a single employee's nested structure
// ═══════════════════════════════════════════════════════════

// Compute a performance summary for one employee
const getEmployeePerformance = async (id) => {
  const employee = await Employee.findOne({ id });
  if (!employee) return null;

  let totalProjects = employee.profile?.projects?.length || 0;
  let totalTasks = 0;
  let primarySkill = null;
  let domains = [];
  let experienceYears = 0;

  // Walk through projects and tasks to extract data
  // ?. (optional chaining) safely accesses nested properties without crashing if something is undefined
  if (employee.profile?.projects?.length > 0) {
    employee.profile.projects.forEach(p => {
      if (p.tasks) totalTasks += p.tasks.length;
      // Get skill info from the first task's assignedTo (if available)
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

// Compute certification stats for one employee
const getEmployeeStats = async (id) => {
  const employee = await Employee.findOne({ id });
  if (!employee) return null;

  let currentCertCount = 0;
  let expiredCertCount = 0;
  let verified = false;
  let lastUpdated = null;

  // Navigate the nested structure to find certification data
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

// Generic filter function — accepts any MongoDB query object
// Used by the filter routes (e.g., /filter/cloud, /filter/python)
const filterEmployees = (matchQuery, pagination) => {
  return paginate(matchQuery, pagination);
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
  filterEmployees,
};
