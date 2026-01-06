# Feedback Management System - Backend API Documentation

## Overview
This is the backend API for the Feedback Management System for JNTUGV. It provides endpoints for three types of users: Students, HODs, and Admin.

## Technology Stack
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file in the Backend directory with the following:
```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
```

### 3. Seed Initial Data
```bash
node seed.js
```

### 4. Start Server
```bash
npm start
```

## Default Credentials

### Admin
- Email: `admin@jntugv.edu.in`
- Password: `Admin@123`

### Principal
- Email: `principal@jntugv.edu.in`
- Password: `Principal@123`

### Vice Principal
- Email: `vp@jntugv.edu.in`
- Password: `VicePrincipal@123`

### HODs (Sample)
- Email: `hod.cse@jntugv.edu.in` / `hod.ece@jntugv.edu.in` / `hod.mca@jntugv.edu.in`
- Password: `Hod@123`
ad
### Students
- Students login with their Roll Number and Date of Birth (YYYY-MM-DD format)

## API Endpoints

### Authentication Routes (`/api/auth`)

#### 1. Student Login
```
POST /api/auth/student/login
Body: {
  "rollNo": "20B81A0501",
  "dob": "2002-05-15"
}
```

#### 2. HOD Login
```
POST /api/auth/hod/login
Body: {
  "email": "hod.cse@jntugv.edu.in",
  "password": "Hod@123"
}
```

#### 3. Admin Login
```
POST /api/auth/admin/login
Body: {
  "email": "admin@jntugv.edu.in",
  "password": "Admin@123"
}
```

#### 4. Verify Token
```
GET /api/auth/verify
Headers: Authorization: Bearer <token>
```

#### 5. Student Change Password
```
POST /api/auth/student/change-password
Headers: Authorization: Bearer <token>
Body: {
  "currentPassword": "2002-05-15",
  "newPassword": "newDOB123"
}
```

#### 6. HOD Change Password
```
POST /api/auth/hod/change-password
Headers: Authorization: Bearer <token>
Body: {
  "currentPassword": "Hod@123",
  "newPassword": "NewPassword@456"
}
```

#### 7. Admin Change Password
```
POST /api/auth/admin/change-password
Headers: Authorization: Bearer <token>
Body: {
  "currentPassword": "Admin@123",
  "newPassword": "NewAdmin@456"
}
```

#### 8. Student Forgot Password
```
POST /api/auth/student/forgot-password
Body: {
  "rollNo": "20B81A0501",
  "dob": "2002-05-15",
  "newPassword": "newDOB123"
}
```

#### 9. HOD Forgot Password
```
POST /api/auth/hod/forgot-password
Body: {
  "email": "hod.cse@jntugv.edu.in",
  "newPassword": "NewPassword@456"
}
```

#### 10. Admin Forgot Password
```
POST /api/auth/admin/forgot-password
Body: {
  "email": "admin@jntugv.edu.in",
  "newPassword": "NewAdmin@456"
}
```

#### 11. Principal Login
```
POST /api/auth/principal/login
Body: {
  "email": "principal@jntugv.edu.in",
  "password": "Principal@123"
}
```

#### 12. Principal Change Password
```
POST /api/auth/principal/change-password
Headers: Authorization: Bearer <token>
Body: {
  "currentPassword": "Principal@123",
  "newPassword": "NewPrincipal@456"
}
```

#### 13. Principal Forgot Password
```
POST /api/auth/principal/forgot-password
Body: {
  "email": "principal@jntugv.edu.in",
  "newPassword": "NewPrincipal@456"
}
```

#### 14. Vice Principal Login
```
POST /api/auth/vice-principal/login
Body: {
  "email": "vp@jntugv.edu.in",
  "password": "VicePrincipal@123"
}
```

#### 15. Vice Principal Change Password
```
POST /api/auth/vice-principal/change-password
Headers: Authorization: Bearer <token>
Body: {
  "currentPassword": "VicePrincipal@123",
  "newPassword": "NewVP@456"
}
```

#### 16. Vice Principal Forgot Password
```
POST /api/auth/vice-principal/forgot-password
Body: {
  "email": "vp@jntugv.edu.in",
  "newPassword": "NewVP@456"
}
```

---

### Student Routes (`/api/student`)
**All routes require authentication with student token**

#### 1. Get Student Profile
```
GET /api/student/profile
Headers: Authorization: Bearer <token>
```

