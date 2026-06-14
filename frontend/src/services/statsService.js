// ─────────────────────────────────────────────────────────────
// Stats Service — API calls for counts, averages, and distributions
// ─────────────────────────────────────────────────────────────

import api from './api';
import {
  STATS_COUNT,
  STATS_EXPERIENCE_AVG,
  STATS_TOP_EXPERIENCE,
  STATS_PROJECT_COUNT,
  STATS_TASK_COUNT,
  STATS_COUNTRY_COUNT,
  STATS_STATE_COUNT,
  STATS_DOMAIN_COUNT,
  STATS_SKILL_COUNT,
  STATS_CERTIFICATION_COUNT,
  STATS_TIMEZONE_COUNT,
  STATS_VERIFIED_COUNT,
  STATS_PROJECT_DISTRIBUTION,
  STATS_TASK_DISTRIBUTION,
  STATS_TECHNOLOGY_COUNT,
} from '../utils/constants';

/** Get total employee count */
export const getCount = () => api.get(STATS_COUNT);

/** Get average years of experience */
export const getExperienceAverage = () => api.get(STATS_EXPERIENCE_AVG);

/** Get top N employees by experience */
export const getTopExperience = (params) => api.get(STATS_TOP_EXPERIENCE, { params });

/** Get unique project count */
export const getProjectCount = () => api.get(STATS_PROJECT_COUNT);

/** Get unique task count */
export const getTaskCount = () => api.get(STATS_TASK_COUNT);

/** Get employees per country */
export const getCountryCount = () => api.get(STATS_COUNTRY_COUNT);

/** Get employees per state */
export const getStateCount = () => api.get(STATS_STATE_COUNT);

/** Get employees per domain */
export const getDomainCount = () => api.get(STATS_DOMAIN_COUNT);

/** Get employees per skill */
export const getSkillCount = () => api.get(STATS_SKILL_COUNT);

/** Get employees per certification */
export const getCertificationCount = () => api.get(STATS_CERTIFICATION_COUNT);

/** Get employees per timezone */
export const getTimezoneCount = () => api.get(STATS_TIMEZONE_COUNT);

/** Get verified vs unverified count */
export const getVerifiedCount = () => api.get(STATS_VERIFIED_COUNT);

/** Get project size distribution */
export const getProjectDistribution = () => api.get(STATS_PROJECT_DISTRIBUTION);

/** Get task size distribution */
export const getTaskDistribution = () => api.get(STATS_TASK_DISTRIBUTION);

/** Get technology usage count */
export const getTechnologyCount = () => api.get(STATS_TECHNOLOGY_COUNT);
