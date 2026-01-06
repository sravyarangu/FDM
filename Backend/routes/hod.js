import express from 'express';
import { auth, isHOD } from '../middleware/auth.js';
import {
  getHODProfile,
  getBatches,
  getBatchStudents,
  getSubjects,
  getAllFaculty,
  getSubjectMapping,
  getFeedbackWindows,
  publishFeedbackWindow,
  closeFeedbackWindow,
  getAnalytics
} from '../controllers/hodController.js';

const router = express.Router();

// Get HOD profile
router.get('/profile', auth, isHOD, getHODProfile);

// Get all batches for HOD's program and branch
router.get('/batches', auth, isHOD, getBatches);

// Get students for a specific batch
router.get('/batch/:admittedYear/students', auth, isHOD, getBatchStudents);

// Get all subjects for HOD's department
router.get('/subjects', auth, isHOD, getSubjects);

// Get all faculty
router.get('/faculty', auth, isHOD, getAllFaculty);

// View subject mappings for HOD's department (read-only)
router.get('/subject-mapping', auth, isHOD, getSubjectMapping);

// Get feedback windows
router.get('/feedback-windows', auth, isHOD, getFeedbackWindows);

// Create/Publish feedback window
router.post('/feedback-window/publish', auth, isHOD, publishFeedbackWindow);

// Close feedback window
router.patch('/feedback-window/:id/close', auth, isHOD, closeFeedbackWindow);

// Get feedback analytics for a semester
router.get('/analytics', auth, isHOD, getAnalytics);

export default router;
