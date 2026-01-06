import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  role: {type: String, default: 'admin'},
  isActive: {type: Boolean, default: true}
}, {timestamps: true});

export default mongoose.model("Admin", adminSchema);
