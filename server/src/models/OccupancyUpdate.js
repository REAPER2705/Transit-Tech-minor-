import mongoose from 'mongoose';

const occupancyUpdateSchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true,
  },
  busId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: true,
  },
  passengerCount: {
    type: Number,
    required: true,
    min: 0,
  },
  capacitySnapshot: {
    type: Number,
    required: true,
  },
  availableSeats: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['confirmed', 'stale', 'disputed'],
    default: 'confirmed',
  },
  source: {
    type: String,
    enum: ['conductor_manual', 'verified_integration', 'admin_correction'],
    default: 'conductor_manual',
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reason: {
    type: String,
  },
  recordedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

occupancyUpdateSchema.index({ tripId: 1, recordedAt: -1 });
occupancyUpdateSchema.index({ busId: 1 });

export default mongoose.model('OccupancyUpdate', occupancyUpdateSchema);
