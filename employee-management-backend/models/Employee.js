const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  profile: {
    contact: {
      email: { type: String, required: true },
      phone: String,
      address: {
        street: String,
        city: String,
        location: {
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
    projects: [{
      projectId: { type: String, index: true },
      name: String,
      tasks: [{
        taskId: { type: String, index: true },
        description: String,
        assignedTo: {
          id: String,
          name: String,
          skills: {
            primary: { type: String, index: true },
            secondary: [String],
            experience: {
              years: { type: Number, index: true },
              domains: [String],
              certifications: {
                current: [String],
                expired: [String],
                meta: {
                  verified: Boolean,
                  lastUpdated: String
                }
              }
            }
          }
        }
      }]
    }]
  }
}, { timestamps: true });

// Compound indexes
EmployeeSchema.index({ id: 1, 'profile.contact.address.location.state': 1 });
EmployeeSchema.index({ id: 1, 'profile.contact.address.location.country': 1 });

module.exports = mongoose.model('Employee', EmployeeSchema);
