import express from 'express';
import PassengerAssignment from '../models/PassengerAssignment.js';
import Trip from '../models/Trip.js';
import OccupancyUpdate from '../models/OccupancyUpdate.js';
import Complaint from '../models/Complaint.js';
import Notification from '../models/Notification.js';
import Bus from '../models/Bus.js';
import Route from '../models/Route.js';
import Stop from '../models/Stop.js';
import ShiftSchedule from '../models/ShiftSchedule.js';
import { authorizeRole } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get passenger's assignments
router.get('/me/assignments', authorizeRole('passenger'), async (req, res) => {
  try {
    const assignments = await PassengerAssignment.find({
      passengerId: req.user.userId,
      status: { $in: ['approved', 'active'] },
    })
      .populate('scheduleId')
      .populate('routeId')
      .populate('busId')
      .populate('boardingStopId');

    res.json({ data: assignments });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({
      error: { code: 'FETCH_ERROR', message: 'Failed to fetch assignments' },
    });
  }
});

// Get assigned bus details
router.get('/me/bus', authorizeRole('passenger'), async (req, res) => {
  try {
    const assignment = await PassengerAssignment.findOne({
      passengerId: req.user.userId,
      status: { $in: ['approved', 'active'] },
    }).populate('busId');

    if (!assignment) {
      return res.status(404).json({
        error: { code: 'NO_ASSIGNMENT', message: 'No active assignment found' },
      });
    }

    const trip = await Trip.findOne({
      scheduleId: assignment.scheduleId,
      status: 'active',
    }).populate('busId');

    res.json({
      data: {
        assignment,
        trip,
      },
    });
  } catch (error) {
    console.error('Error fetching bus:', error);
    res.status(500).json({
      error: { code: 'FETCH_ERROR', message: 'Failed to fetch bus details' },
    });
  }
});

// Get available buses on route
router.get(
  '/routes/:routeId/available-buses',
  authorizeRole('passenger'),
  async (req, res) => {
    try {
      const { routeId } = req.params;

      const trips = await Trip.find({
        routeId,
        status: 'active',
      }).populate('busId');

      const busesWithOccupancy = await Promise.all(
        trips.map(async trip => {
          const occupancy = await OccupancyUpdate.findOne({
            tripId: trip._id,
          })
            .sort({ recordedAt: -1 })
            .limit(1);

          return {
            trip,
            bus: trip.busId,
            occupancy,
          };
        })
      );

      res.json({ data: busesWithOccupancy });
    } catch (error) {
      console.error('Error fetching available buses:', error);
      res.status(500).json({
        error: {
          code: 'FETCH_ERROR',
          message: 'Failed to fetch available buses',
        },
      });
    }
  }
);

// Submit complaint
router.post('/complaints', authorizeRole('passenger'), async (req, res) => {
  try {
    const { category, description, relatedTripId } = req.body;

    if (!category || !description) {
      return res.status(400).json({
        error: {
          code: 'MISSING_FIELDS',
          message: 'Category and description are required',
        },
      });
    }

    const complaint = new Complaint({
      complaintCode: `COMP-${uuidv4()}`,
      submittedBy: req.user.userId,
      category,
      description,
      relatedTripId,
      status: 'submitted',
    });

    await complaint.save();

    res.status(201).json({ data: complaint });
  } catch (error) {
    console.error('Error submitting complaint:', error);
    res.status(500).json({
      error: {
        code: 'COMPLAINT_ERROR',
        message: 'Failed to submit complaint',
      },
    });
  }
});

// Get passenger complaints
router.get('/complaints', authorizeRole('passenger'), async (req, res) => {
  try {
    const complaints = await Complaint.find({
      submittedBy: req.user.userId,
    }).sort({ createdAt: -1 });

    res.json({ data: complaints });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({
      error: { code: 'FETCH_ERROR', message: 'Failed to fetch complaints' },
    });
  }
});

// Get passenger notifications
router.get('/notifications', authorizeRole('passenger'), async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipientId: req.user.userId,
    })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ data: notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      error: {
        code: 'FETCH_ERROR',
        message: 'Failed to fetch notifications',
      },
    });
  }
});

