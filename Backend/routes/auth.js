import express from 'express';
import { auth, isStudent, isHOD, isAdmin, isPrincipal, isVicePrincipal } from '../middleware/auth.js';
import { 
  studentLogin, 
  hodLogin, 
  adminLogin, 
  principalLogin,
  vicePrincipalLogin,
  verifyToken,
  studentChangePassword,
  hodChangePassword,
  adminChangePassword,
  principalChangePassword,
  vicePrincipalChangePassword,
  studentForgotPassword,
  hodForgotPassword,
  adminForgotPassword,
  principalForgotPassword,
  vicePrincipalForgotPassword
} from '../controllers/authController.js';

const router = express.Router();

// ============ LOGIN ROUTES ============

// Student Login - Using Roll Number and DOB
router.post('/student/login', studentLogin);

// HOD Login - Using username and password
router.post('/hod/login', hodLogin);

// Admin Login - Using username and password
router.post('/admin/login', adminLogin);

// Principal Login - Using username and password
router.post('/principal/login', principalLogin);

// Vice Principal Login - Using username and password
router.post('/vice-principal/login', vicePrincipalLogin);

// Verify Token
router.get('/verify', verifyToken);

// ============ CHANGE PASSWORD ROUTES (Authenticated) ============

// Student Change Password
router.post('/student/change-password', auth, isStudent, studentChangePassword);

// HOD Change Password
router.post('/hod/change-password', auth, isHOD, hodChangePassword);

// Admin Change Password
router.post('/admin/change-password', auth, isAdmin, adminChangePassword);

// Principal Change Password
router.post('/principal/change-password', auth, isPrincipal, principalChangePassword);

// Vice Principal Change Password
router.post('/vice-principal/change-password', auth, isVicePrincipal, vicePrincipalChangePassword);

// ============ FORGOT PASSWORD ROUTES (Public) ============

// Student Forgot Password
router.post('/student/forgot-password', studentForgotPassword);

// Principal Forgot Password
router.post('/principal/forgot-password', principalForgotPassword);

// Vice Principal Forgot Password
router.post('/vice-principal/forgot-password', vicePrincipalForgotPassword);

// HOD Forgot Password
router.post('/hod/forgot-password', hodForgotPassword);

// Admin Forgot Password
router.post('/admin/forgot-password', adminForgotPassword);

export default router;
