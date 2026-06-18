// ─────────────────────────────────────────────────────────────
// Database Seed Script — Populates MongoDB with initial data
//
// WHAT IS SEEDING?
// Seeding fills your database with initial/test data from a JSON file.
// This is a one-time script you run manually to set up the database.
//
// HOW TO RUN:
//   node scripts/seed.js
//
// WHAT IT DOES:
// 1. Connects to MongoDB (using the same URI from .env)
// 2. Reads the Employees_Dataset.json file
// 3. Clears ALL existing employees (deleteMany)
// 4. Inserts all employees from the JSON file (insertMany)
// 5. Disconnects and exits
//
// WARNING: This DELETES all existing employee data before inserting!
// ─────────────────────────────────────────────────────────────

const mongoose = require('mongoose');
const fs = require('fs');     // Node.js built-in module for reading files
const path = require('path'); // Node.js built-in module for constructing file paths
require('dotenv').config();   // Load environment variables from .env

const Employee = require('../models/Employee');

const seedDatabase = async () => {
  try {
    // Step 1: Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    // Step 2: Read the JSON dataset file
    // path.join(__dirname, '..', 'Employees_Dataset.json') constructs an absolute path
    // __dirname = the directory where THIS script lives (scripts/)
    // '..' goes up one level to backend/
    const dataPath = path.join(__dirname, '..', 'Employees_Dataset.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8'); // Read file as a string
    const parsed = JSON.parse(rawData); // Parse JSON string into a JavaScript object

    // Handle both formats: { employees: [...] } or just [...]
    const employees = Array.isArray(parsed) ? parsed : parsed.employees;

    // Step 3: Clear ALL existing employee documents
    // deleteMany({}) with empty filter = delete everything
    await Employee.deleteMany({});
    console.log('Cleared existing employees collection.');

    // Step 4: Insert all records at once
    // insertMany() is much faster than inserting one at a time
    const result = await Employee.insertMany(employees);
    console.log(`Successfully seeded ${result.length} employee records.`);

    // Step 5: Clean up — close the database connection
    await mongoose.disconnect();
    console.log('MongoDB disconnected. Seeding complete!');
    process.exit(0); // Exit with success code (0 = success)
  } catch (error) {
    console.error(`Seeding Error: ${error.message}`);
    await mongoose.disconnect();
    process.exit(1); // Exit with error code (1 = failure)
  }
};

// Call the seeding function immediately when this script runs
seedDatabase();
