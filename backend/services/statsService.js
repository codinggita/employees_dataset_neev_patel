const Employee = require('../models/Employee');

const baseUnwind = [
  { $unwind: '$profile.projects' },
  { $unwind: '$profile.projects.tasks' }
];

// Helper for simple grouping by field path
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
 */
const getEmployeesCount = async () => {
  return Employee.countDocuments({});
};

/**
 * 2. Average years of experience across tasks
 */
const getAverageExperience = async () => {
  const result = await Employee.aggregate([
    ...baseUnwind,
    {
      $group: {
        _id: null,
        averageYears: { $avg: '$profile.projects.tasks.assignedTo.skills.experience.years' }
      }
    }
  ]);
  return result.length > 0 ? result[0].averageYears : 0;
};

/**
 * 3. Top employees by experience
 */
const getTopExperience = async (limit = 10) => {
  return Employee.aggregate([
    ...baseUnwind,
    {
      $group: {
        _id: '$id',
        name: { $first: '$name' },
        maxYears: { $max: '$profile.projects.tasks.assignedTo.skills.experience.years' }
      }
    },
    { $sort: { maxYears: -1 } },
    { $limit: limit },
    {
      $project: {
        _id: 0,
        id: '$_id',
        name: 1,
        years: '$maxYears'
      }
    }
  ]);
};

/**
 * 4. Unique projects count
 */
const getProjectCount = async () => {
  const result = await Employee.aggregate([
    { $unwind: '$profile.projects' },
    { $group: { _id: '$profile.projects.projectId' } },
    { $count: 'count' }
  ]);
  return result.length > 0 ? result[0].count : 0;
};

/**
 * 5. Unique tasks count
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
 * 6. Country counts
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
 */
const getDomainCount = async () => {
  return Employee.aggregate([
    ...baseUnwind,
    ...groupByField('$profile.projects.tasks.assignedTo.skills.experience.domains', true)
  ]);
};

/**
 * 9. Skill counts
 */
const getSkillCount = async () => {
  return Employee.aggregate([
    ...baseUnwind,
    ...groupByField('$profile.projects.tasks.assignedTo.skills.primary', false)
  ]);
};

/**
 * 10. Certification counts
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
 */
const getVerifiedCount = async () => {
  return Employee.countDocuments({
    'profile.projects.tasks.assignedTo.skills.experience.certifications.meta.verified': true
  });
};

/**
 * 13. Project distribution (employees per project)
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
 * 14. Task distribution (employees per task)
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
