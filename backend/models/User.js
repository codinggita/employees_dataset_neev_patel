// ─────────────────────────────────────────────────────────────
// User Model — Defines the shape of a "user" document in MongoDB
//
// WHAT IS A MODEL?
// In Mongoose, a Model is a wrapper around a MongoDB collection.
// It defines the structure (schema) of documents in that collection
// and provides methods to create, read, update, and delete documents.
//
// This model represents users who can register, log in, and
// access protected routes. It stores their name, email, hashed
// password, and role (user or admin).
// ─────────────────────────────────────────────────────────────

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Library for hashing passwords (one-way encryption)

// Define the schema — the blueprint for what a User document looks like
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'], // [true, 'custom error message'] — validation with custom error
    trim: true // trim: true automatically removes whitespace from both ends ("  John  " → "John")
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,     // Creates a unique index — no two users can have the same email
    lowercase: true,  // Automatically converts to lowercase before saving
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'] // Built-in validation
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // enum restricts the value to ONLY these options
    default: 'user'          // If no role is provided, defaults to 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now // Automatically set to the current date/time when created
  }
});

// ─────────────────────────────────────────────────────────────
// Pre-save Hook (Mongoose Middleware)
//
// WHAT: Runs automatically BEFORE a document is saved to the database.
// WHY: We hash the password here so we NEVER store plain-text passwords.
//
// bcrypt.hash(password, 10):
//   - Takes the plain password
//   - 10 = "salt rounds" (how many times to scramble — higher = slower but safer)
//   - Returns a hashed string like "$2a$10$X7bM..."
//   - This hash is irreversible — you can't convert it back to the original
//
// this.isModified('password'):
//   - Only hash if the password field actually changed
//   - Prevents re-hashing an already hashed password on unrelated updates
// ─────────────────────────────────────────────────────────────
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return; // Skip if password wasn't changed
  this.password = await bcrypt.hash(this.password, 10); // Hash the password
});

// ─────────────────────────────────────────────────────────────
// Instance Method — comparePassword
//
// WHAT: A custom method available on every User document instance.
// WHY: During login, we need to compare the plain-text password
//      the user typed with the hashed password stored in the DB.
//
// bcrypt.compare(candidatePassword, this.password):
//   - Takes the plain password ("password123")
//   - Takes the hashed password from the DB ("$2a$10$X7bM...")
//   - Returns true if they match, false if not
//   - This works because bcrypt can verify a hash without "un-hashing"
// ─────────────────────────────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// mongoose.model('User', userSchema) creates the "users" collection in MongoDB
// (Mongoose automatically lowercases and pluralizes the name: 'User' → 'users')
const User = mongoose.model('User', userSchema);
module.exports = User;
