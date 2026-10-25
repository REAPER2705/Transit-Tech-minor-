import mongoose from 'mongoose';

const stopSchema = new mongoose.Schema({
  stopCode: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  coordinatesVerified: {
    type: Boolean,
    default: false,
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

stopSchema.index({ location: '2dsphere' });
stopSchema.index({ stopCode: 1 });

export default mongoose.model('Stop', stopSchema);
