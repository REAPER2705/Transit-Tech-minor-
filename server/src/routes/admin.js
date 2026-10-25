import express from 'express';
import User from '../models/User.js';
import Bus from '../models/Bus.js';
import Route from '../models/Route.js';
import Stop from '../models/Stop.js';
import ShiftSchedule from '../models/ShiftSchedule.js';
import PassengerAssignment from '../models/PassengerAssignment.js';
import Trip from '../models/Trip.js';
import Complaint from '../models/Complaint.js';
import ImportJob from '../models/ImportJob.js';
import AuditLog from '../models/AuditLog.js';
import { authorizeRole } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import ExcelJS from 'exceljs';
import { parse } from 'csv-parse/sync';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// ========== USERS ==========

// Create user
router.post('/users', authorizeRole('admin'), async (req, res) => {
  try {
    const { email, displayName, password, roles } = req.body;

    if (!email || !displayName || !password) {
      return res.status(400).json({
        error: { code: 'MISSING_FIELDS', message: 'Required fields missing' },
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: { code: 'USER_EXISTS', message: 'User already exists' },
      });
    }

    const user = new User({
      email,
      displayName,
      passwordHash: password,
      roles: roles || ['passenger'],
    });

    await user.save();

    await AuditLog.create({
      actorId: req.user.userId,
      action: 'user_created',
      entityType: 'User',
      entityId: user._id,
      after: { email, displayName, roles },
    });

    res.status(201).json({ data: user.toJSON() });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: { code: 'ERROR', message: 'Failed to create user' } });
  }
});

// List users
router.get('/users', authorizeRole('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash');
    res.json({ data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: { code: 'ERROR', message: 'Failed to fetch users' } });
  }
});

// Update user
router.patch('/users/:id', authorizeRole('admin'), async (req, res) => {
  try {
    const { displayName, roles, status } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'User not found' },
      });
    }

    const before = { displayName: user.displayName, roles: user.roles, status: user.status };

    if (displayName) user.displayName = displayName;
    if (roles) user.roles = roles;
    if (status) user.status = status;

    await user.save();

    await AuditLog.create({
      actorId: req.user.userId,
      action: 'user_updated',
      entityType: 'User',
      entityId: user._id,
      before,
      after: { displayName: user.displayName, roles: user.roles, status: user.status },
    });

    res.json({ data: user.toJSON() });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: { code: 'ERROR', message: 'Failed to update user' } });
  }
});

// ========== BUSES ==========

// Create bus
router.post('/buses', authorizeRole('admin'), async (req, res) => {
  try {
    const { busCode, registrationNumber, capacity, capacityType } = req.body;

    if (!busCode || !capacity) {
      return res.status(400).json({
        error: { code: 'MISSING_FIELDS', message: 'Bus code and capacity required' },
      });
    }

    const existingBus = await Bus.findOne({ busCode });
    if (existingBus) {
      return res.status(400).json({
        error: { code: 'BUS_EXISTS', message: 'Bus code already exists' },
      });
    }

    const bus = new Bus({
      busCode,
      registrationNumber,
      capacity,
      capacityType: capacityType || 'total_passengers',
    });

    await bus.save();

    await AuditLog.create({
      actorId: req.user.userId,
      action: 'bus_created',
      entityType: 'Bus',
      entityId: bus._id,
      after: { busCode, capacity, capacityType },
    });

    res.status(201).json({ data: bus });
  } catch (error) {
    console.error('Error creating bus:', error);
    res.status(500).json({ error: { code: 'ERROR', message: 'Failed to create bus' } });
  }
});

// List buses
router.get('/buses', authorizeRole('admin'), async (req, res) => {
  try {
    const buses = await Bus.find();
    res.json({ data: buses });
  } catch (error) {
    console.error('Error fetching buses:', error);
    res.status(500).json({ error: { code: 'ERROR', message: 'Failed to fetch buses' } });
  }
});

