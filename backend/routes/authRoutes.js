// ─────────────────────────────────────────────────────────────
// Auth Routes — Maps authentication URLs to controller functions
//
// ROUTE PROTECTION PATTERNS:
//
// 1. PUBLIC routes (no middleware):
//    router.post('/register', register);
//    → Anyone can access, no token needed
//
// 2. PROTECTED routes (with 'protect' middleware):
//    router.get('/profile', protect, getProfile);
//    → Request flows through: protect → getProfile
//    → If protect fails (no/bad token), getProfile never runs
//
// You can chain multiple middleware:
//    router.get('/admin', protect, restrictTo('admin'), handler);
//    → protect runs first → then restrictTo → then handler
// ─────────────────────────────────────────────────────────────

const express = require('express');
const router = express.Router();

// Import controller functions (each handles one endpoint)
const {
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
} = require('../controllers/authController');

// Import the auth middleware that checks for valid JWT tokens
const protect = require('../middlewares/authMiddleware');

// ─── Public routes (no authentication required) ──────────────
router.post('/register', register);     // Create a new account
router.post('/login', login);           // Log in and get a JWT token
router.post('/logout', logout);         // Log out (client-side token deletion)

// ─── Password management (public) ───────────────────────────
router.post('/forgot-password', forgotPassword);  // Request password reset email
router.post('/reset-password', resetPassword);    // Reset password (placeholder)

// ─── Email / OTP verification (public stubs) ─────────────────
router.post('/verify-email', verifyEmail);             // Placeholder
router.post('/send-otp', sendOtp);                     // Placeholder
router.post('/verify-otp', verifyOtp);                 // Placeholder
router.post('/resend-verification', resendVerification); // Placeholder

// ─── Protected routes (require valid JWT in Authorization header) ─
// The 'protect' middleware runs BEFORE the controller function
router.get('/profile', protect, getProfile);          // Get my profile
router.patch('/profile', protect, updateProfile);     // Update my profile
router.delete('/profile', protect, deleteProfile);    // Delete my account
router.post('/change-password', protect, changePassword); // Change my password

module.exports = router;
