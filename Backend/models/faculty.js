import mongoose from "mongoose"

const facultySchema = new mongoose.Schema({
    facultyId: {type: String, unique: true, required: true},
    name : {type: String, required: true},
    email : {type: String, required: true, unique: true},
    department: String,
    designation: String,
    isActive: {type: Boolean, default: true}
}, {timestamps: true});

export default mongoose.model("Faculty",facultySchema);