// Update bus
router.patch('/buses/:id', authorizeRole('admin'), async (req, res) => {
  try {
    const { capacity, status } = req.body;
    const bus = await Bus.findById(req.params.id);

    if (!bus) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Bus not found' } });
    }

    const before = { capacity: bus.capacity, status: bus.status };
    if (capacity !== undefined) bus.capacity = capacity;
    if (status) bus.status = status;

    await bus.save();

    await AuditLog.create({
      actorId: req.user.userId,
      action: 'bus_updated',
      entityType: 'Bus',
      entityId: bus._id,
      before,
      after: { capacity: bus.capacity, status: bus.status },
    });

    res.json({ data: bus });
  } catch (error) {
    console.error('Error updating bus:', error);
    res.status(500).json({ error: { code: 'ERROR', message: 'Failed to update bus' } });
  }
});

// ========== STOPS ==========

// Create stop
router.post('/stops', authorizeRole('admin'), async (req, res) => {
  try {
    const { stopCode, name, latitude, longitude } = req.body;

    if (!stopCode || !name || latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        error: { code: 'MISSING_FIELDS', message: 'Required fields missing' },
      });
    }

    const existingStop = await Stop.findOne({ stopCode });
    if (existingStop) {
      return res.status(400).json({
        error: { code: 'STOP_EXISTS', message: 'Stop code already exists' },
      });
    }

    const stop = new Stop({
      stopCode,
      name,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
    });

    await stop.save();

    await AuditLog.create({
      actorId: req.user.userId,
      action: 'stop_created',
      entityType: 'Stop',
      entityId: stop._id,
      after: { stopCode, name, coordinates: [longitude, latitude] },
    });

    res.status(201).json({ data: stop });
  } catch (error) {
    console.error('Error creating stop:', error);
    res.status(500).json({ error: { code: 'ERROR', message: 'Failed to create stop' } });
  }
});

// List stops
router.get('/stops', authorizeRole('admin'), async (req, res) => {
  try {
    const stops = await Stop.find();
    res.json({ data: stops });
  } catch (error) {
    console.error('Error fetching stops:', error);
    res.status(500).json({ error: { code: 'ERROR', message: 'Failed to fetch stops' } });
  }
});

// ========== ROUTES ==========

// Create route
router.post('/routes', authorizeRole('admin'), async (req, res) => {
  try {
    const { routeCode, name, stopIds, direction } = req.body;

    if (!routeCode || !name || !stopIds || stopIds.length === 0) {
      return res.status(400).json({
        error: { code: 'MISSING_FIELDS', message: 'Required fields missing' },
      });
    }

    const existingRoute = await Route.findOne({ routeCode });
    if (existingRoute) {
      return res.status(400).json({
        error: { code: 'ROUTE_EXISTS', message: 'Route code already exists' },
      });
    }

    const route = new Route({
      routeCode,
      name,
      stopIds,
      direction: direction || 'bidirectional',
    });

    await route.save();

    await AuditLog.create({
      actorId: req.user.userId,
      action: 'route_created',
      entityType: 'Route',
      entityId: route._id,
      after: { routeCode, name, stopIds },
    });

    res.status(201).json({ data: route });
  } catch (error) {
    console.error('Error creating route:', error);
    res.status(500).json({ error: { code: 'ERROR', message: 'Failed to create route' } });
  }
});

// List routes
router.get('/routes', authorizeRole('admin'), async (req, res) => {
  try {
    const routes = await Route.find().populate('stopIds');
    res.json({ data: routes });
  } catch (error) {
    console.error('Error fetching routes:', error);
    res.status(500).json({ error: { code: 'ERROR', message: 'Failed to fetch routes' } });
  }
});

// ========== SHIFT SCHEDULES ==========

