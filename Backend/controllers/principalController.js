import Principal from '../models/principal.js';
import VicePrincipal from '../models/vicePrincipal.js';
import FeedbackWindow from '../models/feedbackWindow.js';
import Feedback from '../models/feedback.js';
import SubjectMap from '../models/subjectMap.js';
import Student from '../models/student.js';
import Faculty from '../models/faculty.js';
import Subject from '../models/subject.js';
import Program from '../models/program.js';
import Batch from '../models/batch.js';

// ============ PRINCIPAL PROFILE ============

export const getPrincipalProfile = async (req, res) => {
  try {
    const principal = await Principal.findById(req.user.id).select('-password');
    
    if (!principal) {
      return res.status(404).json({ message: 'Principal not found' });
    }

    res.json({ success: true, principal });
  } catch (error) {
    console.error('Get principal profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ============ VICE PRINCIPAL PROFILE ============

export const getVicePrincipalProfile = async (req, res) => {
  try {
    const vicePrincipal = await VicePrincipal.findById(req.user.id).select('-password');
    
    if (!vicePrincipal) {
      return res.status(404).json({ message: 'Vice Principal not found' });
    }

    res.json({ success: true, vicePrincipal });
  } catch (error) {
    console.error('Get vice principal profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ============ FEEDBACK WINDOWS - ALL DEPARTMENTS ============

// Get all feedback windows across all departments
export const getAllFeedbackWindows = async (req, res) => {
  try {
    const windows = await FeedbackWindow.find()
      .populate('publishedBy', 'name')
      .populate('program', 'name code')
      .sort({ createdAt: -1 });

    res.json({ success: true, windows });
  } catch (error) {
    console.error('Get all feedback windows error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ============ ANALYTICS - ALL DEPARTMENTS ============

// Get analytics for all departments
export const getAllDepartmentsAnalytics = async (req, res) => {
  try {
    const { program, branch, year, semester, academicYear } = req.query;

    const filter = {};
    if (program) filter.program = program;
    if (branch) filter.branch = branch;
    if (year) filter.year = parseInt(year);
    if (semester) filter.semester = parseInt(semester);

    // Get feedback windows based on filters
    const windows = await FeedbackWindow.find({
      ...filter,
      isPublished: true
    }).populate('program', 'name code');

    if (!windows || windows.length === 0) {
      return res.json({ 
        success: true, 
        message: 'No published feedback windows found',
        analytics: []
      });
    }

    // Get analytics for each window
    const analyticsData = [];

    for (const window of windows) {
      // Get all subject mappings for this window's semester
      const subjectMaps = await SubjectMap.find({
        program: window.program._id,
        branch: window.branch,
        semester: window.semester,
        isActive: true
      })
      .populate('facultyId', 'name email facultyId')
      .populate('subjectId', 'subjectCode subjectName');

      // Get feedback for each subject mapping
      const subjectAnalytics = [];

      for (const subjectMap of subjectMaps) {
        const feedbacks = await Feedback.find({
          subjectMapId: subjectMap._id,
          feedbackWindowId: window._id
        });

        if (feedbacks.length > 0) {
          // Calculate ratings using percentage-based method
          const totalStudents = feedbacks.length;
          const totalQuestions = feedbacks[0].responses.length;
          const maxRating = 5; // Maximum rating scale
          
          const questionAverages = [];
          let sumOfAllRatings = 0;

          // Calculate question-wise ratings
          for (let i = 0; i < totalQuestions; i++) {
            let questionSum = 0;
            feedbacks.forEach(feedback => {
              const rating = feedback.responses[i].rating;
              questionSum += rating;
              sumOfAllRatings += rating;
            });
            
            // Question Rating = (Sum of ratings for question) / (Students × Max Rating)
            const questionRating = (questionSum / (totalStudents * maxRating)).toFixed(4);
            const questionPercentage = (parseFloat(questionRating) * 100).toFixed(2);
            
            questionAverages.push({
              questionNo: i + 1,
              rating: parseFloat(questionRating),
              percentage: parseFloat(questionPercentage),
              outOf: maxRating,
              totalResponses: totalStudents
            });
          }

          // Faculty Overall Rating = (Sum of ALL ratings) / (Students × Questions × Max Rating)
          const facultyRating = (sumOfAllRatings / (totalStudents * totalQuestions * maxRating)).toFixed(4);
          const facultyPercentage = (parseFloat(facultyRating) * 100).toFixed(2);

          subjectAnalytics.push({
            subject: subjectMap.subjectId,
            faculty: subjectMap.facultyId,
            totalFeedbacks: totalStudents,
            totalQuestions: totalQuestions,
            questionAverages,
            overallRating: parseFloat(facultyRating),
            overallPercentage: parseFloat(facultyPercentage),
            maxRating: maxRating
          });
        }
      }

      analyticsData.push({
        window: {
          id: window._id,
          program: window.program,
          branch: window.branch,
          year: window.year,
          semester: window.semester,
          academicYear: window.academicYear,
          startDate: window.startDate,
          endDate: window.endDate
        },
        subjectAnalytics
      });
    }

    res.json({ success: true, analytics: analyticsData });
  } catch (error) {
    console.error('Get all departments analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all programs
export const getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.find({ isActive: true }).sort('name');
    res.json({ success: true, programs });
  } catch (error) {
    console.error('Get programs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all batches
export const getAllBatches = async (req, res) => {
  try {
    const { program, branch } = req.query;
    
    const filter = { isActive: true };
    if (program) filter.program = program;
    if (branch) filter.branch = branch;

    const batches = await Batch.find(filter)
      .populate('program', 'name code')
      .sort({ admittedYear: -1 });

    res.json({ success: true, batches });
  } catch (error) {
    console.error('Get batches error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all students with filters
export const getAllStudents = async (req, res) => {
  try {
    const { program, branch, year, semester } = req.query;
    
    const filter = { isActive: true };
    if (program) filter.program = program;
    if (branch) filter.branch = branch;
    if (year) filter.currentYear = parseInt(year);
    if (semester) filter.semester = parseInt(semester);

    const students = await Student.find(filter)
      .select('rollNo name email branch program currentYear semester')
      .populate('program', 'name code')
      .sort('rollNo');

    res.json({ success: true, students });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all faculty
export const getAllFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find({ isActive: true })
      .select('facultyId name email designation department')
      .sort('name');

    res.json({ success: true, faculty });
  } catch (error) {
    console.error('Get faculty error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all subjects with filters
export const getAllSubjects = async (req, res) => {
  try {
    const { program, branch, year, semester } = req.query;
    
    const filter = { isActive: true };
    if (program) filter.program = program;
    if (branch) filter.branch = branch;
    if (year) filter.year = parseInt(year);
    if (semester) filter.semester = parseInt(semester);

    const subjects = await Subject.find(filter)
      .populate('program', 'name code')
      .sort({ year: 1, semester: 1 });

    res.json({ success: true, subjects });
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get detailed feedback for a specific subject
export const getSubjectFeedbackDetails = async (req, res) => {
  try {
    const { subjectMapId, feedbackWindowId } = req.params;

    const feedbacks = await Feedback.find({
      subjectMapId,
      feedbackWindowId
    }).populate('studentId', 'rollNo name');

    const subjectMap = await SubjectMap.findById(subjectMapId)
      .populate('facultyId', 'name email facultyId')
      .populate('subjectId', 'subjectCode subjectName');

    const window = await FeedbackWindow.findById(feedbackWindowId)
      .populate('program', 'name code');

    if (!feedbacks || feedbacks.length === 0) {
      return res.json({ 
        success: true, 
        message: 'No feedback submissions found',
        feedbacks: [],
        subjectMap,
        window
      });
    }

    res.json({ 
      success: true, 
      feedbacks,
      subjectMap,
      window,
      totalSubmissions: feedbacks.length
    });
  } catch (error) {
    console.error('Get subject feedback details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get overall institution statistics
export const getInstitutionStatistics = async (req, res) => {
  try {
    const totalPrograms = await Program.countDocuments({ isActive: true });
    const totalStudents = await Student.countDocuments({ isActive: true });
    const totalFaculty = await Faculty.countDocuments({ isActive: true });
    const totalFeedbackWindows = await FeedbackWindow.countDocuments({ isPublished: true });
    const totalFeedbacks = await Feedback.countDocuments();

    // Active feedback windows
    const now = new Date();
    const activeFeedbackWindows = await FeedbackWindow.countDocuments({
      isPublished: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    });

    // Program-wise student distribution
    const studentsByProgram = await Student.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$program', count: { $sum: 1 } } },
      { $lookup: { from: 'programs', localField: '_id', foreignField: '_id', as: 'program' } },
      { $unwind: '$program' },
      { $project: { program: '$program.name', count: 1 } }
    ]);

    res.json({ 
      success: true, 
      statistics: {
        totalPrograms,
        totalStudents,
        totalFaculty,
        totalFeedbackWindows,
        activeFeedbackWindows,
        totalFeedbacks,
        studentsByProgram
      }
    });
  } catch (error) {
    console.error('Get institution statistics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