// Mark notification as read
router.patch('/notifications/:id/read', authorizeRole('passenger'), async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { readAt: new Date() },
      { new: true }
    );

    res.json({ data: notification });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      error: { code: 'UPDATE_ERROR', message: 'Failed to update notification' },
    });
  }
});

// Request assignment change
router.post('/assignment-requests', authorizeRole('passenger'), async (req, res) => {
  try {
    const { busId, routeId, boardingStopId } = req.body;

    // TODO: Create assignment request (pending review)
    // For now, just return a success message
    res.status(201).json({
      data: {
        message: 'Assignment request submitted for review',
        status: 'pending',
      },
    });
  } catch (error) {
    console.error('Error creating assignment request:', error);
    res.status(500).json({
      error: {
        code: 'REQUEST_ERROR',
        message: 'Failed to submit assignment request',
      },
    });
  }
});

// ========== NEW ENDPOINTS: SEARCH & TIMETABLE ==========

// Search stops by name
router.get('/stops/search', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        error: {
          code: 'INVALID_QUERY',
          message: 'Query must be at least 2 characters',
        },
      });
    }

    const stops = await Stop.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { stopCode: { $regex: query, $options: 'i' } },
      ],
      status: 'active',
    });

    res.json({
      data: stops,
      metadata: {
        count: stops.length,
        sourceInfo: stops.length > 0 ? {
          sourceDate: stops[0].sourceDate,
          verificationStatus: stops[0].verificationStatus,
        } : null,
      },
    });
  } catch (error) {
    console.error('Error searching stops:', error);
    res.status(500).json({
      error: { code: 'SEARCH_ERROR', message: 'Failed to search stops' },
    });
  }
});

// Get all stops with optional filtering
router.get('/stops', async (req, res) => {
  try {
    const stops = await Stop.find({ status: 'active' }).sort({ name: 1 });

    // Include source metadata in response
    const firstStop = stops.length > 0 ? stops[0] : null;
    const sourceMetadata = firstStop ? {
      sourceUrl: firstStop.sourceUrl,
      sourceDate: firstStop.sourceDate,
      verificationStatus: firstStop.verificationStatus,
    } : null;

    res.json({
      data: stops,
      metadata: {
        count: stops.length,
        source: sourceMetadata,
      },
    });
  } catch (error) {
    console.error('Error fetching stops:', error);
    res.status(500).json({
      error: { code: 'FETCH_ERROR', message: 'Failed to fetch stops' },
    });
  }
});

// Get all routes with optional shift filtering
router.get('/routes', async (req, res) => {
  try {
    const { shift } = req.query;
    
    let query = { status: 'active' };
    
    const routes = await Route.find(query)
      .populate('stopIds')
      .sort({ name: 1 });

    // If shift filter requested, populate with schedules
    let result = routes;
    if (shift) {
      result = await Promise.all(
        routes.map(async (route) => {
          const schedules = await ShiftSchedule.find({
            routeId: route._id,
            shiftCode: shift,
          }).populate('busId');
          return {
            ...route.toObject(),
            schedules,
          };
        })
      );
    }

    // Include source metadata
    const firstRoute = routes.length > 0 ? routes[0] : null;
    const sourceMetadata = firstRoute ? {
      sourceUrl: firstRoute.sourceUrl,
      sourceDate: firstRoute.sourceDate,
      verificationStatus: firstRoute.verificationStatus,
    } : null;

    res.json({
      data: result,
      metadata: {
        count: result.length,
        source: sourceMetadata,
        disclaimer: 'Historical timetable — current timings unverified. Verify with transport office for current schedule.',
      },
    });
  } catch (error) {
    console.error('Error fetching routes:', error);
    res.status(500).json({
      error: { code: 'FETCH_ERROR', message: 'Failed to fetch routes' },
    });
  }
});

