# Frontend-Backend Integration Guide

## Overview
This document describes the complete integration between the React frontend and Node.js/Express backend for the Feedback Management System. It includes setup instructions, API documentation, and manual testing procedures.

---

## 📁 Project Structure

```
FeedBack-Management-JNTUGV/
├── Backend/                    # Node.js/Express API Server
│   ├── config/                 # Database configuration
│   ├── controllers/            # Route handlers
│   ├── middleware/             # Auth & other middleware
│   ├── models/                 # Mongoose models
│   ├── routes/                 # API route definitions
│   ├── uploads/                # File uploads directory
│   ├── index.js                # Server entry point
│   └── package.json
│
├── front/frontend/             # React + Vite Frontend
│   ├── src/
│   │   ├── app/                # Main App component
│   │   ├── context/            # React Context (AuthContext)
│   │   ├── features/           # Feature modules
│   │   │   ├── admin/          # Admin/Principal pages
│   │   │   ├── auth/           # Login pages
│   │   │   ├── hod/            # HOD pages
│   │   │   └── student/        # Student pages
│   │   ├── services/           # API service layer
│   │   │   ├── api.js          # Axios instance
│   │   │   ├── authService.js  # Authentication APIs
│   │   │   ├── studentService.js
│   │   │   ├── hodService.js
│   │   │   ├── adminService.js
│   │   │   ├── principalService.js
│   │   │   └── index.js        # Export all services
│   │   └── shared/             # Shared components
│   ├── .env                    # Environment variables
│   └── package.json
│
└── INTEGRATION_GUIDE.md        # This file
```

---

## ✅ Integration Components

### 1. API Configuration (`services/api.js`)
Centralized axios instance with:
- Base URL configuration from environment variables
- Automatic token attachment to requests
- Response interceptor for handling 401 errors
- Automatic redirect to login on token expiration
- 30-second request timeout

### 2. Environment Configuration (`.env`)
```env
VITE_API_URL=http://localhost:3000/api
```

### 3. Service Layer Files
| Service | Purpose |
|---------|---------|
| `authService.js` | Login, logout, change password, forgot password |
| `studentService.js` | Profile, subjects, feedback submission |
| `hodService.js` | Department management, analytics, feedback windows |
| `adminService.js` | Full CRUD for all entities |
| `principalService.js` | Institution-wide analytics |

### 4. AuthContext (`context/AuthContext.jsx`)
- Real API integration for all login types
- Support for 5 user roles: student, hod, admin, principal, vice-principal
- Token & user data management in localStorage
- Change password functionality
- Error handling and clearing

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js v18+ installed
- MongoDB running (local or Atlas)
- Git installed

### Step 1: Clone and Setup Backend
```bash
cd Backend
npm install
```

### Step 2: Configure Backend Environment
Create `Backend/.env` file:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/feedback_system
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long
JWT_EXPIRE=7d
NODE_ENV=development
```

### Step 3: Seed Database (Optional)
```bash
cd Backend
node seed.js
```

### Step 4: Start Backend Server
```bash
cd Backend
npm start
# Server runs on http://localhost:3000
```

### Step 5: Setup Frontend
```bash
cd front/frontend
npm install
```

### Step 6: Configure Frontend Environment
The `.env` file is already created:
```env
VITE_API_URL=http://localhost:3000/api
```

### Step 7: Start Frontend Development Server
```bash
cd front/frontend
npm run dev
# Vite dev server runs on http://localhost:5173
```

---

## 🔐 Authentication Flow

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Login     │ ──▶  │   Backend   │ ──▶  │   JWT +     │
│   Form      │      │   Validates │      │   User Data │
└─────────────┘      └─────────────┘      └─────────────┘
                                                 │
                     ┌───────────────────────────┘
                     ▼
              ┌─────────────┐
              │ localStorage │
              │ - token      │
              │ - user       │
              └─────────────┘
                     │
                     ▼
              ┌─────────────┐
              │ AuthContext │
              │ - user state│
              │ - methods   │
              └─────────────┘
```

