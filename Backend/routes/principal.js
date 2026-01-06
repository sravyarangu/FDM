import express from 'express';
import { auth, isPrincipalOrVicePrincipal } from '../middleware/auth.js';
import {
  getPrincipalProfile,
  getVicePrincipalProfile,
  getAllFeedbackWindows,
  getAllDepartmentsAnalytics,
  getAllPrograms,
  getAllBatches,
  getAllStudents,
  getAllFaculty,
  getAllSubjects,
  getSubjectFeedbackDetails,
  getInstitutionStatistics
} from '../controllers/principalController.js';

const router = express.Router();

// ============ PROFILE ============

// Get Principal/Vice Principal profile (both can access)
router.get('/profile', auth, isPrincipalOrVicePrincipal, (req, res) => {
  if (req.user.role === 'principal') {
    return getPrincipalProfile(req, res);
  } else {
    return getVicePrincipalProfile(req, res);
  }
});

// ============ FEEDBACK WINDOWS ============

// Get all feedback windows across all departments
router.get('/feedback-windows', auth, isPrincipalOrVicePrincipal, getAllFeedbackWindows);

// ============ ANALYTICS ============

// Get analytics for all departments (with optional filters)
router.get('/analytics', auth, isPrincipalOrVicePrincipal, getAllDepartmentsAnalytics);

// Get detailed feedback for a specific subject
router.get('/feedback/:feedbackWindowId/:subjectMapId', auth, isPrincipalOrVicePrincipal, getSubjectFeedbackDetails);

// Get overall institution statistics
router.get('/statistics', auth, isPrincipalOrVicePrincipal, getInstitutionStatistics);

// ============ VIEWING DATA ============

// Get all programs
router.get('/programs', auth, isPrincipalOrVicePrincipal, getAllPrograms);

// Get all batches (with optional filters)
router.get('/batches', auth, isPrincipalOrVicePrincipal, getAllBatches);

// Get all students (with optional filters)
router.get('/students', auth, isPrincipalOrVicePrincipal, getAllStudents);

// Get all faculty
router.get('/faculty', auth, isPrincipalOrVicePrincipal, getAllFaculty);

// Get all subjects (with optional filters)
router.get('/subjects', auth, isPrincipalOrVicePrincipal, getAllSubjects);

export default router;
