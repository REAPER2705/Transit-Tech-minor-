import mongoose from 'mongoose';

const passengerAssignmentSchema = new mongoose.Schema({
  assignmentCode: {
    type: String,
    required: true,
    unique: true,
  },
  passengerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  scheduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShiftSchedule',
    required: true,
  },
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: true,
  },
  busId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: true,
  },
  boardingStopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stop',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'active', 'ended', 'rejected'],
    default: 'pending',
  },
  validFrom: {
    type: Date,
    default: Date.now,
  },
  validTo: {
    type: Date,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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

passengerAssignmentSchema.index({ passengerId: 1, status: 1 });
passengerAssignmentSchema.index({ scheduleId: 1 });
passengerAssignmentSchema.index({ assignmentCode: 1 });

export default mongoose.model('PassengerAssignment', passengerAssignmentSchema);