### Login Credentials Format

| Role | Credentials |
|------|-------------|
| **Student** | Roll Number + Date of Birth (YYYY-MM-DD) |
| **HOD** | Email + Password |
| **Admin** | Email + Password |
| **Principal** | Email + Password |
| **Vice Principal** | Email + Password |

---

## 📡 API Endpoints Reference

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/student/login` | Student login with rollNo + dob |
| POST | `/hod/login` | HOD login with email + password |
| POST | `/admin/login` | Admin login with email + password |
| POST | `/principal/login` | Principal login |
| POST | `/vice-principal/login` | Vice Principal login |
| GET | `/verify` | Verify JWT token |
| POST | `/{role}/change-password` | Change password (authenticated) |
| POST | `/{role}/forgot-password` | Request password reset |

### Student Routes (`/api/student`) - Requires Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/profile` | Get student profile |
| GET | `/subjects` | Get current semester subjects |
| GET | `/feedback-window` | Check active feedback window |
| GET | `/feedback-questions` | Get feedback questions |
| POST | `/submit-feedback` | Submit feedback |
| GET | `/feedback-status/:subjectMapId` | Check submission status |

### HOD Routes (`/api/hod`) - Requires Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/profile` | Get HOD profile |
| GET | `/batches` | Get department batches |
| GET | `/batch/:year/students` | Get batch students |
| GET | `/subjects` | Get department subjects |
| GET | `/faculty` | Get all faculty |
| GET | `/subject-mapping` | Get subject-faculty mapping |
| GET | `/feedback-windows` | Get feedback windows |
| P,ST | `/feedback-window/publish` | Create feedback window |
| PATCH | `/feedback-window/:id/close` | Close feedback window |
| GET | `/analytics` | Get feedback analytics |

### Admin Routes (`/api/admin`) - Requires Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/programs` | Program management |
| GET/POST | `/batches` | Batch management |
| GET/POST | `/students` | Student management |
| POST | `/students/bulk` | Bulk upload students |
| GET/POST | `/faculty` | Faculty management |
| GET/POST | `/subjects` | Subject management |
| GET/POST | `/hods` | HOD management |
| GET/POST | `/subject-mapping` | Subject-faculty mapping |
| POST | `/subject-mapping/bulk` | Bulk upload mappings |

### Principal Routes (`/api/principal`) - Requires Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/profile` | Get profile |
| GET | `/feedback-windows` | All feedback windows |
| GET | `/analytics` | Institution analytics |
| GET | `/statistics` | Overall statistics |
| GET | `/programs` | View all programs |
| GET | `/batches` | View all batches |
| GET | `/students` | View all students |
| GET | `/faculty` | View all faculty |
| GET | `/subjects` | View all subjects |

---

## 🧪 Manual Testing Guide

### Prerequisites for Testing
1. Both backend and frontend servers running
2. Database seeded with test data (`node seed.js`)
3. Browser developer tools open (F12)

### 🔑 Test Credentials Quick Reference

| Role | Login URL | Email/Roll Number | Password/DOB |
|------|-----------|-------------------|--------------|
| **Student** | `/login/student` | `23VV1A0546` | `2005-01-10` |
| **Student** | `/login/student` | `23VV1A0547` | `2005-02-15` |
| **Student** | `/login/student` | `23VV1A0548` | `2005-03-20` |
| **Student** | `/login/student` | `23VV1A0549` | `2005-04-25` |
| **Student** | `/login/student` | `23VV1A0550` | `2005-05-30` |
| **HOD (CSE)** | `/login/hod` | `hod.cse@jntugv.edu.in` | `Hod@123` |
| **Admin** | `/login/admin` (Super Admin) | `admin@jntugv.edu.in` | `Admin@123` |
| **Principal** | `/login/admin` (Principal) | `principal@jntugv.edu.in` | `Principal@123` |
| **Vice Principal** | `/login/admin` (Vice Principal) | `viceprincipal@jntugv.edu.in` | `VicePrincipal@123` |

