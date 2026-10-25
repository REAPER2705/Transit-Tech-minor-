import { create } from 'zustand';
import {
  mockBuses,
  mockRoutes,
  mockStops,
  mockShifts,
  mockPassengers,
  mockStaff,
  mockRequests,
  mockComplaints,
  mockNotifications,
  mockTrips,
  mockTimetableEntries,
} from './mockData';

const STORAGE_KEY = 'transittech_demo_v1';
const STORAGE_VERSION = 1;

// Helper: Generate unique IDs
const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Helper: Serialize/deserialize dates in localStorage
const serializeState = (state) => {
  return JSON.stringify({
    ...state,
    __version: STORAGE_VERSION,
    __timestamp: new Date().toISOString(),
  });
};

const deserializeState = (data) => {
  try {
    const parsed = JSON.parse(data);
    if (parsed.__version === STORAGE_VERSION) {
      const { __version, __timestamp, ...state } = parsed;
      return state;
    }
  } catch (e) {
    console.warn('Failed to parse localStorage:', e);
  }
  return null;
};

// Helper: Load initial state from localStorage or use defaults
const loadPersistedState = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return deserializeState(stored) || getDefaultState();
    }
  } catch (e) {
    console.warn('localStorage unavailable:', e);
  }
  return getDefaultState();
};

// Default state factory
const getDefaultState = () => ({
  buses: [...mockBuses],
  routes: [...mockRoutes],
  stops: [...mockStops],
  shifts: [...mockShifts],
  passengers: [...mockPassengers],
  staff: [...mockStaff],
  requests: [...mockRequests],
  complaints: [...mockComplaints],
  notifications: [...mockNotifications],
  trips: [...mockTrips],
  timetables: mockTimetableEntries ? [...mockTimetableEntries] : [], // Import from mockData
  incidents: [], // New: incident reports from staff
  auditLog: [], // New: admin action history
  demoSettings: {
    selectedScenario: 'default',
    showSimulation: false,
    lastReset: new Date().toISOString(),
  },
});

