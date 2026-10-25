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
} from './mockData';

export const useAppStore = create((set, get) => ({
  // Data state
  buses: mockBuses,
  routes: mockRoutes,
  stops: mockStops,
  shifts: mockShifts,
  passengers: mockPassengers,
  staff: mockStaff,
  requests: mockRequests,
  complaints: mockComplaints,
  notifications: mockNotifications,
  trips: mockTrips,

  // UI state
  currentUser: null,
  currentPortal: 'passenger',
  userRole: 'Passenger (Shift 1)',
  selectedBus: 'G-47',
  selectedRoute: 'ROUTE-01',
  selectedStop: null,

  // Actions: Bus operations
  updateBusOccupancy: (busId, newOccupancy) =>
    set((state) => ({
      buses: state.buses.map((bus) =>
        bus.id === busId
          ? {
              ...bus,
              currentOccupancy: newOccupancy,
              lastOccupancyUpdate: new Date(),
            }
          : bus
      ),
    })),

  // Actions: Portal navigation
  setCurrentPortal: (portal) => set({ currentPortal: portal }),
  setUserRole: (role) => set({ userRole: role }),

  // Actions: Bus selection
  selectBus: (busId) => set({ selectedBus: busId }),
  selectRoute: (routeId) => set({ selectedRoute: routeId }),
  selectStop: (stopId) => set({ selectedStop: stopId }),

  // Actions: Notification management
  markNotificationRead: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      ),
    })),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
    })),

  // Actions: Request management
  addRequest: (request) =>
    set((state) => ({
      requests: [...state.requests, request],
    })),

  updateRequestStatus: (requestId, newStatus) =>
    set((state) => ({
      requests: state.requests.map((req) =>
        req.id === requestId ? { ...req, status: newStatus } : req
      ),
    })),

  // Actions: Complaint management
  addComplaint: (complaint) =>
    set((state) => ({
      complaints: [...state.complaints, complaint],
    })),

  updateComplaintStatus: (complaintId, newStatus) =>
    set((state) => ({
      complaints: state.complaints.map((comp) =>
        comp.id === complaintId ? { ...comp, status: newStatus } : comp
      ),
    })),

  // Actions: Trip management
  startTrip: (tripData) =>
    set((state) => ({
      trips: [...state.trips, { ...tripData, status: 'IN_PROGRESS', startTime: new Date() }],
    })),

  endTrip: (tripId) =>
    set((state) => ({
      trips: state.trips.map((trip) =>
        trip.id === tripId ? { ...trip, status: 'COMPLETED', endTime: new Date() } : trip
      ),
    })),

  // Actions: Bus/Route/Stop management (Admin)
  updateBus: (busId, updates) =>
    set((state) => ({
      buses: state.buses.map((bus) => (bus.id === busId ? { ...bus, ...updates } : bus)),
    })),

  addBus: (bus) =>
    set((state) => ({
      buses: [...state.buses, bus],
    })),

  updateRoute: (routeId, updates) =>
    set((state) => ({
      routes: state.routes.map((route) =>
        route.id === routeId ? { ...route, ...updates } : route
      ),
    })),

  addRoute: (route) =>
    set((state) => ({
      routes: [...state.routes, route],
    })),

  updateStop: (stopId, updates) =>
    set((state) => ({
      stops: state.stops.map((stop) => (stop.id === stopId ? { ...stop, ...updates } : stop)),
    })),

  addStop: (stop) =>
    set((state) => ({
      stops: [...state.stops, stop],
    })),

  // Get helpers
  getBusById: (busId) => get().buses.find((b) => b.id === busId),
  getRouteById: (routeId) => get().routes.find((r) => r.id === routeId),
  getStopById: (stopId) => get().stops.find((s) => s.id === stopId),
  getStopsByRoute: (routeId) => get().stops.filter((s) => s.routes.includes(routeId)),
  getBusesByRoute: (routeId) => get().buses.filter((b) => b.assignedRoute === routeId),
  getRequestsByPassenger: (passengerId) =>
    get().requests.filter((r) => r.submittedBy === passengerId),
  getComplaintsByPassenger: (passengerId) =>
    get().complaints.filter((c) => c.submittedBy === passengerId),
}));
