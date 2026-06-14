// ─────────────────────────────────────────────────────────────
// API Route Constants
//
// Centralized path constants to avoid hardcoding URL strings
// across service files. Grouped by feature area.
// ─────────────────────────────────────────────────────────────

// ─── Employee CRUD ───────────────────────────────────────────
export const EMPLOYEES = '/employees';
export const EMPLOYEE_BY_ID = (id) => `/employees/${id}`;

// ─── Employee Bulk Operations ────────────────────────────────
export const EMPLOYEES_BULK_CREATE = '/employees/bulk-create';
export const EMPLOYEES_BULK_UPDATE = '/employees/bulk-update';
export const EMPLOYEES_BULK_DELETE = '/employees/bulk-delete';

// ─── Employee Lookup by Field ────────────────────────────────
export const EMPLOYEES_BY_NAME = (name) => `/employees/name/${name}`;
export const EMPLOYEES_BY_STATE = (state) => `/employees/state/${state}`;
export const EMPLOYEES_BY_COUNTRY = (country) => `/employees/country/${country}`;
export const EMPLOYEES_BY_CITY = (city) => `/employees/city/${city}`;
export const EMPLOYEES_BY_DOMAIN = (domain) => `/employees/domain/${domain}`;
export const EMPLOYEES_BY_PRIMARY_SKILL = (skill) => `/employees/primary-skill/${skill}`;
export const EMPLOYEES_BY_SECONDARY_SKILL = (skill) => `/employees/secondary-skill/${skill}`;
export const EMPLOYEES_BY_EXPERIENCE = (years) => `/employees/experience/${years}`;

// ─── Search ──────────────────────────────────────────────────
export const SEARCH_EMPLOYEES = '/search/employees';

// ─── Auth ────────────────────────────────────────────────────
export const AUTH_REGISTER = '/auth/register';
export const AUTH_LOGIN = '/auth/login';
export const AUTH_LOGOUT = '/auth/logout';
export const AUTH_PROFILE = '/auth/profile';
export const AUTH_CHANGE_PASSWORD = '/auth/change-password';
export const AUTH_FORGOT_PASSWORD = '/auth/forgot-password';
export const AUTH_RESET_PASSWORD = '/auth/reset-password';

// ─── Analytics ───────────────────────────────────────────────
export const ANALYTICS_TOP_SKILLS = '/analytics/employees/top-skills';
export const ANALYTICS_TOP_DOMAINS = '/analytics/employees/top-domains';
export const ANALYTICS_TOP_CERTIFICATIONS = '/analytics/employees/top-certifications';
export const ANALYTICS_TOP_PROJECTS = '/analytics/employees/top-projects';
export const ANALYTICS_TOP_TECHNOLOGIES = '/analytics/employees/top-technologies';
export const ANALYTICS_EXPERIENCE = '/analytics/employees/experience-analysis';
export const ANALYTICS_COUNTRY = '/analytics/employees/country-analysis';
export const ANALYTICS_STATE = '/analytics/employees/state-analysis';
export const ANALYTICS_TIMEZONE = '/analytics/employees/timezone-analysis';
export const ANALYTICS_LOCATION = '/analytics/employees/location-analysis';
export const ANALYTICS_VERIFICATION = '/analytics/employees/verification-analysis';
export const ANALYTICS_PROJECT = '/analytics/employees/project-analysis';
export const ANALYTICS_TASK = '/analytics/employees/task-analysis';
export const ANALYTICS_SKILL_DISTRIBUTION = '/analytics/employees/skill-distribution';
export const ANALYTICS_DOMAIN_DISTRIBUTION = '/analytics/employees/domain-distribution';

// ─── Stats ───────────────────────────────────────────────────
export const STATS_COUNT = '/stats/employees/count';
export const STATS_EXPERIENCE_AVG = '/stats/employees/experience-average';
export const STATS_TOP_EXPERIENCE = '/stats/employees/top-experience';
export const STATS_PROJECT_COUNT = '/stats/employees/project-count';
export const STATS_TASK_COUNT = '/stats/employees/task-count';
export const STATS_COUNTRY_COUNT = '/stats/employees/country-count';
export const STATS_STATE_COUNT = '/stats/employees/state-count';
export const STATS_DOMAIN_COUNT = '/stats/employees/domain-count';
export const STATS_SKILL_COUNT = '/stats/employees/skill-count';
export const STATS_CERTIFICATION_COUNT = '/stats/employees/certification-count';
export const STATS_TIMEZONE_COUNT = '/stats/employees/timezone-count';
export const STATS_VERIFIED_COUNT = '/stats/employees/verified-count';
export const STATS_PROJECT_DISTRIBUTION = '/stats/employees/project-distribution';
export const STATS_TASK_DISTRIBUTION = '/stats/employees/task-distribution';
export const STATS_TECHNOLOGY_COUNT = '/stats/employees/technology-count';

// ─── Local Storage Keys ──────────────────────────────────────
export const TOKEN_KEY = 'token';