export const useAppStore = create((set, get) => {
  const initialState = loadPersistedState();

  return {
    // ===== DATA STATE =====
    ...initialState,

    // UI state
    currentPortal: 'passenger',
    userRole: 'Passenger (Shift 1)',
    selectedBus: 'G-47',
    selectedRoute: 'ROUTE-01',
    selectedStop: null,
    notificationPanelOpen: false,

    // ===== PERSISTENCE HELPER =====
    persistState: () => {
      set((state) => {
        const stateToSave = {
          buses: state.buses,
          routes: state.routes,
          stops: state.stops,
          shifts: state.shifts,
          passengers: state.passengers,
          staff: state.staff,
          requests: state.requests,
          complaints: state.complaints,
          notifications: state.notifications,
          trips: state.trips,
          timetables: state.timetables,
          incidents: state.incidents,
          auditLog: state.auditLog,
          demoSettings: state.demoSettings,
        };
        try {
          localStorage.setItem(STORAGE_KEY, serializeState(stateToSave));
        } catch (e) {
          console.warn('Failed to persist state:', e);
        }
        return state;
      });
    },

    // ===== RESET FUNCTIONALITY =====
    resetDemoData: () => {
      set((state) => {
        const reset = getDefaultState();
        reset.demoSettings.lastReset = new Date().toISOString();
        try {
          localStorage.setItem(STORAGE_KEY, serializeState(reset));
        } catch (e) {
          console.warn('Failed to reset demo:', e);
        }
        return reset;
      });
    },

    // ===== PORTAL NAVIGATION =====
    setCurrentPortal: (portal) => set({ currentPortal: portal }),
    setUserRole: (role) => set({ userRole: role }),
    setNotificationPanelOpen: (open) => set({ notificationPanelOpen: open }),

    // ===== BUS OPERATIONS =====
    updateBusOccupancy: (busId, newOccupancy) => {
      set((state) => {
        const updated = {
          buses: state.buses.map((bus) =>
            bus.id === busId
              ? {
                  ...bus,
                  currentOccupancy: newOccupancy,
                  lastOccupancyUpdate: new Date().toISOString(),
                }
              : bus
          ),
        };
        get().persistState();
        return updated;
      });
    },

    updateBus: (busId, updates) => {
      set((state) => {
        const updated = {
          buses: state.buses.map((bus) => (bus.id === busId ? { ...bus, ...updates } : bus)),
        };
        get().persistState();
        return updated;
      });
    },

    addBus: (bus) => {
      set((state) => {
        const updated = {
          buses: [...state.buses, { ...bus, id: bus.id || generateId('BUS') }],
        };
        get().persistState();
        return updated;
      });
    },

    deleteBus: (busId) => {
      set((state) => {
        const updated = {
          buses: state.buses.filter((b) => b.id !== busId),
        };
        get().persistState();
        return updated;
      });
    },

    // ===== ROUTE OPERATIONS =====
    updateRoute: (routeId, updates) => {
      set((state) => {
        const updated = {
          routes: state.routes.map((route) =>
            route.id === routeId ? { ...route, ...updates } : route
          ),
        };
        get().persistState();
        return updated;
      });
    },

    addRoute: (route) => {
      set((state) => {
        const updated = {
          routes: [...state.routes, { ...route, id: route.id || generateId('ROUTE') }],
        };
        get().persistState();
        return updated;
      });
    },

    deleteRoute: (routeId) => {
      set((state) => {
        const updated = {
          routes: state.routes.filter((r) => r.id !== routeId),
        };
        get().persistState();
        return updated;
      });
    },

    // ===== STOP OPERATIONS =====
    updateStop: (stopId, updates) => {
      set((state) => {
        const updated = {
          stops: state.stops.map((stop) => (stop.id === stopId ? { ...stop, ...updates } : stop)),
        };
        get().persistState();
        return updated;
      });
    },

    addStop: (stop) => {
      set((state) => {
        const updated = {
          stops: [...state.stops, { ...stop, id: stop.id || generateId('STOP') }],
        };
        get().persistState();
        return updated;
      });
    },

    deleteStop: (stopId) => {
      set((state) => {
        const updated = {
          stops: state.stops.filter((s) => s.id !== stopId),
        };
        get().persistState();
        return updated;
      });
    },

    // ===== TRIP OPERATIONS =====
    startTrip: (tripData) => {
      set((state) => {
        const trip = {
          ...tripData,
          id: tripData.id || generateId('TRIP'),
          status: 'IN_PROGRESS',
          startTime: new Date().toISOString(),
          currentStopIndex: 0,
        };
        const updated = {
          trips: [...state.trips, trip],
          auditLog: [
            ...state.auditLog,
            {
              id: generateId('AUDIT'),
              action: 'TRIP_STARTED',
              entity: 'Trip',
              entityId: trip.id,
              timestamp: new Date().toISOString(),
              details: `Trip ${trip.id} started for route ${trip.routeId}`,
            },
          ],
        };
        get().persistState();
        return updated;
      });
    },

    updateTripProgress: (tripId, nextStopIndex) => {
      set((state) => {
        const updated = {
          trips: state.trips.map((trip) =>
            trip.id === tripId ? { ...trip, currentStopIndex: nextStopIndex } : trip
          ),
        };
        get().persistState();
        return updated;
      });
    },

    completeTrip: (tripId) => {
      set((state) => {
        const updated = {
          trips: state.trips.map((trip) =>
            trip.id === tripId
              ? { ...trip, status: 'COMPLETED', endTime: new Date().toISOString() }
              : trip
          ),
          auditLog: [
            ...state.auditLog,
            {
              id: generateId('AUDIT'),
              action: 'TRIP_COMPLETED',
              entity: 'Trip',
              entityId: tripId,
              timestamp: new Date().toISOString(),
              details: `Trip ${tripId} completed`,
            },
          ],
        };
        get().persistState();
        return updated;
      });
    },

    // ===== NOTIFICATION MANAGEMENT =====
    markNotificationRead: (notificationId) => {
      set((state) => {
        const updated = {
          notifications: state.notifications.map((notif) =>
            notif.id === notificationId ? { ...notif, read: true, readAt: new Date().toISOString() } : notif
          ),
        };
        get().persistState();
        return updated;
      });
    },

    addNotification: (notification) => {
      set((state) => {
        const notif = {
          ...notification,
          id: notification.id || generateId('NOTIF'),
          createdAt: new Date().toISOString(),
          read: false,
        };
        const updated = {
          notifications: [notif, ...state.notifications],
        };
        get().persistState();
        return updated;
      });
    },

    clearNotifications: () => {
      set((state) => {
        const updated = { notifications: [] };
        get().persistState();
        return updated;
      });
    },

    // ===== COMPLAINT MANAGEMENT =====
    addComplaint: (complaint) => {
      set((state) => {
        const comp = {
          ...complaint,
          id: complaint.id || generateId('COMP'),
          createdAt: new Date().toISOString(),
          status: complaint.status || 'SUBMITTED',
        };
        const updated = {
          complaints: [...state.complaints, comp],
          notifications: [
            ...state.notifications,
            {
              id: generateId('NOTIF'),
              type: 'COMPLAINT_SUBMITTED',
              title: 'Complaint Submitted',
              message: `Complaint ${comp.id} has been submitted`,
              createdAt: new Date().toISOString(),
              read: false,
            },
          ],
        };
        get().persistState();
        return updated;
      });
    },

    updateComplaintStatus: (complaintId, newStatus) => {
      set((state) => {
        const updated = {
          complaints: state.complaints.map((comp) =>
            comp.id === complaintId ? { ...comp, status: newStatus, updatedAt: new Date().toISOString() } : comp
          ),
        };
        get().persistState();
        return updated;
      });
    },

    // ===== INCIDENT MANAGEMENT (Staff/Admin) =====
    addIncident: (incident) => {
      set((state) => {
        const inc = {
          ...incident,
          id: incident.id || generateId('INC'),
          createdAt: new Date().toISOString(),
          status: incident.status || 'OPEN',
          reportedBy: incident.reportedBy || 'STAFF',
        };
        const updated = {
          incidents: [...state.incidents, inc],
          auditLog: [
            ...state.auditLog,
            {
              id: generateId('AUDIT'),
              action: 'INCIDENT_REPORTED',
              entity: 'Incident',
              entityId: inc.id,
              timestamp: new Date().toISOString(),
              details: `Incident ${inc.category} reported at ${inc.location}`,
            },
          ],
          notifications: [
            ...state.notifications,
            {
              id: generateId('NOTIF'),
              type: 'INCIDENT_ALERT',
              title: `${inc.category} Incident`,
              message: `Incident reported: ${inc.description}`,
              createdAt: new Date().toISOString(),
              read: false,
            },
          ],
        };
        get().persistState();
        return updated;
      });
    },

    updateIncidentStatus: (incidentId, newStatus) => {
      set((state) => {
        const incident = state.incidents.find((i) => i.id === incidentId);
        const updated = {
          incidents: state.incidents.map((inc) =>
            inc.id === incidentId ? { ...inc, status: newStatus, updatedAt: new Date().toISOString() } : inc
          ),
          auditLog: [
            ...state.auditLog,
            {
              id: generateId('AUDIT'),
              action: 'INCIDENT_STATUS_CHANGED',
              entity: 'Incident',
              entityId: incidentId,
              timestamp: new Date().toISOString(),
              details: `Incident status changed to ${newStatus}`,
              previousValue: incident?.status,
              newValue: newStatus,
            },
          ],
        };
        get().persistState();
        return updated;
      });
    },

    // ===== REQUEST MANAGEMENT =====
    addRequest: (request) => {
      set((state) => {
        const req = {
          ...request,
          id: request.id || generateId('REQ'),
          createdAt: new Date().toISOString(),
          status: request.status || 'PENDING',
        };
        const updated = {
          requests: [...state.requests, req],
        };
        get().persistState();
        return updated;
      });
    },

    updateRequestStatus: (requestId, newStatus) => {
      set((state) => {
        const updated = {
          requests: state.requests.map((req) =>
            req.id === requestId ? { ...req, status: newStatus, updatedAt: new Date().toISOString() } : req
          ),
        };
        get().persistState();
        return updated;
      });
    },

    // ===== TIMETABLE MANAGEMENT =====
    addTimetableEntry: (entry) => {
      set((state) => {
        const timetable = {
          ...entry,
          id: entry.id || generateId('TT'),
          createdAt: new Date().toISOString(),
          verificationStatus: entry.verificationStatus || 'UNVERIFIED',
        };
        const updated = {
          timetables: [...state.timetables, timetable],
        };
        get().persistState();
        return updated;
      });
    },

    updateTimetableEntry: (entryId, updates) => {
      set((state) => {
        const updated = {
          timetables: state.timetables.map((entry) =>
            entry.id === entryId ? { ...entry, ...updates, updatedAt: new Date().toISOString() } : entry
          ),
          auditLog: [
            ...state.auditLog,
            {
              id: generateId('AUDIT'),
              action: 'TIMETABLE_UPDATED',
              entity: 'Timetable',
              entityId: entryId,
              timestamp: new Date().toISOString(),
              details: `Timetable entry updated`,
            },
          ],
        };
        get().persistState();
        return updated;
      });
    },

    // ===== SELECTION HELPERS =====
    selectBus: (busId) => set({ selectedBus: busId }),
    selectRoute: (routeId) => set({ selectedRoute: routeId }),
    selectStop: (stopId) => set({ selectedStop: stopId }),

    // ===== QUERY HELPERS =====
    getBusById: (busId) => get().buses.find((b) => b.id === busId),
    getRouteById: (routeId) => get().routes.find((r) => r.id === routeId),
    getStopById: (stopId) => get().stops.find((s) => s.id === stopId),
    getStopsByRoute: (routeId) => get().stops.filter((s) => s.routes?.includes(routeId)),
    getBusesByRoute: (routeId) => get().buses.filter((b) => b.assignedRoute === routeId),
    getRequestsByPassenger: (passengerId) => get().requests.filter((r) => r.submittedBy === passengerId),
    getComplaintsByPassenger: (passengerId) => get().complaints.filter((c) => c.submittedBy === passengerId),
    getIncidentsForRoute: (routeId) => get().incidents.filter((i) => i.routeId === routeId),
    getTimetablesForRoute: (routeId) => get().timetables.filter((t) => t.routeId === routeId),
    getActiveTrips: () => get().trips.filter((t) => t.status === 'IN_PROGRESS'),
    getUnreadNotifications: () => get().notifications.filter((n) => !n.read),

    // ===== COMPUTED STATS =====
    getStats: () => {
      const state = get();
      return {
        totalRoutes: state.routes.length,
        totalStops: state.stops.length,
        activeBuses: state.buses.filter((b) => b.status === 'ACTIVE').length,
        totalBuses: state.buses.length,
        activeTrips: state.trips.filter((t) => t.status === 'IN_PROGRESS').length,
        openIncidents: state.incidents.filter((i) => i.status === 'OPEN').length,
        unverifiedTimetables: state.timetables.filter((t) => t.verificationStatus === 'UNVERIFIED').length,
        unreadNotifications: state.notifications.filter((n) => !n.read).length,
      };
    },
  };
});
