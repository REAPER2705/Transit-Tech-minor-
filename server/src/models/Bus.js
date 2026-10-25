import mongoose from 'mongoose';

const busSchema = new mongoose.Schema({
  busCode: {
    type: String,
    required: true,
    unique: true,
  },
  registrationNumber: {
    type: String,
    sparse: true,
  },
  capacity: {
    type: Number,
    required: true,
    min: 1,
  },
  capacityType: {
    type: String,
    enum: ['seated_only', 'total_passengers'],
    default: 'total_passengers',
  },
  status: {
    type: String,
    enum: ['active', 'maintenance', 'inactive'],
    default: 'active',
  },
  sourceUrl: {
    type: String,
    sparse: true,
  },
  sourceDate: {
    type: Date,
    sparse: true,
  },
  verificationStatus: {
    type: String,
    enum: ['unverified', 'verified', 'archived'],
    default: 'unverified',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

busSchema.index({ busCode: 1 });

export default mongoose.model('Bus', busSchema);
