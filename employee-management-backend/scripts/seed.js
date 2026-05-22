const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Employee = require('../models/Employee');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    // Read the dataset
    const dataPath = path.join(__dirname, '..', 'Employees_Dataset.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const parsed = JSON.parse(rawData);
    const employees = Array.isArray(parsed) ? parsed : parsed.employees;

    // Clear existing data
    await Employee.deleteMany({});
    console.log('Cleared existing employees collection.');

    // Insert all records
    const result = await Employee.insertMany(employees);
    console.log(`Successfully seeded ${result.length} employee records.`);

    // Disconnect
    await mongoose.disconnect();
    console.log('MongoDB disconnected. Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding Error: ${error.message}`);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedDatabase();