### Test 1: Student Login Flow
```
1. Navigate to: http://localhost:5173/login/student
2. Enter Roll Number: 23VV1A0546
3. Enter DOB: 2005-01-10
4. Click "Login"
5. ✅ Expected: Redirect to /student/dashboard
6. ✅ Check: localStorage has 'token' and 'user' keys
7. ✅ Check: Network tab shows 200 response from /api/auth/student/login
```

### Test 2: HOD Login Flow
```
1. Navigate to: http://localhost:5173/login/hod
2. Enter Email: hod.cse@jntugv.edu.in
3. Enter Password: Hod@123
4. Click "Login"
5. ✅ Expected: Redirect to /hod/dashboard
6. ✅ Check: User name displayed in sidebar
```

### Test 3: Admin (Super Admin) Login Flow
```
1. Navigate to: http://localhost:5173/login/admin
2. Select Role: Super Admin
3. Enter Email: admin@jntugv.edu.in
4. Enter Password: Admin@123
5. Click "Login"
6. ✅ Expected: Redirect to /admin/dashboard
```

### Test 4: Principal Login Flow
```
1. Navigate to: http://localhost:5173/login/admin
2. Select Role: Principal
3. Enter Email: principal@jntugv.edu.in
4. Enter Password: Principal@123
5. Click "Login"
6. ✅ Expected: Redirect to /admin/analytics
```

### Test 5: Vice Principal Login Flow
```
1. Navigate to: http://localhost:5173/login/admin
2. Select Role: Vice Principal
3. Enter Email: viceprincipal@jntugv.edu.in
4. Enter Password: VicePrincipal@123
5. Click "Login"
6. ✅ Expected: Redirect to /admin/analytics
```

### Test 6: Invalid Credentials
```
1. Navigate to: http://localhost:5173/login/student
2. Enter Roll Number: INVALID123
3. Enter DOB: 2000-01-01
4. Click "Login"
5. ✅ Expected: Error message displayed
6. ✅ Check: No redirect, stays on login page
```

### Test 7: Token Expiration
```
1. Login as any user
2. In DevTools > Application > Local Storage
3. Modify the 'token' value to invalid
4. Refresh the page or make an API call
5. ✅ Expected: Redirected to landing page
6. ✅ Check: localStorage cleared
```

### Test 8: Protected Routes
```
1. Clear localStorage (DevTools > Application > Clear)
2. Navigate directly to: http://localhost:5173/student/dashboard
3. ✅ Expected: Page loads but API calls fail
4. ✅ Check: Console shows 401 errors
```

### Test 9: Logout Functionality
```
1. Login as any user
2. Click "Logout" button in sidebar
3. Confirm logout in modal
4. ✅ Expected: Redirect to landing page
5. ✅ Check: localStorage cleared
```

### Test 10: Change Password
```
1. Login as any user
2. Navigate to "Change Password" page
3. Enter current password
4. Enter new password (min 8 chars with uppercase, lowercase, number, special char)
5. Confirm new password
6. Click "Change Password"
7. ✅ Expected: Success message
8. Test login with new password
```

### Test 11: API Error Handling
```
1. Stop the backend server
2. Try to login
3. ✅ Expected: "An error occurred" message
4. ✅ Check: No crash, graceful error handling
```

### Test 12: Network Tab Verification
```
For each action, verify in Network tab:
1. Request URL is correct (/api/...)
2. Request method is correct (GET/POST/etc)
3. Authorization header present (after login)
4. Response status codes:
   - 200/201 for success
   - 400 for bad request
   - 401 for unauthorized
   - 500 for server errors
```

---

## 🔧 Troubleshooting Guide

