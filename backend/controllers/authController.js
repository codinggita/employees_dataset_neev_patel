// Auth Controller — Handles authentication request/response
const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../middlewares/AppError');
const authService = require('../services/authService');
const User = require('../models/User');

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ─────────────────────────────────────────────
// POST /auth/register
// ─────────────────────────────────────────────
const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return next(new AppError('Name, email, and password are required', 400));
  }

  // Validate email format
  if (!EMAIL_REGEX.test(email)) {
    return next(new AppError('Please provide a valid email address', 400));
  }

  const result = await authService.register(name, email, password);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: result
  });
});

// ─────────────────────────────────────────────
// POST /auth/login
// ─────────────────────────────────────────────
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return next(new AppError('Email and password are required', 400));
  }

  const result = await authService.login(email, password);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: result
  });
});

// ─────────────────────────────────────────────
// POST /auth/logout
// ─────────────────────────────────────────────
const logout = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

// ─────────────────────────────────────────────
// GET /auth/profile   (protected)
// ─────────────────────────────────────────────
const getProfile = asyncHandler(async (req, res, next) => {
  // req.user is set by the protect middleware
  const user = await User.findById(req.user.id).select('-password');
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    success: true,
    data: { user }
  });
});

// ─────────────────────────────────────────────
// PATCH /auth/profile  (protected)
// ─────────────────────────────────────────────
const updateProfile = asyncHandler(async (req, res, next) => {
  const { name, email } = req.body;

  // Build update object (only allowed fields)
  const updates = {};
  if (name) updates.name = name;
  if (email) {
    if (!EMAIL_REGEX.test(email)) {
      return next(new AppError('Please provide a valid email address', 400));
    }
    updates.email = email.toLowerCase();
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    updates,
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: { user }
  });
});

// ─────────────────────────────────────────────
// DELETE /auth/profile  (protected)
// ─────────────────────────────────────────────
const deleteProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.user.id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Account deleted successfully'
  });
});

// ─────────────────────────────────────────────
// POST /auth/forgot-password   (public)
// ─────────────────────────────────────────────
const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError('Email is required', 400));
  }

  await authService.forgotPassword(email);

  // Always return the same generic message — never reveal if email exists
  res.status(200).json({
    success: true,
    message: 'If this email exists, a reset link has been sent'
  });
});

// ─────────────────────────────────────────────
// POST /auth/reset-password   (public — placeholder)
// ─────────────────────────────────────────────
const resetPassword = asyncHandler(async (req, res) => {
  // TODO: implement with email/token service
  res.status(200).json({
    success: true,
    message: 'Password reset — implement with email service'
  });
});

// ─────────────────────────────────────────────
// POST /auth/change-password   (protected)
// ─────────────────────────────────────────────
const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new AppError('Current password and new password are required', 400));
  }

  if (newPassword.length < 6) {
    return next(new AppError('New password must be at least 6 characters', 400));
  }

  // req.user.id is set by protect (authMiddleware)
  const result = await authService.changePassword(req.user.id, currentPassword, newPassword);

  res.status(200).json({
    success: true,
    message: result.message
  });
});

// ─────────────────────────────────────────────
// POST /auth/verify-email   (placeholder)
// ─────────────────────────────────────────────
const verifyEmail = asyncHandler(async (req, res) => {
  // TODO: implement with email verification token
  res.status(200).json({
    success: true,
    message: 'Email verification — implement with email service'
  });
});

// ─────────────────────────────────────────────
// POST /auth/send-otp   (placeholder)
// ─────────────────────────────────────────────
const sendOtp = asyncHandler(async (req, res) => {
  // TODO: implement OTP generation and delivery
  res.status(200).json({
    success: true,
    message: 'OTP sent successfully'
  });
});

// ─────────────────────────────────────────────
// POST /auth/verify-otp   (placeholder)
// ─────────────────────────────────────────────
const verifyOtp = asyncHandler(async (req, res) => {
  // TODO: implement OTP verification logic
  res.status(200).json({
    success: true,
    message: 'OTP verified successfully'
  });
});

// ─────────────────────────────────────────────
// POST /auth/resend-verification   (placeholder)
// ─────────────────────────────────────────────
const resendVerification = asyncHandler(async (req, res) => {
  // TODO: implement resend verification email
  res.status(200).json({
    success: true,
    message: 'Verification email resent'
  });
});

module.exports = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  deleteProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyEmail,
  sendOtp,
  verifyOtp,
  resendVerification
};
