// ─────────────────────────────────────────────────────────────
// Auth Service — API calls for authentication & profile management
// ─────────────────────────────────────────────────────────────

import api from './api';
import {
  AUTH_REGISTER,
  AUTH_LOGIN,
  AUTH_LOGOUT,
  AUTH_PROFILE,
  AUTH_CHANGE_PASSWORD,
} from '../utils/constants';

/** Register a new user */
export const register = (data) => api.post(AUTH_REGISTER, data);

/** Log in and receive a JWT token */
export const login = (data) => api.post(AUTH_LOGIN, data);

/** Log out (server-side acknowledgment) */
export const logout = () => api.post(AUTH_LOGOUT);

/** Get the authenticated user's profile */
export const getProfile = () => api.get(AUTH_PROFILE);

/** Update the authenticated user's profile */
export const updateProfile = (data) => api.patch(AUTH_PROFILE, data);

/** Change the authenticated user's password */
export const changePassword = (data) => api.post(AUTH_CHANGE_PASSWORD, data);
