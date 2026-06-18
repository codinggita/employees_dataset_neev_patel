// ─────────────────────────────────────────────────────────────
// Auth Controller — Handles HTTP requests for authentication routes
//
// This controller manages user registration, login, logout,
// profile CRUD, password management, and placeholder stubs
// for email/OTP verification.
//
// IMPORTANT SECURITY PATTERNS USED:
// 1. Never reveal if an email exists (forgotPassword)
// 2. Validate email format before saving
// 3. Require current password before allowing changes
// 4. Hash passwords (handled by User model's pre-save hook)
// ─────────────────────────────────────────────────────────────

const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../middlewares/AppError');
const authService = require('../services/authService');
const User = require('../models/User');

// Regular expression to validate email format (basic check)
// Tests for: something@something.something
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ─────────────────────────────────────────────
// POST /auth/register — Create a new user account
// Public route — no authentication required
// ─────────────────────────────────────────────
const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Validate all required fields are present
  if (!name || !email || !password) {
    return next(new AppError('Name, email, and password are required', 400));
    // next(error) passes the error to the error handler middleware
    // "return" is needed to stop execution after sending the error
  }

  // Validate email format using regex
  if (!EMAIL_REGEX.test(email)) {
    return next(new AppError('Please provide a valid email address', 400));
  }

  // authService.register() creates the user and returns user + JWT token
  const result = await authService.register(name, email, password, role);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: result // Contains { user: {...}, token: "..." }
  });
});

// ─────────────────────────────────────────────
// POST /auth/login — Authenticate and get a JWT token
// Public route
// ─────────────────────────────────────────────
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Email and password are required', 400));
  }

  // authService.login() verifies credentials and returns user + token
  const result = await authService.login(email, password);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: result // Client should store the token for future authenticated requests
  });
});

// ─────────────────────────────────────────────
// POST /auth/logout — Log out the user
// NOTE: With JWT, logout is handled client-side by deleting the token.
// The server can't truly "invalidate" a JWT without a blacklist.
// ─────────────────────────────────────────────
const logout = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

// ─────────────────────────────────────────────
// GET /auth/profile — Get the logged-in user's profile
// Protected route — requires valid JWT (authMiddleware runs first)
//
// req.user is set by authMiddleware after decoding the JWT
// It contains: { id: "...", role: "user/admin", iat: ..., exp: ... }
// ─────────────────────────────────────────────
const getProfile = asyncHandler(async (req, res, next) => {
  // Find the user by ID from the JWT payload, exclude the password field
  // .select('-password') removes the password from the returned document
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
// PATCH /auth/profile — Update the logged-in user's profile
// Protected route — only updates name and email (not password or role)
// ─────────────────────────────────────────────
const updateProfile = asyncHandler(async (req, res, next) => {
  const { name, email } = req.body;

  // Build an update object with only the fields that were provided
  // This prevents accidentally setting fields to undefined
  const updates = {};
  if (name) updates.name = name;
  if (email) {
    if (!EMAIL_REGEX.test(email)) {
      return next(new AppError('Please provide a valid email address', 400));
    }
    updates.email = email.toLowerCase();
  }

  // findByIdAndUpdate options:
  // { new: true } → return the updated document (not the old one)
  // { runValidators: true } → re-run schema validations on the new data
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
// DELETE /auth/profile — Delete the logged-in user's account
// Protected route — permanently deletes the account
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
// POST /auth/forgot-password — Request a password reset
// Public route — always returns the same message (security)
// ─────────────────────────────────────────────
const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError('Email is required', 400));
  }

  await authService.forgotPassword(email);

  // SECURITY: Always return the same message regardless of whether
  // the email exists. This prevents attackers from discovering valid emails.
  res.status(200).json({
    success: true,
    message: 'If this email exists, a reset link has been sent'
  });
});

// ─────────────────────────────────────────────
// POST /auth/reset-password — Reset password (placeholder)
// Public route — TODO: implement with email token service
// ─────────────────────────────────────────────
const resetPassword = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Password reset — implement with email service'
  });
});

// ─────────────────────────────────────────────
// POST /auth/change-password — Change password while logged in
// Protected route — requires current password for security
// ─────────────────────────────────────────────
const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new AppError('Current password and new password are required', 400));
  }

  if (newPassword.length < 6) {
    return next(new AppError('New password must be at least 6 characters', 400));
  }

  // req.user.id comes from the decoded JWT (set by authMiddleware)
  const result = await authService.changePassword(req.user.id, currentPassword, newPassword);

  res.status(200).json({
    success: true,
    message: result.message
  });
});

// ─────────────────────────────────────────────
// PLACEHOLDER STUBS — Future features
// These return success responses but don't actually do anything yet.
// They exist so the API endpoints are registered and can be tested.
// ─────────────────────────────────────────────

const verifyEmail = asyncHandler(async (req, res) => {
  // TODO: implement with email verification token
  res.status(200).json({
    success: true,
    message: 'Email verification — implement with email service'
  });
});

const sendOtp = asyncHandler(async (req, res) => {
  // TODO: implement OTP generation and delivery
  res.status(200).json({
    success: true,
    message: 'OTP sent successfully'
  });
});

const verifyOtp = asyncHandler(async (req, res) => {
  // TODO: implement OTP verification logic
  res.status(200).json({
    success: true,
    message: 'OTP verified successfully'
  });
});

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
