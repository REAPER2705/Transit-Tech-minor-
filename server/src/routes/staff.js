import express from 'express';
import Trip from '../models/Trip.js';
import ShiftSchedule from '../models/ShiftSchedule.js';
import OccupancyUpdate from '../models/OccupancyUpdate.js';
import BusLocation from '../models/BusLocation.js';
import Bus from '../models/Bus.js';
import AuditLog from '../models/AuditLog.js';
import { authorizeRole } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get staff assignments
router.get('/me/assignments', authorizeRole('driver', 'conductor'), async (req, res) => {
  try {
    const assignments = await ShiftSchedule.find({
      $or: [{ driverId: req.user.userId }, { conductorId: req.user.userId }],
    })
      .populate('routeId')
      .populate('busId')
      .sort({ serviceDate: 1 });

    res.json({ data: assignments });
  } catch (error) {
    console.error('Error fetching staff assignments:', error);
    res.status(500).json({
      error: { code: 'FETCH_ERROR', message: 'Failed to fetch assignments' },
    });
  }
});

// Start trip
router.post('/trips/:tripId/start', authorizeRole('driver'), async (req, res) => {
  try {
    const { tripId } = req.params;
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({
        error: { code: 'TRIP_NOT_FOUND', message: 'Trip not found' },
      });
    }

    if (trip.driverId.toString() !== req.user.userId) {
      return res.status(403).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'You are not assigned to this trip',
        },
      });
    }

    if (trip.status !== 'scheduled') {
      return res.status(400).json({
        error: {
          code: 'INVALID_STATUS',
          message: 'Trip cannot be started from current status',
        },
      });
    }

    trip.status = 'active';
    trip.startedAt = new Date();
    await trip.save();

    // Log audit
    await AuditLog.create({
      actorId: req.user.userId,
      action: 'trip_started',
      entityType: 'Trip',
      entityId: trip._id,
      after: { status: 'active', startedAt: trip.startedAt },
    });

    res.json({ data: trip });
  } catch (error) {
    console.error('Error starting trip:', error);
    res.status(500).json({
      error: { code: 'ERROR', message: 'Failed to start trip' },
    });
  }
});

// End trip
router.post('/trips/:tripId/end', authorizeRole('driver'), async (req, res) => {
  try {
    const { tripId } = req.params;
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({
        error: { code: 'TRIP_NOT_FOUND', message: 'Trip not found' },
      });
    }

    if (trip.driverId.toString() !== req.user.userId) {
      return res.status(403).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'You are not assigned to this trip',
        },
      });
    }

    if (trip.status !== 'active') {
      return res.status(400).json({
        error: {
          code: 'INVALID_STATUS',
          message: 'Trip cannot be ended from current status',
        },
      });
    }

    trip.status = 'completed';
    trip.endedAt = new Date();
    trip.locationStatus = 'offline';
    await trip.save();

    await AuditLog.create({
      actorId: req.user.userId,
      action: 'trip_ended',
      entityType: 'Trip',
      entityId: trip._id,
      after: { status: 'completed', endedAt: trip.endedAt },
    });

    res.json({ data: trip });
  } catch (error) {
    console.error('Error ending trip:', error);
    res.status(500).json({
      error: { code: 'ERROR', message: 'Failed to end trip' },
    });
  }
});

// Post GPS location
router.post('/trips/:tripId/location', authorizeRole('driver'), async (req, res) => {
  try {
    const { tripId } = req.params;
    const { latitude, longitude, accuracy } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        error: {
          code: 'MISSING_COORDINATES',
          message: 'Latitude and longitude are required',
        },
      });
    }

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({
        error: { code: 'TRIP_NOT_FOUND', message: 'Trip not found' },
      });
    }

    if (trip.driverId.toString() !== req.user.userId) {
      return res.status(403).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'You are not assigned to this trip',
        },
      });
    }

    if (trip.status !== 'active') {
      return res.status(400).json({
        error: {
          code: 'TRIP_NOT_ACTIVE',
          message: 'Trip is not active',
        },
      });
    }

    // Validate coordinates
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return res.status(400).json({
        error: {
          code: 'INVALID_COORDINATES',
          message: 'Invalid coordinates',
        },
      });
    }

    const location = new BusLocation({
      tripId,
      busId: trip.busId,
      coordinates: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
      accuracyMeters: accuracy,
      recordedAt: new Date(),
    });

    await location.save();

    trip.lastLocationAt = new Date();
    trip.locationStatus = 'live';
    await trip.save();

    // Broadcast via Socket.IO
    const io = req.app.locals.io;
    io.to(`trip:${tripId}`).emit('trip:location.updated', {
      schemaVersion: 1,
      eventId: uuidv4(),
      occurredAt: new Date().toISOString(),
      entityId: tripId,
      data: {
        coordinates: [longitude, latitude],
        accuracy,
        recordedAt: location.recordedAt,
      },
    });

    res.json({ data: location });
  } catch (error) {
    console.error('Error posting location:', error);
    res.status(500).json({
      error: { code: 'ERROR', message: 'Failed to post location' },
    });
  }
});

