import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  subjectCode: {type: String, required: true, unique: true},
  subjectName: {type: String, required: true},
  program: {type: String, required: true},
  branch: String,
  regulation: String,
  year: {type: Number, required: true},
  semester: {type: Number, required: true},
  credits: Number,
  isActive: {type: Boolean, default: true}
}, {timestamps: true});

export default mongoose.model("Subject", subjectSchema);
