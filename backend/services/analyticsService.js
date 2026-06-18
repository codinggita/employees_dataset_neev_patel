// ─────────────────────────────────────────────────────────────
// Analytics Service — Aggregation queries for data analysis
//
// ALL functions in this file use MongoDB's AGGREGATION PIPELINE.
//
// AGGREGATION PIPELINE EXPLAINED:
// Think of it as an assembly line where data flows through stages:
//
//   Documents → $unwind → $group → $sort → $project → $limit → Result
//
// Common stages used here:
//   $unwind  → "Explodes" an array field. If an employee has 3 projects,
//              $unwind creates 3 separate documents (one per project).
//              This is needed because $group can't directly count items
//              inside arrays.
//
//   $group   → Groups documents by a field and calculates aggregates.
//              Like SQL's GROUP BY. { _id: '$skill', count: { $sum: 1 } }
//              groups by skill and counts how many of each.
//
//   $sort    → Orders the results. { count: -1 } = highest count first.
//
//   $project → Reshapes the output (rename fields, exclude _id, etc.)
//              { _id: 0, value: '$_id', count: 1 } renames _id to "value"
//              and excludes the MongoDB _id.
//
//   $limit   → Takes only the first N results.
// ─────────────────────────────────────────────────────────────

const Employee = require('../models/Employee');

/**
 * Reusable pipeline helper — builds aggregation stages for
 * "group by field, count occurrences, sort by count, limit results"
 *
 * @param {string|object} fieldPath - The MongoDB field path to group by (must start with $)
 * @param {boolean} isArray - If true, $unwind the field first (needed for array fields)
 * @param {number} limit - Max results to return (null = no limit)
 * @returns {Array} Array of pipeline stages
 */
function groupByField(fieldPath, isArray = false, limit = 10) {
  const pipeline = [];
  // If the field is an array (like domains or secondary skills),
  // $unwind it first so each array element becomes its own document
  if (isArray) pipeline.push({ $unwind: fieldPath });
  pipeline.push({ $group: { _id: fieldPath, count: { $sum: 1 } } }); // Count per unique value
  pipeline.push({ $sort: { count: -1 } });                           // Most frequent first
  pipeline.push({ $project: { _id: 0, value: '$_id', count: 1 } }); // Clean output format
  if (limit) pipeline.push({ $limit: limit });                       // Cap results
  return pipeline;
}

// Shared pipeline stages to flatten the nested projects → tasks structure
// Almost every analytics query needs this because skills data is inside tasks
const baseUnwind = [
  { $unwind: '$profile.projects' },       // 1 employee with 3 projects → 3 documents
  { $unwind: '$profile.projects.tasks' }  // 1 project with 2 tasks → 2 documents
];

// ─── Analytics functions ─────────────────────────────────────
// Each function runs an aggregation pipeline and returns the results.
// The spread operator (...) merges the baseUnwind stages with
// the groupByField stages into a single pipeline array.

// Top primary skills (e.g., Python: 1200, Java: 1100, Go: 800)
const getTopSkills = async (limit = 10) => {
  return Employee.aggregate([
    ...baseUnwind,
    ...groupByField('$profile.projects.tasks.assignedTo.skills.primary', false, limit)
  ]);
};

// Top domains (e.g., Cloud: 2000, DevOps: 1500, AI: 900)
// Domains is an array, so isArray=true triggers an extra $unwind
const getTopDomains = async (limit = 10) => {
  return Employee.aggregate([
    ...baseUnwind,
    ...groupByField('$profile.projects.tasks.assignedTo.skills.experience.domains', true, limit)
  ]);
};

// Top current certifications
const getTopCertifications = async (limit = 10) => {
  return Employee.aggregate([
    ...baseUnwind,
    ...groupByField('$profile.projects.tasks.assignedTo.skills.experience.certifications.current', true, limit)
  ]);
};

