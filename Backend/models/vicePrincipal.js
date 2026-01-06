import mongoose from 'mongoose';

const vicePrincipalSchema = new mongoose.Schema({
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
    default: 'vice_principal',
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
vicePrincipalSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const VicePrincipal = mongoose.model('VicePrincipal', vicePrincipalSchema);

export default VicePrincipal;
