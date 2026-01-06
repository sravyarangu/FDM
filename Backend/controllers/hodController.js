import HOD from '../models/hod.js';
import Batch from '../models/batch.js';
import SubjectMap from '../models/subjectMap.js';
import Subject from '../models/subject.js';
import Faculty from '../models/faculty.js';
import FeedbackWindow from '../models/feedbackWindow.js';
import Feedback from '../models/feedback.js';
import Student from '../models/student.js';

// Get HOD profile
export const getHODProfile = async (req, res) => {
  try {
    const hod = await HOD.findById(req.user.id).select('-password');
    
    if (!hod) {
      return res.status(404).json({ message: 'HOD not found' });
    }

    res.json({ success: true, hod });
  } catch (error) {
    console.error('Get HOD profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all batches for HOD's program and branch
export const getBatches = async (req, res) => {
  try {
    const hod = await HOD.findById(req.user.id);
    
    const batches = await Batch.find({
      program: hod.program,
      branch: hod.branch,
      isActive: true
    }).sort({ admittedYear: -1 });

    res.json({ success: true, batches });
  } catch (error) {
    console.error('Get batches error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get students for a specific batch
export const getBatchStudents = async (req, res) => {
  try {
    const hod = await HOD.findById(req.user.id);
    const { admittedYear } = req.params;

    const students = await Student.find({
      program: hod.program,
      branch: hod.branch,
      admittedYear: parseInt(admittedYear),
      isActive: true
    })
    .select('rollNo name email currentYear semester')
    .sort('rollNo');

    res.json({ success: true, students });
  } catch (error) {
    console.error('Get batch students error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all subjects for HOD's department
export const getSubjects = async (req, res) => {
  try {
    const hod = await HOD.findById(req.user.id);
    
    const subjects = await Subject.find({
      program: hod.program,
      branch: hod.branch,
      isActive: true
    }).sort({ year: 1, semester: 1 });

    res.json({ success: true, subjects });
  } catch (error) {
    console.error('Get subjects error:', error);
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

// View subject mappings for HOD's department (read-only)
export const getSubjectMapping = async (req, res) => {
  try {
    const hod = await HOD.findById(req.user.id);
    const { admittedYear, semester } = req.query;

    const filter = {
      program: hod.program,
      branch: hod.branch,
      isActive: true
    };

    if (admittedYear) filter.admittedYear = parseInt(admittedYear);
    if (semester) filter.semester = parseInt(semester);

    const mappings = await SubjectMap.find(filter)
      .populate('facultyId', 'facultyId name email designation')
      .populate('subjectId', 'subjectCode subjectName credits')
      .sort({ admittedYear: -1, semester: 1 });

    res.json({ success: true, mappings });
  } catch (error) {
    console.error('Get subject mapping error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get feedback windows
export const getFeedbackWindows = async (req, res) => {
  try {
    const hod = await HOD.findById(req.user.id);

    const windows = await FeedbackWindow.find({
      program: hod.program,
      branch: hod.branch
    })
    .populate('publishedBy', 'name')
    .sort({ createdAt: -1 });

    res.json({ success: true, windows });
  } catch (error) {
    console.error('Get feedback windows error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create/Publish feedback window
export const publishFeedbackWindow = async (req, res) => {
  try {
    const hod = await HOD.findById(req.user.id);
    const { year, semester, startDate, endDate, academicYear } = req.body;

    if (!year || !semester || !startDate || !endDate) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if window already exists for this semester
    let window = await FeedbackWindow.findOne({
      program: hod.program,
      branch: hod.branch,
      year,
      semester,
      isPublished: false
    });

    if (window) {
      // Update existing unpublished window
      window.startDate = new Date(startDate);
      window.endDate = new Date(endDate);
      window.academicYear = academicYear;
      window.isPublished = true;
      window.publishedBy = req.user.id;
      window.publishedAt = new Date();
      await window.save();
    } else {
      // Create new window
      window = new FeedbackWindow({
        program: hod.program,
        branch: hod.branch,
        year,
        semester,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        academicYear,
        isPublished: true,
        publishedBy: req.user.id,
        publishedAt: new Date()
      });
      await window.save();
    }

    res.json({ 
      success: true, 
      message: 'Feedback window published successfully',
      window 
    });
  } catch (error) {
    console.error('Publish feedback window error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Close feedback window
export const closeFeedbackWindow = async (req, res) => {
  try {
    const window = await FeedbackWindow.findById(req.params.id);

    if (!window) {
      return res.status(404).json({ message: 'Feedback window not found' });
    }

    window.endDate = new Date(); // Set end date to now
    await window.save();

    res.json({ 
      success: true, 
      message: 'Feedback window closed successfully',
      window 
    });
  } catch (error) {
    console.error('Close feedback window error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get feedback analytics for a semester
export const getAnalytics = async (req, res) => {
  try {
    const hod = await HOD.findById(req.user.id);
    const { year, semester } = req.query;

    if (!year || !semester) {
      return res.status(400).json({ message: 'Year and semester required' });
    }

    // Check if feedback window was published
    const window = await FeedbackWindow.findOne({
      program: hod.program,
      branch: hod.branch,
      year: parseInt(year),
      semester: parseInt(semester),
      isPublished: true
    });

    if (!window) {
      return res.status(404).json({ message: 'No published feedback window found' });
    }

    // Get all subject mappings for this semester
    const subjectMaps = await SubjectMap.find({
      program: hod.program,
      branch: hod.branch,
      semester: parseInt(semester),
      isActive: true
    })
    .populate('facultyId', 'facultyId name email designation')
    .populate('subjectId', 'subjectCode subjectName');

    // Calculate analytics for each subject-faculty combination
    const analytics = await Promise.all(subjectMaps.map(async (map) => {
      const feedbacks = await Feedback.find({
        subjectMapId: map._id,
        feedbackWindowId: window._id
      });

      if (feedbacks.length === 0) {
        return {
          subjectMap: map,
          faculty: map.facultyId,
          subject: map.subjectId,
          totalResponses: 0,
          averageRatings: [],
          overallAverage: 0
        };
      }

      // Calculate ratings using percentage-based method
      const totalStudents = feedbacks.length;
      const maxRating = 5; // Maximum rating scale
      
      const questionRatings = {};
      let sumOfAllRatings = 0;
      let totalQuestions = 0;

      // Collect all ratings
      feedbacks.forEach(feedback => {
        feedback.responses.forEach(response => {
          const qId = response.questionId?.toString() || response.criteria;
          if (!questionRatings[qId]) {
            questionRatings[qId] = {
              criteria: response.criteria,
              totalRating: 0,
              count: 0
            };
            totalQuestions++;
          }
          questionRatings[qId].totalRating += response.rating;
          questionRatings[qId].count += 1;
          sumOfAllRatings += response.rating;
        });
      });

      // Calculate question-wise ratings
      const averageRatings = Object.entries(questionRatings).map(([qId, data]) => {
        // Question Rating = (Sum of ratings for question) / (Students × Max Rating)
        const questionRating = (data.totalRating / (totalStudents * maxRating)).toFixed(4);
        const questionPercentage = (parseFloat(questionRating) * 100).toFixed(2);
        
        return {
          criteria: data.criteria,
          rating: parseFloat(questionRating),
          percentage: parseFloat(questionPercentage),
          outOf: maxRating,
          totalResponses: totalStudents
        };
      });

      // Faculty Overall Rating = (Sum of ALL ratings) / (Students × Questions × Max Rating)
      const facultyRating = (sumOfAllRatings / (totalStudents * totalQuestions * maxRating)).toFixed(4);
      const facultyPercentage = (parseFloat(facultyRating) * 100).toFixed(2);

      return {
        subjectMap: map,
        faculty: map.facultyId,
        subject: map.subjectId,
        totalResponses: totalStudents,
        totalQuestions: totalQuestions,
        averageRatings,
        overallRating: parseFloat(facultyRating),
        overallPercentage: parseFloat(facultyPercentage),
        maxRating: maxRating
      };
    }));

    res.json({ success: true, analytics });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