#### 2. Get Current Semester Subjects
```
GET /api/student/subjects
Headers: Authorization: Bearer <token>
```

#### 3. Check Active Feedback Window
```
GET /api/student/feedback-window
Headers: Authorization: Bearer <token>
```

#### 4. Get Feedback Questions
```
GET /api/student/feedback-questions
Headers: Authorization: Bearer <token>
```

#### 5. Submit Feedback
```
POST /api/student/submit-feedback
Headers: Authorization: Bearer <token>
Body: {
  "subjectMapId": "objectId",
  "feedbackWindowId": "objectId",
  "responses": [
    {
      "questionId": "objectId",
      "criteria": "Question text",
      "rating": 5
    }
  ]
}
```

#### 6. Check Feedback Status
```
GET /api/student/feedback-status/:subjectMapId
Headers: Authorization: Bearer <token>
```

---

### HOD Routes (`/api/hod`)
**All routes require authentication with HOD token**

#### 1. Get HOD Profile
```
GET /api/hod/profile
Headers: Authorization: Bearer <token>
```

#### 2. Get All Batches
```
GET /api/hod/batches
Headers: Authorization: Bearer <token>
```

#### 3. Get Batch Students
```
GET /api/hod/batch/:admittedYear/students
Headers: Authorization: Bearer <token>
```

#### 4. Get Subjects
```
GET /api/hod/subjects
Headers: Authorization: Bearer <token>
```

#### 5. Get Faculty List
```
GET /api/hod/faculty
Headers: Authorization: Bearer <token>
```

#### 6. Get Subject Mappings
```
GET /api/hod/subject-mapping?admittedYear=2020&semester=1
Headers: Authorization: Bearer <token>
```

#### 7. Create/Update Subject Mapping
```
POST /api/hod/subject-mapping
Headers: Authorization: Bearer <token>
Body: {
  "admittedYear": 2020,
  "year": 1,
  "semester": 1,
  "subjectId": "objectId",
  "facultyId": "objectId",
  "academicYear": "2024-25"
}
```

#### 8. Delete Subject Mapping
```
DELETE /api/hod/subject-mapping/:id
Headers: Authorization: Bearer <token>
```

#### 9. Get Feedback Windows
```
GET /api/hod/feedback-windows
Headers: Authorization: Bearer <token>
```

#### 10. Publish Feedback Window
```
POST /api/hod/feedback-window/publish
Headers: Authorization: Bearer <token>
Body: {
  "year": 1,
  "semester": 1,
  "startDate": "2024-12-01",
  "endDate": "2024-12-15",
  "academicYear": "2024-25"
}
```

#### 11. Close Feedback Window
```
PATCH /api/hod/feedback-window/:id/close
Headers: Authorization: Bearer <token>
```

#### 12. Get Feedback Analytics
```
GET /api/hod/analytics?year=1&semester=1
Headers: Authorization: Bearer <token>
```

---

### Admin Routes (`/api/admin`)
**All routes require authentication with admin token**

#### Programs

```
GET /api/admin/programs
POST /api/admin/programs
PUT /api/admin/programs/:id
DELETE /api/admin/programs/:id
```

#### Batches

```
GET /api/admin/batches?program=BTech&branch=CSE
POST /api/admin/batches
PUT /api/admin/batches/:id
DELETE /api/admin/batches/:id
```

#### Students

```
GET /api/admin/students?program=BTech&branch=CSE&admittedYear=2020
POST /api/admin/students
POST /api/admin/students/bulk
PUT /api/admin/students/:id
DELETE /api/admin/students/:id
```

#### Faculty

```
GET /api/admin/faculty
POST /api/admin/faculty
PUT /api/admin/faculty/:id
DELETE /api/admin/faculty/:id
```

#### Subjects

```
GET /api/admin/subjects?program=BTech&branch=CSE
POST /api/admin/subjects
PUT /api/admin/subjects/:id
DELETE /api/admin/subjects/:id
```

#### HODs

```
GET /api/admin/hods
POST /api/admin/hods
PUT /api/admin/hods/:id
DELETE /api/admin/hods/:id
```

## Database Models

### Student
- rollNo (unique)
- name
- email
- dob (YYYY-MM-DD)
- branch
- program (BTech, MTech, MCA, MBA)
- admittedYear
- currentYear
- semester
- regulation
- isActive

