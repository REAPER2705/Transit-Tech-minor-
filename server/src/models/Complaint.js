import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  complaintCode: {
    type: String,
    required: true,
    unique: true,
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'safety',
      'cleanliness',
      'driver_behavior',
      'schedule_issue',
      'vehicle_condition',
      'other',
    ],
  },
  description: {
    type: String,
    required: true,
  },
  relatedTripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
  },
  status: {
    type: String,
    enum: ['submitted', 'in_progress', 'resolved', 'rejected'],
    default: 'submitted',
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  adminResponse: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  resolvedAt: {
    type: Date,
  },
});

complaintSchema.index({ submittedBy: 1, createdAt: -1 });
complaintSchema.index({ status: 1 });

export default mongoose.model('Complaint', complaintSchema);
