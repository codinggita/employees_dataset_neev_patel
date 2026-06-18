// ─────────────────────────────────────────────────────────────
// Employee Model — Defines the structure for employee documents
//
// This is a deeply nested schema that mirrors the JSON structure
// in Employees_Dataset.json. MongoDB allows nested objects and
// arrays, which is why this schema has objects inside objects.
//
// DOCUMENT STRUCTURE (simplified):
// {
//   id: "E00001",
//   name: "Geoffrey Zimmerman",
//   profile: {
//     contact: { email, phone, address: { street, city, location: { state, country, geo } } },
//     projects: [
//       { projectId, name, tasks: [
//         { taskId, description, assignedTo: { id, name, skills: { primary, secondary, experience } } }
//       ]}
//     ]
//   }
// }
// ─────────────────────────────────────────────────────────────

const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  // Custom string ID (e.g., "E00001") instead of MongoDB's default _id
  // unique: true — no two employees can have the same id
  // index: true — creates a database index for fast lookups by id
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },

  // Nested "profile" object containing contact info and projects
  profile: {
    contact: {
      email: { type: String, required: true },
      phone: String, // Optional field — no "required" means it can be omitted
      address: {
        street: String,
        city: String,
        location: {
          // index: true on nested fields allows fast queries like:
          // Employee.find({ 'profile.contact.address.location.state': 'TX' })
          state: { type: String, index: true },
          country: { type: String, index: true },
          geo: {
            lat: String,
            long: String,
            timezone: {
              name: { type: String, index: true },
              utc_offset: String
            }
          }
        }
      }
    },

    // projects is an ARRAY of project objects (notice the [ ] brackets)
    // Each employee can have multiple projects
    projects: [{
      projectId: { type: String, index: true },
      name: String,

      // Each project has an array of tasks
      tasks: [{
        taskId: { type: String, index: true },
        description: String,

        // assignedTo contains the employee's skills and experience data
        assignedTo: {
          id: String,
          name: String,
          skills: {
            primary: { type: String, index: true }, // Main skill (e.g., "Python")
            secondary: [String], // Array of strings (e.g., ["React", "Node.js"])
            experience: {
              years: { type: Number, index: true }, // Years of experience
              domains: [String], // Array of domains (e.g., ["Cloud", "DevOps"])
              certifications: {
                current: [String],  // Active certifications
                expired: [String],  // Expired certifications
                meta: {
                  verified: Boolean,   // Whether certifications are verified
                  lastUpdated: String  // Date string of last update
                }
              }
            }
          }
        }
      }]
    }]
  }
}, { timestamps: true }); // timestamps: true auto-adds createdAt and updatedAt fields

// ─────────────────────────────────────────────────────────────
// Compound Indexes
//
// A compound index indexes MULTIPLE fields together.
// This makes queries that filter by BOTH fields much faster.
//
// Example: If you frequently query:
//   Employee.find({ id: 'E00001', 'profile.contact.address.location.state': 'TX' })
// MongoDB can use the compound index instead of scanning every document.
// ─────────────────────────────────────────────────────────────
EmployeeSchema.index({ id: 1, 'profile.contact.address.location.state': 1 });
EmployeeSchema.index({ id: 1, 'profile.contact.address.location.country': 1 });

// Creates the 'employees' collection in MongoDB
module.exports = mongoose.model('Employee', EmployeeSchema);
