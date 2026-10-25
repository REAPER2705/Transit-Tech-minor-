import mongoose from 'mongoose';

const shiftScheduleSchema = new mongoose.Schema({
  scheduleCode: {
    type: String,
    required: true,
    unique: true,
  },
  shiftCode: {
    type: String,
    enum: ['SHIFT_1', 'SHIFT_2'],
    required: true,
  },
  startTimeLocal: {
    type: String, // HH:mm format
    required: true,
  },
  endTimeLocal: {
    type: String, // HH:mm format
    required: true,
  },
  serviceDate: {
    type: Date,
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
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
    default: 'scheduled',
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

shiftScheduleSchema.index({ shiftCode: 1, serviceDate: 1 });
shiftScheduleSchema.index({ busId: 1, serviceDate: 1 });
shiftScheduleSchema.index({ driverId: 1, serviceDate: 1 });
shiftScheduleSchema.index({ scheduleCode: 1 });

export default mongoose.model('ShiftSchedule', shiftScheduleSchema);