// Top projects by number of employees assigned
// This uses a custom pipeline instead of the helper because
// it also captures the project name using $first
const getTopProjects = async (limit = 10) => {
  return Employee.aggregate([
    { $unwind: '$profile.projects' },
    {
      $group: {
        _id: '$profile.projects.projectId',
        name: { $first: '$profile.projects.name' }, // $first takes the first name encountered in each group
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    {
      $project: {
        _id: 0,
        projectId: '$_id', // Rename _id back to projectId
        name: 1,           // Include name
        count: 1           // Include count
      }
    },
    ...(limit ? [{ $limit: limit }] : []) // Conditionally add $limit stage
  ]);
};

// Top secondary skills / technologies (e.g., React, AWS, Docker)
const getTopTechnologies = async (limit = 10) => {
  return Employee.aggregate([
    ...baseUnwind,
    ...groupByField('$profile.projects.tasks.assignedTo.skills.secondary', true, limit)
  ]);
};

// Timezone distribution — how many employees in each timezone
// No baseUnwind needed because timezone is not inside projects/tasks arrays
const getTimezoneAnalysis = async (limit = 10) => {
  return Employee.aggregate([
    ...groupByField('$profile.contact.address.location.geo.timezone.name', false, limit)
  ]);
};

// Location distribution — grouped by state + country combination
// Uses an object as _id to group by multiple fields at once
const getLocationAnalysis = async (limit = 10) => {
  return Employee.aggregate([
    ...groupByField({
      state: '$profile.contact.address.location.state',
      country: '$profile.contact.address.location.country'
    }, false, limit)
  ]);
};

// Experience distribution — count of employees at each experience level (1yr, 2yr, etc.)
// Sorted by years ascending (1, 2, 3...) instead of by count
const getExperienceAnalysis = async () => {
  return Employee.aggregate([
    ...baseUnwind,
    {
      $group: {
        _id: '$profile.projects.tasks.assignedTo.skills.experience.years',
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }, // Sort by years ascending
    {
      $project: {
        _id: 0,
        value: '$_id',
        count: 1
      }
    }
  ]);
};

// Verification split — how many verified vs. unverified
const getVerificationAnalysis = async () => {
  return Employee.aggregate([
    ...baseUnwind,
    ...groupByField('$profile.projects.tasks.assignedTo.skills.experience.certifications.meta.verified', false, null)
  ]);
};

// Project analysis — each project with its task count and employee count
// $size counts elements in an array; $ifNull provides a fallback empty array
const getProjectAnalysis = async (limit = 10) => {
  return Employee.aggregate([
    { $unwind: '$profile.projects' },
    {
      $group: {
        _id: '$profile.projects.projectId',
        name: { $first: '$profile.projects.name' },
        taskCount: { $sum: { $size: { $ifNull: ['$profile.projects.tasks', []] } } },
        count: { $sum: 1 }
      }
    },
    { $sort: { taskCount: -1 } },
    {
      $project: {
        _id: 0,
        projectId: '$_id',
        name: 1,
        taskCount: 1,
        employeeCount: '$count'
      }
    },
    ...(limit ? [{ $limit: limit }] : [])
  ]);
};

// Task analysis — count occurrences of each taskId
const getTaskAnalysis = async (limit = 10) => {
  return Employee.aggregate([
    ...baseUnwind,
    ...groupByField('$profile.projects.tasks.taskId', false, limit)
  ]);
};

// Full distribution of primary skills (no limit — returns ALL skills)
const getSkillDistribution = async () => {
  return Employee.aggregate([
    ...baseUnwind,
    ...groupByField('$profile.projects.tasks.assignedTo.skills.primary', false, null)
  ]);
};

// Full distribution of domains (no limit)
const getDomainDistribution = async () => {
  return Employee.aggregate([
    ...baseUnwind,
    ...groupByField('$profile.projects.tasks.assignedTo.skills.experience.domains', true, null)
  ]);
};

// Count employees per country
const getCountryAnalysis = async () => {
  return Employee.aggregate([
    ...groupByField('$profile.contact.address.location.country', false, null)
  ]);
};

// Count employees per state (with limit)
const getStateAnalysis = async (limit = 10) => {
  return Employee.aggregate([
    ...groupByField('$profile.contact.address.location.state', false, limit)
  ]);
};

module.exports = {
  getTopSkills,
  getTopDomains,
  getTopCertifications,
  getTopProjects,
  getTopTechnologies,
  getTimezoneAnalysis,
  getLocationAnalysis,
  getExperienceAnalysis,
  getVerificationAnalysis,
  getProjectAnalysis,
  getTaskAnalysis,
  getSkillDistribution,
  getDomainDistribution,
  getCountryAnalysis,
  getStateAnalysis
};
