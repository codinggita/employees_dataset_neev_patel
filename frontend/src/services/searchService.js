// ─────────────────────────────────────────────────────────────
// Search Service — API calls for full-text employee search
// ─────────────────────────────────────────────────────────────

import api from './api';
import { SEARCH_EMPLOYEES } from '../utils/constants';

/** Search employees by query string (supports pagination params) */
export const searchEmployees = (q, params = {}) =>
  api.get(SEARCH_EMPLOYEES, { params: { q, ...params } });
