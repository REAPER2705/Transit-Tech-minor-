import mongoose from 'mongoose';

const importJobSchema = new mongoose.Schema({
  importCode: {
    type: String,
    required: true,
    unique: true,
  },
  importType: {
    type: String,
    enum: [
      'buses',
      'routes_stops',
      'schedules',
      'passenger_assignments',
      'staff_assignments',
    ],
    required: true,
  },
  shiftCode: {
    type: String,
    enum: ['SHIFT_1', 'SHIFT_2'],
  },
  fileName: {
    type: String,
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['uploaded', 'validated', 'committed', 'failed', 'cancelled'],
    default: 'uploaded',
  },
  rowCount: {
    type: Number,
    default: 0,
  },
  validCount: {
    type: Number,
    default: 0,
  },
  errorCount: {
    type: Number,
    default: 0,
  },
  errors: {
    type: [
      {
        rowNumber: Number,
        fields: [String],
        message: String,
      },
    ],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  committedAt: {
    type: Date,
  },
});

importJobSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('ImportJob', importJobSchema);