### Faculty
- facultyId (unique)
- name
- email
- department
- designation
- isActive

### HOD
- username (unique)
- password (hashed)
- name
- email
- branch
- program
- isActive

### Admin
- username (unique)
- password (hashed)
- name
- email
- role
- isActive

### Program
- name
- code
- duration
- branches []
- isActive

### Batch
- program
- admittedYear
- branch
- regulation
- studentsCount
- isActive

### Subject
- subjectCode (unique)
- subjectName
- program
- branch
- regulation
- year
- semester
- credits
- isActive

### SubjectMap
- program
- admittedYear
- branch
- year
- semester
- facultyId (ref: Faculty)
- subjectId (ref: Subject)
- academicYear
- isActive

### FeedbackWindow
- branch
- program
- year
- semester
- academicYear
- startDate
- endDate
- isPublished
- publishedBy (ref: HOD)
- publishedAt

### Feedback
- studentId (ref: Student)
- rollNo
- subjectMapId (ref: SubjectMap)
- feedbackWindowId (ref: FeedbackWindow)

---

## Principal & Vice Principal Routes (`/api/principal`)
**All routes require authentication with principal or vice principal token**
**Both Principal and Vice Principal can access all these endpoints**

### 1. Get Profile
```
GET /api/principal/profile
Headers: Authorization: Bearer <token>
```

### 2. Get All Feedback Windows
```
GET /api/principal/feedback-windows
Headers: Authorization: Bearer <token>
```
Returns all feedback windows from all departments.

### 3. Get All Departments Analytics
```
GET /api/principal/analytics?program=<programId>&branch=<branch>&year=<year>&semester=<semester>
Headers: Authorization: Bearer <token>
```
Query Parameters (all optional):
- program: Filter by program ID
- branch: Filter by branch
- year: Filter by year
- semester: Filter by semester

### 4. Get Subject Feedback Details
```
GET /api/principal/feedback/:feedbackWindowId/:subjectMapId
Headers: Authorization: Bearer <token>
```
Get detailed feedback for a specific subject including all student responses.

### 5. Get Institution Statistics
```
GET /api/principal/statistics
Headers: Authorization: Bearer <token>
```
Returns overall statistics including:
- Total programs, students, faculty
- Active feedback windows
- Student distribution by program

### 6. Get All Programs
```
GET /api/principal/programs
Headers: Authorization: Bearer <token>
```

### 7. Get All Batches
```
GET /api/principal/batches?program=<programId>&branch=<branch>
Headers: Authorization: Bearer <token>
```

### 8. Get All Students
```
GET /api/principal/students?program=<programId>&branch=<branch>&year=<year>&semester=<semester>
Headers: Authorization: Bearer <token>
```

### 9. Get All Faculty
```
GET /api/principal/faculty
Headers: Authorization: Bearer <token>
```

### 10. Get All Subjects
```
GET /api/principal/subjects?program=<programId>&branch=<branch>&year=<year>&semester=<semester>
Headers: Authorization: Bearer <token>
```

---
- responses []
  - questionId (ref: FeedbackQuestion)
  - criteria
  - rating (1-5)
- submissionTime

### FeedbackQuestion
- sno
- criteria
- category
- isActive

## Workflow

### 1. Admin Setup
1. Login as admin
2. Create programs (BTech, MTech, etc.)
3. Create batches for each program
4. Upload students batch-wise
5. Create subjects for each program/branch
6. Add faculty members
7. Create HOD accounts for each branch

### 2. HOD Operations
1. Login as HOD
2. Map subjects to faculty for each batch/semester
3. Publish feedback window (set start and end dates)
4. Monitor feedback submissions
5. View analytics after feedback period ends

### 3. Student Operations
1. Login with roll number and DOB
2. View assigned subjects and faculty
3. Submit feedback during active feedback window
4. Rate faculty on predefined criteria (1-5 scale)

## Testing the API

You can test the API using:
- Postman
- Thunder Client (VS Code extension)
- curl commands
- Any HTTP client

Example curl command:
```bash
curl -X POST http://localhost:3000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@123"}'
```

## Notes
- All passwords are hashed using bcryptjs
- JWT tokens expire in 7 days (configurable)
- Student passwords are their DOB in YYYY-MM-DD format
- Analytics are only visible to HODs after feedback window is published
- Students can submit feedback only once per subject per window
