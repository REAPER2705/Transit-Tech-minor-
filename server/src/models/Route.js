import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema({
  routeCode: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  direction: {
    type: String,
    default: 'bidirectional',
  },
  stopIds: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Stop',
    required: true,
  },
  geometry: {
    type: {
      type: String,
      enum: ['LineString'],
      default: 'LineString',
    },
    coordinates: {
      type: [[Number]], // array of [longitude, latitude]
    },
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
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

routeSchema.index({ routeCode: 1 });

export default mongoose.model('Route', routeSchema);