// Get occupancy
router.get('/trips/:tripId/occupancy', authorizeRole('driver', 'conductor'), async (req, res) => {
  try {
    const { tripId } = req.params;
    const occupancy = await OccupancyUpdate.findOne({
      tripId,
    })
      .sort({ recordedAt: -1 })
      .limit(1);

    res.json({ data: occupancy });
  } catch (error) {
    console.error('Error fetching occupancy:', error);
    res.status(500).json({
      error: { code: 'FETCH_ERROR', message: 'Failed to fetch occupancy' },
    });
  }
});

// Update occupancy (conductor)
router.post('/trips/:tripId/occupancy', authorizeRole('conductor'), async (req, res) => {
  try {
    const { tripId } = req.params;
    const { passengerCount, reason } = req.body;

    if (passengerCount === undefined) {
      return res.status(400).json({
        error: {
          code: 'MISSING_COUNT',
          message: 'Passenger count is required',
        },
      });
    }

    const trip = await Trip.findById(tripId).populate('busId');
    if (!trip) {
      return res.status(404).json({
        error: { code: 'TRIP_NOT_FOUND', message: 'Trip not found' },
      });
    }

    if (trip.conductorId.toString() !== req.user.userId) {
      return res.status(403).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'You are not assigned to this trip',
        },
      });
    }

    // Validate count
    if (passengerCount < 0 || passengerCount > trip.busId.capacity) {
      return res.status(400).json({
        error: {
          code: 'INVALID_COUNT',
          message: `Passenger count must be between 0 and ${trip.busId.capacity}`,
        },
      });
    }

    const availableSeats = Math.max(0, trip.busId.capacity - passengerCount);

    const occupancy = new OccupancyUpdate({
      tripId,
      busId: trip.busId._id,
      passengerCount,
      capacitySnapshot: trip.busId.capacity,
      availableSeats,
      status: 'confirmed',
      source: 'conductor_manual',
      updatedBy: req.user.userId,
      reason,
    });

    await occupancy.save();

    await AuditLog.create({
      actorId: req.user.userId,
      action: 'occupancy_updated',
      entityType: 'OccupancyUpdate',
      entityId: occupancy._id,
      after: { passengerCount, availableSeats },
    });

    // Broadcast via Socket.IO
    const io = req.app.locals.io;
    io.to(`trip:${tripId}`).emit('trip:occupancy.updated', {
      schemaVersion: 1,
      eventId: uuidv4(),
      occurredAt: new Date().toISOString(),
      entityId: tripId,
      data: {
        passengerCount,
        availableSeats,
        isFull: availableSeats === 0,
      },
    });

    res.json({ data: occupancy });
  } catch (error) {
    console.error('Error updating occupancy:', error);
    res.status(500).json({
      error: { code: 'ERROR', message: 'Failed to update occupancy' },
    });
  }
});

// ========== INCIDENT REPORTING (NEW) ==========

// Submit incident/service report
router.post('/incidents', authorizeRole('driver', 'conductor'), async (req, res) => {
  try {
    const { tripId, routeId, stopId, category, description, severity } = req.body;

    if (!category || !description) {
      return res.status(400).json({
        error: {
          code: 'MISSING_FIELDS',
          message: 'Category and description are required',
        },
      });
    }

    // Validate category
    const validCategories = ['delay', 'breakdown', 'accident', 'passenger_incident', 'weather', 'traffic', 'other'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        error: {
          code: 'INVALID_CATEGORY',
          message: `Category must be one of: ${validCategories.join(', ')}`,
        },
      });
    }

    const incident = await new Complaint({
      complaintCode: `INC-${uuidv4()}`,
      submittedBy: req.user.userId,
      category,
      description,
      relatedTripId: tripId,
      status: 'submitted',
      customFields: {
        routeId,
        stopId,
        severity: severity || 'medium',
        reportType: 'staff_incident',
      },
    }).save();

    // Create audit log
    await AuditLog.create({
      actorId: req.user.userId,
      action: 'incident_reported',
      entityType: 'Complaint',
      entityId: incident._id,
      after: {
        category,
        description,
        severity,
        reportType: 'staff_incident',
      },
    });

    res.status(201).json({ data: incident });
  } catch (error) {
    console.error('Error submitting incident:', error);
    res.status(500).json({
      error: { code: 'ERROR', message: 'Failed to submit incident report' },
    });
  }
});

// Get incident reports for staff
router.get('/incidents', authorizeRole('driver', 'conductor'), async (req, res) => {
  try {
    const incidents = await Complaint.find({
      submittedBy: req.user.userId,
      'customFields.reportType': 'staff_incident',
    })
      .sort({ createdAt: -1 });

    res.json({ data: incidents });
  } catch (error) {
    console.error('Error fetching incidents:', error);
    res.status(500).json({
      error: { code: 'ERROR', message: 'Failed to fetch incidents' },
    });
  }
});

// Get all incidents for a trip
router.get('/trips/:tripId/incidents', authorizeRole('driver', 'conductor'), async (req, res) => {
  try {
    const { tripId } = req.params;
    
    const incidents = await Complaint.find({
      relatedTripId: tripId,
    }).sort({ createdAt: -1 });

    res.json({ data: incidents });
  } catch (error) {
    console.error('Error fetching trip incidents:', error);
    res.status(500).json({
      error: { code: 'ERROR', message: 'Failed to fetch incidents' },
    });
  }
});

export default router;
