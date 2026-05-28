const express = require('express');
const router = express.Router();

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

const protect = require('../middlewares/authMiddleware');

// ─── Public routes ────────────────────────────
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// ─── Password management (public) ────────────
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// ─── Email / OTP verification (public stubs) ─
router.post('/verify-email', verifyEmail);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/resend-verification', resendVerification);

// ─── Protected routes (require valid JWT) ─────
router.get('/profile', protect, getProfile);
router.patch('/profile', protect, updateProfile);
router.delete('/profile', protect, deleteProfile);
router.post('/change-password', protect, changePassword);

module.exports = router;
