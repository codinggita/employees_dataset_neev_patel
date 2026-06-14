// ─────────────────────────────────────────────────────────────
// Analytics Service — API calls for aggregation & analysis endpoints
// ─────────────────────────────────────────────────────────────

import api from './api';
import {
  ANALYTICS_TOP_SKILLS,
  ANALYTICS_TOP_DOMAINS,
  ANALYTICS_EXPERIENCE,
  ANALYTICS_COUNTRY,
  ANALYTICS_TOP_CERTIFICATIONS,
  ANALYTICS_TOP_PROJECTS,
  ANALYTICS_TOP_TECHNOLOGIES,
  ANALYTICS_STATE,
  ANALYTICS_TIMEZONE,
  ANALYTICS_LOCATION,
  ANALYTICS_VERIFICATION,
  ANALYTICS_PROJECT,
  ANALYTICS_TASK,
  ANALYTICS_SKILL_DISTRIBUTION,
  ANALYTICS_DOMAIN_DISTRIBUTION,
} from '../utils/constants';

/** Get top skills ranked by frequency */
export const getTopSkills = (params) => api.get(ANALYTICS_TOP_SKILLS, { params });

/** Get top domains ranked by frequency */
export const getTopDomains = (params) => api.get(ANALYTICS_TOP_DOMAINS, { params });

/** Get top certifications ranked by frequency */
export const getTopCertifications = (params) => api.get(ANALYTICS_TOP_CERTIFICATIONS, { params });

/** Get top projects ranked by frequency */
export const getTopProjects = (params) => api.get(ANALYTICS_TOP_PROJECTS, { params });

/** Get top technologies ranked by frequency */
export const getTopTechnologies = (params) => api.get(ANALYTICS_TOP_TECHNOLOGIES, { params });

/** Get experience distribution analysis */
export const getExperienceAnalysis = () => api.get(ANALYTICS_EXPERIENCE);

/** Get country-wise employee distribution */
export const getCountryAnalysis = () => api.get(ANALYTICS_COUNTRY);

/** Get state-wise employee distribution */
export const getStateAnalysis = () => api.get(ANALYTICS_STATE);

/** Get timezone distribution analysis */
export const getTimezoneAnalysis = () => api.get(ANALYTICS_TIMEZONE);

/** Get location-based analysis */
export const getLocationAnalysis = () => api.get(ANALYTICS_LOCATION);

/** Get verification status analysis */
export const getVerificationAnalysis = () => api.get(ANALYTICS_VERIFICATION);

/** Get project-based analysis */
export const getProjectAnalysis = () => api.get(ANALYTICS_PROJECT);

/** Get task-based analysis */
export const getTaskAnalysis = () => api.get(ANALYTICS_TASK);

/** Get full skill distribution (no limit) */
export const getSkillDistribution = () => api.get(ANALYTICS_SKILL_DISTRIBUTION);

/** Get full domain distribution (no limit) */
export const getDomainDistribution = () => api.get(ANALYTICS_DOMAIN_DISTRIBUTION);
