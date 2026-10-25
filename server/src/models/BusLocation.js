import mongoose from 'mongoose';

const busLocationSchema = new mongoose.Schema({
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
  coordinates: {
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
  accuracyMeters: {
    type: Number,
  },
  recordedAt: {
    type: Date,
    required: true,
  },
  receivedAt: {
    type: Date,
    default: Date.now,
  },
});

busLocationSchema.index({ tripId: 1, recordedAt: -1 });
busLocationSchema.index({ coordinates: '2dsphere' });

export default mongoose.model('BusLocation', busLocationSchema);
