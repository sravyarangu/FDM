import mongoose from "mongoose";

const subjectMapSchema = new mongoose.Schema({
  program: {type: String, required: true},
  admittedYear: {type: Number, required: true},
  branch: {type: String, required: true},
  year: {type: Number, required: true},
  semester: {type: Number, required: true},
  
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty", required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  
  academicYear: String,
  isActive: {type: Boolean, default: true}
}, {timestamps: true});

// Ensure unique mapping per subject per semester per batch
subjectMapSchema.index({ program: 1, admittedYear: 1, branch: 1, semester: 1, subjectId: 1 }, { unique: true });

export default mongoose.model("SubjectMap", subjectMapSchema);
