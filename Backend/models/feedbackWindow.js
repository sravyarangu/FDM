import mongoose from "mongoose"

const feedbackWindowSchema = new mongoose.Schema({
  branch: {type: String, required: true},
  program: {type: String, required: true},
  year: {type: Number, required: true},
  semester: {type: Number, required: true},
  academicYear: String, // e.g., 2024-25
  
  startDate: Date,
  endDate: Date,
  
  isPublished: { type: Boolean, default: false },
  publishedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'HOD' },
  publishedAt: Date
}, {timestamps: true});

export default mongoose.model("FeedbackWindow",feedbackWindowSchema);