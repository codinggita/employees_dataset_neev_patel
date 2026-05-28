// Auth Service — Authentication business logic
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../middlewares/AppError');

/**
 * generateToken — Signs a JWT with userId and role
 */
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * getUserFromToken — Verifies and decodes a JWT
 */
const getUserFromToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * register — Creates a new user account
 * Throws 409 if email already exists
 */
const register = async (name, email, password) => {
  // Check for duplicate email
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new AppError('Email is already registered', 409);
  }

  // Create user (password hashed by pre-save hook)
  const user = await User.create({ name, email, password });

  const token = generateToken(user._id, user.role);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token
  };
};

/**
 * login — Validates credentials and returns a token
 * Throws 401 if email not found or password does not match
 */
const login = async (email, password) => {
  // Find user (include password field which is normally excluded)
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = generateToken(user._id, user.role);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token
  };
};

/**
 * changePassword — Verifies current password then hashes and saves new password
 * Throws 401 if current password does not match
 */
const changePassword = async (userId, currentPassword, newPassword) => {
  // Fetch user with password field (normally excluded)
  const user = await User.findById(userId).select('+password');
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Verify current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new AppError('Current password is incorrect', 401);
  }

  // Assign new password (pre-save hook will hash it)
  user.password = newPassword;
  await user.save();

  return { message: 'Password changed successfully' };
};

/**
 * forgotPassword — Accepts an email and returns a generic message
 * Never reveals whether the email exists in the system (security)
 */
const forgotPassword = async (email) => {
  // Intentionally do NOT throw if user is not found
  await User.findOne({ email: email.toLowerCase() });
  // Future: generate reset token, send email here
  return { message: 'If this email exists, a reset link has been sent' };
};

module.exports = { register, login, generateToken, getUserFromToken, changePassword, forgotPassword };
