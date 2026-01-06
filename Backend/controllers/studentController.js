import Student from '../models/student.js';
import SubjectMap from '../models/subjectMap.js';
import FeedbackWindow from '../models/feedbackWindow.js';
import Feedback from '../models/feedback.js';
import FeedbackQuestion from '../models/feedbackQuestion.js';

// Get student profile
export const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select('-__v');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ success: true, student });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get current semester subjects with faculty
export const getCurrentSubjects = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Get subject mappings for student's current semester
    const subjectMaps = await SubjectMap.find({
      program: student.program,
      admittedYear: student.admittedYear,
      branch: student.branch,
      semester: student.semester,
      isActive: true
    })
    .populate('facultyId', 'name email facultyId designation')
    .populate('subjectId', 'subjectCode subjectName credits');

    res.json({ success: true, subjects: subjectMaps });
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Check if feedback window is active for student
export const checkFeedbackWindow = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const now = new Date();
    const activeWindow = await FeedbackWindow.findOne({
      program: student.program,
      branch: student.branch,
      year: student.currentYear,
      semester: student.semester,
      isPublished: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    });

    if (!activeWindow) {
      return res.json({ 
        success: true, 
        active: false, 
        message: 'No active feedback window' 
      });
    }

    res.json({ 
      success: true, 
      active: true, 
      window: activeWindow 
    });
  } catch (error) {
    console.error('Check feedback window error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get feedback questions
export const getFeedbackQuestions = async (req, res) => {
  try {
    const questions = await FeedbackQuestion.find({ isActive: true }).sort('sno');
    res.json({ success: true, questions });
  } catch (error) {
    console.error('Get feedback questions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Submit feedback for a subject
export const submitFeedback = async (req, res) => {
  try {
    const { subjectMapId, feedbackWindowId, responses } = req.body;

    if (!subjectMapId || !feedbackWindowId || !responses || !Array.isArray(responses)) {
      return res.status(400).json({ message: 'Invalid feedback data' });
    }

    const student = await Student.findById(req.user.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Verify feedback window is active
    const window = await FeedbackWindow.findById(feedbackWindowId);
    if (!window || !window.isPublished) {
      return res.status(400).json({ message: 'Feedback window not active' });
    }

    const now = new Date();
    if (now < window.startDate || now > window.endDate) {
      return res.status(400).json({ message: 'Feedback window not active' });
    }

    // Check if student already submitted feedback for this subject
    const existingFeedback = await Feedback.findOne({
      studentId: req.user.id,
      subjectMapId,
      feedbackWindowId
    });

    if (existingFeedback) {
      return res.status(400).json({ message: 'Feedback already submitted for this subject' });
    }

    // Create feedback
    const feedback = new Feedback({
      studentId: req.user.id,
      rollNo: student.rollNo,
      subjectMapId,
      feedbackWindowId,
      responses
    });

    await feedback.save();

    res.json({ 
      success: true, 
      message: 'Feedback submitted successfully',
      feedback 
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Feedback already submitted for this subject' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// Check if feedback submitted for a subject
export const checkFeedbackStatus = async (req, res) => {
  try {
    const { subjectMapId } = req.params;
    
    // Get active feedback window
    const student = await Student.findById(req.user.id);
    const window = await FeedbackWindow.findOne({
      program: student.program,
      branch: student.branch,
      year: student.currentYear,
      semester: student.semester,
      isPublished: true
    });

    if (!window) {
      return res.json({ success: true, submitted: false, noWindow: true });
    }

    const feedback = await Feedback.findOne({
      studentId: req.user.id,
      subjectMapId,
      feedbackWindowId: window._id
    });

    res.json({ 
      success: true, 
      submitted: !!feedback,
      submissionTime: feedback?.submissionTime 
    });
  } catch (error) {
    console.error('Check feedback status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get my submissions
export const getMySubmissions = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Get all feedback submitted by this student
    const submissions = await Feedback.find({ studentId: req.user.id })
      .populate({
        path: 'feedbackWindowId',
        select: 'year semester startDate endDate program branch'
      })
      .populate({
        path: 'subjectMapId',
        populate: {
          path: 'subjectId facultyId',
          select: 'subjectName subjectCode name'
        }
      })
      .sort({ submissionTime: -1 });

    // Group by feedback window
    const groupedSubmissions = {};
    
    submissions.forEach(submission => {
      const windowId = submission.feedbackWindowId?._id?.toString();
      if (!windowId) return;
      
      if (!groupedSubmissions[windowId]) {
        const window = submission.feedbackWindowId;
        const semesterNumber = (window.year - 1) * 2 + window.semester;
        groupedSubmissions[windowId] = {
          windowId: windowId,
          semester: `Semester ${semesterNumber}`,
          year: window.year,
          semesterNumber: semesterNumber,
          submittedDate: submission.submissionTime,
          subjects: [],
          totalQuestions: 0,
          answered: 0
        };
      }
      
      if (submission.subjectMapId?.subjectId) {
        groupedSubmissions[windowId].subjects.push({
          subjectName: submission.subjectMapId.subjectId.subjectName,
          subjectCode: submission.subjectMapId.subjectId.subjectCode,
          facultyName: submission.subjectMapId.facultyId?.name || 'N/A',
          questionsAnswered: submission.responses?.length || 0
        });
        groupedSubmissions[windowId].totalQuestions += submission.responses?.length || 0;
        groupedSubmissions[windowId].answered += submission.responses?.length || 0;
      }
    });

    const submissionsArray = Object.values(groupedSubmissions).sort((a, b) => 
      new Date(b.submittedDate) - new Date(a.submittedDate)
    );

    res.json({ 
      success: true, 
      submissions: submissionsArray,
      totalSubmissions: submissionsArray.length
    });
  } catch (error) {
    console.error('Get my submissions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all feedback sessions with status (active/completed)
export const getFeedbackSessions = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Calculate active and completed semesters
    const currentCalendarYear = new Date().getFullYear();
    const yearsSinceAdmission = currentCalendarYear - student.admittedYear;
    const programYears = {
      'BTECH': 4, 'BTech': 4, 'B.Tech': 4,
      'MTECH': 2, 'MTech': 2, 'M.Tech': 2,
      'MBA': 2, 'MCA': 2
    };
    const maxYears = programYears[student.program] || 4;
    const currentYear = Math.max(1, Math.min(yearsSinceAdmission, maxYears));
    
    const activeSemesters = [
      (currentYear * 2) - 1,  // Odd semester (e.g., Year 3 -> Sem 5)
      currentYear * 2          // Even semester (e.g., Year 3 -> Sem 6)
    ];
    
    const completedSemesters = [];
    for (let i = 1; i < (currentYear * 2) - 1; i++) {
      completedSemesters.push(i);
    }

    // Get all feedback windows for the student's program and branch
    const allWindows = await FeedbackWindow.find({
      program: student.program,
      branch: student.branch,
      isPublished: true
    }).sort({ year: 1, semester: 1 });

    const now = new Date();
    const sessions = allWindows.map(window => {
      const semesterNumber = (window.year - 1) * 2 + window.semester;
      const isActiveSemester = activeSemesters.includes(semesterNumber);
      const isCompletedSemester = completedSemesters.includes(semesterNumber);
      const isWithinTimeWindow = now >= window.startDate && now <= window.endDate;
      
      let status = 'upcoming';
      if (isCompletedSemester) {
        status = 'completed';
      } else if (isActiveSemester && isWithinTimeWindow) {
        status = 'active';
      } else if (isActiveSemester && now > window.endDate) {
        status = 'completed';
      }
      
      return {
        _id: window._id,
        title: `${window.program} - Year ${window.year} - Semester ${semesterNumber}`,
        year: window.year,
        semester: semesterNumber,
        startDate: window.startDate,
        endDate: window.endDate,
        status,
        isActive: status === 'active',
        isCompleted: status === 'completed'
      };
    });

    res.json({ 
      success: true, 
      sessions,
      studentInfo: {
        currentYear,
        activeSemesters,
        completedSemesters,
        admittedYear: student.admittedYear
      }
    });
  } catch (error) {
    console.error('Get feedback sessions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