// Create schedule
router.post('/schedules', authorizeRole('admin'), async (req, res) => {
  try {
    const { scheduleCode, shiftCode, startTimeLocal, endTimeLocal, serviceDate, routeId, busId, driverId, conductorId } = req.body;

    if (!scheduleCode || !shiftCode || !startTimeLocal || !endTimeLocal || !serviceDate || !routeId || !busId || !driverId || !conductorId) {
      return res.status(400).json({
        error: { code: 'MISSING_FIELDS', message: 'Required fields missing' },
      });
    }

    const existingSchedule = await ShiftSchedule.findOne({ scheduleCode });
    if (existingSchedule) {
      return res.status(400).json({
        error: { code: 'SCHEDULE_EXISTS', message: 'Schedule code already exists' },
      });
    }

    const schedule = new ShiftSchedule({
      scheduleCode,
      shiftCode,
      startTimeLocal,
      endTimeLocal,
      serviceDate: new Date(serviceDate),
      routeId,
      busId,
      driverId,
      conductorId,
    });

    await schedule.save();

    // Create corresponding trip
    const trip = new Trip({
      tripCode: `TRIP-${uuidv4()}`,
      scheduleId: schedule._id,
      busId,
      routeId,
      driverId,
      conductorId,
    });

    await trip.save();

    res.status(201).json({ data: { schedule, trip } });
  } catch (error) {
    console.error('Error creating schedule:', error);
    res.status(500).json({ error: { code: 'ERROR', message: 'Failed to create schedule' } });
  }
});

// List schedules
router.get('/schedules', authorizeRole('admin'), async (req, res) => {
  try {
    const schedules = await ShiftSchedule.find()
      .populate('routeId')
      .populate('busId')
      .populate('driverId', 'displayName email')
      .populate('conductorId', 'displayName email');

    res.json({ data: schedules });
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({ error: { code: 'ERROR', message: 'Failed to fetch schedules' } });
  }
});

// ========== PASSENGER ASSIGNMENTS ==========

// Create assignment
router.post('/assignments', authorizeRole('admin'), async (req, res) => {
  try {
    const { assignmentCode, passengerId, scheduleId, routeId, busId, boardingStopId } = req.body;

    if (!assignmentCode || !passengerId || !scheduleId || !busId || !boardingStopId) {
      return res.status(400).json({
        error: { code: 'MISSING_FIELDS', message: 'Required fields missing' },
      });
    }

    const existingAssignment = await PassengerAssignment.findOne({ assignmentCode });
    if (existingAssignment) {
      return res.status(400).json({
        error: { code: 'ASSIGNMENT_EXISTS', message: 'Assignment code already exists' },
      });
    }

    const assignment = new PassengerAssignment({
      assignmentCode,
      passengerId,
      scheduleId,
      routeId,
      busId,
      boardingStopId,
      status: 'approved',
      createdBy: req.user.userId,
    });

    await assignment.save();

    res.status(201).json({ data: assignment });
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ error: { code: 'ERROR', message: 'Failed to create assignment' } });
  }
});

// List assignments
router.get('/assignments', authorizeRole('admin'), async (req, res) => {
  try {
    const assignments = await PassengerAssignment.find()
      .populate('passengerId', 'displayName email')
      .populate('busId')
      .populate('scheduleId')
      .populate('boardingStopId');

    res.json({ data: assignments });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ error: { code: 'ERROR', message: 'Failed to fetch assignments' } });
  }
});

// ========== COMPLAINTS ==========

// List complaints
router.get('/complaints', authorizeRole('admin'), async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('submittedBy', 'displayName email')
      .populate('relatedTripId')
      .sort({ createdAt: -1 });

    res.json({ data: complaints });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ error: { code: 'ERROR', message: 'Failed to fetch complaints' } });
  }
});

// Update complaint
router.patch('/complaints/:id', authorizeRole('admin'), async (req, res) => {
  try {
    const { status, adminResponse } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Complaint not found' },
      });
    }

    if (status) {
      complaint.status = status;
      if (status === 'resolved') {
        complaint.resolvedAt = new Date();
      }
    }

    if (adminResponse) {
      complaint.adminResponse = adminResponse;
    }

    await complaint.save();

    res.json({ data: complaint });
  } catch (error) {
    console.error('Error updating complaint:', error);
    res.status(500).json({ error: { code: 'ERROR', message: 'Failed to update complaint' } });
  }
});

// ========== AUDIT LOGS ==========

// List audit logs
router.get('/audit-logs', authorizeRole('admin'), async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate('actorId', 'displayName email')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({ data: logs });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ error: { code: 'ERROR', message: 'Failed to fetch audit logs' } });
  }
});

// ========== IMPORTS ==========

