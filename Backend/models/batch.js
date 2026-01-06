import mongoose from "mongoose"

const batchSchema = new mongoose.Schema({
    program : {type: String, required: true},
    admittedYear : {type: Number, required: true},
    branch : {type: String, required: true},
    regulation: String,
    studentsCount : {type: Number, default: 0},
    isActive: {type: Boolean, default: true}
}, {timestamps: true});

export default mongoose.model("Batch",batchSchema);