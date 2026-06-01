const Employee = require('../models/Employee');

/**
 * Reusable pipeline helper to group by a field path and count occurrences.
 * @param {string|object} fieldPath - The path to the field or group _id object
 * @param {boolean} isArray - Whether the field is an array that needs unwinding
 * @param {number} limit - Maximum number of documents to return
 * @returns {Array} Aggregation pipeline stages
 */
function groupByField(fieldPath, isArray = false, limit = 10) {
  const pipeline = [];
  if (isArray) pipeline.push({ $unwind: fieldPath });
  pipeline.push({ $group: { _id: fieldPath, count: { $sum: 1 } } });
  pipeline.push({ $sort: { count: -1 } });
  pipeline.push({ $project: { _id: 0, value: '$_id', count: 1 } });
  if (limit) pipeline.push({ $limit: limit });
  return pipeline;
}

const baseUnwind = [
  { $unwind: '$profile.projects' },
  { $unwind: '$profile.projects.tasks' }
];

const getTopSkills = async (limit = 10) => {
  return Employee.aggregate([
    ...baseUnwind,
    ...groupByField('$profile.projects.tasks.assignedTo.skills.primary', false, limit)
  ]);
};

const getTopDomains = async (limit = 10) => {
  return Employee.aggregate([
    ...baseUnwind,
    ...groupByField('$profile.projects.tasks.assignedTo.skills.experience.domains', true, limit)
  ]);
};

const getTopCertifications = async (limit = 10) => {
  return Employee.aggregate([
    ...baseUnwind,
    ...groupByField('$profile.projects.tasks.assignedTo.skills.experience.certifications.current', true, limit)
  ]);
};

const getTopProjects = async (limit = 10) => {
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
    },
    ...(limit ? [{ $limit: limit }] : [])
  ]);
};

const getTopTechnologies = async (limit = 10) => {
  return Employee.aggregate([
    ...baseUnwind,
    ...groupByField('$profile.projects.tasks.assignedTo.skills.secondary', true, limit)
  ]);
};

const getTimezoneAnalysis = async (limit = 10) => {
  return Employee.aggregate([
    ...groupByField('$profile.contact.address.location.geo.timezone.name', false, limit)
  ]);
};

const getLocationAnalysis = async (limit = 10) => {
  return Employee.aggregate([
    ...groupByField({
      state: '$profile.contact.address.location.state',
      country: '$profile.contact.address.location.country'
    }, false, limit)
  ]);
};

module.exports = {
  getTopSkills,
  getTopDomains,
  getTopCertifications,
  getTopProjects,
  getTopTechnologies,
  getTimezoneAnalysis,
  getLocationAnalysis
};
