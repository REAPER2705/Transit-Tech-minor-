import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  tripCode: {
    type: String,
    required: true,
    unique: true,
  },
  scheduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShiftSchedule',
    required: true,
  },
  busId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: true,
  },
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: true,
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  conductorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['scheduled', 'active', 'completed', 'cancelled'],
    default: 'scheduled',
  },
  startedAt: {
    type: Date,
  },
  endedAt: {
    type: Date,
  },
  lastLocationAt: {
    type: Date,
  },
  locationStatus: {
    type: String,
    enum: ['unknown', 'live', 'stale', 'offline'],
    default: 'unknown',
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

tripSchema.index({ status: 1, routeId: 1 });
tripSchema.index({ busId: 1, status: 1 });
tripSchema.index({ driverId: 1 });
tripSchema.index({ tripCode: 1 });

export default mongoose.model('Trip', tripSchema);
