import mongoose from "mongoose"

const feedbackQuestionSchema = new mongoose.Schema({
  sno: {type: Number, required: true, unique: true},
  criteria: {type: String, required: true},
  category: String, // e.g., Teaching, Course Content, Lab Facilities
  isActive: {type: Boolean, default: true}
}, {timestamps: true});

export default mongoose.model("FeedbackQuestion", feedbackQuestionSchema);