// Get route details with stops and timetable
router.get('/routes/:routeId', async (req, res) => {
  try {
    const { routeId } = req.params;
    const { shift } = req.query;

    const route = await Route.findById(routeId).populate('stopIds');

    if (!route) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Route not found' },
      });
    }

    // Get schedules for this route
    let query = { routeId: route._id };
    if (shift) {
      query.shiftCode = shift;
    }

    const schedules = await ShiftSchedule.find(query)
      .populate('busId')
      .sort({ shiftCode: 1 });

    res.json({
      data: {
        route,
        schedules,
      },
      metadata: {
        sourceUrl: route.sourceUrl,
        sourceDate: route.sourceDate,
        verificationStatus: route.verificationStatus,
        disclaimer: 'Historical timetable — current timings unverified. Verify with transport office for current schedule.',
      },
    });
  } catch (error) {
    console.error('Error fetching route details:', error);
    res.status(500).json({
      error: { code: 'FETCH_ERROR', message: 'Failed to fetch route details' },
    });
  }
});

// Get schedules for a specific stop
router.get('/stops/:stopId/schedules', async (req, res) => {
  try {
    const { stopId } = req.params;
    const { shift } = req.query;

    // Find all routes that include this stop
    const routes = await Route.find({
      stopIds: stopId,
      status: 'active',
    });

    if (routes.length === 0) {
      return res.json({
        data: [],
        message: 'No routes found for this stop',
      });
    }

    // Get schedules for these routes
    let query = {
      routeId: { $in: routes.map(r => r._id) },
    };
    if (shift) {
      query.shiftCode = shift;
    }

    const schedules = await ShiftSchedule.find(query)
      .populate('routeId')
      .populate('busId')
      .sort({ shiftCode: 1, startTimeLocal: 1 });

    res.json({
      data: schedules,
      metadata: {
        count: schedules.length,
        disclaimer: 'Historical timetable — current timings unverified. Verify with transport office for current schedule.',
      },
    });
  } catch (error) {
    console.error('Error fetching stop schedules:', error);
    res.status(500).json({
      error: { code: 'FETCH_ERROR', message: 'Failed to fetch schedules' },
    });
  }
});

// Get timetable metadata (source info and disclaimer)
router.get('/timetable-info', async (req, res) => {
  try {
    const stops = await Stop.findOne({ status: 'active' });
    const routes = await Route.findOne({ status: 'active' });

    const sourceInfo = stops || routes ? {
      sourceUrl: (stops || routes).sourceUrl,
      sourceDate: (stops || routes).sourceDate,
      verificationStatus: (stops || routes).verificationStatus,
    } : null;

    res.json({
      data: {
        sourceUrl: sourceInfo?.sourceUrl,
        sourceDate: sourceInfo?.sourceDate,
        verificationStatus: sourceInfo?.verificationStatus,
        disclaimer: 'Historical timetable dated September 1, 2023. Current timings are unverified. Always verify with the transport office for current schedule.',
        liveTrackingStatus: 'unavailable',
        liveTrackingMessage: 'Live GPS tracking is not currently available. Please refer to published timetable.',
      },
    });
  } catch (error) {
    console.error('Error fetching timetable info:', error);
    res.status(500).json({
      error: { code: 'FETCH_ERROR', message: 'Failed to fetch timetable info' },
    });
  }
});

// Get all buses (for timetable display)
router.get('/buses', async (req, res) => {
  try {
    const buses = await Bus.find({ status: 'active' }).sort({ busCode: 1 });

    // Include source metadata
    const firstBus = buses.length > 0 ? buses[0] : null;
    const sourceMetadata = firstBus ? {
      sourceUrl: firstBus.sourceUrl,
      sourceDate: firstBus.sourceDate,
      verificationStatus: firstBus.verificationStatus,
    } : null;

    res.json({
      data: buses,
      metadata: {
        count: buses.length,
        source: sourceMetadata,
      },
    });
  } catch (error) {
    console.error('Error fetching buses:', error);
    res.status(500).json({
      error: { code: 'FETCH_ERROR', message: 'Failed to fetch buses' },
    });
  }
});

export default router;