### Issue: CORS Errors
```
Error: Access to XMLHttpRequest has been blocked by CORS policy
```
**Solution:**
1. Ensure backend has CORS enabled
2. Check `Backend/index.js` has `app.use(cors())`
3. For production, configure specific origins

### Issue: 401 Unauthorized
```
Error: Request failed with status code 401
```
**Solution:**
1. Check if token exists in localStorage
2. Verify token hasn't expired
3. Ensure JWT_SECRET matches in backend .env
4. Try logging out and back in

### Issue: Network Error
```
Error: Network Error / ERR_CONNECTION_REFUSED
```
**Solution:**
1. Verify backend is running on port 3000
2. Check VITE_API_URL in frontend .env
3. Ensure no firewall blocking
4. Try `http://127.0.0.1:3000` instead of `localhost`

### Issue: Token Not Persisting
**Solution:**
1. Check browser allows localStorage
2. Verify no privacy/incognito mode restrictions
3. Check console for storage errors

### Issue: Login Works But Dashboard Empty
**Solution:**
1. Check if database has data (run seed.js)
2. Verify student/HOD belongs to correct program/branch
3. Check network tab for API response data

---

## 📦 Production Deployment

### Frontend Build
```bash
cd front/frontend
npm run build
# Output in dist/ folder
```

### Environment Variables for Production

**Frontend** (`front/frontend/.env.production`):
```env
VITE_API_URL=https://api.yourdomain.com/api
```

**Backend** (`.env`):
```env
PORT=3000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/feedback
JWT_SECRET=your_super_secure_production_secret_min_32_chars
JWT_EXPIRE=7d
NODE_ENV=production
```

### CORS Configuration for Production
Update `Backend/index.js`:
```javascript
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}));
```

---

## ✅ Integration Checklist

### Backend
- [x] Express server with CORS enabled
- [x] MongoDB connection with Mongoose
- [x] JWT authentication middleware
- [x] All routes: auth, student, hod, admin, principal
- [x] Error handling middleware
- [x] File upload support (multer)

### Frontend
- [x] Axios instance with interceptors
- [x] Service layer for all API modules
- [x] AuthContext with all login methods
- [x] Token management in localStorage
- [x] Error handling in components
- [x] All login pages integrated
- [x] Logout functionality
- [x] Environment configuration

### Testing
- [ ] All login flows tested
- [ ] Token expiration handling verified
- [ ] Error scenarios covered
- [ ] Network tab responses verified
- [ ] Protected routes working

---

## 📝 Code Examples

### Making Authenticated API Calls
```javascript
import studentService from '../services/studentService';

// In a React component
useEffect(() => {
  const fetchData = async () => {
    try {
      const profile = await studentService.getProfile();
      setProfile(profile);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load');
    }
  };
  fetchData();
}, []);
```

### Using AuthContext
```javascript
import { useAuth } from '../context/AuthContext';

const MyComponent = () => {
  const { user, logout, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  return <div>Welcome, {user.name}!</div>;
};
```

### Submitting Forms with API
```javascript
import hodService from '../services/hodService';

const handleSubmit = async (formData) => {
  try {
    setLoading(true);
    const result = await hodService.publishFeedbackWindow(formData);
    if (result.success) {
      showSuccess('Feedback window created!');
    }
  } catch (error) {
    showError(error.response?.data?.message);
  } finally {
    setLoading(false);
  }
};
```

---

## 🎯 Summary

The Feedback Management System is now fully integrated with:
- ✅ Complete service layer for all API modules
- ✅ AuthContext with real backend authentication
- ✅ All login pages connected to backend APIs
- ✅ Token-based authentication with auto-refresh
- ✅ Comprehensive error handling
- ✅ Logout functionality across all modules
- ✅ Environment configuration for dev/production

**Next Steps:**
1. Run manual tests using the testing guide above
2. Seed database with realistic test data
3. Implement remaining module-specific features
4. Add form validation and loading states
5. Deploy to production environment