// Validate import
router.post('/imports/validate', authorizeRole('admin'), upload.single('file'), async (req, res) => {
  try {
    const { importType, shiftCode } = req.body;

    if (!importType || !req.file) {
      return res.status(400).json({
        error: { code: 'MISSING_FIELDS', message: 'Import type and file required' },
      });
    }

    if (['passenger_assignments', 'staff_assignments'].includes(importType) && !shiftCode) {
      return res.status(400).json({
        error: { code: 'MISSING_SHIFT', message: 'Shift code required for this import type' },
      });
    }

    // Parse file (Excel or CSV)
    let rows = [];
    let headers = [];

    try {
      if (req.file.originalname.endsWith('.xlsx')) {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(req.file.buffer);
        const worksheet = workbook.worksheets[0];

        headers = worksheet.getRow(1).values.slice(1);
        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber > 1) {
            rows.push(Object.fromEntries(headers.map((h, i) => [h, row.getCell(i + 1).value])));
          }
        });
      } else if (req.file.originalname.endsWith('.csv')) {
        const text = req.file.buffer.toString();
        rows = parse(text, { columns: true });
        if (rows.length > 0) {
          headers = Object.keys(rows[0]);
        }
      } else {
        return res.status(400).json({
          error: { code: 'INVALID_FILE', message: 'Only XLSX and CSV files are supported' },
        });
      }
    } catch (parseError) {
      return res.status(400).json({
        error: { code: 'PARSE_ERROR', message: 'Failed to parse file' },
      });
    }

    // Validate schema based on import type
    const requiredHeaders = {
      buses: ['busCode', 'registrationNumber', 'capacity'],
      routes_stops: ['routeCode', 'name', 'stopCodes'],
      schedules: ['scheduleCode', 'shiftCode', 'startTime', 'endTime', 'serviceDate', 'routeCode', 'busCode', 'driverEmail', 'conductorEmail'],
      passenger_assignments: ['assignmentCode', 'passengerEmail', 'scheduleCode', 'boardingStopCode'],
    };

    const required = requiredHeaders[importType] || [];
    const missingHeaders = required.filter(h => !headers.includes(h));

    if (missingHeaders.length > 0) {
      return res.status(400).json({
        error: {
          code: 'INVALID_SCHEMA',
          message: `Missing headers: ${missingHeaders.join(', ')}`,
        },
      });
    }

    // Basic validation
    const errors = [];
    rows.forEach((row, index) => {
      if (Object.values(row).every(v => v === null || v === undefined || v === '')) {
        errors.push({ rowNumber: index + 2, fields: [], message: 'Empty row' });
      }
    });

    // Create import job
    const importJob = new ImportJob({
      importCode: `IMPORT-${uuidv4()}`,
      importType,
      shiftCode,
      fileName: req.file.originalname,
      uploadedBy: req.user.userId,
      status: 'validated',
      rowCount: rows.length,
      validCount: rows.length - errors.length,
      errorCount: errors.length,
      errors,
    });

    await importJob.save();

    res.json({
      data: {
        importJob,
        preview: rows.slice(0, 10),
      },
    });
  } catch (error) {
    console.error('Error validating import:', error);
    res.status(500).json({
      error: { code: 'ERROR', message: 'Failed to validate import' },
    });
  }
});

// ========== TIMETABLE MANAGEMENT (NEW) ==========

// Update route with new timetable data
router.patch('/routes/:id', authorizeRole('admin'), async (req, res) => {
  try {
    const { name, stopIds, sourceUrl, sourceDate, verificationStatus } = req.body;
    const route = await Route.findById(req.params.id);

    if (!route) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Route not found' },
      });
    }

    const before = {
      name: route.name,
      stopIds: route.stopIds,
      sourceDate: route.sourceDate,
      verificationStatus: route.verificationStatus,
    };

    if (name) route.name = name;
    if (stopIds) route.stopIds = stopIds;
    if (sourceUrl) route.sourceUrl = sourceUrl;
    if (sourceDate) route.sourceDate = new Date(sourceDate);
    if (verificationStatus) route.verificationStatus = verificationStatus;

    await route.save();

    await AuditLog.create({
      actorId: req.user.userId,
      action: 'route_updated',
      entityType: 'Route',
      entityId: route._id,
      before,
      after: {
        name: route.name,
        stopIds: route.stopIds,
        sourceDate: route.sourceDate,
        verificationStatus: route.verificationStatus,
      },
    });

    res.json({ data: route });
  } catch (error) {
    console.error('Error updating route:', error);
    res.status(500).json({ error: { code: 'ERROR', message: 'Failed to update route' } });
  }
});

