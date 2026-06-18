// ─────────────────────────────────────────────────────────────
// Stats Service — Aggregation queries for numerical statistics
//
// Similar to analyticsService, but focused on COUNTS and
// DISTRIBUTIONS rather than ranked lists.
//
// KEY DIFFERENCES FROM ANALYTICS:
// - Analytics → "What are the top 10 skills?" (ranked lists)
// - Stats     → "How many total employees? What's the avg experience?"
//               (single numbers and distributions)
// ─────────────────────────────────────────────────────────────

const Employee = require('../models/Employee');

// Shared stages to flatten nested projects → tasks structure
const baseUnwind = [
  { $unwind: '$profile.projects' },
  { $unwind: '$profile.projects.tasks' }
];

// Helper for grouping by a field and counting
// Same pattern as analyticsService.groupByField
const groupByField = (fieldPath, isArray = false) => {
  const pipeline = [];
  if (isArray) {
    pipeline.push({ $unwind: fieldPath });
  }
  pipeline.push({ $group: { _id: fieldPath, count: { $sum: 1 } } });
  pipeline.push({ $sort: { count: -1 } });
  pipeline.push({ $project: { _id: 0, value: '$_id', count: 1 } });
  return pipeline;
};

/**
 * 1. Total employees count
 * countDocuments({}) = count all documents with no filter
 */
const getEmployeesCount = async () => {
  return Employee.countDocuments({});
};

/**
 * 2. Average years of experience across ALL tasks
 *
 * $avg is an accumulator that computes the arithmetic mean.
 * _id: null means "don't group by anything — put everything in one group"
 * Result: [{ _id: null, averageYears: 6.009 }]
 */
const getAverageExperience = async () => {
  const result = await Employee.aggregate([
    ...baseUnwind,
    {
      $group: {
        _id: null, // Single group for all documents
        averageYears: { $avg: '$profile.projects.tasks.assignedTo.skills.experience.years' }
      }
    }
  ]);
  return result.length > 0 ? result[0].averageYears : 0;
};

/**
 * 3. Top employees by experience (ranked by max years)
 *
 * $max picks the highest value when an employee has multiple tasks
 * with different experience years.
 */
const getTopExperience = async (limit = 10) => {
  return Employee.aggregate([
    ...baseUnwind,
    {
      $group: {
        _id: '$id',             // Group by employee id
        name: { $first: '$name' }, // Take the first name (they're all the same for one employee)
        maxYears: { $max: '$profile.projects.tasks.assignedTo.skills.experience.years' }
      }
    },
    { $sort: { maxYears: -1 } }, // Highest experience first
    { $limit: limit },
    {
      $project: {
        _id: 0,          // Exclude MongoDB's _id
        id: '$_id',      // Rename _id to id
        name: 1,         // Include name
        years: '$maxYears' // Rename maxYears to years
      }
    }
  ]);
};

/**
 * 4. Unique projects count
 *
 * Steps:
 * 1. $unwind projects → one doc per project
 * 2. $group by projectId → removes duplicates (like SQL DISTINCT)
 * 3. $count → counts the unique groups
 * Result: [{ count: 891 }]
 */
const getProjectCount = async () => {
  const result = await Employee.aggregate([
    { $unwind: '$profile.projects' },
    { $group: { _id: '$profile.projects.projectId' } }, // Each unique projectId becomes one doc
    { $count: 'count' } // $count stage just counts how many documents remain
  ]);
  return result.length > 0 ? result[0].count : 0;
};

/**
 * 5. Unique tasks count (same approach as project count)
 */
const getTaskCount = async () => {
  const result = await Employee.aggregate([
    ...baseUnwind,
    { $group: { _id: '$profile.projects.tasks.taskId' } },
    { $count: 'count' }
  ]);
  return result.length > 0 ? result[0].count : 0;
};

/**
 * 6. Country counts — how many employees per country
 * No baseUnwind needed because country is at the top level (not inside arrays)
 */
const getCountryCount = async () => {
  return Employee.aggregate([
    ...groupByField('$profile.contact.address.location.country', false)
  ]);
};

/**
 * 7. State counts
 */
const getStateCount = async () => {
  return Employee.aggregate([
    ...groupByField('$profile.contact.address.location.state', false)
  ]);
};

/**
 * 8. Domain counts
 * Needs baseUnwind (domains is inside projects → tasks) AND
 * isArray=true (domains itself is an array like ["Cloud", "DevOps"])
 */
const getDomainCount = async () => {
  return Employee.aggregate([
    ...baseUnwind,
    ...groupByField('$profile.projects.tasks.assignedTo.skills.experience.domains', true)
  ]);
};

/**
 * 9. Primary skill counts
 */
const getSkillCount = async () => {
  return Employee.aggregate([
    ...baseUnwind,
    ...groupByField('$profile.projects.tasks.assignedTo.skills.primary', false)
  ]);
};

/**
 * 10. Certification counts (current certs only)
 */
const getCertificationCount = async () => {
  return Employee.aggregate([
    ...baseUnwind,
    ...groupByField('$profile.projects.tasks.assignedTo.skills.experience.certifications.current', true)
  ]);
};

/**
 * 11. Timezone counts
 */
const getTimezoneCount = async () => {
  return Employee.aggregate([
    ...groupByField('$profile.contact.address.location.geo.timezone.name', false)
  ]);
};

/**
 * 12. Count of employees with verified certifications
 * Uses a simple filter query instead of aggregation
 */
const getVerifiedCount = async () => {
  return Employee.countDocuments({
    'profile.projects.tasks.assignedTo.skills.experience.certifications.meta.verified': true
  });
};

/**
 * 13. Project distribution — how many employees per project
 * Returns projectId, name, and employee count for each project
 */
const getProjectDistribution = async () => {
  return Employee.aggregate([
    { $unwind: '$profile.projects' },
    {
      $group: {
        _id: '$profile.projects.projectId',
        name: { $first: '$profile.projects.name' },
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    {
      $project: {
        _id: 0,
        projectId: '$_id',
        name: 1,
        count: 1
      }
    }
  ]);
};

/**
 * 14. Task distribution — how many employees per task
 */
const getTaskDistribution = async () => {
  return Employee.aggregate([
    ...baseUnwind,
    {
      $group: {
        _id: '$profile.projects.tasks.taskId',
        description: { $first: '$profile.projects.tasks.description' },
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    {
      $project: {
        _id: 0,
        taskId: '$_id',
        description: 1,
        count: 1
      }
    }
  ]);
};

/**
 * 15. Technology (secondary skill) counts
 */
const getTechnologyCount = async () => {
  return Employee.aggregate([
    ...baseUnwind,
    ...groupByField('$profile.projects.tasks.assignedTo.skills.secondary', true)
  ]);
};

module.exports = {
  getEmployeesCount,
  getAverageExperience,
  getTopExperience,
  getProjectCount,
  getTaskCount,
  getCountryCount,
  getStateCount,
  getDomainCount,
  getSkillCount,
  getCertificationCount,
  getTimezoneCount,
  getVerifiedCount,
  getProjectDistribution,
  getTaskDistribution,
  getTechnologyCount
};
