// ─────────────────────────────────────────────────────────────
// Auth Service — Business logic for authentication
//
// WHAT IS A SERVICE?
// The service layer contains the core business logic, separated
// from the HTTP layer (controllers/routes). This separation means:
//   - Controllers handle HTTP req/res (what to send back)
//   - Services handle the actual logic (how to do it)
//   - This makes the code easier to test and reuse
//
// This service handles: registration, login, password management,
// JWT token creation/verification, and dashboard data aggregation.
// ─────────────────────────────────────────────────────────────

const jwt = require('jsonwebtoken'); // Library to create & verify JSON Web Tokens
const User = require('../models/User');
const Employee = require('../models/Employee');
const AppError = require('../middlewares/AppError');

/**
 * generateToken — Creates a signed JWT containing the user's ID and role
 *
 * jwt.sign(payload, secret, options):
 *   - payload: the data embedded in the token (id + role)
 *   - secret: the private key used to sign (from .env — NEVER expose this)
 *   - expiresIn: how long the token is valid (e.g., '7d' = 7 days)
 *
 * The resulting token is a long string like: eyJhbGciOi...
 * It contains 3 parts separated by dots: header.payload.signature
 */
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },         // Payload — data stored inside the token
    process.env.JWT_SECRET,       // Secret key — used to sign and later verify
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } // Token expiration time
  );
};

/**
 * getUserFromToken — Decodes and verifies a JWT
 *
 * jwt.verify() does TWO things:
 *   1. Checks the signature (was it created with our secret?)
 *   2. Checks expiration (has it expired?)
 * If either check fails, it throws an error.
 * If valid, it returns the decoded payload: { id, role, iat, exp }
 */
const getUserFromToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * register — Creates a new user account
 *
 * Flow:
 * 1. Check if email already exists (prevent duplicates)
 * 2. Create the user document (password auto-hashed by pre-save hook in User model)
 * 3. Generate a JWT so the user is immediately logged in after registration
 * 4. Return user info + token
 */
const register = async (name, email, password, role) => {
  // Check for duplicate email (case-insensitive because email is stored lowercase)
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new AppError('Email is already registered', 409); // 409 = Conflict
  }

  // User.create() is a Mongoose method that creates AND saves a new document
  // The pre-save hook in User.js automatically hashes the password before saving
  const user = await User.create({ name, email, password, role });

  // Generate a token for the newly registered user (auto-login)
  const token = generateToken(user._id, user.role);

  return {
    user: {
      id: user._id,     // MongoDB's auto-generated unique ID
      name: user.name,
      email: user.email,
      role: user.role
    },
    token // Client stores this and sends it in the Authorization header for future requests
  };
};

/**
 * login — Validates email + password and returns a JWT
 *
 * Flow:
 * 1. Find user by email
 * 2. Compare the plain-text password with the hashed one in the DB
 * 3. If valid, generate a new JWT
 * 4. Return user info + token
 *
 * SECURITY: We use the SAME error message for both "email not found"
 * and "wrong password" — so attackers can't tell which one was wrong.
 */
const login = async (email, password) => {
  // .select('+password') explicitly includes the password field
  // (Mongoose normally excludes it from queries for security)
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    throw new AppError('Invalid email or password', 401); // 401 = Unauthorized
  }

  // user.comparePassword() is the instance method we defined in User.js
  // It uses bcrypt.compare() under the hood
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
 * changePassword — Updates the user's password after verifying the current one
 *
 * Flow:
 * 1. Find the user and include the password field
 * 2. Verify the current password matches
 * 3. Set the new password (pre-save hook will hash it)
 * 4. Save the document (triggers the pre-save hook)
 */
const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Verify the current password before allowing a change
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new AppError('Current password is incorrect', 401);
  }

  // Assign new password — the pre-save hook in User.js will automatically hash it
  // IMPORTANT: We use user.save() instead of User.findByIdAndUpdate() because
  // findByIdAndUpdate() does NOT trigger pre-save hooks
  user.password = newPassword;
  await user.save();

  return { message: 'Password changed successfully' };
};

/**
 * forgotPassword — Accepts an email and returns a generic message
 *
 * SECURITY: We NEVER reveal whether the email exists in our system.
 * This prevents "email enumeration" attacks where attackers try
 * different emails to see which ones are registered.
 */
const forgotPassword = async (email) => {
  // We look up the user but intentionally do nothing with the result
  await User.findOne({ email: email.toLowerCase() });
  // TODO: In production, generate a reset token and send it via email
  return { message: 'If this email exists, a reset link has been sent' };
};

/**
 * refreshToken — Issues a fresh JWT for an already-authenticated user
 * Used when the current token is about to expire
 */
const refreshToken = (userId, role) => {
  return generateToken(userId, role);
};

/**
 * getDashboardSummary — Aggregates key statistics from the Employee collection
 *
 * WHAT IS AGGREGATION?
 * MongoDB's aggregation pipeline processes documents through a series
 * of stages (like an assembly line). Each stage transforms the data:
 *
 *   $unwind → Splits array fields into separate documents
 *             (1 employee with 3 projects → 3 documents)
 *   $group  → Groups documents by a field and computes values
 *             (like SQL's GROUP BY)
 *   $sort   → Sorts the results
 *   $limit  → Takes only the first N results
 *
 * This function finds:
 *   - Total number of employees
 *   - The most common primary skill (e.g., "Python")
 *   - The most common domain (e.g., "Cloud")
 */
const getDashboardSummary = async () => {
  // countDocuments({}) counts all documents in the collection
  const totalEmployees = await Employee.countDocuments();

  // Aggregation pipeline to find the most common primary skill
  const skillAgg = await Employee.aggregate([
    { $unwind: '$profile.projects' },          // Flatten the projects array
    { $unwind: '$profile.projects.tasks' },    // Flatten the tasks array within each project
    {
      $group: {
        _id: '$profile.projects.tasks.assignedTo.skills.primary', // Group by primary skill
        count: { $sum: 1 }  // Count occurrences of each skill
      }
    },
    { $sort: { count: -1 } },  // Sort by count descending (most popular first)
    { $limit: 1 }              // Take only the top result
  ]);

  // Same pattern for finding the most common domain
  const domainAgg = await Employee.aggregate([
    { $unwind: '$profile.projects' },
    { $unwind: '$profile.projects.tasks' },
    { $unwind: '$profile.projects.tasks.assignedTo.skills.experience.domains' }, // Domains is also an array
    {
      $group: {
        _id: '$profile.projects.tasks.assignedTo.skills.experience.domains',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 1 }
  ]);

  return {
    totalEmployees,
    topSkill: skillAgg[0]?._id || null,    // ?. is optional chaining — safe if array is empty
    topDomain: domainAgg[0]?._id || null
  };
};

module.exports = { register, login, generateToken, getUserFromToken, changePassword, forgotPassword, refreshToken, getDashboardSummary };