// Update stop with verified coordinates
router.patch('/stops/:id', authorizeRole('admin'), async (req, res) => {
  try {
    const { name, latitude, longitude, coordinatesVerified, verificationStatus } = req.body;
    const stop = await Stop.findById(req.params.id);

    if (!stop) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Stop not found' },
      });
    }

    const before = {
      name: stop.name,
      coordinates: stop.location.coordinates,
      coordinatesVerified: stop.coordinatesVerified,
      verificationStatus: stop.verificationStatus,
    };

    if (name) stop.name = name;
    if (latitude !== undefined && longitude !== undefined) {
      stop.location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      };
    }
    if (coordinatesVerified !== undefined) stop.coordinatesVerified = coordinatesVerified;
    if (verificationStatus) stop.verificationStatus = verificationStatus;

    await stop.save();

    await AuditLog.create({
      actorId: req.user.userId,
      action: 'stop_updated',
      entityType: 'Stop',
      entityId: stop._id,
      before,
      after: {
        name: stop.name,
        coordinates: stop.location.coordinates,
        coordinatesVerified: stop.coordinatesVerified,
        verificationStatus: stop.verificationStatus,
      },
    });

    res.json({ data: stop });
  } catch (error) {
    console.error('Error updating stop:', error);
    res.status(500).json({ error: { code: 'ERROR', message: 'Failed to update stop' } });
  }
});

// Update schedule/timetable
router.patch('/schedules/:id', authorizeRole('admin'), async (req, res) => {
  try {
    const { startTimeLocal, endTimeLocal, status } = req.body;
    const schedule = await ShiftSchedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Schedule not found' },
      });
    }

    const before = {
      startTimeLocal: schedule.startTimeLocal,
      endTimeLocal: schedule.endTimeLocal,
      status: schedule.status,
    };

    if (startTimeLocal) schedule.startTimeLocal = startTimeLocal;
    if (endTimeLocal) schedule.endTimeLocal = endTimeLocal;
    if (status) schedule.status = status;

    await schedule.save();

    await AuditLog.create({
      actorId: req.user.userId,
      action: 'schedule_updated',
      entityType: 'ShiftSchedule',
      entityId: schedule._id,
      before,
      after: {
        startTimeLocal: schedule.startTimeLocal,
        endTimeLocal: schedule.endTimeLocal,
        status: schedule.status,
      },
    });

    res.json({ data: schedule });
  } catch (error) {
    console.error('Error updating schedule:', error);
    res.status(500).json({ error: { code: 'ERROR', message: 'Failed to update schedule' } });
  }
});

// Get timetable verification report
router.get('/timetable-report', authorizeRole('admin'), async (req, res) => {
  try {
    const routes = await Route.find().populate('stopIds');
    const stops = await Stop.find();
    const schedules = await ShiftSchedule.find().populate('routeId').populate('busId');

    const report = {
      totalRoutes: routes.length,
      verifiedRoutes: routes.filter(r => r.verificationStatus === 'verified').length,
      unverifiedRoutes: routes.filter(r => r.verificationStatus === 'unverified').length,
      totalStops: stops.length,
      verifiedStops: stops.filter(s => s.coordinatesVerified).length,
      unverifiedStops: stops.filter(s => !s.coordinatesVerified).length,
      totalSchedules: schedules.length,
      activeSchedules: schedules.filter(s => s.status === 'scheduled').length,
      recentAuditLogs: [],
    };

    // Get recent audit logs for timetable changes
    const auditLogs = await AuditLog.find({
      action: { $in: ['route_updated', 'stop_updated', 'schedule_updated'] },
    })
      .populate('actorId', 'displayName email')
      .sort({ createdAt: -1 })
      .limit(20);

    report.recentAuditLogs = auditLogs;

    res.json({ data: report });
  } catch (error) {
    console.error('Error generating timetable report:', error);
    res.status(500).json({
      error: { code: 'ERROR', message: 'Failed to generate report' },
    });
  }
});

export default router;
