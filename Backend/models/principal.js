import mongoose from 'mongoose';

const principalSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String
  },
  employeeId: {
    type: String,
    unique: true,
    sparse: true
  },
  role: {
    type: String,
    default: 'principal',
    immutable: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
principalSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Principal = mongoose.model('Principal', principalSchema);

export default Principal;
