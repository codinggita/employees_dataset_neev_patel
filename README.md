# 🧑💼 Employee Management System — Backend API

> A production-ready RESTful backend built with **Node.js**, **Express.js**, and **MongoDB (Mongoose)** — covering full CRUD, advanced querying, JWT authentication, aggregation pipelines, and 200+ API endpoints across a deeply nested employee dataset.

---

## 📌 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Dataset Overview](#dataset-overview)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
  - [CRUD Routes](#1-crud-routes)
  - [Employee Info Routes](#2-employee-info-routes)
  - [Route Parameters](#3-route-parameters)
  - [Query Parameters](#4-query-parameters)
  - [Pagination Routes](#5-pagination-routes)
  - [Sorting Routes](#6-sorting-routes)
  - [Search Routes](#7-search-routes)
  - [Filter Routes](#8-filter-routes)
  - [Analytics Routes](#9-analytics-routes)
  - [Statistics Routes](#10-statistics-routes)
  - [Combination Queries](#11-combination-query-routes)
  - [Middleware Routes](#12-middleware-practice-routes)
  - [Authentication Routes](#13-authentication-routes)
  - [JWT Routes](#14-jwt-authentication-routes)
  - [Error Handling Routes](#15-error-handling-routes)
  - [HEAD & OPTIONS Routes](#16-head--options-routes)
- [Authentication Flow](#authentication-flow)
- [MongoDB Schema Design](#mongodb-schema-design)
- [Aggregation Pipeline Examples](#aggregation-pipeline-examples)
- [Middleware Architecture](#middleware-architecture)
- [Error Handling](#error-handling)
- [Author](#author)

---

## Project Overview

This is a backend system for managing employee records. It handles a deeply nested JSON dataset of 127+ employees — each with contact info, geo-coordinates, projects, tasks, skills, experience, and certifications — and exposes a complete REST API for querying, filtering, sorting, searching, and analyzing that data.

**Key highlights:**
- 200+ REST API endpoints organized by purpose
- Deeply nested MongoDB schema mirroring the original dataset structure
- JWT-based authentication with protected and admin-only routes
- MongoDB Aggregation Framework for analytics and statistics
- MVC architecture with clean separation between controllers, services, and models
- Comprehensive error handling with consistent JSON error responses
- Pagination, sorting, filtering, and full-text search on all major fields

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB (via Mongoose ODM) |
| Authentication | JSON Web Tokens (JWT) + bcryptjs |
| Environment | dotenv |
| CORS | cors middleware |
| Dev Tools | Postman (API testing & documentation) |

---

## Project Structure

```
employee-management-backend/
│
├── config/
│   └── db.js                  # MongoDB connection setup
│
├── models/
│   └── Employee.js            # Mongoose schema & model
│
├── controllers/
│   ├── employeeController.js  # Request/response handling only
│   ├── authController.js
│   ├── analyticsController.js
│   └── statsController.js
│
├── services/
│   ├── employeeService.js     # Core business logic
│   ├── authService.js
│   ├── analyticsService.js
│   └── statsService.js
│
├── routes/
│   ├── employeeRoutes.js
│   ├── searchRoutes.js
│   ├── filterRoutes.js
│   ├── analyticsRoutes.js
│   ├── statsRoutes.js
│   ├── authRoutes.js
│   ├── jwtRoutes.js
│   ├── adminRoutes.js
│   ├── protectedRoutes.js
│   └── middlewareRoutes.js
│
├── middlewares/
│   ├── authMiddleware.js      # JWT token verification
│   ├── errorHandler.js        # Global error handler
│   ├── logger.js              # Request logging
│   ├── roleCheck.js           # Role-based authorization
│   ├── validate.js            # Input validation
│   ├── requestTime.js         # Request timing
│   └── auditLog.js            # Audit logging
│
├── .env                       # Environment variables (not committed)
├── .env.example               # Environment variable template
├── .gitignore
├── package.json
├── server.js                  # Entry point
└── README.md
```

---

## Dataset Overview

The dataset (`Employees_Dataset.json`) contains **127+ employee records**, each following this nested structure:

```json
{
  "id": "E00001",
  "name": "Geoffrey Zimmerman",
  "profile": {
    "contact": {
      "email": "...",
      "phone": "...",
      "address": {
        "street": "...",
        "city": "...",
        "location": {
          "state": "RI",
          "country": "USA",
          "geo": {
            "lat": "-13.8488",
            "long": "9.9210",
            "timezone": {
              "name": "America/Denver",
              "utc_offset": "-07:00"
            }
          }
        }
      }
    },
    "projects": [
      {
        "projectId": "P321",
        "name": "Grow Innovative Portals",
        "tasks": [
          {
            "taskId": "T832",
            "description": "Object-based zero-defect ability",
            "assignedTo": {
              "id": "E00001",
              "name": "Geoffrey Zimmerman",
              "skills": {
                "primary": "Java",
                "secondary": ["GCP", "Node.js"],
                "experience": {
                  "years": 5,
                  "domains": ["DevOps", "Finance"],
                  "certifications": {
                    "current": ["Scrum Master", "AWS Solutions Architect"],
                    "expired": ["CompTIA Security+"],
                    "meta": {
                      "verified": true,
                      "lastUpdated": "2025-01-23"
                    }
                  }
                }
              }
            }
          }
        ]
      }
    ]
  }
}
```

**Nesting depth:** 8 levels deep at the certification meta level.

**Key queryable fields:**
- `id`, `name`
- `profile.contact.email`, `profile.contact.address.city`, `.location.state`, `.location.country`
- `profile.contact.address.location.geo.timezone.name`
- `profile.projects[].projectId`, `profile.projects[].tasks[].taskId`
- `profile.projects[].tasks[].assignedTo.skills.primary`
- `profile.projects[].tasks[].assignedTo.skills.secondary[]`
- `profile.projects[].tasks[].assignedTo.skills.experience.years`
- `profile.projects[].tasks[].assignedTo.skills.experience.domains[]`
- `profile.projects[].tasks[].assignedTo.skills.experience.certifications.current[]`
- `profile.projects[].tasks[].assignedTo.skills.experience.certifications.meta.verified`

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- npm
- Postman (for API testing)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/employee-management-backend.git
cd employee-management-backend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your values (see Environment Variables section)

# 4. Seed the database with the dataset
node scripts/seed.js

# 5. Start the development server
npm run dev

# Server runs on http://localhost:5000
```

---

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/employee_management
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

> ⚠️ Never commit your `.env` file. It is included in `.gitignore`.

---

## API Reference

**Base URL:** `http://localhost:5000`

All responses follow this consistent structure:

```json
{
  "success": true,
  "count": 10,
  "data": [ ... ]
}
```

Error responses:

```json
{
  "success": false,
  "message": "Employee not found",
  "statusCode": 404
}
```

---

### 1. CRUD Routes

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/employees` | Fetch all employee records |
| `GET` | `/employees/:id` | Fetch single employee by ID |
| `POST` | `/employees` | Add a new employee record |
| `PUT` | `/employees/:id` | Replace complete employee record |
| `PATCH` | `/employees/:id` | Update specific employee fields |
| `DELETE` | `/employees/:id` | Remove employee record |
| `GET` | `/employees/exists/:id` | Check whether employee exists |
| `POST` | `/employees/bulk-create` | Insert multiple employees |
| `PATCH` | `/employees/bulk-update` | Update multiple employees |
| `DELETE` | `/employees/bulk-delete` | Delete multiple employees |

---

### 2. Employee Info Routes

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/employees/verified` | Employees with verified certifications |
| `GET` | `/employees/projects` | All employee projects |
| `GET` | `/employees/tasks` | All employee tasks |
| `GET` | `/employees/top-experience` | Highest experienced employees |
| `GET` | `/employees/top-skills` | Employees with top skills |
| `GET` | `/employees/cloud-engineers` | Cloud domain employees |
| `GET` | `/employees/devops-engineers` | DevOps domain employees |
| `GET` | `/employees/ai-engineers` | AI domain employees |
| `GET` | `/employees/fullstack` | Full stack developers |
| `GET` | `/employees/recent-certifications` | Recently updated certifications |

---

### 3. Route Parameters

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/employees/name/:name` | Fetch by name |
| `GET` | `/employees/state/:state` | Fetch by US state |
| `GET` | `/employees/country/:country` | Fetch by country |
| `GET` | `/employees/city/:city` | Fetch by city |
| `GET` | `/employees/timezone/:timezone` | Fetch by timezone |
| `GET` | `/employees/primary-skill/:skill` | Fetch by primary skill |
| `GET` | `/employees/secondary-skill/:skill` | Fetch by secondary skill |
| `GET` | `/employees/domain/:domain` | Fetch by domain |
| `GET` | `/employees/experience/:years` | Fetch by experience years |
| `GET` | `/employees/project/:projectId` | Fetch by project ID |
| `GET` | `/employees/task/:taskId` | Fetch by task ID |
| `GET` | `/employees/certification/:certification` | Fetch by certification |
| `GET` | `/employees/performance/:id` | Employee performance analytics |
| `GET` | `/employees/stats/:id` | Employee statistics |

---

### 4. Query Parameters

All supported on `GET /employees`:

| Parameter | Example | Description |
|---|---|---|
| `country` | `?country=USA` | Filter by country |
| `state` | `?state=RI` | Filter by state |
| `city` | `?city=Weberview` | Filter by city |
| `primarySkill` | `?primarySkill=Java` | Filter by primary skill |
| `secondarySkill` | `?secondarySkill=React` | Filter by secondary skill |
| `domain` | `?domain=Cloud` | Filter by domain |
| `experience` | `?experience=5` | Filter by experience years |
| `verified` | `?verified=true` | Filter verified employees |
| `certification` | `?certification=Scrum+Master` | Filter by certification |
| `timezone` | `?timezone=America/Denver` | Filter by timezone |
| `project` | `?project=P321` | Filter by project ID |
| `task` | `?task=T832` | Filter by task ID |
| `technology` | `?technology=Kubernetes` | Filter by technology |
| `skill` | `?skill=Node.js` | Filter by any skill |

---

### 5. Pagination Routes

```
GET /employees?page=1&limit=10
GET /employees?page=2&limit=20
GET /employees/country/USA?page=1&limit=10
GET /employees/primary-skill/Java?page=1&limit=10
GET /employees/domain/Cloud?page=1&limit=10
GET /employees/verified?page=1&limit=10
GET /employees/projects?page=1&limit=20
GET /employees/tasks?page=1&limit=20
```

---

### 6. Sorting Routes

```
GET /employees?sort=name
GET /employees?sort=experience
GET /employees?sort=lastUpdated
GET /employees/sort/experience-desc
GET /employees/sort/name-asc
GET /employees/sort/project-asc
GET /employees/sort/domain-asc
GET /employees/sort/certification-desc
```

---

### 7. Search Routes

```
GET /search/employees?q=java
GET /search/employees?q=cloud
GET /search/employees?q=devops
GET /search/employees?q=react
GET /search/employees?q=kubernetes
GET /search/employees?q=aws
GET /search/employees?q=scrum
GET /search/employees?q=finance
GET /search/employees?q=healthcare
```

> Searches across: name, primary skill, secondary skills, domain, certifications, country, project names, and task descriptions.

---

### 8. Filter Routes

```
GET /employees/filter/high-experience
GET /employees/filter/low-experience
GET /employees/filter/verified
GET /employees/filter/cloud
GET /employees/filter/finance
GET /employees/filter/healthcare
GET /employees/filter/devops
GET /employees/filter/ai
GET /employees/filter/fullstack
GET /employees/filter/kubernetes
GET /employees/filter/react
GET /employees/filter/nodejs
GET /employees/filter/java
GET /employees/filter/python
GET /employees/filter/recent-certifications
```

---

### 9. Analytics Routes

| Endpoint | Description |
|---|---|
| `GET /analytics/employees/top-skills` | Most popular primary skills |
| `GET /analytics/employees/top-domains` | Most active work domains |
| `GET /analytics/employees/top-certifications` | Most common certifications |
| `GET /analytics/employees/top-projects` | Project distribution analysis |
| `GET /analytics/employees/top-technologies` | Technology usage analysis |
| `GET /analytics/employees/timezone-analysis` | Timezone distribution |
| `GET /analytics/employees/location-analysis` | Location distribution |
| `GET /analytics/employees/experience-analysis` | Experience distribution |
| `GET /analytics/employees/verification-analysis` | Certification verification status |
| `GET /analytics/employees/project-analysis` | Project activity analysis |
| `GET /analytics/employees/task-analysis` | Task activity analysis |
| `GET /analytics/employees/skill-distribution` | Skill distribution breakdown |
| `GET /analytics/employees/domain-distribution` | Domain distribution breakdown |
| `GET /analytics/employees/country-analysis` | Country-wise employee records |
| `GET /analytics/employees/state-analysis` | State-wise employee records |

---

### 10. Statistics Routes

| Endpoint | Description |
|---|---|
| `GET /stats/employees/count` | Total employee count |
| `GET /stats/employees/experience-average` | Average experience years |
| `GET /stats/employees/top-experience` | Highest experienced employee |
| `GET /stats/employees/project-count` | Total projects count |
| `GET /stats/employees/task-count` | Total tasks count |
| `GET /stats/employees/country-count` | Employees per country |
| `GET /stats/employees/state-count` | Employees per state |
| `GET /stats/employees/domain-count` | Employees per domain |
| `GET /stats/employees/skill-count` | Employees per skill |
| `GET /stats/employees/certification-count` | Certification records count |
| `GET /stats/employees/timezone-count` | Timezone distribution count |
| `GET /stats/employees/verified-count` | Verified employees count |
| `GET /stats/employees/project-distribution` | Project distribution analysis |
| `GET /stats/employees/task-distribution` | Task distribution analysis |
| `GET /stats/employees/technology-count` | Technology usage count |

---

### 11. Combination Query Routes

These combine filtering + sorting + pagination in a single request:

```
GET /employees?country=USA&sort=experience&page=1&limit=10
GET /employees?primarySkill=Java&sort=experience&page=1&limit=10
GET /employees?domain=Cloud&sort=experience&page=1&limit=15
GET /employees?verified=true&sort=lastUpdated&page=1&limit=10
GET /employees?country=USA&primarySkill=Java&sort=experience&page=1&limit=10
GET /employees?domain=Cloud&technology=Node.js&sort=experience&page=1&limit=10
GET /employees?primarySkill=Python&domain=Healthcare&sort=experience&page=1&limit=15
GET /employees?domain=AI&verified=true&sort=lastUpdated&page=1&limit=10
GET /employees?country=USA&domain=Finance&technology=GCP&sort=experience&page=1&limit=10
```

---

### 12. Middleware Practice Routes

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/middleware/logger` | Request logging middleware |
| `GET` | `/middleware/auth` | Authentication middleware |
| `GET` | `/middleware/rate-limit` | Rate limiting middleware |
| `GET` | `/middleware/error-handler` | Global error handler |
| `GET` | `/middleware/request-time` | Request timing middleware |
| `GET` | `/middleware/role-check` | Role-based authorization |
| `GET` | `/middleware/validation` | Input validation middleware |
| `GET` | `/middleware/audit-log` | Audit logging middleware |

---

### 13. Authentication Routes

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register new employee account |
| `POST` | `/auth/login` | Login and receive JWT token |
| `POST` | `/auth/logout` | Logout authenticated user |
| `GET` | `/auth/profile` | Get authenticated user profile |
| `PATCH` | `/auth/profile` | Update profile |
| `DELETE` | `/auth/profile` | Delete profile |
| `POST` | `/auth/forgot-password` | Request password reset |
| `POST` | `/auth/reset-password` | Reset forgotten password |
| `POST` | `/auth/change-password` | Change current password |
| `POST` | `/auth/verify-email` | Verify email address |
| `POST` | `/auth/send-otp` | Send OTP code |
| `POST` | `/auth/verify-otp` | Verify OTP code |
| `POST` | `/auth/resend-verification` | Resend verification email |

---

### 14. JWT Authentication Routes

| Method | Endpoint | Description | Protected |
|---|---|---|---|
| `GET` | `/jwt/profile` | Access JWT-protected profile | ✅ |
| `GET` | `/jwt/dashboard` | JWT-protected dashboard | ✅ |
| `POST` | `/jwt/generate-token` | Generate new JWT token | — |
| `POST` | `/jwt/verify-token` | Verify existing token | — |
| `POST` | `/jwt/refresh-token` | Refresh access token | ✅ |
| `DELETE` | `/jwt/revoke-token` | Revoke token | ✅ |
| `GET` | `/jwt/private-employees` | Protected employee records | ✅ |
| `GET` | `/jwt/private-projects` | Protected project records | ✅ |
| `GET` | `/jwt/private-tasks` | Protected task records | ✅ |
| `GET` | `/jwt/private-analytics` | Protected analytics dashboard | ✅ |

---

### 15. Error Handling Routes

The API returns consistent error responses for all invalid requests:

| Scenario | Status Code | Example Route |
|---|---|---|
| Employee not found | `404` | `GET /employees/:id` |
| Missing required fields | `400` | `POST /employees` |
| Validation error | `422` | `PATCH /employees/:id` |
| Unauthorized access | `401` | `GET /admin/employees` |
| Invalid numeric value | `400` | `GET /employees/experience/abc` |
| Invalid country | `404` | `GET /employees/country/unknown` |
| Invalid pagination values | `400` | `GET /employees?page=-1&limit=-5` |
| Empty search query | `400` | `GET /search/employees?q=` |
| Duplicate employee | `409` | `POST /employees` |

---

### 16. HEAD & OPTIONS Routes

```
HEAD  /employees
HEAD  /employees/:id
HEAD  /employees/projects
HEAD  /stats/employees/count
OPTIONS /employees
OPTIONS /employees/:id
OPTIONS /auth/login
OPTIONS /admin/employees
OPTIONS /search/employees
OPTIONS /jwt/profile
```

---

## Authentication Flow

```
1. POST /auth/register  →  Hash password with bcrypt  →  Save user  →  Return JWT
2. POST /auth/login     →  Verify credentials          →  Return JWT
3. Protected request    →  Send JWT in Authorization header
                                   ↓
                        Bearer <token>
                                   ↓
                        authMiddleware verifies token
                                   ↓
                        req.user populated  →  Controller runs
```

**Authorization Header format:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## MongoDB Schema Design

The schema mirrors the original dataset nesting exactly:

```javascript
const EmployeeSchema = new mongoose.Schema({
  id:   { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  profile: {
    contact: {
      email: { type: String, required: true },
      phone: String,
      address: {
        street: String,
        city:   String,
        location: {
          state:   { type: String, index: true },
          country: { type: String, index: true },
          geo: {
            lat:  String,
            long: String,
            timezone: {
              name:       { type: String, index: true },
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
        taskId:      { type: String, index: true },
        description: String,
        assignedTo: {
          id:   String,
          name: String,
          skills: {
            primary:   { type: String, index: true },
            secondary: [String],
            experience: {
              years:   { type: Number, index: true },
              domains: [String],
              certifications: {
                current: [String],
                expired: [String],
                meta: {
                  verified:    Boolean,
                  lastUpdated: String
                }
              }
            }
          }
        }
      }]
    }]
  }
});
```

**Indexes created on:** `id`, `state`, `country`, `timezone.name`, `projectId`, `taskId`, `skills.primary`, `experience.years`

---

## Aggregation Pipeline Examples

**Top Skills Analysis:**
```javascript
Employee.aggregate([
  { $unwind: "$profile.projects" },
  { $unwind: "$profile.projects.tasks" },
  { $group: {
      _id: "$profile.projects.tasks.assignedTo.skills.primary",
      count: { $sum: 1 }
  }},
  { $sort: { count: -1 } },
  { $project: { skill: "$_id", count: 1, _id: 0 } }
])
```

**Experience Distribution:**
```javascript
Employee.aggregate([
  { $unwind: "$profile.projects" },
  { $unwind: "$profile.projects.tasks" },
  { $group: {
      _id: "$profile.projects.tasks.assignedTo.skills.experience.years",
      count: { $sum: 1 }
  }},
  { $sort: { _id: 1 } }
])
```

**Domain Distribution:**
```javascript
Employee.aggregate([
  { $unwind: "$profile.projects" },
  { $unwind: "$profile.projects.tasks" },
  { $unwind: "$profile.projects.tasks.assignedTo.skills.experience.domains" },
  { $group: {
      _id: "$profile.projects.tasks.assignedTo.skills.experience.domains",
      count: { $sum: 1 }
  }},
  { $sort: { count: -1 } }
])
```

---

## Middleware Architecture

Requests pass through the following chain before reaching any controller:

```
Incoming Request
      ↓
  CORS Middleware
      ↓
  Logger Middleware       (logs method, path, timestamp)
      ↓
  Request Time Middleware (stamps request start time)
      ↓
  [Auth Middleware]       (protected routes only — verifies JWT)
      ↓
  [Role Check]            (admin routes only)
      ↓
  [Validation]            (POST/PATCH routes — validates body)
      ↓
  Controller
      ↓
  [Audit Log]             (write operations only)
      ↓
  Response
      ↓
  Error Handler Middleware (catches any thrown errors)
```

---

## Error Handling

All errors are caught by the global error handler (`middlewares/errorHandler.js`).

Async functions use a wrapper utility to avoid repetitive try/catch:

```javascript
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
```

All controllers are wrapped:
```javascript
exports.getEmployee = asyncHandler(async (req, res) => {
  const employee = await employeeService.findById(req.params.id);
  if (!employee) throw new AppError('Employee not found', 404);
  res.json({ success: true, data: employee });
});
```

---

## Author

**[Neev Patel]**
GitHub: [@neev3654](https://github.com/neev3654)