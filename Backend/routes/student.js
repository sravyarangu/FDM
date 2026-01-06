import express from 'express';
import { auth, isStudent } from '../middleware/auth.js';
import {
  getStudentProfile,
  getCurrentSubjects,
  checkFeedbackWindow,
  getFeedbackQuestions,
  submitFeedback,
  checkFeedbackStatus,
  getFeedbackSessions,
  getMySubmissions
} from '../controllers/studentController.js';

const router = express.Router();

// Get student profile
router.get('/profile', auth, isStudent, getStudentProfile);

// Get current semester subjects with faculty
router.get('/subjects', auth, isStudent, getCurrentSubjects);

// Check if feedback window is active for student
router.get('/feedback-window', auth, isStudent, checkFeedbackWindow);

// Get feedback questions
router.get('/feedback-questions', auth, isStudent, getFeedbackQuestions);

// Submit feedback for a subject
router.post('/submit-feedback', auth, isStudent, submitFeedback);

// Check if feedback submitted for a subject
router.get('/feedback-status/:subjectMapId', auth, isStudent, checkFeedbackStatus);

// Get all feedback sessions with status
router.get('/feedback-sessions', auth, isStudent, getFeedbackSessions);

// Get my submissions
router.get('/my-submissions', auth, isStudent, getMySubmissions);

export default router;
