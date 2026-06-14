// ─────────────────────────────────────────────────────────────
// Centralized Axios Instance
//
// All API calls go through this single instance, which provides:
// 1. Base URL from environment variable
// 2. Request interceptor — attaches JWT token to every request
// 3. Response interceptor — normalizes success and error responses
// ─────────────────────────────────────────────────────────────

import axios from 'axios';
import { TOKEN_KEY } from '../utils/constants';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor ─────────────────────────────────────
// Runs before every request is sent to the server.
// If a JWT token exists in localStorage, attach it as a Bearer token.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ─── Response Interceptor ────────────────────────────────────
// Runs after every response is received.
// On success: unwrap and return response.data directly.
// On error: normalize the error into { message, statusCode }.
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const statusCode = error.response?.status || 500;
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';

    return Promise.reject({ message, statusCode });
  }
);

export default api;
