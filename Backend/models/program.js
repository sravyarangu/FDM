import mongoose from "mongoose"

const programSchema = new mongoose.Schema({
    name : {type: String, required: true, unique: true}, // BTech, MTech, MCA, MBA
    code : {type: String, required: true, unique: true},
    duration : {type: Number, required: true}, // in years
    branches: [{type: String}], // CSE, ECE, MECH, etc.
    isActive: {type: Boolean, default: true}
}, {timestamps: true});

export default mongoose.model("Program",programSchema);