// ─────────────────────────────────────────────────────────────
// Database Connection Module
// Uses Mongoose (an ODM = Object Data Modeling library) to
// connect Node.js to MongoDB. Think of Mongoose as a translator
// between your JavaScript code and the MongoDB database.
// ─────────────────────────────────────────────────────────────

const mongoose = require('mongoose'); // Mongoose gives us schemas, models, and query helpers for MongoDB

/**
 * connectDB — Establishes a connection to MongoDB using the URI from .env
 *
 * How it works:
 * 1. mongoose.connect() opens a persistent connection to the database
 * 2. The connection string (MONGO_URI) comes from the .env file
 *    Example: MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/mydb
 * 3. If connection succeeds, we log the host name
 * 4. If it fails (wrong URI, network error, etc.), we log the error
 *    and kill the server with process.exit(1) — because the app can't
 *    work without a database
 */
const connectDB = async () => {
  try {
    // mongoose.connect() returns a connection object; we destructure .connection.host from it
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // process.exit(1) = exit with failure code. 0 = success, 1 = failure
    process.exit(1);
  }
};

module.exports = connectDB;
