import mongoose from "mongoose"

const feedbackSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  rollNo: { type: String, required: true },
  subjectMapId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubjectMap', required: true },
  feedbackWindowId: { type: mongoose.Schema.Types.ObjectId, ref: 'FeedbackWindow', required: true },
  
  responses: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'FeedbackQuestion' },
    criteria: String,
    rating: { type: Number, required: true, min: 1, max: 5 }
  }],
  
  submissionTime: { type: Date, default: Date.now }
}, {timestamps: true});

// Ensure one feedback per student per subject per window
feedbackSchema.index({ studentId: 1, subjectMapId: 1, feedbackWindowId: 1 }, { unique: true });

export default mongoose.model("Feedback",feedbackSchema);
