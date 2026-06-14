// ─────────────────────────────────────────────────────────────
// Employee Service — API calls for employee CRUD operations
// ─────────────────────────────────────────────────────────────

import api from './api';
import { EMPLOYEES, EMPLOYEE_BY_ID } from '../utils/constants';

/** Get all employees (supports query params: page, limit, sort, etc.) */
export const getAllEmployees = (params) => api.get(EMPLOYEES, { params });

/** Get a single employee by ID */
export const getEmployeeById = (id) => api.get(EMPLOYEE_BY_ID(id));

/** Create a new employee */
export const createEmployee = (data) => api.post(EMPLOYEES, data);

/** Partially update an employee by ID */
export const updateEmployee = (id, data) => api.patch(EMPLOYEE_BY_ID(id), data);

/** Delete an employee by ID */
export const deleteEmployee = (id) => api.delete(EMPLOYEE_BY_ID(id));
